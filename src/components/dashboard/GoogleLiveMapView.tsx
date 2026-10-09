import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Hospital as HospitalIcon, 
  Truck, 
  Phone, 
  MapPin, 
  Layers, 
  Maximize2, 
  Navigation, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  Crosshair, 
  Radio, 
  Search, 
  Key, 
  ExternalLink, 
  ShieldAlert, 
  Info,
  Clock,
  ShieldCheck,
  HelpCircle,
  X
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  loadGoogleMaps, 
  getGoogleMapsApiKey, 
  getGoogleMapsErrorMessage,
  registerGoogleMapsAuthErrorHandler 
} from '../../services/googleMapsService';
import { calculateHaversineKm } from '../../services/routingService';
import { Hospital, Ambulance, Incident } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const GoogleLiveMapView: React.FC = () => {
  const { incidents, ambulances, hospitals, selectedIncidentId, setSelectedIncidentId } = useEmergencyData();
  const { theme } = useTheme();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const infoWindowRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);

  // States
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet_fallback'>('google');
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ title: string; description: string; action: string } | null>(null);
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [activeMapType, setActiveMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  // Filters
  const [showHospitals, setShowHospitals] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Selected Hospital for Sidebar Detail Panel
  const [selectedHospitalForDetails, setSelectedHospitalForDetails] = useState<Hospital | null>(null);

  // Mysuru Central Coordinates (Near KR Hospital & Palace)
  const MYSURU_CENTER = { lat: 12.3080, lng: 76.6480 };

  // Register Google Maps Auth Error Listener (InvalidKey, RefererNotAllowed, BillingNotEnabled)
  useEffect(() => {
    registerGoogleMapsAuthErrorHandler((errCode) => {
      setLoadingError(errCode);
      setErrorDetails(getGoogleMapsErrorMessage(errCode));
      setMapLoaded(false);
    });
  }, []);

  // Initialize Map
  const initMap = useCallback(async (keyOverride?: string) => {
    if (!mapContainerRef.current) return;
    setLoadingError(null);
    setErrorDetails(null);
    setMapLoaded(false);

    // If keyOverride provided or env key exists, attempt official Google Maps initialization
    const envKey = getGoogleMapsApiKey();
    const effectiveKey = keyOverride || envKey;

    if (!effectiveKey) {
      // Key missing in environment: render high-resolution geographic map + show setup instructions
      setLoadingError('MISSING_API_KEY');
      setErrorDetails(getGoogleMapsErrorMessage('MISSING_API_KEY'));
      initLeafletFallback();
      return;
    }

    try {
      if (keyOverride) {
        setIsValidatingKey(true);
      }

      const g = await loadGoogleMaps(effectiveKey);
      
      // Destroy any leftover leaflet instance if switching to Google Maps
      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }

      const mapOptions = {
        center: MYSURU_CENTER,
        zoom: 13,
        mapTypeId: g.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        mapTypeControl: false, // We provide modern custom UI buttons for Standard, Satellite, Hybrid, Terrain
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        gestureHandling: 'greedy',
      };

      const map = new g.maps.Map(mapContainerRef.current, mapOptions);
      mapInstanceRef.current = map;
      infoWindowRef.current = new g.maps.InfoWindow();
      setMapEngine('google');

      setTimeout(() => {
        g.maps.event.trigger(map, 'resize');
      }, 200);

      setMapLoaded(true);
      setIsValidatingKey(false);
      setShowSetupModal(false);
    } catch (err: any) {
      console.warn('Google Maps load diagnostic:', err);
      setIsValidatingKey(false);
      const errCode = err.message || 'UNKNOWN_ERROR';
      setLoadingError(errCode);
      setErrorDetails(getGoogleMapsErrorMessage(errCode));
      // Render fallback so user is never stuck with an empty box
      initLeafletFallback();
    }
  }, []);

  // Fallback high-definition geographic map for when key is missing or invalid
  const initLeafletFallback = () => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current = null;
    }
    if (leafletInstanceRef.current) {
      leafletInstanceRef.current.remove();
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [MYSURU_CENTER.lat, MYSURU_CENTER.lng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; Mysuru GIS Telemetry',
        maxZoom: 19,
      }).addTo(map);

      // Add Hospital Markers in Fallback Mode
      hospitals.forEach((hosp) => {
        const icon = L.divIcon({
          className: 'hosp-pin',
          html: `<div style="background:#168BCE; color:#fff; padding:4px 8px; border-radius:8px; font-weight:bold; font-size:11px; border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.4); white-space:nowrap;">
            🏥 ${hosp.shortName} (${hosp.icuBedsAvailable} ICU)
          </div>`,
          iconSize: [130, 26],
          iconAnchor: [65, 13],
        });

        const marker = L.marker([hosp.lat, hosp.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedHospitalForDetails(hosp));
      });

      // Add Ambulance Fleet Markers
      ambulances.forEach((amb) => {
        const icon = L.divIcon({
          className: 'amb-pin',
          html: `<div style="background:#22C55E; color:#05080D; padding:3px 6px; border-radius:6px; font-weight:bold; font-size:10px; border:1px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,0.4);">
            🚑 ${amb.callSign}
          </div>`,
          iconSize: [80, 22],
        });
        L.marker([amb.lat, amb.lng], { icon }).addTo(map);
      });

      leafletInstanceRef.current = map;
      setMapEngine('leaflet_fallback');
      setMapLoaded(true);

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } catch (e) {
      console.error('Leaflet fallback error:', e);
    }
  };

  useEffect(() => {
    initMap();
    return () => {
      // Cleanup markers and instances
      Object.values(markersRef.current).forEach((m) => m && m.setMap && m.setMap(null));
      markersRef.current = {};
      if (userLocationMarkerRef.current && userLocationMarkerRef.current.setMap) {
        userLocationMarkerRef.current.setMap(null);
      }
      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }
    };
  }, [initMap]);

  // Handle Map Type Change
  const handleMapTypeChange = (type: 'roadmap' | 'satellite' | 'hybrid' | 'terrain') => {
    setActiveMapType(type);
    if (!mapInstanceRef.current || !window.google) return;
    const g = window.google;
    
    switch (type) {
      case 'satellite':
        mapInstanceRef.current.setMapTypeId(g.maps.MapTypeId.SATELLITE);
        break;
      case 'hybrid':
        mapInstanceRef.current.setMapTypeId(g.maps.MapTypeId.HYBRID);
        break;
      case 'terrain':
        mapInstanceRef.current.setMapTypeId(g.maps.MapTypeId.TERRAIN);
        break;
      case 'roadmap':
      default:
        mapInstanceRef.current.setMapTypeId(g.maps.MapTypeId.ROADMAP);
        break;
    }
  };

  // Find My Location
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(userPos);
        setIsLocatingUser(false);

        if (mapInstanceRef.current && window.google) {
          const g = window.google;
          mapInstanceRef.current.setCenter(userPos);
          mapInstanceRef.current.setZoom(14);

          if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setPosition(userPos);
          } else {
            userLocationMarkerRef.current = new g.maps.Marker({
              position: userPos,
              map: mapInstanceRef.current,
              title: 'Your Current Location',
              icon: {
                path: g.maps.SymbolPath.CIRCLE,
                scale: 9,
                fillColor: '#00D4FF',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2.5,
              },
            });
          }
        } else if (leafletInstanceRef.current) {
          leafletInstanceRef.current.setView([userPos.lat, userPos.lng], 14);
        }
      },
      (err) => {
        setIsLocatingUser(false);
        alert('Could not determine your location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Render & Update Markers on Google Map
  useEffect(() => {
    if (!mapLoaded || mapEngine !== 'google' || !mapInstanceRef.current || !window.google) return;
    const g = window.google;
    const map = mapInstanceRef.current;
    const infoWindow = infoWindowRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m && m.setMap && m.setMap(null));
    markersRef.current = {};

    // 1. Hospital Markers
    if (showHospitals) {
      hospitals.forEach((hosp) => {
        const distanceKm = userLocation 
          ? calculateHaversineKm(userLocation.lat, userLocation.lng, hosp.lat, hosp.lng).toFixed(1)
          : null;

        const marker = new g.maps.Marker({
          position: { lat: hosp.lat, lng: hosp.lng },
          map,
          title: hosp.name,
          icon: {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#168BCE',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
            scale: 1.8,
            anchor: new g.maps.Point(12, 22),
          },
        });

        marker.addListener('click', () => {
          setSelectedHospitalForDetails(hosp);
          if (!infoWindow) return;
          const content = `
            <div style="color: #071321; font-family: system-ui, sans-serif; padding: 4px; max-width: 260px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2px;">
                <div style="font-weight: 800; font-size: 14px;">${hosp.name}</div>
                <span style="background: #e0f2fe; color: #0369a1; font-size: 9px; font-weight: bold; padding: 2px 4px; border-radius: 4px;">VERIFIED</span>
              </div>
              <div style="color: #4b5563; font-size: 11px; margin-bottom: 6px;">
                📍 ${hosp.area}, Mysuru ${distanceKm ? `&bull; <strong style="color: #0284c7;">${distanceKm} km away</strong>` : ''}
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; margin-bottom: 8px; background: #f3f4f6; padding: 6px; border-radius: 8px;">
                <div>ICU Free: <strong style="color: #15803d;">${hosp.icuBedsAvailable}</strong></div>
                <div>Ventilators: <strong>${hosp.ventilatorsAvailable}</strong></div>
                <div>Total Beds: <strong>${hosp.totalBeds}</strong></div>
                <div>Surgeons: <strong style="color: #0369a1;">${hosp.traumaSurgeonsOnDuty} On Duty</strong></div>
              </div>

              <div style="font-size: 11px; margin-bottom: 8px;">
                📞 ER Helpline: <a href="tel:${hosp.emergencyPhone}" style="color: #0284c7; font-weight: bold; text-decoration: none;">${hosp.emergencyPhone}</a>
              </div>

              <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hosp.name + ', Mysuru')}" target="_blank" style="display: block; text-align: center; background: #168BCE; color: white; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
                Get Directions ➔
              </a>
            </div>
          `;
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        });

        markersRef.current[`hosp-${hosp.id}`] = marker;
      });
    }

    // 2. Ambulance Markers (Real Telemetry / Available Base Stations)
    if (showAmbulances) {
      ambulances.forEach((amb) => {
        const isBusy = amb.status === 'EN_ROUTE' || amb.status === 'TRANSPORTING';
        const color = isBusy ? '#F59E0B' : '#22C55E';

        const marker = new g.maps.Marker({
          position: { lat: amb.lat, lng: amb.lng },
          map,
          title: `${amb.callSign} (${amb.vehicleType})`,
          icon: {
            path: g.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            rotation: amb.heading || 45,
          },
        });

        marker.addListener('click', () => {
          if (!infoWindow) return;
          const content = `
            <div style="color: #071321; font-family: system-ui, sans-serif; padding: 4px; max-width: 240px;">
              <div style="font-weight: 800; font-size: 13px;">🚑 ${amb.callSign}</div>
              <div style="color: #4b5563; font-size: 11px; margin-bottom: 6px;">108 Unit &bull; ${amb.vehicleType}</div>
              <div style="font-size: 11px; margin-bottom: 4px;">Status: <strong style="color: ${color};">${amb.status}</strong></div>
              <div style="font-size: 11px; margin-bottom: 4px;">Driver: <strong>${amb.driverName}</strong></div>
              <div style="font-size: 11px; margin-bottom: 4px;">Base: <strong>${amb.baseStation}</strong></div>
              <div style="font-size: 11px;">Speed: <strong>${amb.speedKmH} km/h</strong></div>
            </div>
          `;
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        });

        markersRef.current[`amb-${amb.id}`] = marker;
      });
    }

    // 3. Active Incident Markers
    if (showIncidents) {
      incidents.forEach((inc) => {
        const marker = new g.maps.Marker({
          position: { lat: inc.lat, lng: inc.lng },
          map,
          title: `EMERGENCY: ${inc.locationName}`,
          icon: {
            path: 'M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z',
            fillColor: '#EF4444',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
            scale: 1.4,
            anchor: new g.maps.Point(12, 12),
          },
        });

        marker.addListener('click', () => {
          setSelectedIncidentId(inc.id);
          if (!infoWindow) return;
          const content = `
            <div style="color: #071321; font-family: system-ui, sans-serif; padding: 4px; max-width: 240px;">
              <div style="font-weight: 800; font-size: 13px; color: #dc2626;">🚨 ${inc.category.replace('_', ' ')}</div>
              <div style="font-size: 11px; margin-top: 2px;">📍 ${inc.locationName}</div>
              <div style="font-size: 11px; margin-top: 4px;">Status: <strong>${inc.status}</strong> (${inc.priority})</div>
              <div style="font-size: 11px; margin-top: 2px;">Reported: ${inc.reportedAt}</div>
            </div>
          `;
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        });

        markersRef.current[`inc-${inc.id}`] = marker;
      });
    }
  }, [mapLoaded, mapEngine, showHospitals, showAmbulances, showIncidents, hospitals, ambulances, incidents, userLocation, setSelectedIncidentId]);

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matchedHosp = hospitals.find(
      (h) => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedHosp) {
      setSelectedHospitalForDetails(matchedHosp);
      if (mapInstanceRef.current && window.google) {
        const g = window.google;
        mapInstanceRef.current.setCenter({ lat: matchedHosp.lat, lng: matchedHosp.lng });
        mapInstanceRef.current.setZoom(15);
        const marker = markersRef.current[`hosp-${matchedHosp.id}`];
        if (marker && infoWindowRef.current) {
          g.maps.event.trigger(marker, 'click');
        }
      } else if (leafletInstanceRef.current) {
        leafletInstanceRef.current.setView([matchedHosp.lat, matchedHosp.lng], 15);
      }
    } else {
      alert(`No hospital matching "${searchQuery}" found in Mysuru database.`);
    }
  };

  const handleValidateAndApplyKey = () => {
    if (apiKeyInput.trim()) {
      initMap(apiKeyInput.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
              Mysuru Geographic Operations Map
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              mapEngine === 'google'
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                : 'bg-blue-950/80 text-[#46C5F5] border-cyan-800/60'
            }`}>
              {mapEngine === 'google' ? 'Google Maps JS API (Active)' : 'GIS Live Operations Map'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real geographic coordinates, verified hospitals, and 108 ambulance fleet telemetry.
          </p>
        </div>

        {/* Place Search Form */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Mysuru hospital / area..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none focus:border-[#168BCE]"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white text-xs font-semibold cursor-pointer shadow-md transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Diagnostic Alert Banner (Only when key is missing or invalid) */}
      {errorDetails && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-[#071321] to-[#050C16] border border-[#168BCE]/40 text-xs text-slate-200 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-[#46C5F5] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white flex items-center space-x-2">
                <span>{errorDetails.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#168BCE]/30 text-cyan-300">
                  {loadingError === 'MISSING_API_KEY' ? 'Setup Fallback Active' : 'API Diagnostic'}
                </span>
              </p>
              <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                {errorDetails.description} {errorDetails.action}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowSetupModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Configure API Key</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Type & Layer Controls Bar */}
      <div className="p-3 rounded-xl bg-[#071321]/80 dark:bg-[#071321]/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Map Type Switcher (Standard, Satellite, Hybrid, Terrain) */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Map View:</span>
          {(['roadmap', 'satellite', 'hybrid', 'terrain'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleMapTypeChange(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeMapType === type
                  ? 'bg-[#168BCE] text-white shadow-sm'
                  : 'bg-[#050C16] text-slate-400 hover:text-white'
              }`}
            >
              {type === 'roadmap' ? 'Standard' : type}
            </button>
          ))}
        </div>

        {/* Layer Filters (Hospitals, Ambulances, Incidents) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center space-x-1 cursor-pointer transition-colors ${
              showHospitals
                ? 'bg-blue-950/60 border-[#168BCE] text-[#46C5F5]'
                : 'bg-[#050C16] border-slate-800 text-slate-500'
            }`}
          >
            <HospitalIcon className="w-3.5 h-3.5" />
            <span>Hospitals ({hospitals.length})</span>
          </button>

          <button
            onClick={() => setShowAmbulances(!showAmbulances)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center space-x-1 cursor-pointer transition-colors ${
              showAmbulances
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                : 'bg-[#050C16] border-slate-800 text-slate-500'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>108 Fleet ({ambulances.length})</span>
          </button>

          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center space-x-1 cursor-pointer transition-colors ${
              showIncidents
                ? 'bg-rose-950/60 border-rose-500 text-rose-400'
                : 'bg-[#050C16] border-slate-800 text-slate-500'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Incidents ({incidents.length})</span>
          </button>

          {/* Find My Location Action */}
          <button
            onClick={handleLocateUser}
            disabled={isLocatingUser}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1 cursor-pointer border border-slate-700 transition-colors"
            title="Center map on your current location"
          >
            <Crosshair className={`w-3.5 h-3.5 text-cyan-400 ${isLocatingUser ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">My Location</span>
          </button>
        </div>
      </div>

      {/* Main Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Map Canvas (Directly renders live interactive map) */}
        <div className={selectedHospitalForDetails ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl bg-[#050C16]">
            {/* Live Map Container (Google Maps / GIS Engine) */}
            <div ref={mapContainerRef} className="w-full h-full min-h-[620px]" />
          </div>
        </div>

        {/* Selected Hospital Detailed Information Panel */}
        {selectedHospitalForDetails && (
          <div className="lg:col-span-4 p-5 rounded-3xl bg-[#071321]/95 border border-[#168BCE]/40 shadow-2xl space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 text-[#46C5F5] border border-cyan-800/60 font-mono text-[10px] font-bold mb-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>VERIFIED CLINICAL RECORD</span>
                </div>
                <h3 className="text-base font-bold text-white">{selectedHospitalForDetails.name}</h3>
                <p className="text-slate-400 text-[11px] mt-0.5 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#168BCE]" />
                  <span>{selectedHospitalForDetails.area}, Mysuru</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedHospitalForDetails(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 cursor-pointer"
                title="Close Panel"
              >
                ✕
              </button>
            </div>

            {/* Capacity Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 rounded-xl bg-[#050C16] border border-slate-800">
                <p className="text-[10px] uppercase font-mono text-slate-400">Available ICU</p>
                <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                  {selectedHospitalForDetails.icuBedsAvailable}
                </p>
                <span className="text-[9px] text-slate-500 font-mono">of {selectedHospitalForDetails.totalIcuBeds} verified beds</span>
              </div>

              <div className="p-3 rounded-xl bg-[#050C16] border border-slate-800">
                <p className="text-[10px] uppercase font-mono text-slate-400">Ventilators</p>
                <p className="text-xl font-bold text-cyan-400 font-mono mt-0.5">
                  {selectedHospitalForDetails.ventilatorsAvailable}
                </p>
                <span className="text-[9px] text-slate-500 font-mono">of {selectedHospitalForDetails.totalVentilators} ready</span>
              </div>
            </div>

            {/* Specialties Checklist */}
            <div className="space-y-1.5 pt-1">
              <p className="font-bold text-slate-300">Specialized Emergency Capabilities:</p>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#050C16] border border-slate-800/80">
                  <span>Cath Lab (Cardiac)</span>
                  <strong className={selectedHospitalForDetails.cathLabReady ? "text-emerald-400" : "text-slate-500"}>
                    {selectedHospitalForDetails.cathLabReady ? "✓ 24/7 Ready" : "Unavailable"}
                  </strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#050C16] border border-slate-800/80">
                  <span>Stroke Critical Unit</span>
                  <strong className={selectedHospitalForDetails.strokeUnitReady ? "text-emerald-400" : "text-slate-500"}>
                    {selectedHospitalForDetails.strokeUnitReady ? "✓ Certified" : "Unavailable"}
                  </strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#050C16] border border-slate-800/80">
                  <span>Trauma Surgeons on Duty</span>
                  <strong className="text-cyan-400">
                    {selectedHospitalForDetails.traumaSurgeonsOnDuty} Active
                  </strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`tel:${selectedHospitalForDetails.emergencyPhone}`}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call ER: {selectedHospitalForDetails.emergencyPhone}</span>
              </a>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedHospitalForDetails.name + ', Mysuru')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions on Google Maps</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Setup & Validation Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div 
            className="relative w-full max-w-lg rounded-3xl bg-[#071321] border border-[#168BCE]/40 p-6 text-slate-100 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-[#46C5F5]" />
                <h4 className="text-base font-bold text-white">Google Maps API Setup & Validation</h4>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Google Maps JavaScript API loads automatically from the deployment environment variable <code className="text-[#46C5F5] font-mono font-bold">VITE_GOOGLE_MAPS_API_KEY</code>.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#050C16] border border-slate-800 text-xs space-y-2">
              <p className="font-bold text-slate-200">Deployment Configuration Checklist:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                <li>Enable <strong>Maps JavaScript API</strong> & <strong>Places API</strong> in Google Cloud Console.</li>
                <li>Link an active <strong>Billing Account</strong> (Google provides $200 free monthly credit).</li>
                <li>Set HTTP Referrer restriction to <code className="text-slate-300">http://localhost:*/*</code> and your production URL.</li>
                <li>Add <code className="text-[#46C5F5]">VITE_GOOGLE_MAPS_API_KEY=your_key</code> to your <code className="text-white">.env</code> file.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Test API Key for this Session:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#050C16] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#168BCE]"
                />
                <button
                  onClick={handleValidateAndApplyKey}
                  disabled={isValidatingKey}
                  className="px-4 py-2.5 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isValidatingKey ? 'animate-spin' : ''}`} />
                  <span>{isValidatingKey ? 'Validating...' : 'Validate & Load'}</span>
                </button>
              </div>
            </div>

            {loadingError && loadingError !== 'MISSING_API_KEY' && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorDetails?.description || loadingError}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
