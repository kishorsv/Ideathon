import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  Hospital as HospitalIcon, 
  Truck, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  RotateCcw,
  Compass
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { NavigationRoute } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface NavigationPanelProps {
  onBackToHospitalSelection?: () => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({ onBackToHospitalSelection }) => {
  const { 
    incidents, 
    ambulances, 
    hospitals, 
    selectedIncidentId, 
    activeNavigationRoute, 
    generateDriverNavigationRoute 
  } = useEmergencyData();

  const currentIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];
  const assignedAmb = ambulances.find((a) => a.id === currentIncident?.assignedAmbulanceId) || ambulances[0];
  const assignedHosp = hospitals.find((h) => h.id === currentIncident?.assignedHospitalId) || hospitals[0];

  const [currentStage, setCurrentStage] = useState<'TO_EMERGENCY' | 'TO_HOSPITAL'>(
    activeNavigationRoute?.stage || 'TO_HOSPITAL'
  );
  const [route, setRoute] = useState<NavigationRoute | null>(activeNavigationRoute);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Generate / update route when stage or incident changes
  useEffect(() => {
    if (!currentIncident) return;
    const generated = generateDriverNavigationRoute(currentIncident.id, currentStage);
    if (generated) setRoute(generated);
  }, [currentStage, currentIncident, generateDriverNavigationRoute]);

  // Leaflet map setup for navigation
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [12.3080, 76.6480],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;

      setTimeout(() => map.invalidateSize(), 150);

      return () => {
        map.remove();
        mapInstanceRef.current = null;
        markersGroupRef.current = null;
        routePolylineRef.current = null;
      };
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update map polyline and markers when route changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !route) return;
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    group.clearLayers();

    // Add Origin Marker
    const originIcon = L.divIcon({
      className: 'nav-origin-icon',
      html: `<div style="background:#168bce; color:#fff; padding:3px 6px; border-radius:6px; font-weight:bold; font-size:10px; border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.5); white-space:nowrap;">
        🏁 START: ${route.origin.label}
      </div>`,
      iconSize: [120, 24],
      iconAnchor: [60, 12],
    });
    const originMarker = L.marker([route.origin.lat, route.origin.lng], { icon: originIcon });
    group.addLayer(originMarker);

    // Add Destination Marker
    const destIcon = L.divIcon({
      className: 'nav-dest-icon',
      html: `<div style="background:#22c55e; color:#fff; padding:3px 6px; border-radius:6px; font-weight:bold; font-size:10px; border:2px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.5); white-space:nowrap;">
        🏥 DESTINATION: ${route.destination.label}
      </div>`,
      iconSize: [140, 24],
      iconAnchor: [70, 12],
    });
    const destMarker = L.marker([route.destination.lat, route.destination.lng], { icon: destIcon });
    group.addLayer(destMarker);

    // Add Polyline
    if (routePolylineRef.current) {
      group.removeLayer(routePolylineRef.current);
    }
    const polyline = L.polyline(route.polyline, {
      color: '#168BCE',
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
    });
    routePolylineRef.current = polyline;
    group.addLayer(polyline);

    // Fit map bounds to route
    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  }, [route]);

  const handleRecalculate = () => {
    if (!currentIncident) return;
    setIsRecalculating(true);
    setTimeout(() => {
      const regenerated = generateDriverNavigationRoute(currentIncident.id, currentStage);
      if (regenerated) setRoute(regenerated);
      setIsRecalculating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5] mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>Turn-by-Turn Dynamic Emergency Routing</span>
          </div>
          <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
            Ambulance Navigation Console
          </h2>
          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1">
            Real-time traffic-aware routing with verified coordinates for patient pickup and hospital ER trauma bay transit.
          </p>
        </div>

        {onBackToHospitalSelection && (
          <button
            onClick={onBackToHospitalSelection}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors"
          >
            ← Back to Hospital Selection
          </button>
        )}
      </div>

      {/* Stage Selector Tabs (Feature 4: Dual Stage Navigation) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stage A */}
        <button
          onClick={() => setCurrentStage('TO_EMERGENCY')}
          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex items-center justify-between ${
            currentStage === 'TO_EMERGENCY'
              ? 'bg-[#168BCE]/20 border-[#46C5F5] shadow-[0_0_25px_rgba(22,139,206,0.3)]'
              : 'bg-[#071321]/80 dark:bg-[#071321]/80 light:bg-white border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#168BCE]/20 text-[#46C5F5] flex items-center justify-center font-black">
              A
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Stage A: Navigate to Pickup</p>
              <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mt-0.5">
                Ambulance → Emergency Scene
              </h4>
              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                {currentIncident?.locationName}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
            currentStage === 'TO_EMERGENCY' ? 'bg-[#168BCE] text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {currentStage === 'TO_EMERGENCY' ? 'ACTIVE ROUTE' : 'SWITCH'}
          </span>
        </button>

        {/* Stage B */}
        <button
          onClick={() => setCurrentStage('TO_HOSPITAL')}
          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex items-center justify-between ${
            currentStage === 'TO_HOSPITAL'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_25px_rgba(34,197,94,0.3)]'
              : 'bg-[#071321]/80 dark:bg-[#071321]/80 light:bg-white border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              B
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Stage B: Patient Transit to ER</p>
              <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mt-0.5">
                Emergency Scene → {assignedHosp?.shortName}
              </h4>
              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                {assignedHosp?.area}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
            currentStage === 'TO_HOSPITAL' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {currentStage === 'TO_HOSPITAL' ? 'ACTIVE ROUTE' : 'SWITCH'}
          </span>
        </button>
      </div>

      {/* Main Grid: Interactive Map & Turn-by-Turn Instruction Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Details & Turn-by-Turn Steps */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-5">
            {/* ETA & Distance Summary */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200">
                <p className="text-[10px] uppercase font-mono text-slate-400">Drive ETA</p>
                <p className="text-3xl font-black font-mono text-[#00D4FF] mt-1">
                  ~{route?.durationMins || 4} <span className="text-xs font-normal text-slate-400">mins</span>
                </p>
                <span className="text-[10px] text-emerald-400 font-mono">Live Traffic Sync</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200">
                <p className="text-[10px] uppercase font-mono text-slate-400">Road Distance</p>
                <p className="text-3xl font-black font-mono text-white dark:text-white light:text-slate-900 mt-1">
                  {route?.distanceKm || 3.2} <span className="text-xs font-normal text-slate-400">km</span>
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Speed: ~42 km/h</span>
              </div>
            </div>

            {/* Origin & Destination Labels */}
            <div className="p-3.5 rounded-2xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#168BCE]"></span>
                <span className="text-slate-400">Origin:</span>
                <strong className="text-white dark:text-white light:text-slate-900 truncate">{route?.origin.label}</strong>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-slate-400">Destination:</span>
                <strong className="text-white dark:text-white light:text-slate-900 truncate">{route?.destination.label}</strong>
              </div>
            </div>

            {/* Turn-by-Turn Instruction List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#46C5F5]" />
                  <span>Turn-by-Turn Maneuvers</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500">{route?.steps.length} Steps</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {route?.steps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-xs flex items-start space-x-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-medium leading-relaxed">
                        {step.instruction}
                      </p>
                      <div className="flex items-center space-x-3 mt-1 text-[10px] font-mono text-slate-400">
                        <span>{step.distanceM}m</span>
                        <span>•</span>
                        <span>~{step.durationS}s</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* External App Launch & Recalculate Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <a
                href={route?.externalMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-md transition-colors text-center"
              >
                <span>Launch in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleRecalculate}
                disabled={isRecalculating}
                className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin text-cyan-400' : ''}`} />
                <span>{isRecalculating ? 'Recalculating...' : 'Refresh Route'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Route Map */}
        <div className="lg:col-span-7">
          <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl bg-[#071321]">
            <div ref={mapContainerRef} className="w-full h-full min-h-[520px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
