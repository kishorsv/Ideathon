import React from 'react';
import { Radio, Sparkles, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Collect & Connect',
    subtitle: 'Instant Ingestion',
    icon: Radio,
    description: 'Emergency 112 calls and citizen mobile SOS streams connect automatically. Spatial geocoding locks caller GPS location within ±4 meters across Mysuru district.',
    details: ['112 Telephony Stream Sync', 'High-Precision Geocoding', 'Multi-lingual Speech Parsing'],
    color: 'from-[#168BCE] to-[#46C5F5]',
  },
  {
    step: '02',
    title: 'Analyze & Understand',
    subtitle: 'AI Clinical Triage',
    icon: Sparkles,
    description: 'Assistive AI analyzes caller distress, calculates Glasgow Coma Scale, extracts critical trauma markers, and cross-references live ER bed availability.',
    details: ['Real-Time Urgency Scoring (0-100)', 'ICU & Ventilator Readiness Match', 'Gold-Standard Clinical Pathways'],
    color: 'from-[#46C5F5] to-[#00D4FF]',
  },
  {
    step: '03',
    title: 'Coordinate & Respond',
    subtitle: 'Dynamic Dispatch',
    icon: Navigation,
    description: 'Dispatches closest ALS/BLS ambulance with siren routing. Pre-alerts receiving trauma surgical teams with tele-ECG and live vitals streaming.',
    details: ['Turn-by-turn Telematics Navigation', 'Hospital ER Trauma Team Pre-Alert', 'Paramedic Telemetry Sync'],
    color: 'from-[#00D4FF] to-[#22C55E]',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#05080D] dark:bg-[#05080D] light:bg-white relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operational Flow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white light:text-slate-900 font-sans">
            How It Works
          </h2>
          <p className="text-slate-300 light:text-slate-600 text-base md:text-lg">
            A frictionless three-stage emergency lifecycle transforming panicked calls into synchronized clinical rescues.
          </p>
        </div>

        {/* 3 Step Connected Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl p-8 bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-[#F5F8FC] border border-slate-800 light:border-slate-200 shadow-2xl flex flex-col justify-between group hover:border-[#168BCE]/60 transition-all duration-300"
              >
                {/* Step Number Top Badge */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400 group-hover:from-[#168BCE] group-hover:to-[#46C5F5] transition-all">
                      {s.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#168BCE]/20 to-[#00D4FF]/20 border border-[#168BCE]/40 flex items-center justify-center text-[#46C5F5]">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <p className="text-xs font-mono uppercase tracking-widest text-[#46C5F5] font-semibold mb-1">
                    {s.subtitle}
                  </p>
                  <h3 className="text-2xl font-bold text-white light:text-slate-900 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-300 light:text-slate-600 leading-relaxed mb-6">
                    {s.description}
                  </p>
                </div>

                {/* Micro checklist items */}
                <div className="pt-4 border-t border-slate-800 light:border-slate-200 space-y-2">
                  {s.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center space-x-2 text-xs text-slate-400 light:text-slate-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#168BCE]"></span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
