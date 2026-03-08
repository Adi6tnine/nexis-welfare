import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LanguageSelectionPage from './pages/LanguageSelectionPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SimpleProfilePage from './pages/SimpleProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import AdaptiveQuestionnairePage from './pages/AdaptiveQuestionnairePage';
import ChatPage from './pages/ChatPage';
import VoiceOnboardingPage from './pages/VoiceOnboardingPage';
import GuidedApplicationPage from './pages/GuidedApplicationPage';
import EnhancedResultsPage from './pages/EnhancedResultsPage';
import ResultsPage from './pages/ResultsPage';
import { FloatingNav } from './components/FloatingNav';
import { AIChatOverlay } from './components/AIChatOverlay';
import { getLanguage } from './services/storage';
import { initializeAuth } from './services/auth';
import './styles/design-system.css';

function AppContent() {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Initialize auth on app startup
  useEffect(() => {
    initializeAuth();
  }, []);
  
  // Don't show floating nav on language selection page or auth pages
  const showFloatingNav = location.pathname !== '/' && 
                          location.pathname !== '/login' && 
                          location.pathname !== '/register';

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/" 
            element={getLanguage() ? <Navigate to="/landing" replace /> : <LanguageSelectionPage />} 
          />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/simple-profile" element={<SimpleProfilePage />} />
          <Route path="/adaptive-profile" element={<AdaptiveQuestionnairePage />} />
          <Route path="/voice-onboarding" element={<VoiceOnboardingPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/enhanced-results" element={<EnhancedResultsPage />} />
          <Route path="/guided-application/:schemeId" element={<GuidedApplicationPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>

      {/* Floating Navigation */}
      {showFloatingNav && <FloatingNav onChatOpen={() => setIsChatOpen(true)} />}

      {/* AI Chat Overlay */}
      <AIChatOverlay isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;
