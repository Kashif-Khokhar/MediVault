import React, { useState } from 'react';
import { VaultProvider, useVault } from './context/VaultContext';
import { UserProvider, useUser } from './context/UserContext';
import PasscodeLock from './components/Layout/PasscodeLock';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import AuthPage from './components/Auth/AuthPage';
import RecordsList from './components/Records/RecordsList';
import VitalsChart from './components/Dashboard/VitalsChart';
import { DashboardStats } from './components/Dashboard/StatsCard';
import MedicineReminders from './components/Dashboard/MedicineReminders';
import EmergencyCard from './components/Emergency/EmergencyCard';
import { db } from './db/schema';
import { useLiveQuery } from 'dexie-react-hooks';

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("MediVault Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-red-100 shadow-xl text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-4 text-red-600">Something went wrong</h2>
            <p className="text-slate-500 text-sm mb-6">The application encountered an unexpected error. Your data is safe in the vault.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-medical-600 text-white rounded-xl font-bold shadow-lg"
            >
              Reload MediVault
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const { isLocked, loading: vaultLoading } = useVault();
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Live counts for dashboard
  const recordsCount = useLiveQuery(() => db.records.count()) ?? 0;
  const vitalsCount = useLiveQuery(() => db.vitals.count()) ?? 0;

  if (vaultLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  // 1. First Gate: Cloud Authentication
  if (!user) {
    return <AuthPage onSuccess={() => setActiveTab('dashboard')} />;
  }

  // 2. Second Gate: Local Vault Passcode
  if (isLocked) {
    return <PasscodeLock />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <TopBar onNavigate={setActiveTab} />
        <ErrorBoundary>
          <main className="p-8 flex-1 overflow-y-auto max-h-[calc(100vh - 80px)]">
            <div className="max-w-7xl mx-auto space-y-8">
              {activeTab === 'records' ? (
                <ErrorBoundary>
                  <RecordsList />
                </ErrorBoundary>
              ) : activeTab === 'ice' ? (
                <ErrorBoundary>
                  <EmergencyCard />
                </ErrorBoundary>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">Your Health Overview</h2>
                    <div className="text-sm text-slate-400 font-medium">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                  </div>

                  <DashboardStats recordsCount={recordsCount} vitalsCount={vitalsCount} />

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <ErrorBoundary><VitalsChart /></ErrorBoundary>
                    <ErrorBoundary><MedicineReminders /></ErrorBoundary>
                  </div>
                </>
              )}
            </div>
          </main>
        </ErrorBoundary>
      </div>
    </div>
  );
};

function App() {
  return (
    <VaultProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </VaultProvider>
  );
}

export default App;
