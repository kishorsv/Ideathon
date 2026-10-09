import React, { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Map, 
  Sparkles, 
  Hospital as HospitalIcon, 
  Truck, 
  FileText, 
  BarChart3, 
  HeartHandshake, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Radio, 
  Activity, 
  Menu, 
  X, 
  Plus, 
  Globe, 
  Volume2, 
  VolumeX,
  CheckCircle2,
  Navigation,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergencyData } from '../../context/EmergencyDataContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { SoundToggle } from '../common/SoundToggle';
import { DriverNotificationDrawer } from './DriverNotificationDrawer';

export type DashboardTab = 
  | 'command' 
  | 'map' 
  | 'triage' 
  | 'smart_hospital'
  | 'navigation'
  | 'hospitals' 
  | 'fleet' 
  | 'incidents' 
  | 'analytics' 
  | 'citizen';

interface DashboardLayoutProps {
  currentTab: DashboardTab;
  setCurrentTab: (tab: DashboardTab) => void;
  onReturnToLanding: () => void;
  onOpenSettings: () => void;
  onOpenCreateIncident: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onReturnToLanding,
  onOpenSettings,
  onOpenCreateIncident,
  children,
}) => {
  const { user, logout } = useAuth();
  const { 
    notifications, 
    markNotificationRead, 
    clearAllNotifications, 
    connectionStatus, 
    latencyMs, 
    triggerMockEmergencyCall,
    isSimulatingCalls,
    setIsSimulatingCalls,
    setSelectedIncidentId
  } = useEmergencyData();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const NAV_ITEMS: { id: DashboardTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'command', label: 'Command Center', icon: LayoutDashboard },
    { id: 'map', label: 'GIS Live Operations', icon: Map, badge: 'Live GPS' },
    { id: 'smart_hospital', label: 'Smart Hospital Match', icon: Compass, badge: 'AI Match' },
    { id: 'navigation', label: 'Turn-by-Turn Navigation', icon: Navigation, badge: 'Dual Stage' },
    { id: 'triage', label: 'AI Clinical Triage Lab', icon: Sparkles, badge: 'AI' },
    { id: 'hospitals', label: 'Hospital ER Matrix', icon: HospitalIcon },
    { id: 'fleet', label: '108 Ambulance Fleet', icon: Truck },
    { id: 'incidents', label: 'Incident Registry', icon: FileText },
    { id: 'analytics', label: 'Analytics & Heatmap', icon: BarChart3 },
    { id: 'citizen', label: 'Citizen SOS & First-Aid', icon: HeartHandshake },
  ];

  return (
    <div className="min-h-screen bg-[#05080D] dark:bg-[#05080D] light:bg-[#F5F8FC] text-slate-100 dark:text-slate-100 light:text-slate-900 flex flex-col transition-colors relative">
      {/* Top Application Header */}
      <header className="h-16 bg-[#071321] dark:bg-[#071321] light:bg-white border-b border-slate-800 dark:border-slate-800 light:border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 dark:bg-slate-800 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={onReturnToLanding}
            className="flex items-center space-x-2.5 cursor-pointer group" 
            title="Go to Landing Page"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#168BCE] to-[#46C5F5] flex items-center justify-center p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#071321] rounded-[6px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#46C5F5]" />
              </div>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white dark:text-white light:text-slate-900">
                Mysuru EM <span className="text-[#46C5F5]">Studio</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-950 text-cyan-300 border border-cyan-800/60">
                112 EOC
              </span>
            </div>
          </div>
        </div>

        {/* Center: Real-Time Connection & Live Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Connection status badge */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#050C16] dark:bg-[#050C16] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium">LIVE TELEMETRY</span>
            <span className="text-slate-500 font-mono">({latencyMs}ms)</span>
          </div>

          {/* Incoming Call Simulation Button */}
          <button
            onClick={() => triggerMockEmergencyCall()}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95"
            title="Simulate incoming 112 emergency call"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Simulate 112 Call</span>
          </button>

          {/* New Incident Action */}
          <button
            onClick={onOpenCreateIncident}
            className="px-3 py-1.5 rounded-xl bg-[#168BCE] hover:bg-[#1277b2] text-white text-xs font-semibold flex items-center space-x-1 shadow-md cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Incident</span>
          </button>
        </div>

        {/* Right: Controls & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <SoundToggle />
          <ThemeToggle />

          {/* Landing Page Switcher */}
          <button
            onClick={onReturnToLanding}
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 text-xs font-medium cursor-pointer transition-colors"
            title="Return to Public Landing Page"
          >
            <Globe className="w-3.5 h-3.5 text-[#46C5F5]" />
            <span>Public Site</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#071321] dark:bg-[#071321] light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#46C5F5]">
                    Operational Notifications ({notifications.length})
                  </h4>
                  <button
                    onClick={clearAllNotifications}
                    className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors border ${
                          n.read
                            ? 'bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50 border-transparent text-slate-400'
                            : 'bg-[#168BCE]/15 dark:bg-[#168BCE]/15 light:bg-blue-50 border-[#168BCE]/40 text-white dark:text-white light:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[11px] text-[#46C5F5]">{n.title}</span>
                          <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] mt-1 text-slate-300 dark:text-slate-300 light:text-slate-600">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:border-[#168BCE] border border-transparent cursor-pointer transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#168BCE] to-[#46C5F5] flex items-center justify-center text-xs font-bold text-slate-950">
                {user?.name?.slice(0, 2).toUpperCase() || 'MC'}
              </div>
              <div className="hidden xl:block text-left pr-1">
                <p className="text-xs font-bold text-white dark:text-white light:text-slate-900 truncate max-w-[120px]">
                  {user?.name || 'Commander'}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px] font-mono">
                  {user?.role || 'COMMANDER'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#071321] dark:bg-[#071321] light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
                  <p className="text-xs font-bold text-white dark:text-white light:text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#168BCE]/20 text-[#46C5F5]">
                    ROLE: {user?.role}
                  </span>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <button
                    onClick={() => { onOpenSettings(); setUserDropdownOpen(false); }}
                    className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 text-left text-slate-300 dark:text-slate-300 light:text-slate-700 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-[#46C5F5]" />
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    onClick={() => { logout(); setUserDropdownOpen(false); }}
                    className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-rose-950/40 text-left text-rose-400 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-[#071321]/95 dark:bg-[#071321]/95 light:bg-white border-r border-slate-800 dark:border-slate-800 light:border-slate-200 flex flex-col justify-between transition-all duration-300 z-30 ${
            sidebarOpen ? 'fixed inset-y-0 left-0 pt-16' : 'hidden lg:flex'
          }`}
        >
          {/* Navigation items */}
          <div className="p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              Operations Center
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#168BCE] text-white shadow-[0_0_15px_rgba(22,139,206,0.35)]'
                      : 'text-slate-300 dark:text-slate-300 light:text-slate-600 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 hover:text-white dark:hover:text-white light:hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#46C5F5]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-cyan-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Bottom Operational Status */}
          <div className="p-4 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 bg-[#050C16]/80 dark:bg-[#050C16]/80 light:bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Auto-Call Simulator</span>
              <button
                onClick={() => setIsSimulatingCalls(!isSimulatingCalls)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold cursor-pointer ${
                  isSimulatingCalls ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isSimulatingCalls ? 'ENABLED' : 'PAUSED'}
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>District Jurisdiction</span>
                <span className="text-white dark:text-white light:text-slate-900 font-bold">Mysuru (All Wards)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Active 112 Channels</span>
                <span className="text-emerald-400 font-mono font-bold">12 / 12</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#05080D] dark:bg-[#05080D] light:bg-[#F5F8FC] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Global Real-Time Ambulance Driver Notification Drawer (Feature 2 & 6) */}
      <DriverNotificationDrawer
        onAcceptSuccess={(incidentId) => {
          setSelectedIncidentId(incidentId);
          setCurrentTab('navigation');
        }}
        onViewIncident={(incidentId) => {
          setSelectedIncidentId(incidentId);
          setCurrentTab('command');
        }}
      />
    </div>
  );
};
