import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MapPin, 
  Shield, 
  Maximize2, 
  Search, 
  ChevronDown, 
  Bell, 
  Activity, 
  Radio, 
  Compass, 
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Navigation,
  RefreshCw,
  Crosshair
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { Incident } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveHeroMapPreviewProps {
  onOpenDashboard: (incidentId?: string) => void;
}

export const InteractiveHeroMapPreview: React.FC<InteractiveHeroMapPreviewProps> = ({ onOpenDashboard }) => {
  const { incidents, ambulances, hospitals } = useEmergencyData();
  const [activeTab, setActiveTab] = useState<'calls' | 'dispatch' | 'analytics' | 'training' | 'explore' | 'admin'>('calls');
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident>(incidents[0] || ({} as Incident));
  const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map');
  const [callTimer, setCallTimer] = useState(84);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const MYSURU_CENTER: [number, number] = [12.3080, 76.6480];

  useEffect(() => {
    if (incidents.length > 0 && (!selectedIncident || !selectedIncident.id)) {
      setSelectedIncident(incidents[0]);
    }
  }, [incidents, selectedIncident]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Leaflet Map in Hero Preview
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: MYSURU_CENTER,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      const tileUrl = mapMode === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 19,
      });

      tiles.on('load', () => setIsMapLoading(false));
      tiles.addTo(map);
      tileLayerRef.current = tiles;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      const timer1 = setTimeout(() => {
        map.invalidateSize();
        setIsMapLoading(false);
      }, 150);

      const timer2 = setTimeout(() => {
        map.invalidateSize();
      }, 500);

      const resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        resizeObserver.disconnect();
        map.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
        markersLayerRef.current = null;
      };
    } catch (e) {
      console.error('Hero map init error:', e);
      setIsMapLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileUrl = mapMode === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    tileLayerRef.current.setUrl(tileUrl);
    mapInstanceRef.current.invalidateSize();
  }, [mapMode]);

  // Update Markers on Hero Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    // Hospitals
    hospitals.slice(0, 4).forEach((hosp) => {
      const customIcon = L.divIcon({
        className: 'custom-hosp-pill',
        html: `<div style="
          background: #071321;
          border: 1.5px solid #22c55e;
          color: #ffffff;
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(0,0,0,0.6);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 3px;
        ">🏥 ${hosp.shortName} <span style="color:#00d4ff; font-family: monospace;">(${hosp.icuBedsAvailable})</span></div>`,
        iconSize: [110, 24],
        iconAnchor: [55, 12],
      });
      const marker = L.marker([hosp.lat, hosp.lng], { icon: customIcon });
      layer.addLayer(marker);
    });

    // Ambulances
    ambulances.slice(0, 3).forEach((amb) => {
      const customIcon = L.divIcon({
        className: 'custom-amb-beacon',
        html: `<div style="
          background: #168bce;
          border: 2px solid #ffffff;
          color: #ffffff;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          box-shadow: 0 0 15px #00d4ff;
          position: relative;
        ">
          <div style="position: absolute; inset: -3px; border-radius: 50%; border: 1.5px solid #00d4ff; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.8;"></div>
          <span>🚑</span>
        </div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });
      const marker = L.marker([amb.lat, amb.lng], { icon: customIcon });
      layer.addLayer(marker);
    });

    // Incidents
    incidents.slice(0, 4).forEach((inc) => {
      const isSelected = selectedIncident?.id === inc.id;
      const isCrit = inc.priority === 'CRITICAL';
      const customIcon = L.divIcon({
        className: 'custom-inc-beacon',
        html: `<div style="
          background: ${isCrit ? '#ef4444' : '#f59e0b'};
          border: 2px solid #ffffff;
          color: #ffffff;
          width: ${isSelected ? '28px' : '22px'};
          height: ${isSelected ? '28px' : '22px'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          box-shadow: 0 0 15px ${isCrit ? '#ef4444' : '#f59e0b'};
          cursor: pointer;
        ">
          <span>📞</span>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const marker = L.marker([inc.lat, inc.lng], { icon: customIcon });
      marker.on('click', () => setSelectedIncident(inc));
      layer.addLayer(marker);
    });

    // Active Route Polyline
    if (incidents[0] && ambulances[0]) {
      const routeLine = L.polyline(
        [
          [ambulances[0].lat, ambulances[0].lng],
          [(ambulances[0].lat + incidents[0].lat) / 2 + 0.002, (ambulances[0].lng + incidents[0].lng) / 2],
          [incidents[0].lat, incidents[0].lng],
        ],
        {
          color: '#00D4FF',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 5',
        }
      );
      layer.addLayer(routeLine);
    }
  }, [hospitals, ambulances, incidents, selectedIncident]);

  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = inc.callerPhone.includes(searchQuery) || inc.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || inc.priority === 'CRITICAL';
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full relative rounded-2xl md:rounded-3xl overflow-hidden border border-[#168BCE]/30 bg-[#071321]/95 text-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(22,139,206,0.25)] backdrop-blur-2xl transition-all duration-300">
      {/* Glow Top Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#46C5F5] to-transparent opacity-60"></div>
      
      {/* Top Application Header Bar */}
      <div className="flex items-center justify-between px-3 md:px-6 py-2.5 bg-[#050C16]/90 border-b border-slate-800/80 text-xs md:text-sm">
        {/* Left: Brand Icon & Navigation Tabs */}
        <div className="flex items-center space-x-2 md:space-x-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-[#168BCE]/20 border border-[#168BCE]/40 flex items-center justify-center text-[#46C5F5]">
              <Shield className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2 text-slate-300">
            <button
              onClick={() => setActiveTab('calls')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'calls' ? 'bg-[#168BCE]/20 text-[#46C5F5] border border-[#168BCE]/40' : 'hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#46C5F5]" />
              <span>Calls</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-0.5"></span>
            </button>

            <button
              onClick={() => { setActiveTab('dispatch'); onOpenDashboard(); }}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'dispatch' ? 'bg-[#168BCE]/20 text-[#46C5F5] border border-[#168BCE]/40' : 'hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-slate-400" />
              <span>Dispatch</span>
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); onOpenDashboard(); }}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => { setActiveTab('training'); onOpenDashboard(); }}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Triage</span>
            </button>

            <button
              onClick={() => { setActiveTab('explore'); onOpenDashboard(); }}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Hospitals</span>
            </button>
          </div>
        </div>

        {/* Right: Department selector & profile info */}
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
          <button 
            onClick={() => onOpenDashboard()}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800/70 border border-slate-700/60 text-slate-200 hover:border-[#168BCE]/60 text-xs font-medium cursor-pointer"
          >
            <span>Mysuru Control</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          <div className="relative p-1 text-slate-400 hover:text-white cursor-pointer" onClick={() => onOpenDashboard()}>
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
          </div>
          <div 
            onClick={() => onOpenDashboard()}
            className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#168BCE] to-[#46C5F5] flex items-center justify-center text-[10px] font-bold text-slate-950 cursor-pointer"
            title="Open Full Dashboard"
          >
            MC
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] md:min-h-[520px] bg-[#071321]">
        {/* Left Column: Incidents & Incoming Calls list */}
        <div className="lg:col-span-4 border-r border-slate-800/70 flex flex-col bg-[#06101c]/90">
          <div className="p-3 border-b border-slate-800/60 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-md bg-[#168BCE]/25 text-[#46C5F5] font-semibold border border-[#168BCE]/40">
                  Incidents ({filteredIncidents.length})
                </span>
                <span className="px-2.5 py-1 rounded-md text-slate-400 hover:text-slate-200 cursor-pointer">
                  Archive
                </span>
              </div>
              <button 
                onClick={() => onOpenDashboard()}
                className="w-6 h-6 rounded-md bg-slate-800 hover:bg-[#168BCE] text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                title="Create Incident"
              >
                +
              </button>
            </div>

            {/* Filter Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by phone or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#168BCE]"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeFilter === 'all' ? 'text-[#46C5F5] font-medium bg-[#168BCE]/15' : 'hover:text-slate-200'
                  }`}
                >
                  All Calls
                </button>
                <button
                  onClick={() => setActiveFilter('critical')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeFilter === 'critical' ? 'text-rose-400 font-medium bg-rose-950/40' : 'hover:text-slate-200'
                  }`}
                >
                  Critical Only
                </button>
              </div>
              <span className="flex items-center space-x-1 text-emerald-400 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AI Live Sync</span>
              </span>
            </div>
          </div>

          {/* Call / Incident Item List */}
          <div className="flex-1 overflow-y-auto max-h-[380px] p-2 space-y-1.5 divide-y divide-slate-800/40">
            {filteredIncidents.map((inc, index) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`pt-1.5 first:pt-0 p-2.5 rounded-xl cursor-pointer transition-all duration-200 flex items-start justify-between ${
                    isSelected
                      ? 'bg-[#168BCE]/15 border border-[#168BCE]/50 shadow-[0_0_15px_rgba(22,139,206,0.2)]'
                      : 'hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        inc.priority === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-[#168BCE]/20 text-[#46C5F5] border border-[#168BCE]/30'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-white tracking-wide font-mono">
                          {inc.callerPhone}
                        </span>
                        {inc.priority === 'CRITICAL' && (
                          <span className="px-1.5 py-0.2 bg-rose-500/30 text-rose-300 text-[9px] font-bold rounded">
                            CODE RED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[170px] mt-0.5">
                        {inc.locationName}
                      </p>
                      <p className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <span>Position #{12 + index}</span>
                        <span>•</span>
                        <span>{inc.area}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {inc.reportedAt}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded inline-block mt-1 ${
                      isSelected ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-500'
                    }`}>
                      {formatSeconds(inc.callDurationSeconds + (isSelected ? (callTimer % 60) : 0))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center/Right: Interactive Mysuru City GIS Map Area */}
        <div className="lg:col-span-8 relative flex flex-col bg-[#050b14] overflow-hidden min-h-[350px]">
          {/* Map Top Floating Controls Bar */}
          <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-auto">
            {/* Search area bar */}
            <div className="relative max-w-xs w-full shadow-lg">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                readOnly
                value="Mysuru Urban Division (112 Area)"
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#071321]/90 backdrop-blur-md border border-slate-700/70 text-slate-200 focus:outline-none cursor-default"
              />
            </div>

            {/* Map Controls */}
            <div className="flex items-center space-x-1.5 bg-[#071321]/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/70 shadow-lg text-xs">
              <button
                onClick={() => setMapMode('map')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                  mapMode === 'map' ? 'bg-[#168BCE] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark Carto
              </button>
              <button
                onClick={() => setMapMode('satellite')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                  mapMode === 'satellite' ? 'bg-[#168BCE] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => onOpenDashboard()}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                title="Expand to Fullscreen GIS"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Leaflet Map DOM Node */}
          <div className="relative flex-1 w-full h-full min-h-[380px] bg-[#071321]">
            <div 
              ref={mapContainerRef} 
              className="w-full h-full min-h-[380px] z-0" 
              style={{ width: '100%', height: '100%', minHeight: '380px' }}
            />

            {/* Selected Incident Floating Detail Callout */}
            {selectedIncident && (
              <div className="absolute top-[48%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-40 w-[290px] md:w-[340px] bg-[#071321]/95 border border-[#46C5F5]/40 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(22,139,206,0.3)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header with Phone & Live Timer */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white font-mono">
                      {selectedIncident.callerPhone}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {formatSeconds(selectedIncident.callDurationSeconds + (callTimer % 60))}
                  </span>
                </div>

                {/* Sub Location */}
                <div className="mt-2 text-xs text-slate-300 space-y-0.5">
                  <p className="text-[11px] text-cyan-400 font-medium flex items-center space-x-1">
                    <MapPin className="w-3 h-3 inline" />
                    <span>Apple Device GPS • Accuracy ±4m</span>
                  </p>
                  <p className="font-semibold text-slate-100">{selectedIncident.locationName}</p>
                  <p className="text-[11px] text-slate-400">{selectedIncident.area}, Mysuru</p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 my-2.5">
                  <button
                    onClick={() => onOpenDashboard(selectedIncident.id)}
                    className="py-1.5 px-3 rounded-lg bg-[#168BCE] hover:bg-[#1277b2] text-white text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-md"
                  >
                    <span>Open</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onOpenDashboard(selectedIncident.id)}
                    className="py-1.5 px-3 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                  >
                    <span>Street View</span>
                  </button>
                </div>

                {/* AI Transcription / Dispatch Note Snippet */}
                <div className="bg-[#050c16]/80 rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  <p className="text-slate-400">
                    <span className="text-[#46C5F5] font-semibold">AI Summary: </span>
                    {selectedIncident.aiTriageSummary || 'Caller reporting emergency. First responder unit en-route.'}
                  </p>
                </div>

                {/* Unit Assigned status badge */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Unit: Alpha-01 (ALS)</span>
                  </span>
                  <span className="text-cyan-400 font-mono font-semibold">ETA: ~3 mins</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Live Operations Ticker */}
          <div className="px-4 py-2 bg-[#050C16]/90 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5 text-cyan-400 font-medium">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Mysuru 112 Command Live</span>
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="hidden sm:inline text-slate-400 font-mono">
                Active Ambulances: {ambulances.filter(a => a.status === 'EN_ROUTE' || a.status === 'TRANSPORTING').length}/{ambulances.length}
              </span>
            </div>
            <button
              onClick={() => onOpenDashboard()}
              className="text-[#46C5F5] hover:text-white font-medium flex items-center space-x-1 cursor-pointer transition-colors text-xs"
            >
              <span>Launch Full GIS Operations</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
