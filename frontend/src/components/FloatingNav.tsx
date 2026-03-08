import React, { useState } from 'react';
import { Home, LayoutGrid, MessageSquare, Bell, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from './EditorialComponents';

interface FloatingNavProps {
  onChatOpen?: () => void;
}

export function FloatingNav({ onChatOpen }: FloatingNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleChatOpen = () => {
    if (onChatOpen) {
      onChatOpen();
    } else {
      setToastMessage('Opening Chat Assistant...');
      setTimeout(() => navigate('/chat'), 600);
    }
  };

  const handleNotifications = () => {
    setToastMessage('No new notifications');
  };

  return (
    <>
      {/* Toast Notifications */}
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>

      {/* Floating Navigation */}
      <div className="fixed bottom-4 md:bottom-6 left-0 right-0 z-50 flex items-center justify-center pointer-events-none px-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-md md:max-w-none md:w-auto"
        >
          <div className="bg-[#FAF9F6] border border-stone-300 shadow-[6px_6px_0px_0px_rgba(28,25,23,0.1)] px-4 md:px-8 py-2 md:py-3 flex items-center justify-center gap-4 md:gap-8 relative">
            {/* Home */}
            <button
              onClick={() => navigate('/')}
              className={`transition-colors flex flex-col items-center gap-1 ${
                isActive('/') || isActive('/landing')
                  ? 'text-[#059669]'
                  : 'text-stone-400 hover:text-stone-900'
              }`}
              aria-label="Go to home"
            >
              <Home size={20} strokeWidth={2} className="md:w-[22px] md:h-[22px]" />
            </button>

            {/* Dashboard/Results */}
            <button
              onClick={() => {
                setToastMessage('Viewing Dashboard / Results...');
                setTimeout(() => navigate('/results'), 600);
              }}
              className={`transition-colors flex flex-col items-center gap-1 ${
                isActive('/results') || isActive('/enhanced-results')
                  ? 'text-[#059669]'
                  : 'text-stone-400 hover:text-stone-900'
              }`}
              aria-label="View results"
            >
              <LayoutGrid size={20} strokeWidth={2} className="md:w-[22px] md:h-[22px]" />
            </button>

            {/* AI Chat - Center Elevated Button */}
            <div className="flex items-center justify-center">
              <button
                onClick={handleChatOpen}
                className="bg-[#059669] text-white p-3 md:p-3.5 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all relative -top-4 md:-top-6"
                aria-label="Open AI chat assistant"
              >
                <MessageSquare size={20} strokeWidth={2} className="fill-[#059669] md:w-[22px] md:h-[22px]" />
              </button>
            </div>

            {/* Notifications */}
            <button
              onClick={handleNotifications}
              className="text-stone-400 hover:text-stone-900 transition-colors flex flex-col items-center gap-1 relative"
              aria-label="View notifications"
            >
              <Bell size={20} strokeWidth={2} className="md:w-[22px] md:h-[22px]" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 border border-[#FAF9F6]"></span>
            </button>

            {/* Profile */}
            <button
              onClick={() => {
                setToastMessage('Opening User Profile Settings...');
                setTimeout(() => navigate('/profile'), 600);
              }}
              className={`transition-colors flex flex-col items-center gap-1 ${
                isActive('/profile') || isActive('/adaptive-profile')
                  ? 'text-[#059669]'
                  : 'text-stone-400 hover:text-stone-900'
              }`}
              aria-label="View profile"
            >
              <User size={20} strokeWidth={2} className="md:w-[22px] md:h-[22px]" />
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
