import React from 'react';
import { Clock, ShieldCheck, TrendingDown, Check, Users, Brain, HeartPulse } from 'lucide-react';

const BENEFITS = [
  {
    icon: Clock,
    metric: '42% Faster',
    title: 'Reduced Response Latency',
    description: 'Instant automated 112 geolocation and assistive triage dispatch units in under 60 seconds of initial contact.',
  },
  {
    icon: Brain,
    metric: '98.6% Accuracy',
    title: 'AI Clinical Triage Precision',
    description: 'Gold-standard algorithmic matching between patient trauma severity and receiving hospital ER capabilities.',
  },
  {
    icon: HeartPulse,
    metric: 'Zero Blindspots',
    title: 'Pre-Arrival ER Preparation',
    description: 'Emergency departments receive tele-ECG and live vitals telemetry before the patient arrives at trauma bay.',
  },
  {
    icon: Users,
    metric: 'Unified Network',
    title: 'Multi-Agency Coordination',
    description: 'Seamless real-time synchronization between Mysuru Police, 108 EMS, private hospitals, and district administration.',
  },
];

export const PlatformBenefits: React.FC = () => {
  return (
    <section id="benefits" className="py-24 bg-[#05080D] dark:bg-[#05080D] light:bg-white relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Demonstrated Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white light:text-slate-900 font-sans">
            Measurable Operational Benefits
          </h2>
          <p className="text-slate-300 light:text-slate-600 text-base md:text-lg">
            Supporting critical decision-making when every second determines survival.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#071321]/80 dark:bg-[#071321]/80 light:bg-[#F5F8FC] border border-slate-800 light:border-slate-200 shadow-xl space-y-4 hover:border-[#46C5F5]/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#168BCE]/20 border border-[#168BCE]/40 flex items-center justify-center text-[#46C5F5]">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#46C5F5] to-[#00D4FF]">
                    {b.metric}
                  </span>
                  <h3 className="text-lg font-bold text-white light:text-slate-900 mt-1">
                    {b.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 light:text-slate-600 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
