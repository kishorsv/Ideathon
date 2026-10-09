import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Map as MapIcon, 
  Hospital as HospitalIcon, 
  Phone, 
  Activity, 
  BookOpen, 
  ArrowRight,
  Shield,
  Radio,
  Clock,
  Compass
} from 'lucide-react';
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
    // Increment click counter to track repeated clicks
    setEmergencyClickCount((prev) => prev + 1);
    // Keep panel open without creating duplicate requests or false alarms
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
    <section className="relative min-h-[85vh] pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col justify-center overflow-hidden bg-white dark:bg-[#05080D] transition-colors duration-200">
      {/* Subtle Background Lighting & Ambient Gradient (White & Navy Blue Palette) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Navy Blue Ambient Radiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#168BCE]/20 via-[#071321]/10 dark:from-[#168BCE]/25 dark:via-[#071321]/50 to-transparent rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#46C5F5]/10 dark:bg-[#46C5F5]/15 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Brand Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#071321]/5 dark:bg-[#168BCE]/15 border border-[#168BCE]/30 dark:border-[#46C5F5]/30 shadow-sm backdrop-blur-md animate-in fade-in">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-800 dark:text-[#46C5F5] uppercase tracking-wider font-mono">
            Mysuru EM AI Studio &bull; 112 Control Network
          </span>
        </div>

        {/* Exact Required Main Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#071321] dark:text-white leading-[1.15]">
            Emergency Response <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#168BCE] via-[#0284c7] to-[#00D4FF]">
              Intelligence
            </span>
          </h1>

          {/* Exact Required Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Find nearby hospitals, understand emergency resources, and access important information when every second matters.
          </p>
        </div>

        {/* Two Prominent Required Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          {/* Button 1: Prominent Large Red EMERGENCY Button */}
          <button
            onClick={handleEmergencyClick}
            className="w-full sm:w-auto flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-base sm:text-lg shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:shadow-[0_15px_40px_rgba(239,68,68,0.6)] border border-red-400/30 transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer active:scale-95 group"
            title="Open Emergency Assistance Panel"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </div>
            <span className="tracking-wider">EMERGENCY</span>
          </button>

          {/* Button 2: Prominent Navy/Blue OPEN LIVE MAP Button */}
          <button
            onClick={handleOpenMap}
            className="w-full sm:w-auto flex-1 px-8 py-4 rounded-2xl bg-[#071321] dark:bg-[#071321] hover:bg-slate-900 text-white font-bold text-base sm:text-lg shadow-[0_10px_30px_rgba(7,19,33,0.3)] hover:shadow-[0_15px_40px_rgba(22,139,206,0.3)] border border-slate-700 hover:border-[#168BCE] transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer active:scale-95 group"
            title="Open Interactive Google Live Map"
          >
            <div className="w-6 h-6 rounded-full bg-[#168BCE]/20 flex items-center justify-center">
              <MapIcon className="w-4 h-4 text-[#46C5F5] group-hover:scale-110 transition-transform" />
            </div>
            <span className="tracking-wide">OPEN LIVE MAP</span>
          </button>
        </div>

        {/* Clean, Uncluttered Essential Quick Shortcuts */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          {/* Quick Item 1 */}
          <div 
            onClick={() => setAssistancePanelOpen(true)}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071321]/80 border border-slate-200 dark:border-slate-800 hover:border-[#168BCE]/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-1">
              <Phone className="w-4 h-4" />
              <span className="font-bold text-xs">112 Helpline</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct police, fire & 108 ambulance contact</p>
          </div>

          {/* Quick Item 2 */}
          <div 
            onClick={() => setAssistancePanelOpen(true)}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071321]/80 border border-slate-200 dark:border-slate-800 hover:border-[#168BCE]/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2 text-[#168BCE] dark:text-[#46C5F5] mb-1">
              <HospitalIcon className="w-4 h-4" />
              <span className="font-bold text-xs">Mysuru Hospitals</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">KR Hospital, Apollo BGS, JSS & more</p>
          </div>

          {/* Quick Item 3 */}
          <div 
            onClick={() => onOpenDashboard()}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071321]/80 border border-slate-200 dark:border-slate-800 hover:border-[#168BCE]/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <Activity className="w-4 h-4" />
              <span className="font-bold text-xs">ICU Bed Matrix</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Live bed capacity, ventilators & oxygen</p>
          </div>

          {/* Quick Item 4 */}
          <div 
            onClick={() => setAssistancePanelOpen(true)}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#071321]/80 border border-slate-200 dark:border-slate-800 hover:border-[#168BCE]/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="font-bold text-xs">First-Aid Guidance</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">CPR, severe bleeding & stroke protocols</p>
          </div>
        </div>
      </div>

      {/* Emergency Assistance Panel (Opens on EMERGENCY button click) */}
      <EmergencyAssistancePanel
        isOpen={assistancePanelOpen}
        onClose={() => setAssistancePanelOpen(false)}
        onOpenLiveMap={handleOpenMap}
        clickCount={emergencyClickCount}
      />
    </section>
  );
};
