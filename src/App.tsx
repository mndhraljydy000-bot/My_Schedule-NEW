import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import QiyasSection from './pages/QiyasSection';
import TahsiliSection from './pages/TahsiliSection';
import MySchedule from './pages/MySchedule';
import Notes from './pages/Notes';
import AuthPage from './pages/AuthPage';
import TelegramGate from './components/TelegramGate';
import Toast from './components/Toast';
import InstallPrompt from './components/InstallPrompt';
import { applyPageSeo } from './utils/seo';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { page, telegramGateOpen, telegramGateMode, setTelegramGate, handleTelegramVerified, generateError, setGenerateError } = useApp();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: `/${page}`, title: page });
    applyPageSeo(page);
  }, [page]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {page === 'home' && <Home />}
        {page === 'qiyas' && <QiyasSection />}
        {page === 'tahsili' && <TahsiliSection />}
        {page === 'schedule' && <MySchedule />}
        {page === 'notes' && <Notes />}
      </main>
      <Footer />
      <TelegramGate
        open={telegramGateOpen}
        mode={telegramGateMode}
        onVerified={handleTelegramVerified}
        onClose={() => setTelegramGate(false)}
      />
      <Toast open={!!generateError} onClose={() => setGenerateError(null)} message={generateError ?? ''} />
      <InstallPrompt />
    </div>
  );
}

function LoginRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user) return <Navigate to="/" replace />;
  return <AuthPage onBack={() => navigate('/')} />;
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-gold-400" />
          <p className="text-sm text-ink-300">جاري التحميل…</p>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
