import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Dashboard  from './pages/Dashboard';
import Agents     from './pages/Agents';
import Missions   from './pages/Missions';
import Vault      from './pages/Vault';
import Chat       from './pages/Chat';
import Chats      from './pages/Chats';
import Settings   from './pages/Settings';
import api        from './hooks/useApi';

function AppRouter() {
  const [onboarded, setOnboarded] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    api.get('/api/config')
      .then(r => setOnboarded(r.data?.onboarded === 'true'))
      .catch(() => setOnboarded(false));
  }, []);

  // Loading splash
  if (onboarded === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-base)' }}
      >
        <div
          className="w-10 h-10 border-2 rounded-full animate-spin"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }}
        />
      </div>
    );
  }

  return (
    <Routes>
      {/* Guard: onboarding inaccessible if already onboarded (BUG-13) */}
      <Route path="/onboarding" element={
        onboarded ? <Navigate to="/dashboard" replace /> : <Onboarding />
      } />

      {/* Main app routes */}
      <Route path="/dashboard"      element={<Dashboard />} />
      <Route path="/agents"         element={<Agents />} />
      <Route path="/chats"          element={<Chats />} />
      <Route path="/missions"       element={<Missions />} />
      <Route path="/vault"          element={<Vault />} />
      <Route path="/chat/:agentId"  element={<Chat />} />
      <Route path="/settings"       element={<Settings />} />

      {/* Root redirect: vai ao onboarding se não configurou, senão ao dashboard */}
      <Route
        path="/"
        element={<Navigate to={onboarded ? '/dashboard' : '/onboarding'} replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
