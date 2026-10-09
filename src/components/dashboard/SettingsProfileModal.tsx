import React, { useState } from 'react';
import { X, User, Settings, Shield, Bell, Moon, Sun, Volume2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { UserRole } from '../../types';

interface SettingsProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsProfileModal: React.FC<SettingsProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, setSoundEnabled } = useEmergencyData();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'DISPATCHER');
  const [badgeNumber, setBadgeNumber] = useState(user?.badgeNumber || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      department,
      role,
      badgeNumber,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all mock incidents and ambulance data to factory defaults?')) {
      localStorage.removeItem('mysuru_em_incidents');
      localStorage.removeItem('mysuru_em_ambulances');
      localStorage.removeItem('mysuru_em_hospitals');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#071321] border border-[#168BCE]/40 p-6 shadow-2xl text-slate-100 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#168BCE]/20 text-[#46C5F5] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">Operator Profile & Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* User Avatar preview */}
          <div className="flex items-center space-x-4 p-3 rounded-2xl bg-[#050C16] border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#168BCE] to-[#46C5F5] flex items-center justify-center text-slate-950 font-black text-lg">
              {name.slice(0, 2).toUpperCase() || 'MC'}
            </div>
            <div>
              <p className="font-bold text-sm text-white">{name || 'Operator'}</p>
              <p className="text-slate-400 text-[11px] font-mono">{user?.email}</p>
              <span className="text-[10px] text-cyan-400 font-mono">ROLE: {role}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Full Name & Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Assigned Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Badge / Officer ID</label>
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="MY-112-09"
                className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Operational Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-xl bg-[#050C16] border border-slate-800 text-white focus:outline-none focus:border-[#168BCE]"
            >
              <option value="COMMANDER">Commander / District EOC Lead</option>
              <option value="DISPATCHER">112 Central Dispatcher</option>
              <option value="DOCTOR">Hospital ER Doctor</option>
              <option value="PARAMEDIC">Ambulance Paramedic</option>
              <option value="CITIZEN">Citizen / Public User</option>
            </select>
          </div>

          {/* Preferences */}
          <div className="p-3 rounded-2xl bg-[#050C16] border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-300">System Preferences</h4>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center space-x-1.5">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <span>Active Theme ({theme.toUpperCase()})</span>
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono cursor-pointer"
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Volume2 className="w-4 h-4 text-[#46C5F5]" />
                <span>Audible Siren & Alert Chirps</span>
              </span>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-1 rounded-lg font-mono cursor-pointer ${
                  soundEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/80 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile Settings Updated Successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetData}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white font-bold shadow-md cursor-pointer transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
