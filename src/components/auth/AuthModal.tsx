import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  UserCheck, 
  Radio, 
  Stethoscope, 
  Truck, 
  User as UserIcon, 
  ArrowRight, 
  Lock, 
  Mail, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, loginAsDemo, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('DISPATCHER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isRegisterMode) {
      const res = await register({ email, name, role, password });
      setLoading(false);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    } else {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    }
  };

  const handleDemoClick = (demoRole: UserRole) => {
    loginAsDemo(demoRole);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-[#071321] border border-[#168BCE]/40 p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(22,139,206,0.3)] text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#46C5F5] to-transparent"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#168BCE]/20 border border-[#168BCE]/40 flex items-center justify-center text-[#46C5F5]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {isRegisterMode ? 'Create Operations Account' : 'Portal Authentication'}
            </h3>
            <p className="text-xs text-slate-400">
              Mysuru EM AI Studio Emergency Platform
            </p>
          </div>
        </div>

        {/* Quick 1-Click Role Login Buttons */}
        <div className="mb-6 p-4 rounded-2xl bg-[#050C16] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#46C5F5] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant 1-Click Demo Profiles</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">No password required</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoClick('COMMANDER')}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-[#168BCE]/20 border border-slate-800 hover:border-[#168BCE]/60 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Commander</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">Dr. Deshpande, IAS</p>
            </button>

            <button
              onClick={() => handleDemoClick('DISPATCHER')}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-[#168BCE]/20 border border-slate-800 hover:border-[#168BCE]/60 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#46C5F5]">
                <Radio className="w-3.5 h-3.5" />
                <span>112 Dispatch</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">Priyanka Gowda</p>
            </button>

            <button
              onClick={() => handleDemoClick('DOCTOR')}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-[#168BCE]/20 border border-slate-800 hover:border-[#168BCE]/60 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>ER Doctor</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">KR Hospital ER</p>
            </button>

            <button
              onClick={() => handleDemoClick('PARAMEDIC')}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-[#168BCE]/20 border border-slate-800 hover:border-[#168BCE]/60 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-300">
                <Truck className="w-3.5 h-3.5" />
                <span>Paramedic</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">Alpha-01 ALS Lead</p>
            </button>

            <button
              onClick={() => handleDemoClick('CITIZEN')}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-[#168BCE]/20 border border-slate-800 hover:border-[#168BCE]/60 text-left transition-all cursor-pointer group col-span-2 sm:col-span-1"
            >
              <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-300">
                <UserIcon className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">Resident SOS</p>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs font-mono text-slate-500 uppercase">Or Authenticate with Email</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name & Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050C16] border border-slate-800 text-sm text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Official Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@mysuru-em.gov.in"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#050C16] border border-slate-800 text-sm text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#050C16] border border-slate-800 text-sm text-white focus:outline-none focus:border-[#168BCE]"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Operational Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050C16] border border-slate-800 text-sm text-white focus:outline-none focus:border-[#168BCE]"
              >
                <option value="DISPATCHER">112 Central Dispatcher</option>
                <option value="COMMANDER">District EOC Commander</option>
                <option value="DOCTOR">Hospital ER Doctor</option>
                <option value="PARAMEDIC">Ambulance Paramedic</option>
                <option value="CITIZEN">Citizen / Public User</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : isRegisterMode ? 'Register Account' : 'Sign In to Platform'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          <button
            onClick={() => { setIsRegisterMode(!isRegisterMode); setError(null); }}
            className="text-xs text-slate-400 hover:text-[#46C5F5] transition-colors cursor-pointer"
          >
            {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
