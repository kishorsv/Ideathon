import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ChevronDown, 
  Menu, 
  X, 
  Activity, 
  Radio, 
  Sparkles, 
  Hospital as HospitalIcon, 
  Truck, 
  PhoneCall, 
  FileText, 
  ShieldCheck, 
  LayoutDashboard,
  ArrowUpRight
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { SoundToggle } from '../common/SoundToggle';
import { useAuth } from '../../context/AuthContext';
import { EmergencySOSButton } from './EmergencySOSButton';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenDashboard }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#071321]/90 dark:bg-[#071321]/90 light:bg-white/95 backdrop-blur-xl border-b border-slate-800/80 light:border-slate-200 shadow-lg'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#168BCE] via-[#46C5F5] to-[#00D4FF] p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(22,139,206,0.4)]">
              <div className="w-full h-full bg-[#071321] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#46C5F5]" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg md:text-xl tracking-tight text-white light:text-slate-900 font-sans flex items-center space-x-1.5">
                <span>Mysuru EM</span>
                <span className="px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-[#168BCE]/20 border border-[#168BCE]/40 text-[#46C5F5] uppercase tracking-wider">
                  AI Studio
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                District Emergency Operations Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {/* Platform Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('platform')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white light:text-slate-700 light:hover:text-slate-900 hover:bg-slate-800/40 light:hover:bg-slate-100 transition-colors cursor-pointer">
                <span>Platform</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              
              {activeDropdown === 'platform' && (
                <div className="absolute top-full left-0 w-80 p-3 rounded-2xl bg-[#071321]/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1">
                    <button onClick={onOpenDashboard} className="w-full flex items-start space-x-3 p-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors cursor-pointer">
                      <Sparkles className="w-5 h-5 text-[#46C5F5] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-white">AI Clinical Triage Engine</p>
                        <p className="text-[11px] text-slate-400">Automated NLP severity scoring & protocol guidance</p>
                      </div>
                    </button>
                    <button onClick={onOpenDashboard} className="w-full flex items-start space-x-3 p-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors cursor-pointer">
                      <Radio className="w-5 h-5 text-[#168BCE] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-white">112 Central Command GIS</p>
                        <p className="text-[11px] text-slate-400">High-definition telemetry & live incident routing</p>
                      </div>
                    </button>
                    <button onClick={onOpenDashboard} className="w-full flex items-start space-x-3 p-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors cursor-pointer">
                      <HospitalIcon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-white">ER Clinical Readiness Matrix</p>
                        <p className="text-[11px] text-slate-400">Live ICU beds, ventilator & trauma surgeon sync</p>
                      </div>
                    </button>
                    <button onClick={onOpenDashboard} className="w-full flex items-start space-x-3 p-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors cursor-pointer">
                      <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-white">Ambulance Telematics</p>
                        <p className="text-[11px] text-slate-400">GPS tracking, siren routing & vital telematics</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white light:text-slate-700 light:hover:text-slate-900 hover:bg-slate-800/40 light:hover:bg-slate-100 transition-colors cursor-pointer">
                <span>Solutions</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-0 w-72 p-3 rounded-2xl bg-[#071321]/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1">
                    <button onClick={onOpenDashboard} className="w-full p-2 rounded-lg hover:bg-slate-800/60 text-left cursor-pointer">
                      <p className="text-xs font-semibold text-white">For 112 Dispatchers</p>
                      <p className="text-[11px] text-slate-400">Real-time call triaging & rapid allocation</p>
                    </button>
                    <button onClick={onOpenDashboard} className="w-full p-2 rounded-lg hover:bg-slate-800/60 text-left cursor-pointer">
                      <p className="text-xs font-semibold text-white">For Hospital ERs</p>
                      <p className="text-[11px] text-slate-400">Inbound patient pre-arrival alerts</p>
                    </button>
                    <button onClick={onOpenDashboard} className="w-full p-2 rounded-lg hover:bg-slate-800/60 text-left cursor-pointer">
                      <p className="text-xs font-semibold text-white">For Paramedics</p>
                      <p className="text-[11px] text-slate-400">Turn-by-turn routing & vitals telemetry</p>
                    </button>
                    <button onClick={onOpenDashboard} className="w-full p-2 rounded-lg hover:bg-slate-800/60 text-left cursor-pointer">
                      <p className="text-xs font-semibold text-white">For Citizens</p>
                      <p className="text-[11px] text-slate-400">One-tap SOS & AI First-Aid guidance</p>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white light:text-slate-700 light:hover:text-slate-900 hover:bg-slate-800/40 light:hover:bg-slate-100 transition-colors cursor-pointer">
                <span>Resources</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 w-64 p-3 rounded-2xl bg-[#071321]/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1">
                    <a href="#features" className="block p-2 rounded-lg hover:bg-slate-800/60 text-left">
                      <p className="text-xs font-semibold text-white">Features Overview</p>
                      <p className="text-[11px] text-slate-400">Capabilities and architecture</p>
                    </a>
                    <a href="#how-it-works" className="block p-2 rounded-lg hover:bg-slate-800/60 text-left">
                      <p className="text-xs font-semibold text-white">How It Works</p>
                      <p className="text-[11px] text-slate-400">3-step operational workflow</p>
                    </a>
                    <a href="#benefits" className="block p-2 rounded-lg hover:bg-slate-800/60 text-left">
                      <p className="text-xs font-semibold text-white">Clinical Benefits</p>
                      <p className="text-[11px] text-slate-400">Outcome enhancements</p>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* About Link */}
            <a
              href="#footer"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white light:text-slate-700 light:hover:text-slate-900 hover:bg-slate-800/40 light:hover:bg-slate-100 transition-colors"
            >
              About
            </a>

            {/* Live Operations Link */}
            <button
              onClick={onOpenDashboard}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#46C5F5] hover:text-[#00D4FF] hover:bg-[#168BCE]/10 transition-colors cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Live Operations</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <EmergencySOSButton onOpenDashboard={onOpenDashboard} />
            <SoundToggle />
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-white hover:border-[#168BCE] text-xs font-medium cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#46C5F5]" />
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/50 light:text-slate-700 light:hover:text-slate-900 transition-colors cursor-pointer"
              >
                Login
              </button>
            )}

            <button
              onClick={onOpenDashboard}
              className="group px-5 py-2.5 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white text-sm font-semibold shadow-[0_0_20px_rgba(22,139,206,0.4)] hover:shadow-[0_0_25px_rgba(22,139,206,0.6)] transition-all duration-200 flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Access Dashboard</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071321]/98 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 backdrop-blur-2xl animate-in slide-in-from-top-4">
          <div className="space-y-1">
            <button
              onClick={() => { onOpenDashboard(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#168BCE]/15 text-[#46C5F5] font-semibold text-sm"
            >
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Live Emergency Dashboard</span>
              </div>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 text-sm font-medium"
            >
              Platform Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 text-sm font-medium"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 text-sm font-medium"
            >
              Platform Benefits
            </a>
            <a
              href="#footer"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 text-sm font-medium"
            >
              About & Emergency Directory
            </a>
          </div>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700"
            >
              Login
            </button>
            <button
              onClick={() => { onOpenDashboard(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl bg-[#168BCE] text-white text-sm font-semibold hover:bg-[#1277b2]"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
