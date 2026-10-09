import React from 'react';
import { ArrowUpRight, Shield, Radio, PhoneCall } from 'lucide-react';

interface CallToActionProps {
  onOpenDashboard: () => void;
  onOpenLogin: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onOpenDashboard, onOpenLogin }) => {
  return (
    <section className="py-24 bg-[#071321] dark:bg-[#071321] light:bg-[#F5F8FC] relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden bg-gradient-to-br from-[#050C16] via-[#071321] to-[#0A2239] border border-[#168BCE]/40 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(22,139,206,0.3)]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#46C5F5]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#168BCE]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#168BCE]/20 border border-[#168BCE]/40 text-xs font-semibold text-[#46C5F5]">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Mysuru District Operations</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Make Every Emergency Decision More Informed.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Equip your medical team, 112 dispatchers, and district coordinators with the premier AI-powered emergency management infrastructure.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onOpenDashboard}
                className="px-8 py-3.5 rounded-full bg-white text-[#071321] hover:bg-slate-100 font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2 cursor-pointer group"
              >
                <span>Explore Platform</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenLogin}
                className="px-8 py-3.5 rounded-full bg-transparent hover:bg-slate-800/80 text-white font-semibold text-base border border-slate-700 hover:border-[#168BCE] transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Sign In / Demo</span>
                <ArrowUpRight className="w-4 h-4 text-[#46C5F5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
