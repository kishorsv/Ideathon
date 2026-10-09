import React from 'react';
import { 
  Hospital as HospitalIcon, 
  HeartPulse, 
  Wind, 
  Activity, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  Minus,
  Droplet,
  Flame,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';

export const HospitalReadinessView: React.FC = () => {
  const { hospitals, updateHospitalCapacity } = useEmergencyData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5] mb-2">
            <HospitalIcon className="w-3.5 h-3.5" />
            <span>District Clinical Capacity</span>
          </div>
          <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
            Mysuru Hospital Emergency Readiness Matrix
          </h2>
          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1">
            Real-time synchronization of ICU beds, ventilators, surgical teams, and blood bank reserves across all certified facilities.
          </p>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-[#46C5F5] border border-cyan-800/60 font-semibold">
                    {hosp.type}
                  </span>
                  <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 mt-1.5">
                    {hosp.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#168BCE]" />
                    <span>{hosp.area}</span>
                  </p>
                </div>

                <button
                  onClick={() => updateHospitalCapacity(hosp.id, { intakeAccepting: !hosp.intakeAccepting })}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                    hosp.intakeAccepting
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                  title="Click to toggle intake availability"
                >
                  {hosp.intakeAccepting ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>INTAKE OPEN</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      <span>DIVERT</span>
                    </>
                  )}
                </button>
              </div>

              {/* Main Metric Gauges with Live Increment/Decrement controls */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* ICU Beds */}
                <div className="p-3 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-mono text-slate-400">ICU Beds</p>
                    <p className="text-lg font-bold font-mono text-emerald-400">
                      {hosp.icuBedsAvailable} <span className="text-xs text-slate-500">/{hosp.totalIcuBeds}</span>
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => updateHospitalCapacity(hosp.id, { icuBedsAvailable: Math.min(hosp.totalIcuBeds, hosp.icuBedsAvailable + 1) })}
                      className="p-1 rounded bg-slate-800 hover:bg-[#168BCE] text-white text-xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => updateHospitalCapacity(hosp.id, { icuBedsAvailable: Math.max(0, hosp.icuBedsAvailable - 1) })}
                      className="p-1 rounded bg-slate-800 hover:bg-rose-600 text-white text-xs cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Ventilators */}
                <div className="p-3 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-mono text-slate-400">Ventilators</p>
                    <p className="text-lg font-bold font-mono text-cyan-400">
                      {hosp.ventilatorsAvailable} <span className="text-xs text-slate-500">/{hosp.totalVentilators}</span>
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => updateHospitalCapacity(hosp.id, { ventilatorsAvailable: Math.min(hosp.totalVentilators, hosp.ventilatorsAvailable + 1) })}
                      className="p-1 rounded bg-slate-800 hover:bg-[#168BCE] text-white text-xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => updateHospitalCapacity(hosp.id, { ventilatorsAvailable: Math.max(0, hosp.ventilatorsAvailable - 1) })}
                      className="p-1 rounded bg-slate-800 hover:bg-rose-600 text-white text-xs cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                <div className="p-2 rounded-lg bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 flex items-center space-x-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  <span>{hosp.traumaSurgeonsOnDuty} Trauma Surgeons</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 flex items-center space-x-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <span>O2: {hosp.oxygenCapacityPct}% Liquid</span>
                </div>
              </div>

              {/* Blood Bank Availability Badges */}
              <div className="pt-2 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span className="flex items-center space-x-1">
                    <Droplet className="w-3 h-3 text-rose-500" />
                    <span>Blood Bank Units Ready</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800">
                    O+: {hosp.bloodStockLevels.oPos}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800">
                    O-: {hosp.bloodStockLevels.oNeg}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    A+: {hosp.bloodStockLevels.aPos}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    B+: {hosp.bloodStockLevels.bPos}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Emergency Contact */}
            <div className="pt-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-cyan-400">{hosp.emergencyPhone}</span>
              <span className="text-emerald-400 font-medium">Wait ~{hosp.currentWaitTimeMinutes} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
