import React from 'react';
import { 
  Truck, 
  Activity, 
  BatteryCharging, 
  Navigation, 
  Phone, 
  Wind, 
  Zap, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';

export const AmbulanceFleetView: React.FC = () => {
  const { ambulances } = useEmergencyData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5] mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>108 Fleet Telematics</span>
          </div>
          <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
            Mysuru District 108 Ambulance Units
          </h2>
          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1">
            Real-time GPS tracking, vehicle telemetry, medical oxygen cylinders, defibrillator ready-state, and active crew contacts.
          </p>
        </div>
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ambulances.map((amb) => (
          <div
            key={amb.id}
            className="p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-4"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-[#168BCE]/20 border border-[#168BCE]/40 flex items-center justify-center text-[#46C5F5]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">{amb.callSign}</h3>
                  <p className="text-xs font-mono text-slate-400">{amb.registrationNumber}</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                amb.status === 'AVAILABLE'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : amb.status === 'EN_ROUTE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {amb.status.replace('_', ' ')}
              </span>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center">
              <div>
                <p className="text-[10px] uppercase font-mono text-slate-400">GPS Speed</p>
                <p className="text-sm font-bold font-mono text-white dark:text-white light:text-slate-900">{amb.speedKmH} km/h</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono text-slate-400">Fuel / Battery</p>
                <p className="text-sm font-bold font-mono text-emerald-400">{amb.fuelPct}%</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono text-slate-400">O2 Tank</p>
                <p className="text-sm font-bold font-mono text-cyan-400">{amb.oxygenCylinderPct}%</p>
              </div>
            </div>

            {/* Crew Info */}
            <div className="space-y-1 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              <p><strong className="text-white dark:text-white light:text-slate-900">Lead Paramedic:</strong> {amb.paramedicName}</p>
              <p><strong className="text-white dark:text-white light:text-slate-900">Driver:</strong> {amb.driverName} ({amb.driverPhone})</p>
              <p><strong className="text-white dark:text-white light:text-slate-900">Base Station:</strong> {amb.baseStation}</p>
            </div>

            {/* Defibrillator & Equipment */}
            <div className="pt-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between text-xs">
              <span className="flex items-center space-x-1 text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Defibrillator Ready</span>
              </span>
              <span className="font-mono text-slate-400 text-[10px]">
                Lat: {amb.lat.toFixed(4)}, Lng: {amb.lng.toFixed(4)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
