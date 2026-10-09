import React, { useState } from 'react';
import { 
  Hospital as HospitalIcon, 
  Sparkles, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  HeartPulse, 
  Wind, 
  ShieldCheck, 
  ArrowRight,
  Droplet,
  Flame,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { HospitalRecommendation } from '../../types';

interface SmartHospitalSelectionViewProps {
  onNavigateToHospital: (hospitalId: string) => void;
}

export const SmartHospitalSelectionView: React.FC<SmartHospitalSelectionViewProps> = ({
  onNavigateToHospital,
}) => {
  const { 
    incidents, 
    selectedIncidentId, 
    setSelectedIncidentId, 
    getHospitalRecommendationsForIncident,
    selectHospitalAndGenerateRoute 
  } = useEmergencyData();

  const currentIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];
  const recommendations = currentIncident ? getHospitalRecommendationsForIncident(currentIncident.id) : [];

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(
    currentIncident?.assignedHospitalId || recommendations[0]?.hospitalId || ''
  );

  const handleSelectAndGetDirections = (rec: HospitalRecommendation) => {
    setSelectedHospitalId(rec.hospitalId);
    selectHospitalAndGenerateRoute(currentIncident.id, rec.hospitalId);
    onNavigateToHospital(rec.hospitalId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Hospital Recommendation Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
            Intelligent ER Facility Selection
          </h2>
          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1 max-w-2xl">
            Multi-factor clinical optimization balancing road travel time, verified ICU bed capacity, on-duty trauma surgeons, and specialized treatment units.
          </p>
        </div>

        {/* Selected Incident Selector */}
        {currentIncident && (
          <div className="p-3 rounded-xl bg-[#050C16] border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Target Incident</span>
            <p className="font-bold text-white font-mono">{currentIncident.callerPhone}</p>
            <p className="text-[11px] text-[#46C5F5] truncate max-w-[180px]">{currentIncident.locationName}</p>
          </div>
        )}
      </div>

      {/* Ranked Hospital Cards List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const isTopRanked = index === 0;
          const isSelected = currentIncident?.assignedHospitalId === rec.hospitalId;

          return (
            <div
              key={rec.hospitalId}
              className={`p-6 rounded-3xl border transition-all duration-300 shadow-xl relative overflow-hidden ${
                isTopRanked
                  ? 'bg-gradient-to-br from-[#071321] via-[#081b30] to-[#0a2747] border-[#46C5F5] shadow-[0_10px_35px_rgba(22,139,206,0.25)]'
                  : 'bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border-slate-800 dark:border-slate-800 light:border-slate-200'
              }`}
            >
              {isTopRanked && (
                <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-gradient-to-l from-[#168BCE] to-[#46C5F5] text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                  ★ TOP CLINICAL MATCH
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Hospital Info & Clinical Rationale */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-white dark:text-white light:text-slate-900">
                      {rec.hospital.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-[#46C5F5] border border-cyan-800/60">
                      {rec.hospital.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#168BCE]" />
                    <span>{rec.hospital.area}</span>
                  </p>

                  {/* Why Recommended Rationale Box */}
                  <div className="p-3.5 rounded-2xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800/80 dark:border-slate-800 light:border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#46C5F5] flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Why Recommended:</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">{rec.dataFreshness}</span>
                    </div>
                    <p className="text-slate-200 dark:text-slate-200 light:text-slate-700 leading-relaxed">
                      {rec.rationale}
                    </p>
                  </div>

                  {/* Verified Capabilities Checklist */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rec.matchedCapabilities.map((cap, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-[11px] font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{cap}</span>
                      </span>
                    ))}
                    {rec.missingCapabilities.map((miss, mIdx) => (
                      <span
                        key={mIdx}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 text-[11px]"
                      >
                        <span>• {miss}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Road Metrics & Action Button */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4 p-4 rounded-2xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200">
                  {/* Road Distance & Driving Time */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200">
                      <p className="text-[10px] uppercase font-mono text-slate-400">Estimated Drive Time</p>
                      <p className="text-2xl font-black font-mono text-[#00D4FF] mt-1">
                        ~{rec.estimatedDriveTimeMins} <span className="text-xs font-normal text-slate-400">mins</span>
                      </p>
                      <span className="text-[10px] text-emerald-400 font-mono">Traffic: {rec.trafficCondition}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200">
                      <p className="text-[10px] uppercase font-mono text-slate-400">Road Distance</p>
                      <p className="text-2xl font-black font-mono text-white dark:text-white light:text-slate-900 mt-1">
                        {rec.roadDistanceKm} <span className="text-xs font-normal text-slate-400">km</span>
                      </p>
                      <span className="text-[10px] text-cyan-400 font-mono">Score: {rec.matchScore}/100</span>
                    </div>
                  </div>

                  {/* Bed Status */}
                  <div className="flex items-center justify-between text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 px-1">
                    <span>ICU Capacity: <strong className="text-emerald-400 font-mono">{rec.hospital.icuBedsAvailable} Free</strong></span>
                    <span>Ventilators: <strong className="text-cyan-400 font-mono">{rec.hospital.ventilatorsAvailable} Ready</strong></span>
                  </div>

                  {/* GET DIRECTIONS Button (Feature 4) */}
                  <button
                    onClick={() => handleSelectAndGetDirections(rec)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#168BCE] to-[#46C5F5] hover:from-[#1277b2] hover:to-[#38bdf8] text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Navigation className="w-4 h-4 fill-current" />
                    <span>GET DIRECTIONS TO {rec.hospital.shortName.toUpperCase()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
