import React, { useState } from 'react';
import { 
  Hospital as HospitalIcon, 
  Truck, 
  Activity, 
  Radio, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  HeartPulse,
  Wind
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';

interface OperationsShowcaseProps {
  onOpenDashboard: (view?: string) => void;
}

export const OperationsShowcase: React.FC<OperationsShowcaseProps> = ({ onOpenDashboard }) => {
  const { hospitals, ambulances, incidents } = useEmergencyData();
  const [activeTab, setActiveTab] = useState<'hospitals' | 'ambulances' | 'timeline'>('hospitals');

  return (
    <section className="py-24 bg-[#071321] dark:bg-[#071321] light:bg-[#F5F8FC] relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5] mb-3">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Operational Matrix</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white light:text-slate-900">
              Mysuru District Emergency Readiness
            </h2>
            <p className="text-slate-300 light:text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
              Real-time resource synchronization across all major medical facilities, ambulance fleets, and active 112 incident streams.
            </p>
          </div>

          {/* Tab Switchers */}
          <div className="flex items-center space-x-2 bg-[#050C16] p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeTab === 'hospitals' ? 'bg-[#168BCE] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HospitalIcon className="w-3.5 h-3.5" />
              <span>Hospital ERs</span>
            </button>
            <button
              onClick={() => setActiveTab('ambulances')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeTab === 'ambulances' ? 'bg-[#168BCE] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>108 Fleet</span>
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeTab === 'timeline' ? 'bg-[#168BCE] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Live Events</span>
            </button>
          </div>
        </div>

        {/* Content Showcase Cards */}
        {activeTab === 'hospitals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="p-6 rounded-2xl bg-[#050C16]/90 dark:bg-[#050C16]/90 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-4 hover:border-[#168BCE]/60 transition-all cursor-pointer"
                onClick={() => onOpenDashboard('hospitals')}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-cyan-400 border border-cyan-800/60 font-semibold">
                      {hosp.type}
                    </span>
                    <h3 className="text-base font-bold text-white light:text-slate-900 mt-2">
                      {hosp.name}
                    </h3>
                    <p className="text-xs text-slate-400 light:text-slate-500">{hosp.area}</p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" title="Intake Accepting"></span>
                </div>

                {/* Capacity Gauges */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/80 light:bg-slate-50 rounded-xl border border-slate-800/60 light:border-slate-200 text-center">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-mono">ICU Beds</p>
                    <p className="text-sm font-bold text-emerald-400">{hosp.icuBedsAvailable}/{hosp.totalIcuBeds}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-mono">Ventilators</p>
                    <p className="text-sm font-bold text-cyan-400">{hosp.ventilatorsAvailable}/{hosp.totalVentilators}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-mono">Oxygen %</p>
                    <p className="text-sm font-bold text-white light:text-slate-800">{hosp.oxygenCapacityPct}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 light:text-slate-600 pt-2 border-t border-slate-800 light:border-slate-200">
                  <span className="flex items-center space-x-1">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                    <span>{hosp.traumaSurgeonsOnDuty} Trauma Surgeons</span>
                  </span>
                  <span className="text-emerald-400 font-medium">Wait: ~{hosp.currentWaitTimeMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ambulances' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambulances.map((amb) => (
              <div
                key={amb.id}
                className="p-6 rounded-2xl bg-[#050C16]/90 dark:bg-[#050C16]/90 light:bg-white border border-slate-800 light:border-slate-200 shadow-xl space-y-4 hover:border-[#168BCE]/60 transition-all cursor-pointer"
                onClick={() => onOpenDashboard('fleet')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#168BCE]/20 border border-[#168BCE]/40 flex items-center justify-center text-[#46C5F5]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white light:text-slate-900">{amb.callSign}</h3>
                      <p className="text-[11px] font-mono text-slate-400">{amb.registrationNumber}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    amb.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {amb.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-300 light:text-slate-600">
                  <p><strong className="text-white light:text-slate-900">Lead Paramedic:</strong> {amb.paramedicName}</p>
                  <p><strong className="text-white light:text-slate-900">Base Station:</strong> {amb.baseStation}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 light:border-slate-200 text-xs">
                  <span className="text-slate-400">Speed: <strong className="text-white light:text-slate-800 font-mono">{amb.speedKmH} km/h</strong></span>
                  <span className="text-slate-400 text-right">O2 Tank: <strong className="text-cyan-400 font-mono">{amb.oxygenCylinderPct}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-[#050C16]/90 dark:bg-[#050C16]/90 light:bg-white rounded-3xl p-6 md:p-8 border border-slate-800 light:border-slate-200 shadow-2xl">
            <div className="space-y-6">
              {incidents[0]?.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#168BCE]/20 border border-[#168BCE]/40 flex items-center justify-center text-[#46C5F5] shrink-0 text-xs font-mono font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pb-4 border-b border-slate-800/80 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white light:text-slate-900">{event.title}</h4>
                      <span className="text-xs font-mono text-slate-400">{event.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 light:text-slate-600 mt-1">{event.description}</p>
                    <span className="text-[10px] font-mono text-cyan-400 mt-1 inline-block">Actor: {event.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA to open full command suite */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onOpenDashboard()}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white font-semibold text-sm shadow-lg transition-colors cursor-pointer"
          >
            <span>Launch Complete Command Center Suite</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
