import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  MapPin, 
  Hospital as HospitalIcon, 
  Map as MapIcon, 
  BookOpen, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  HeartPulse, 
  Flame, 
  Wind, 
  Activity,
  Send,
  Navigation,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { IncidentCategory } from '../../types';

interface EmergencyAssistancePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLiveMap: () => void;
  clickCount?: number;
}

export const EmergencyAssistancePanel: React.FC<EmergencyAssistancePanelProps> = ({
  isOpen,
  onClose,
  onOpenLiveMap,
  clickCount = 1,
}) => {
  const { hospitals, createEmergencyRequest } = useEmergencyData();

  // Active section in the assistance panel
  const [activeSection, setActiveSection] = useState<'options' | 'hospitals' | 'hospital_info' | 'guidance' | 'sos_form'>('options');
  
  // Call confirmation modal
  const [showCallConfirm, setShowCallConfirm] = useState(false);
  
  // Selected hospital for detailed info
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || '');
  
  // SOS Dispatch Form state
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('TRAUMA_ACCIDENT');
  const [description, setDescription] = useState('');
  const [isSubmittingSOS, setIsSubmittingSOS] = useState(false);
  const [sosSuccessIncidentId, setSosSuccessIncidentId] = useState<string | null>(null);
  const [sosError, setSosError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  // Initiate call to 112 with user confirmation
  const handleInitiate112Call = () => {
    setShowCallConfirm(true);
  };

  const handleConfirm112Call = () => {
    setShowCallConfirm(false);
    // Opens the device's native dialer using a standard tel: link
    window.location.href = 'tel:112';
  };

  // Submit formal online SOS request with confirmation
  const handleSubmitSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingSOS) return; // Prevent duplicate submission

    setIsSubmittingSOS(true);
    setSosError(null);

    try {
      const res = await createEmergencyRequest({
        callerName: callerName || 'Citizen Emergency Caller',
        callerPhone: callerPhone || '(0821) 112-9999',
        locationName: manualAddress || 'Mysuru District Emergency Scene',
        lat: 12.3080,
        lng: 76.6480,
        category,
        priority: 'CRITICAL',
        description: description || 'Assistance requested via Emergency Assistance Portal.',
      });

      setIsSubmittingSOS(false);
      if (res.success && res.incident) {
        setSosSuccessIncidentId(res.incident.id);
      } else {
        setSosError(res.error || 'Unable to broadcast request. Please dial 112 immediately.');
      }
    } catch {
      setIsSubmittingSOS(false);
      setSosError('Network error. Please call 112 directly on your phone.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#071321] text-slate-100 border border-slate-700/80 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-red-650 via-rose-600 to-[#071321] border-b border-slate-800 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-400/50 flex items-center justify-center text-white shadow-lg">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Emergency Assistance Panel
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-red-700">
                  112 HELPLINE
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Immediate response options for Mysuru District
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Close Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-click Informational Banner (Required behavior for repeated clicks) */}
        {clickCount > 1 && (
          <div className="px-5 py-2.5 bg-blue-950/80 border-b border-blue-800/60 text-xs text-cyan-300 flex items-center space-x-2 animate-in slide-in-from-top-1">
            <Info className="w-4 h-4 shrink-0 text-[#46C5F5]" />
            <span>Emergency assistance options are available below.</span>
          </div>
        )}

        {/* Panel Main Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Main Options Menu View */}
          {activeSection === 'options' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 font-medium">
                Choose the assistance option that best fits your immediate requirement:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Call Emergency Services (112) */}
                <button
                  onClick={handleInitiate112Call}
                  className="p-4 rounded-2xl bg-gradient-to-br from-red-950/60 via-red-900/40 to-[#071321] hover:from-red-900/70 hover:to-red-950 border border-red-500/50 hover:border-red-400 text-left transition-all duration-200 group cursor-pointer shadow-lg sm:col-span-2 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
                      <Phone className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-bold text-white group-hover:text-red-300">
                          Call Emergency Services (112)
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500 text-white">
                          TOLL FREE
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Connect to Mysuru Central Police, Fire, and 108 Ambulance Dispatch.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform shrink-0 hidden sm:block" />
                </button>

                {/* 2. Find Nearby Hospitals */}
                <button
                  onClick={() => setActiveSection('hospitals')}
                  className="p-4 rounded-2xl bg-[#050C16] hover:bg-slate-800/80 border border-slate-800 hover:border-[#168BCE]/60 text-left transition-all duration-200 group cursor-pointer space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#168BCE]/20 text-[#46C5F5] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <HospitalIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#46C5F5]">
                      Find Nearby Hospitals
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      View closest verified trauma centers, contact numbers & driving directions.
                    </p>
                  </div>
                </button>

                {/* 3. View Available Hospital Information */}
                <button
                  onClick={() => setActiveSection('hospital_info')}
                  className="p-4 rounded-2xl bg-[#050C16] hover:bg-slate-800/80 border border-slate-800 hover:border-[#168BCE]/60 text-left transition-all duration-200 group cursor-pointer space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">
                      Hospital Capacity & ICU Status
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Real-time ICU bed availability, ventilators, oxygen and trauma surgeons.
                    </p>
                  </div>
                </button>

                {/* 4. Open the Live Map */}
                <button
                  onClick={() => {
                    onClose();
                    onOpenLiveMap();
                  }}
                  className="p-4 rounded-2xl bg-[#050C16] hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/60 text-left transition-all duration-200 group cursor-pointer space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MapIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">
                      Open Live Google Map
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Explore interactive city map with hospital markers, streets & directions.
                    </p>
                  </div>
                </button>

                {/* 5. View Emergency Guidance */}
                <button
                  onClick={() => setActiveSection('guidance')}
                  className="p-4 rounded-2xl bg-[#050C16] hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/60 text-left transition-all duration-200 group cursor-pointer space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300">
                      Emergency First-Aid Guidance
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Step-by-step instructions for CPR, severe bleeding, stroke & heart attack.
                    </p>
                  </div>
                </button>
              </div>

              {/* Quick Online 108 Dispatch Trigger */}
              <div className="pt-2">
                <button
                  onClick={() => setActiveSection('sos_form')}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 hover:border-red-500/50 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <span>Need to submit an online incident report to dispatch 108 units?</span>
                  <span className="text-[#46C5F5] underline font-bold">Click here to log details</span>
                </button>
              </div>
            </div>
          )}

          {/* Section: Nearby Hospitals List */}
          {activeSection === 'hospitals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <HospitalIcon className="w-4 h-4 text-[#46C5F5]" />
                  <span>Verified Mysuru Hospitals ({hospitals.length})</span>
                </h4>
                <button
                  onClick={() => setActiveSection('options')}
                  className="text-xs text-[#46C5F5] hover:underline cursor-pointer"
                >
                  ← Back to Options
                </button>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {hospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    className="p-3.5 rounded-2xl bg-[#050C16] border border-slate-800 hover:border-slate-700 transition-colors text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-white text-sm">{hosp.name}</h5>
                        <p className="text-slate-400 text-[11px] flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#168BCE]" />
                          <span>{hosp.area}, Mysuru</span>
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-[#46C5F5] border border-cyan-800/50">
                        {hosp.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                      <div>
                        <span className="text-slate-500">ICU Beds: </span>
                        <strong className="text-emerald-400 font-mono">{hosp.icuBedsAvailable} Available</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Total Beds: </span>
                        <strong className="text-cyan-400">{hosp.totalBeds}</strong>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-500">Emergency: </span>
                        <a href={`tel:${hosp.emergencyPhone}`} className="text-white hover:text-[#46C5F5] font-mono underline">
                          {hosp.emergencyPhone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-900 text-slate-400">
                          Surgeons on Duty: {hosp.traumaSurgeonsOnDuty}
                        </span>
                        {hosp.cathLabReady && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-300">
                            Cath Lab
                          </span>
                        )}
                        {hosp.strokeUnitReady && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-950 text-cyan-300">
                            Stroke Unit
                          </span>
                        )}
                      </div>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hosp.name + ', Mysuru')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-[#46C5F5] hover:text-white font-semibold text-[11px] cursor-pointer"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Hospital Detailed Capacity Information */}
          {activeSection === 'hospital_info' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Facility Resource Breakdown</span>
                </h4>
                <button
                  onClick={() => setActiveSection('options')}
                  className="text-xs text-[#46C5F5] hover:underline cursor-pointer"
                >
                  ← Back to Options
                </button>
              </div>

              {/* Hospital Tabs */}
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                {hospitals.map((hosp) => (
                  <button
                    key={hosp.id}
                    onClick={() => setSelectedHospitalId(hosp.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedHospital.id === hosp.id
                        ? 'bg-[#168BCE] text-white'
                        : 'bg-[#050C16] text-slate-400 hover:text-white'
                    }`}
                  >
                    {hosp.shortName}
                  </button>
                ))}
              </div>

              {/* Selected Hospital Details Card */}
              {selectedHospital && (
                <div className="p-5 rounded-2xl bg-[#050C16] border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{selectedHospital.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{selectedHospital.area}, Mysuru</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono">
                      {selectedHospital.icuBedsAvailable} ICU Beds Free
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] uppercase font-mono text-slate-400">Total Bed Count</p>
                      <p className="text-xl font-bold text-white font-mono mt-1">{selectedHospital.totalBeds}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] uppercase font-mono text-slate-400">Available ICU</p>
                      <p className="text-xl font-bold text-emerald-400 font-mono mt-1">{selectedHospital.icuBedsAvailable}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] uppercase font-mono text-slate-400">Ventilators</p>
                      <p className="text-xl font-bold text-cyan-400 font-mono mt-1">{selectedHospital.ventilatorsAvailable}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] uppercase font-mono text-slate-400">Surgeons On Duty</p>
                      <p className="text-xl font-bold text-purple-400 font-mono mt-1">{selectedHospital.traumaSurgeonsOnDuty}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-slate-300">Verified Clinical Facilities:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedHospital.cathLabReady && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium">
                          ✓ 24/7 Cardiac Cath Lab
                        </span>
                      )}
                      {selectedHospital.strokeUnitReady && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium">
                          ✓ Comprehensive Stroke Center
                        </span>
                      )}
                      {selectedHospital.burnUnitReady && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium">
                          ✓ Burns Critical Care Unit
                        </span>
                      )}
                      {selectedHospital.pediatricIcuReady && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium">
                          ✓ Pediatric Intensive Care (PICU)
                        </span>
                      )}
                      {selectedHospital.bloodBankAvailable && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium">
                          ✓ 24/7 Blood Bank
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <a
                      href={`tel:${selectedHospital.emergencyPhone}`}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call ER: {selectedHospital.emergencyPhone}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedHospital.name + ', Mysuru')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white font-bold text-xs shadow-md transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Drive Directions</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section: Emergency Guidance (CPR, Stroke, Heart Attack, First Aid) */}
          {activeSection === 'guidance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Immediate Life-Support Protocols</span>
                </h4>
                <button
                  onClick={() => setActiveSection('options')}
                  className="text-xs text-[#46C5F5] hover:underline cursor-pointer"
                >
                  ← Back to Options
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* CPR Protocol */}
                <div className="p-4 rounded-2xl bg-[#050C16] border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold">
                    <HeartPulse className="w-4 h-4" />
                    <span>Cardiac Arrest & CPR</span>
                  </div>
                  <ol className="list-decimal list-inside text-slate-300 space-y-1 leading-relaxed">
                    <li>Check for responsiveness and pulse.</li>
                    <li>Call 112 immediately and place on speaker.</li>
                    <li>Push hard & fast in center of chest (100–120 bpm).</li>
                    <li>Allow chest to fully recoil between compressions.</li>
                  </ol>
                </div>

                {/* Stroke Protocol */}
                <div className="p-4 rounded-2xl bg-[#050C16] border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold">
                    <Activity className="w-4 h-4" />
                    <span>Stroke Assessment (F.A.S.T.)</span>
                  </div>
                  <ul className="text-slate-300 space-y-1 leading-relaxed">
                    <li><strong className="text-white">F - Face:</strong> Ask to smile; does one side droop?</li>
                    <li><strong className="text-white">A - Arms:</strong> Raise both arms; does one drift down?</li>
                    <li><strong className="text-white">S - Speech:</strong> Slurred or strange words?</li>
                    <li><strong className="text-white">T - Time:</strong> Call 112 immediately; note onset time.</li>
                  </ul>
                </div>

                {/* Severe Bleeding */}
                <div className="p-4 rounded-2xl bg-[#050C16] border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-red-400 font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Severe Bleeding & Trauma</span>
                  </div>
                  <ol className="list-decimal list-inside text-slate-300 space-y-1 leading-relaxed">
                    <li>Apply continuous direct pressure with clean cloth.</li>
                    <li>Do not remove embedded objects.</li>
                    <li>Keep patient calm, lying down, and warm.</li>
                    <li>Elevate wounded limb above heart level if no fracture.</li>
                  </ol>
                </div>

                {/* Fire & Thermal Burns */}
                <div className="p-4 rounded-2xl bg-[#050C16] border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <Flame className="w-4 h-4" />
                    <span>Thermal Burns</span>
                  </div>
                  <ol className="list-decimal list-inside text-slate-300 space-y-1 leading-relaxed">
                    <li>Cool burn immediately under clean running water (10 mins).</li>
                    <li>Do not apply ice, butter, or harsh ointments.</li>
                    <li>Cover loosely with sterile, non-stick dressing.</li>
                    <li>Seek immediate medical attention for large burns.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Section: Formal Online SOS Submission */}
          {activeSection === 'sos_form' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Send className="w-4 h-4 text-[#46C5F5]" />
                  <span>Log Online Emergency Incident</span>
                </h4>
                <button
                  onClick={() => setActiveSection('options')}
                  className="text-xs text-[#46C5F5] hover:underline cursor-pointer"
                >
                  ← Back to Options
                </button>
              </div>

              {sosSuccessIncidentId ? (
                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h5 className="text-base font-bold text-emerald-300">Incident Transmitted</h5>
                  <p className="text-xs text-slate-300">
                    Emergency ID <strong className="text-white font-mono">{sosSuccessIncidentId}</strong> has been logged to the 108 ambulance dispatch queue.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLiveMap();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Track on Live Map
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitSOS} className="space-y-3 text-xs">
                  {sosError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{sosError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Your Name</label>
                      <input
                        type="text"
                        value={callerName}
                        onChange={(e) => setCallerName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:border-[#168BCE] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={callerPhone}
                        onChange={(e) => setCallerPhone(e.target.value)}
                        placeholder="e.g. 98450 12345"
                        className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:border-[#168BCE] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Incident Location / Landmark</label>
                    <input
                      type="text"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder="e.g. Near Sayyaji Rao Road / Mysore Palace"
                      className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:border-[#168BCE] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Emergency Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:border-[#168BCE] focus:outline-none"
                    >
                      <option value="TRAUMA_ACCIDENT">Trauma / Road Accident</option>
                      <option value="CARDIAC_ARREST">Cardiac Arrest / Severe Chest Pain</option>
                      <option value="STROKE">Suspected Stroke</option>
                      <option value="RESPIRATORY_DISTRESS">Severe Respiratory Distress</option>
                      <option value="FIRE_HAZARD">Fire / Thermal Burns</option>
                      <option value="OBSTETRIC_EMERGENCY">Obstetric Emergency</option>
                      <option value="GENERAL_MEDICAL">General Medical Crisis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Brief Description</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Details on casualties, patient consciousness, visible injuries..."
                      className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:border-[#168BCE] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingSOS}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <span>{isSubmittingSOS ? 'Broadcasting...' : 'Confirm & Transmit Emergency Alert'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 bg-[#050C16] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Mysuru 112 Control Center Active</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                onOpenLiveMap();
              }}
              className="text-[#46C5F5] hover:underline font-semibold cursor-pointer"
            >
              Open Live Map →
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for 112 Call */}
      {showCallConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-[#071321] border border-red-500/60 p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-white">Confirm Call to Emergency Services</h4>
              <p className="text-xs text-slate-300">
                You are about to place a direct phone call to <strong className="text-red-400 font-mono text-sm">112</strong> (All-India National Emergency Helpline).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              This will open your phone's dialer to connect you with Mysuru emergency dispatchers for immediate police, fire, or ambulance support.
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowCallConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm112Call}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer shadow-lg transition-colors flex items-center justify-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call 112 Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
