import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { EmergencyDataProvider, useEmergencyData } from './context/EmergencyDataContext';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { PlatformFeatures } from './components/landing/PlatformFeatures';
import { HowItWorks } from './components/landing/HowItWorks';
import { OperationsShowcase } from './components/landing/OperationsShowcase';
import { PlatformBenefits } from './components/landing/PlatformBenefits';
import { CallToAction } from './components/landing/CallToAction';
import { Footer } from './components/landing/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardLayout, DashboardTab } from './components/dashboard/DashboardLayout';
import { CommandCenterView } from './components/dashboard/CommandCenterView';
import { LiveMapView } from './components/dashboard/LiveMapView';
import { AIClinicalTriageView } from './components/dashboard/AIClinicalTriageView';
import { HospitalReadinessView } from './components/dashboard/HospitalReadinessView';
import { AmbulanceFleetView } from './components/dashboard/AmbulanceFleetView';
import { IncidentManagerView } from './components/dashboard/IncidentManagerView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { CitizenPortalView } from './components/dashboard/CitizenPortalView';
import { SmartHospitalSelectionView } from './components/dashboard/SmartHospitalSelectionView';
import { NavigationPanel } from './components/dashboard/NavigationPanel';
import { SettingsProfileModal } from './components/dashboard/SettingsProfileModal';
import { CreateIncidentModal } from './components/dashboard/CreateIncidentModal';

function AppContent() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('command');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [createIncidentModalOpen, setCreateIncidentModalOpen] = useState(false);
  const { setSelectedIncidentId } = useEmergencyData();

  const handleOpenDashboard = (incidentId?: string) => {
    if (incidentId) {
      setSelectedIncidentId(incidentId);
      setDashboardTab('command');
    }
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05080D] dark:bg-[#05080D] light:bg-[#F5F8FC] text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors duration-200 selection:bg-[#168BCE] selection:text-white">
      {currentView === 'landing' ? (
        <>
          <Navbar
            onOpenLogin={() => setAuthModalOpen(true)}
            onOpenDashboard={() => handleOpenDashboard()}
          />
          <main>
            <HeroSection
              onOpenDashboard={(incidentId) => handleOpenDashboard(incidentId)}
              onOpenDemo={() => setAuthModalOpen(true)}
              onOpenLiveMap={() => {
                setDashboardTab('map');
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <PlatformFeatures />
            <HowItWorks />
            <OperationsShowcase onOpenDashboard={(view) => {
              if (view === 'hospitals') setDashboardTab('hospitals');
              else if (view === 'fleet') setDashboardTab('fleet');
              else setDashboardTab('command');
              setCurrentView('dashboard');
            }} />
            <PlatformBenefits />
            <CallToAction
              onOpenDashboard={() => handleOpenDashboard()}
              onOpenLogin={() => setAuthModalOpen(true)}
            />
          </main>
          <Footer />
        </>
      ) : (
        <DashboardLayout
          currentTab={dashboardTab}
          setCurrentTab={setDashboardTab}
          onReturnToLanding={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onOpenCreateIncident={() => setCreateIncidentModalOpen(true)}
        >
          {dashboardTab === 'command' && <CommandCenterView />}
          {dashboardTab === 'map' && <LiveMapView />}
          {dashboardTab === 'smart_hospital' && (
            <SmartHospitalSelectionView
              onNavigateToHospital={() => setDashboardTab('navigation')}
            />
          )}
          {dashboardTab === 'navigation' && (
            <NavigationPanel
              onBackToHospitalSelection={() => setDashboardTab('smart_hospital')}
            />
          )}
          {dashboardTab === 'triage' && <AIClinicalTriageView />}
          {dashboardTab === 'hospitals' && <HospitalReadinessView />}
          {dashboardTab === 'fleet' && <AmbulanceFleetView />}
          {dashboardTab === 'incidents' && (
            <IncidentManagerView
              onOpenCreateIncident={() => setCreateIncidentModalOpen(true)}
            />
          )}
          {dashboardTab === 'analytics' && <AnalyticsView />}
          {dashboardTab === 'citizen' && <CitizenPortalView />}
        </DashboardLayout>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => handleOpenDashboard()}
      />

      <SettingsProfileModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      <CreateIncidentModal
        isOpen={createIncidentModalOpen}
        onClose={() => setCreateIncidentModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EmergencyDataProvider>
          <AppContent />
        </EmergencyDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
