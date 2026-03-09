import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, FileText, LogOut, ChevronDown } from 'lucide-react';
import { getCurrentUser, logout } from '../services/auth';

interface UserProfileDropdownProps {
  isActive?: boolean;
}

export function UserProfileDropdown({ isActive }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/landing');
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  if (!user) {
    // Not logged in - show regular profile icon
    return (
      <button
        onClick={() => navigate('/profile')}
        className={`transition-colors flex flex-col items-center gap-1 ${
          isActive ? 'text-[#059669]' : 'text-stone-400 hover:text-stone-900'
        }`}
        aria-label="View profile"
      >
        <User size={20} strokeWidth={2} className="md:w-[22px] md:h-[22px]" />
      </button>
    );
  }

  // Logged in - show dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`transition-colors flex items-center gap-2 ${
          isActive || isOpen ? 'text-[#059669]' : 'text-stone-400 hover:text-stone-900'
        }`}
        aria-label="User menu"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 bg-[#059669] text-white flex items-center justify-center text-sm font-medium border border-stone-900">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <ChevronDown 
            size={16} 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 w-56 bg-[#FAF9F6] border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
          >
            {/* User Info */}
            <div className="p-3 border-b-2 border-stone-900">
              <p className="font-medium text-stone-900 truncate">{user.name}</p>
              <p className="text-sm text-stone-600 truncate">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-stone-100 transition-colors text-stone-900"
              >
                <Settings size={16} />
                <span className="text-sm">Edit Profile</span>
              </button>

              <button
                onClick={() => handleNavigation('/results')}
                className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-stone-100 transition-colors text-stone-900"
              >
                <FileText size={16} />
                <span className="text-sm">My Results</span>
              </button>

              <div className="border-t border-stone-300 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
