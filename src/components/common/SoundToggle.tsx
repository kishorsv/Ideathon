import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useEmergencyData } from '../../context/EmergencyDataContext';

export const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { soundEnabled, setSoundEnabled } = useEmergencyData();

  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!soundEnabled)}
      className={`inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 border cursor-pointer ${
        soundEnabled
          ? 'bg-slate-900/80 border-cyan-500/30 text-cyan-400 hover:bg-slate-800 shadow-sm'
          : 'bg-slate-900/40 border-slate-700/40 text-slate-500 hover:text-slate-400'
      } ${className}`}
      title={soundEnabled ? 'Alert audio enabled' : 'Alert audio muted'}
    >
      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  );
};
