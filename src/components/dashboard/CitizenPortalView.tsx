import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  PhoneCall, 
  MapPin, 
  Sparkles, 
  ShieldAlert, 
  HeartPulse, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Square
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';

export const CitizenPortalView: React.FC = () => {
  const { createIncident } = useEmergencyData();
  const [sosSent, setSosSent] = useState(false);
  const [cprActive, setCprActive] = useState(false);
  const [cprCount, setCprCount] = useState(0);
  const [activeGuide, setActiveGuide] = useState<'cpr' | 'bleeding' | 'choking' | 'burns'>('cpr');

  // CPR Metronome simulation (110 BPM -> interval ~545ms)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (cprActive) {
      interval = setInterval(() => {
        setCprCount((prev) => prev + 1);
      }, 545);
    }
    return () => clearInterval(interval);
  }, [cprActive]);

  const handle1TapSOS = () => {
    createIncident({
      callerName: 'Mysuru Citizen (Mobile App SOS)',
      callerPhone: '(0821) 998-0012',
      locationName: 'Current Device Geolocation (Near Mysore Palace Gate)',
      area: 'Mysuru Central',
      category: 'TRAUMA_ACCIDENT',
      priority: 'CRITICAL',
      description: 'Instant 1-Tap Mobile SOS Broadcast. Citizen requested immediate emergency response.',
      lat: 12.3040,
      lng: 76.6550,
    });
    setSosSent(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5] mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Citizen Emergency Companion</span>
          </div>
          <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
            Citizen 1-Tap SOS & AI First-Aid Companion
          </h2>
          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1">
            Instant priority rescue dispatch with automated GPS telemetry and life-saving guided first-aid protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 1-Tap SOS Trigger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#050C16] to-[#0A1A2F] border border-rose-500/40 shadow-2xl text-center space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                DISTRICT 112 DIRECT LINK
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Immediate Emergency SOS</h3>
              <p className="text-xs text-slate-400 mt-1">
                Pressing this button broadcasts your exact GPS coordinates directly to the 112 command center and dispatches the nearest ALS unit.
              </p>
            </div>

            {/* Giant SOS Button */}
            <div className="py-4 flex justify-center">
              <button
                onClick={handle1TapSOS}
                disabled={sosSent}
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center font-black text-2xl shadow-[0_0_50px_rgba(239,68,68,0.5)] transition-all cursor-pointer ${
                  sosSent
                    ? 'bg-emerald-600 text-white shadow-[0_0_50px_rgba(34,197,94,0.6)]'
                    : 'bg-rose-600 hover:bg-rose-500 text-white hover:scale-105 active:scale-95 animate-pulse'
                }`}
              >
                {sosSent ? (
                  <>
                    <CheckCircle2 className="w-12 h-12 mb-1" />
                    <span className="text-base font-bold">DISPATCHED</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-12 h-12 mb-1" />
                    <span>SOS 112</span>
                    <span className="text-[10px] font-mono tracking-widest font-normal">EMERGENCY</span>
                  </>
                )}
              </button>
            </div>

            {sosSent ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/80 text-emerald-300 text-xs space-y-1">
                <p className="font-bold">✓ Ambulance Alpha-01 Dispatched!</p>
                <p>ETA ~3 minutes. Keep your phone line free. Emergency responders are approaching your GPS location.</p>
              </div>
            ) : (
              <div className="text-xs text-slate-400 flex items-center justify-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#168BCE]" />
                <span>Device GPS: Mysuru Urban (Accurate to ±4m)</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI CPR & First-Aid Interactive Guide */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>Interactive AI First-Aid Guidance</span>
              </h3>

              {/* Protocol selector tabs */}
              <div className="flex space-x-1 text-xs">
                <button
                  onClick={() => setActiveGuide('cpr')}
                  className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
                    activeGuide === 'cpr' ? 'bg-[#168BCE] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CPR
                </button>
                <button
                  onClick={() => setActiveGuide('bleeding')}
                  className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
                    activeGuide === 'bleeding' ? 'bg-[#168BCE] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bleeding
                </button>
                <button
                  onClick={() => setActiveGuide('choking')}
                  className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
                    activeGuide === 'choking' ? 'bg-[#168BCE] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Choking
                </button>
                <button
                  onClick={() => setActiveGuide('burns')}
                  className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
                    activeGuide === 'burns' ? 'bg-[#168BCE] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Burns
                </button>
              </div>
            </div>

            {/* CPR Section */}
            {activeGuide === 'cpr' && (
              <div className="space-y-4">
                {/* CPR Metronome Interactive Tool */}
                <div className="p-4 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-white dark:text-white light:text-slate-900">CPR Compression Metronome (110 BPM)</p>
                    <p className="text-[11px] text-slate-400">Push hard and fast in the center of the chest to the beat.</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-mono font-bold text-sm ${
                      cprActive ? 'border-rose-500 bg-rose-500/20 text-rose-300 scale-110' : 'border-slate-700 text-slate-500'
                    } transition-all duration-150`}>
                      {cprCount % 30 || 30}
                    </div>

                    <button
                      onClick={() => setCprActive(!cprActive)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer ${
                        cprActive ? 'bg-rose-600 text-white' : 'bg-[#168BCE] text-white'
                      }`}
                    >
                      {cprActive ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{cprActive ? 'Stop Metronome' : 'Start Metronome'}</span>
                    </button>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-start space-x-3">
                    <span className="w-5 h-5 rounded-full bg-[#168BCE] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">Place the heel of your hand on the center of the person's chest. Interlock your other hand on top.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-start space-x-3">
                    <span className="w-5 h-5 rounded-full bg-[#168BCE] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">Compress chest at least 2 inches (5 cm) deep at 100-120 compressions per minute.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-start space-x-3">
                    <span className="w-5 h-5 rounded-full bg-[#168BCE] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">Do not stop until the 108 paramedic crew arrives or an automated defibrillator (AED) instructs you.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bleeding Section */}
            {activeGuide === 'bleeding' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 font-semibold">
                  Severe Arterial Hemorrhage Protocol
                </div>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">1. Apply direct, firm, and continuous pressure using a clean cloth or sterile gauze.</p>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">2. Elevate the injured limb above the level of the heart if possible.</p>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">3. If bleeding does not stop and an extremity tourniquet is available, place 2-3 inches above the wound.</p>
              </div>
            )}

            {/* Choking Section */}
            {activeGuide === 'choking' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 font-semibold">
                  Adult Heimlich Abdominal Thrusts
                </div>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">1. Stand behind the person and wrap your arms around their waist.</p>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">2. Make a fist with one hand and place the thumb side just above the navel.</p>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">3. Grasp your fist with your other hand and give quick, upward thrusts into the abdomen.</p>
              </div>
            )}

            {/* Burns Section */}
            {activeGuide === 'burns' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 font-semibold">
                  Thermal & Chemical Burn First Aid
                </div>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">1. Cool the burn immediately with cool running water for at least 10-20 minutes.</p>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">2. Never apply ice, butter, or greasy ointments to severe burns.</p>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">3. Cover loosely with sterile, non-adherent dressing or clean plastic wrap.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
