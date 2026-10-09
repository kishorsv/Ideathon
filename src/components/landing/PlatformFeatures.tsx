import React from 'react';
import { 
  Sparkles, 
  Map, 
  Truck, 
  Hospital, 
  Activity, 
  BellRing, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  Stethoscope 
} from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    badge: 'Assistive AI',
    title: 'AI-Powered Emergency Intelligence',
    description: 'Speech-to-text NLP analysis parses caller distress in real time, calculating urgency scores, Glasgow Coma Scale, and recommending clinical triage pathways.',
    gradient: 'from-[#168BCE]/20 to-[#00D4FF]/10',
    iconColor: 'text-[#00D4FF]',
    borderColor: 'border-[#168BCE]/30',
  },
  {
    icon: ShieldAlert,
    badge: 'Real-Time 112',
    title: 'Continuous Incident Monitoring',
    description: 'Centralized multi-channel queue tracking incoming emergency calls, caller GPS accuracy, priority categorization, and live response timers.',
    gradient: 'from-rose-500/20 to-amber-500/10',
    iconColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
  },
  {
    icon: Map,
    badge: 'Mysuru GIS',
    title: 'Interactive Spatial Maps',
    description: 'High-definition GIS telemetry of Mysuru district featuring dynamic ambulance markers, hospital emergency intake nodes, and optimal siren route geometry.',
    gradient: 'from-[#46C5F5]/20 to-[#168BCE]/10',
    iconColor: 'text-[#46C5F5]',
    borderColor: 'border-[#46C5F5]/30',
  },
  {
    icon: Truck,
    badge: 'Fleet Telematics',
    title: 'Emergency Resource Coordination',
    description: 'Live monitoring of ALS/BLS ambulances, motorcycle rapid responders, on-board oxygen reserves, defibrillators, and crew telemetry.',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  {
    icon: Hospital,
    badge: 'Clinical Matrix',
    title: 'Hospital ER Readiness Matrix',
    description: 'Synchronized availability of ICU beds, ventilators, blood bank stocks, trauma surgeons, and cath lab readiness across all Mysuru hospitals.',
    gradient: 'from-purple-500/20 to-[#168BCE]/10',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: BellRing,
    badge: 'Pre-Arrival Alerts',
    title: 'Alert & Notification Engine',
    description: 'Automated pre-arrival trauma team activation, tele-ECG transmissions, and high-priority cross-departmental dispatch broadcasts.',
    gradient: 'from-amber-500/20 to-orange-500/10',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
];

export const PlatformFeatures: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-[#071321] dark:bg-[#071321] light:bg-[#F5F8FC] relative overflow-hidden transition-colors">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#168BCE]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/15 border border-[#168BCE]/30 text-xs font-semibold text-[#46C5F5]">
            <Cpu className="w-3.5 h-3.5" />
            <span>Operational Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white light:text-slate-900 font-sans">
            Built for High-Stakes <br />
            Emergency Operations
          </h2>
          <p className="text-slate-300 light:text-slate-600 text-base md:text-lg">
            Purpose-built technology connecting 112 dispatchers, field paramedics, and hospital emergency trauma units into a unified response network.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`group relative rounded-2xl p-6 md:p-8 bg-[#050C16]/80 dark:bg-[#050C16]/80 light:bg-white border ${f.borderColor} light:border-slate-200 shadow-xl hover:shadow-[0_15px_35px_rgba(22,139,206,0.15)] transition-all duration-300 flex flex-col justify-between`}
              >
                {/* Subtle Hover Gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-slate-900/90 light:bg-slate-100 border border-slate-700 light:border-slate-300 flex items-center justify-center ${f.iconColor} shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 light:bg-slate-100 text-slate-300 light:text-slate-700 border border-slate-700/60 light:border-slate-300">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white light:text-slate-900 group-hover:text-[#46C5F5] transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="relative z-10 pt-6 mt-4 border-t border-slate-800/60 light:border-slate-200 flex items-center justify-between text-xs text-slate-400 light:text-slate-500 font-medium">
                  <span>Standard Protocol Compliant</span>
                  <Zap className="w-3.5 h-3.5 text-[#168BCE]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
