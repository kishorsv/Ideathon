import React, { useState } from 'react';
import { 
  Phone, 
  Radio, 
  Hospital as HospitalIcon, 
  Truck, 
  Activity, 
  Clock, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HeartPulse, 
  Play, 
  Pause, 
  ArrowRight,
  ShieldCheck,
  Send,
  User
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { PriorityLevel, IncidentStatus } from '../../types';

export const CommandCenterView: React.FC = () => {
  const { 
    incidents, 
    ambulances, 
    hospitals, 
    selectedIncidentId, 
    setSelectedIncidentId, 
    dispatchAmbulance, 
    assignHospital, 
    updateIncidentStatus,
    updateVitals
  } = useEmergencyData();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const currentIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const criticalIncidentsCount = incidents.filter((i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const availableAmbulancesCount = ambulances.filter((a) => a.status === 'AVAILABLE').length;
  const totalIcuBedsAvailable = hospitals.reduce((acc, h) => acc + h.icuBedsAvailable, 0);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = inc.callerPhone.includes(searchQuery) || inc.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'CRITICAL') return matchesSearch && inc.priority === 'CRITICAL';
    if (activeFilter === 'PENDING') return matchesSearch && inc.status === 'PENDING';
    return matchesSearch;
  });

  const assignedAmb = ambulances.find((a) => a.id === currentIncident?.assignedAmbulanceId);
  const assignedHosp = hospitals.find((h) => h.id === currentIncident?.assignedHospitalId);

  return (
    <div className="space-y-6">
      {/* Top Operations KPI Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-rose-500/30 dark:border-rose-500/30 light:border-slate-200 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase font-semibold text-rose-400">Critical Code Red</p>
            <h3 className="text-3xl font-extrabold text-white dark:text-white light:text-slate-900 mt-1 font-mono">
              {criticalIncidentsCount}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Active priority incidents</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase font-semibold text-[#46C5F5]">108 Fleet Available</p>
            <h3 className="text-3xl font-extrabold text-white dark:text-white light:text-slate-900 mt-1 font-mono">
              {availableAmbulancesCount} <span className="text-sm font-normal text-slate-400">/ {ambulances.length}</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">ALS & BLS units ready</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#168BCE]/20 border border-[#168BCE]/40 flex items-center justify-center text-[#46C5F5]">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-emerald-500/30 dark:border-emerald-500/30 light:border-slate-200 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase font-semibold text-emerald-400">Mysuru ICU Beds Free</p>
            <h3 className="text-3xl font-extrabold text-white dark:text-white light:text-slate-900 mt-1 font-mono">
              {totalIcuBedsAvailable}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Across 6 major ER centers</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <HospitalIcon className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-cyan-500/30 dark:border-cyan-500/30 light:border-slate-200 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase font-semibold text-cyan-400">Avg Urban ETA</p>
            <h3 className="text-3xl font-extrabold text-white dark:text-white light:text-slate-900 mt-1 font-mono">
              3.4 <span className="text-sm font-normal text-slate-400">min</span>
            </h3>
            <p className="text-[11px] text-emerald-400 mt-0.5">⚡ 42% faster than standard</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main 3-Column Command Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 112 Incident Queue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 flex items-center space-x-2">
                <Radio className="w-4 h-4 text-[#46C5F5]" />
                <span>112 Call Streams</span>
              </h4>
              <span className="text-xs font-mono text-[#46C5F5] font-semibold">
                {filteredIncidents.length} Active
              </span>
            </div>

            {/* Filter buttons */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#050C16] dark:bg-[#050C16] light:bg-slate-100 rounded-xl text-xs font-medium">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`py-1 rounded-lg cursor-pointer transition-colors ${
                  activeFilter === 'ALL' ? 'bg-[#168BCE] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({incidents.length})
              </button>
              <button
                onClick={() => setActiveFilter('CRITICAL')}
                className={`py-1 rounded-lg cursor-pointer transition-colors ${
                  activeFilter === 'CRITICAL' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setActiveFilter('PENDING')}
                className={`py-1 rounded-lg cursor-pointer transition-colors ${
                  activeFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search phone or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs text-slate-200 dark:text-slate-200 light:text-slate-900 focus:outline-none focus:border-[#168BCE]"
            />

            {/* Incidents List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredIncidents.map((inc) => {
                const isSelected = currentIncident?.id === inc.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#168BCE]/20 dark:bg-[#168BCE]/20 light:bg-blue-50 border-[#46C5F5] shadow-md'
                        : 'bg-[#050C16]/80 dark:bg-[#050C16]/80 light:bg-slate-50 border-slate-800 dark:border-slate-800 light:border-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white dark:text-white light:text-slate-900">
                        {inc.callerPhone}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        inc.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {inc.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 mt-1 truncate">
                      {inc.locationName}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 text-[10px] text-slate-400">
                      <span className="font-mono">{inc.category.replace('_', ' ')}</span>
                      <span className={`font-semibold ${
                        inc.status === 'EN_ROUTE' ? 'text-cyan-400' : inc.status === 'RESOLVED' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Column: Selected Incident & AI Dispatch Actions */}
        <div className="lg:col-span-5 space-y-4">
          {currentIncident ? (
            <div className="p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl space-y-5">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold font-mono text-white dark:text-white light:text-slate-900">
                      {currentIncident.callerPhone}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#168BCE]/20 text-[#46C5F5]">
                      {currentIncident.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#168BCE]" />
                    <span>{currentIncident.locationName} ({currentIncident.area})</span>
                  </p>
                </div>

                <select
                  value={currentIncident.status}
                  onChange={(e) => updateIncidentStatus(currentIncident.id, e.target.value as IncidentStatus)}
                  className="px-3 py-1.5 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-100 border border-slate-700 text-xs font-bold text-white dark:text-white light:text-slate-900 focus:outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="EN_ROUTE">EN ROUTE</option>
                  <option value="ON_SCENE">ON SCENE</option>
                  <option value="TRANSPORTING">TRANSPORTING</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              {/* Simulated Audio Stream & Waveform */}
              <div className="p-3.5 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center space-x-1.5 text-cyan-400 font-mono">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Live 112 Audio Channel</span>
                  </span>
                  <span className="font-mono">01:24 / 02:40</span>
                </div>

                {/* Visual Audio Waveform Simulation */}
                <div className="flex items-center justify-between h-8 px-2 space-x-1">
                  {[20, 45, 80, 60, 95, 30, 70, 85, 40, 90, 65, 35, 75, 100, 50, 80, 30, 90, 60, 40].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-[#00D4FF] animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{ height: isPlayingAudio ? `${h}%` : `${h * 0.4}%` }}
                    ></div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#168BCE] text-white text-xs font-semibold cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? 'Pause Live Audio' : 'Play Live Audio'}</span>
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">Auto-Transcribed via AI Whisper Engine</span>
                </div>
              </div>

              {/* AI Triage Summary Box */}
              <div className="p-4 rounded-xl bg-blue-950/30 dark:bg-blue-950/30 light:bg-blue-50 border border-[#168BCE]/40 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#46C5F5]">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Clinical Triage Summary</span>
                </div>
                <p className="text-xs text-slate-200 dark:text-slate-200 light:text-slate-800 leading-relaxed">
                  {currentIncident.aiTriageSummary}
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  "{currentIncident.callerTranscriptSnippet}"
                </p>
              </div>

              {/* Dynamic Dispatch & Allocation Actions */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Resource Allocations
                </h5>

                {/* Ambulance Assignment */}
                <div className="p-3 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-[#168BCE]/20 flex items-center justify-center text-[#46C5F5]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                        {assignedAmb ? assignedAmb.callSign : 'No Unit Dispatched'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {assignedAmb ? `Driver: ${assignedAmb.driverName} • ETA: ~${currentIncident.etaMinutes || 3}m` : 'Select available unit'}
                      </p>
                    </div>
                  </div>

                  <select
                    value={currentIncident.assignedAmbulanceId || ''}
                    onChange={(e) => dispatchAmbulance(currentIncident.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-700 text-xs font-semibold text-[#46C5F5] focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select Ambulance</option>
                    {ambulances.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.callSign} ({a.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Receiving Hospital ER Assignment */}
                <div className="p-3 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <HospitalIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white dark:text-white light:text-slate-900">
                        {assignedHosp ? assignedHosp.name : 'No Hospital Selected'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {assignedHosp ? `${assignedHosp.icuBedsAvailable} ICU Beds • ${assignedHosp.traumaSurgeonsOnDuty} Trauma Surgeons` : 'Assign receiving facility'}
                      </p>
                    </div>
                  </div>

                  <select
                    value={currentIncident.assignedHospitalId || ''}
                    onChange={(e) => assignHospital(currentIncident.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-700 text-xs font-semibold text-emerald-400 focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select Hospital</option>
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.shortName} ({h.icuBedsAvailable} ICU)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">No incident selected</div>
          )}
        </div>

        {/* Right Column: Live Patient Telemetry & Audit Timeline */}
        <div className="lg:col-span-3 space-y-4">
          {/* Patient Vitals Card */}
          <div className="p-4 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white dark:text-white light:text-slate-900 flex items-center space-x-1.5">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>Patient Telemetry</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 animate-pulse">● LIVE STREAM</span>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Heart Rate</p>
                <p className="text-lg font-bold font-mono text-rose-400">
                  {currentIncident?.vitals?.heartRate || 112} <span className="text-[10px] text-slate-400">bpm</span>
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-mono">SpO2 Level</p>
                <p className="text-lg font-bold font-mono text-cyan-400">
                  {currentIncident?.vitals?.spO2 || 94}%
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Blood Pressure</p>
                <p className="text-lg font-bold font-mono text-white dark:text-white light:text-slate-900">
                  {currentIncident?.vitals?.bloodPressure || '120/80'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-mono">GCS Score</p>
                <p className="text-lg font-bold font-mono text-emerald-400">
                  {currentIncident?.vitals?.gcs || 14} / 15
                </p>
              </div>
            </div>
          </div>

          {/* Incident Timeline Log */}
          <div className="p-4 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Audit Timeline</span>
            </h4>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {currentIncident?.timeline.map((item) => (
                <div key={item.id} className="text-xs space-y-0.5 border-l-2 border-[#168BCE] pl-2.5 py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white dark:text-white light:text-slate-900">{item.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
