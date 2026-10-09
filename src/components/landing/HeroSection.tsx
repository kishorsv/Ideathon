import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Map as MapIcon, 
  ArrowUpRight, 
  Shield, 
  Activity, 
  Radio, 
  Sparkles,
  Phone,
  Hospital as HospitalIcon,
  BookOpen
} from 'lucide-react';
import { InteractiveHeroMapPreview } from './InteractiveHeroMapPreview';
import { EmergencyAssistancePanel } from './EmergencyAssistancePanel';

interface HeroSectionProps {
  onOpenDashboard: (incidentId?: string) => void;
  onOpenDemo?: () => void;
  onOpenLiveMap?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onOpenDashboard, 
  onOpenDemo,
  onOpenLiveMap 
}) => {
  const [assistancePanelOpen, setAssistancePanelOpen] = useState(false);
  const [emergencyClickCount, setEmergencyClickCount] = useState(0);

  // Handle Emergency Button Click
  const handleEmergencyClick = () => {
    setEmergencyClickCount((prev) => prev + 1);
    setAssistancePanelOpen(true);
  };

  const handleOpenMap = () => {
    if (onOpenLiveMap) {
      onOpenLiveMap();
    } else {
      onOpenDashboard();
    }
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#05080D] transition-colors duration-200">
      {/* Background Visual Atmosphere (Matching the reference cinematic blue sky & glowing alpine silhouette) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing Top Radial Blue Light */}
        <div className="absolute -top-[20%] left-1/2 transform -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-b from-[#168BCE]/35 via-[#071321]/60 to-transparent rounded-full blur-3xl opacity-75"></div>
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#00D4FF]/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-[15%] right-[20%] w-[600px] h-[600px] bg-[#46C5F5]/20 rounded-full blur-[140px]"></div>

        {/* Subtle GIS Coordinate Grid */}
        <div className="absolute inset-0 subtle-grid opacity-30"></div>

        {/* Realistic Alpine Mountain Silhouette Gradient at Horizon */}
        <svg 
          className="absolute bottom-0 inset-x-0 w-full h-[380px] md:h-[480px] opacity-25 text-[#071321]" 
          viewBox="0 0 1440 400" 
          preserveAspectRatio="none" 
          fill="none"
        >
          <path 
            d="M0,280 L180,210 L340,260 L520,170 L720,240 L920,150 L1120,230 L1300,180 L1440,240 L1440,400 L0,400 Z" 
            fill="currentColor" 
          />
          <path 
            d="M0,320 L220,260 L440,300 L680,220 L890,290 L1100,210 L1320,270 L1440,250 L1440,400 L0,400 Z" 
            fill="#05080D" 
            opacity="0.9" 
          />
        </svg>

        {/* Vignette bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#05080D] to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Hero Content Container */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#168BCE]/15 border border-[#46C5F5]/30 shadow-[0_0_20px_rgba(22,139,206,0.25)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-500">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse"></span>
            <span className="text-xs font-semibold text-[#46C5F5] uppercase tracking-wider font-mono">
              Mysuru EM AI Studio &bull; District 112 Command Network
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] font-sans">
            Smarter Emergency Management. <br className="hidden sm:inline" />
            <span className="font-serif-display italic font-normal tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-[#46C5F5] to-[#00D4FF]">
              Faster, More Intelligent Response.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Transform emergency management with intelligent technology, real-time operational insights, 
            and data-driven decision support designed to help teams respond when every second matters.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Prominent Red Emergency Button */}
            <button
              onClick={handleEmergencyClick}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm sm:text-base shadow-[0_0_35px_rgba(239,68,68,0.6)] hover:shadow-[0_0_50px_rgba(239,68,68,0.85)] border-2 border-white/30 transition-all duration-200 flex items-center space-x-2.5 cursor-pointer active:scale-95 animate-pulse"
              title="Open Emergency Assistance Panel"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <ShieldAlert className="w-5 h-5 text-white" />
              <span className="tracking-wide uppercase font-mono">EMERGENCY (112)</span>
            </button>

            {/* Primary Button: Explore Platform */}
            <button
              onClick={() => onOpenDashboard()}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#168BCE] to-[#46C5F5] hover:from-[#1277b2] hover:to-[#38bdf8] text-slate-950 font-extrabold text-sm sm:text-base shadow-[0_10px_25px_rgba(22,139,206,0.35)] hover:shadow-[0_15px_35px_rgba(22,139,206,0.5)] transition-all duration-200 flex items-center space-x-2 cursor-pointer group"
            >
              <span>Explore Platform</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Secondary Button: Open Live Map */}
            <button
              onClick={handleOpenMap}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-[#071321]/90 hover:bg-slate-800/90 text-white font-semibold text-sm sm:text-base border border-slate-700/80 hover:border-[#168BCE] shadow-lg backdrop-blur-md transition-all duration-200 flex items-center space-x-2 cursor-pointer group"
            >
              <MapIcon className="w-4 h-4 text-[#46C5F5]" />
              <span>Open Live Map</span>
            </button>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#46C5F5]" />
              <span><strong className="text-white">6 Multi-Specialty</strong> Hospitals Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span><strong className="text-white">&lt;3.8 Min</strong> Avg Urban Dispatch ETA</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span><strong className="text-white">99.4%</strong> Telemetry Uptime</span>
            </div>
          </div>
        </div>

        {/* Large Floating Dashboard Preview (Directly inspired by reference image) */}
        <div className="mt-12 md:mt-16 max-w-6xl mx-auto">
          <InteractiveHeroMapPreview onOpenDashboard={onOpenDashboard} />
        </div>
      </div>

      {/* Emergency Assistance Panel */}
      <EmergencyAssistancePanel
        isOpen={assistancePanelOpen}
        onClose={() => setAssistancePanelOpen(false)}
        onOpenLiveMap={handleOpenMap}
        clickCount={emergencyClickCount}
      />
    </section>
  );
};
