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
  Info 
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { useTheme } from '../../context/ThemeContext';
import { loadGoogleMaps, getGoogleMapsApiKey, setCustomGoogleMapsApiKey } from '../../services/googleMapsService';
import { Hospital, Ambulance, Incident } from '../../types';

export const GoogleLiveMapView: React.FC = () => {
  const { incidents, ambulances, hospitals, selectedIncidentId, setSelectedIncidentId } = useEmergencyData();
  const { theme } = useTheme();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const infoWindowRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);

  // States
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [activeMapType, setActiveMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  // Filters
  const [showHospitals, setShowHospitals] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Mysuru Central Coordinates (Near KR Hospital & Palace)
  const MYSURU_CENTER = { lat: 12.3080, lng: 76.6480 };

  // Initialize Google Maps
  const initMap = useCallback(async (keyOverride?: string) => {
    if (!mapContainerRef.current) return;
    setLoadingError(null);
    setMapLoaded(false);

    try {
      const g = await loadGoogleMaps(keyOverride);
      
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

      // Trigger resize once container is mounted
      setTimeout(() => {
        g.maps.event.trigger(map, 'resize');
      }, 200);

      setMapLoaded(true);
    } catch (err: any) {
      console.warn('Google Maps load error:', err);
      if (err.message === 'MISSING_API_KEY') {
        setLoadingError('NO_API_KEY');
      } else {
        setLoadingError(err.message || 'Failed to initialize Google Maps JavaScript API.');
      }
    }
  }, []);

  useEffect(() => {
    initMap();
    return () => {
      // Cleanup markers
      Object.values(markersRef.current).forEach((m) => m && m.setMap && m.setMap(null));
      markersRef.current = {};
      if (userLocationMarkerRef.current && userLocationMarkerRef.current.setMap) {
        userLocationMarkerRef.current.setMap(null);
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
          mapInstanceRef.current.setZoom(15);

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
    if (!mapLoaded || !mapInstanceRef.current || !window.google) return;
    const g = window.google;
    const map = mapInstanceRef.current;
    const infoWindow = infoWindowRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m && m.setMap && m.setMap(null));
    markersRef.current = {};

    // 1. Hospital Markers
    if (showHospitals) {
      hospitals.forEach((hosp) => {
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
          if (!infoWindow) return;
          const content = `
            <div style="color: #071321; font-family: system-ui, sans-serif; padding: 4px; max-width: 260px;">
              <div style="font-weight: 800; font-size: 14px; margin-bottom: 2px;">${hosp.name}</div>
              <div style="color: #4b5563; font-size: 11px; margin-bottom: 8px;">📍 ${hosp.area}, Mysuru</div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; margin-bottom: 8px; background: #f3f4f6; padding: 6px; border-radius: 8px;">
                <div>ICU Free: <strong style="color: #15803d;">${hosp.icuBedsAvailable}</strong></div>
                <div>Ventilators: <strong>${hosp.ventilatorsAvailable}</strong></div>
                <div>Total Beds: <strong>${hosp.totalBeds}</strong></div>
                <div>Surgeons: <strong style="color: #0369a1;">${hosp.traumaSurgeonsOnDuty} On Duty</strong></div>
              </div>

              <div style="font-size: 11px; margin-bottom: 8px;">
                📞 ER: <a href="tel:${hosp.emergencyPhone}" style="color: #0284c7; font-weight: bold; text-decoration: none;">${hosp.emergencyPhone}</a>
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

    // 2. Ambulance Markers (Real/Simulated GPS)
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
            rotation: 45,
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
  }, [mapLoaded, showHospitals, showAmbulances, showIncidents, hospitals, ambulances, incidents, setSelectedIncidentId]);

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current || !window.google) return;
    const g = window.google;

    const matchedHosp = hospitals.find(
      (h) => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedHosp) {
      mapInstanceRef.current.setCenter({ lat: matchedHosp.lat, lng: matchedHosp.lng });
      mapInstanceRef.current.setZoom(15);
      const marker = markersRef.current[`hosp-${matchedHosp.id}`];
      if (marker && infoWindowRef.current) {
        g.maps.event.trigger(marker, 'click');
      }
    } else {
      alert(`No hospital matching "${searchQuery}" found in Mysuru database.`);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setCustomGoogleMapsApiKey(apiKeyInput.trim());
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
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#168BCE]/20 text-[#46C5F5] border border-[#168BCE]/30">
              Official Google Maps
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

      {/* Main Map Canvas */}
      <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl bg-[#050C16]">
        {/* Google Maps Container */}
        <div ref={mapContainerRef} className="w-full h-full min-h-[600px]" />

        {/* API Key Missing Banner with Direct Input */}
        {loadingError === 'NO_API_KEY' && (
          <div className="absolute inset-0 bg-[#071321]/95 flex items-center justify-center p-6 text-center z-20">
            <div className="max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#168BCE]/20 text-[#46C5F5] flex items-center justify-center mx-auto border border-[#168BCE]/40">
                <Key className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Google Maps API Configuration</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  To load the official Google Maps JavaScript API with streets, satellite, and terrain imagery for Mysuru, configure <code className="text-[#46C5F5] font-mono font-bold">VITE_GOOGLE_MAPS_API_KEY</code> in your environment or enter it below.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#050C16] border border-slate-800 text-left text-xs space-y-2">
                <p className="font-semibold text-slate-300">Quick Configuration:</p>
                <ol className="list-decimal list-inside text-slate-400 space-y-1">
                  <li>Set <code className="text-[#46C5F5]">VITE_GOOGLE_MAPS_API_KEY=your_key</code> in <code className="text-white">.env</code></li>
                  <li>Or enter your Google Maps API key below for immediate live testing:</li>
                </ol>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste Google Maps API Key here..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#050C16] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#168BCE]"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2.5 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* General Error Banner */}
        {loadingError && loadingError !== 'NO_API_KEY' && (
          <div className="absolute top-4 left-4 right-4 z-20 p-4 rounded-2xl bg-rose-950/90 border border-rose-500 text-xs text-rose-200 flex items-center justify-between shadow-2xl backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>Google Maps Error: {loadingError}</span>
            </div>
            <button
              onClick={() => initMap()}
              className="px-3 py-1 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-semibold cursor-pointer transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
