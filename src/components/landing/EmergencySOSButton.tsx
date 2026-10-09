import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { EmergencyAssistancePanel } from './EmergencyAssistancePanel';

interface EmergencySOSButtonProps {
  onOpenDashboard?: (incidentId?: string) => void;
  onOpenLiveMap?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmergencySOSButton: React.FC<EmergencySOSButtonProps> = ({ 
  onOpenDashboard, 
  onOpenLiveMap,
  className = '',
  size = 'md'
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    // Idempotent: Increment click counter without creating duplicate alerts
    setClickCount((prev) => prev + 1);
    setPanelOpen(true);
  };

  const handleOpenMap = () => {
    if (onOpenLiveMap) {
      onOpenLiveMap();
    } else if (onOpenDashboard) {
      onOpenDashboard();
    }
  };

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs sm:text-sm',
    lg: 'px-8 py-4 text-base sm:text-lg',
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`group relative rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_35px_rgba(239,68,68,0.7)] border border-red-400/40 transition-all duration-200 flex items-center space-x-2 cursor-pointer active:scale-95 ${sizeClasses[size]} ${className}`}
        title="Open 112 Emergency Assistance Panel"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0"></span>
        <ShieldAlert className="w-4 h-4 text-white shrink-0" />
        <span className="tracking-wider uppercase font-mono">EMERGENCY (112)</span>
      </button>

      <EmergencyAssistancePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        onOpenLiveMap={handleOpenMap}
        clickCount={clickCount}
      />
    </>
  );
};
