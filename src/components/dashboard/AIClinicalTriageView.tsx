import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Activity, 
  Hospital as HospitalIcon, 
  ShieldAlert, 
  CheckCircle2, 
  Brain, 
  ArrowRight, 
  AlertTriangle,
  Radio,
  FileCheck
} from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { AIAnalysisResult } from '../../types';

const SAMPLE_SCENARIOS = [
  {
    label: 'Highway Trauma Crash',
    text: 'Multi-vehicle collision near Highway Circle on Sayyaji Rao Road. 2 casualties with severe head trauma, active arterial bleeding, and suspected pelvic fracture. Immediate ALS unit required.',
  },
  {
    label: 'Acute STEMI Myocardial Infarction',
    text: '60-year-old male at Kuvempunagar Double Road complaining of crushing substernal chest pain radiating to left jaw, diaphoresis, and pulse rate 130 bpm. Needs immediate primary PCI Cath Lab.',
  },
  {
    label: 'FAST Stroke Alert',
    text: '72-year-old female at Gokulam 3rd stage showing right facial drooping, inability to lift right arm, and slurred incomprehensible speech for 25 minutes. Golden window stroke pathway needed.',
  },
  {
    label: 'Industrial Chemical Flash Fire',
    text: 'Solvent explosion at Hebbal Industrial Area warehouse. Worker sustained 2nd-degree thermal burns to arms and inhaled toxic smoke. Breathing is labored.',
  },
];

export const AIClinicalTriageView: React.FC = () => {
  const { analyzeEmergencySpeechOrText, createIncident } = useEmergencyData();
  const [inputText, setInputText] = useState(SAMPLE_SCENARIOS[0].text);
  const [callerName, setCallerName] = useState('Ananya Rao');
  const [callerPhone, setCallerPhone] = useState('(0821) 445-9012');
  const [locationName, setLocationName] = useState('Sayyaji Rao Road, Highway Circle, Mysuru');
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult>(() =>
    analyzeEmergencySpeechOrText(SAMPLE_SCENARIOS[0].text)
  );
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  const handleAnalyze = () => {
    const result = analyzeEmergencySpeechOrText(inputText);
    setAnalysisResult(result);
    setDispatchedSuccess(false);
  };

  const handleCreateAndDispatch = () => {
    createIncident({
      callerName,
      callerPhone,
      locationName,
      area: 'Mysuru Urban',
      category: analysisResult.recommendedCategory,
      priority: analysisResult.recommendedPriority,
      patientCount: analysisResult.keyEntities.casualties,
      description: inputText,
    });
    setDispatchedSuccess(true);
    setTimeout(() => setDispatchedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical NLP Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
            Assistive AI Clinical Triage Laboratory
          </h2>
          <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1 max-w-2xl">
            Simulate and test real-time emergency voice transcripts. The AI parses clinical severity, recommends clinical protocols, and pairs the patient with the most capable hospital ER.
          </p>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-mono font-bold text-slate-400 self-center mr-2">Preset Scenarios:</span>
        {SAMPLE_SCENARIOS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(s.text);
              const res = analyzeEmergencySpeechOrText(s.text);
              setAnalysisResult(res);
              setDispatchedSuccess(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100 hover:bg-[#168BCE]/20 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Speech Transcriber */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-[#46C5F5]" />
              <span>112 Emergency Voice / Transcript Ingestion</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Caller Name</label>
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Caller Phone</label>
                <input
                  type="text"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Incident Geolocation / Landmark</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Emergency Speech Transcript</label>
              <textarea
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs text-white dark:text-white light:text-slate-900 focus:outline-none leading-relaxed"
                placeholder="Type or paste emergency call content..."
              ></textarea>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleAnalyze}
                className="flex-1 py-2.5 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Clinical Triage</span>
              </button>

              <button
                onClick={handleCreateAndDispatch}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Live</span>
              </button>
            </div>

            {dispatchedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/80 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Incident Dispatched & Receiving ER Pre-Alerted Successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Live Diagnostic Scoring Results */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white border border-[#168BCE]/30 dark:border-[#168BCE]/30 light:border-slate-200 shadow-xl space-y-5">
            {/* Top Scores */}
            <div className="grid grid-cols-3 gap-3">
              {/* Urgency Gauge */}
              <div className="p-4 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center">
                <p className="text-[10px] uppercase font-mono text-slate-400">Urgency Score</p>
                <p className="text-3xl font-extrabold font-mono text-[#00D4FF] mt-1">
                  {analysisResult.urgencyScore}<span className="text-xs text-slate-500">/100</span>
                </p>
                <span className="text-[10px] font-bold text-rose-400">
                  {analysisResult.sentiment} STATE
                </span>
              </div>

              {/* Priority */}
              <div className="p-4 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center">
                <p className="text-[10px] uppercase font-mono text-slate-400">Triage Code</p>
                <p className={`text-xl font-bold font-mono mt-2 ${
                  analysisResult.recommendedPriority === 'CRITICAL' ? 'text-rose-500' : 'text-amber-400'
                }`}>
                  {analysisResult.recommendedPriority}
                </p>
                <span className="text-[10px] text-slate-400">{analysisResult.keyEntities.casualties} Casualty</span>
              </div>

              {/* Category */}
              <div className="p-4 rounded-xl bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center">
                <p className="text-[10px] uppercase font-mono text-slate-400">Clinical Category</p>
                <p className="text-xs font-bold text-[#46C5F5] mt-2 truncate">
                  {analysisResult.recommendedCategory.replace('_', ' ')}
                </p>
                <span className="text-[10px] text-emerald-400">Protocol Locked</span>
              </div>
            </div>

            {/* Extracted Clinical Markers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracted Clinical Markers & Symptoms
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.keyEntities.symptoms.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                    {s}
                  </span>
                ))}
                {analysisResult.keyEntities.hazards.map((h, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                    ⚠️ {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Clinical Actions */}
            <div className="p-4 rounded-xl bg-blue-950/30 dark:bg-blue-950/30 light:bg-blue-50 border border-[#168BCE]/40 space-y-2">
              <h4 className="text-xs font-bold text-[#46C5F5] flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4" />
                <span>Recommended Standard Protocols</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                {analysisResult.recommendedActions.map((act, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#46C5F5]"></span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optimal Hospital Matching */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ranked Hospital ER Readiness Match
              </h4>

              <div className="space-y-2">
                {analysisResult.recommendedHospitals.slice(0, 3).map((rec, i) => (
                  <div
                    key={rec.hospitalId}
                    className={`p-3 rounded-xl border flex items-start justify-between ${
                      i === 0
                        ? 'bg-emerald-950/30 dark:bg-emerald-950/30 light:bg-emerald-50 border-emerald-500/50'
                        : 'bg-[#050C16] dark:bg-[#050C16] light:bg-slate-50 border-slate-800 dark:border-slate-800 light:border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white dark:text-white light:text-slate-900">{rec.hospitalName}</span>
                        {i === 0 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
                            BEST MATCH
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{rec.rationale}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        ETA: ~{rec.etaMinutes}m
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono">{rec.distanceKm} km</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
