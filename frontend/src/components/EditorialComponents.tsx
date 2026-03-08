import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronRight, ArrowLeft, Loader2, Check } from 'lucide-react';

// Shared Animation Configuration
export const transition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition }
};

export const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

export const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 }
};

// Toast Component
interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-stone-900 text-[#FAF9F6] px-6 py-4 border-2 border-[#059669] shadow-[6px_6px_0px_0px_rgba(5,150,105,1)] flex items-center gap-3 font-bold text-sm tracking-wider uppercase w-max max-w-[90vw]"
    >
      <Info size={18} className="text-[#059669] shrink-0" />
      <span className="truncate">{message}</span>
    </motion.div>
  );
};

// Header Component
interface HeaderProps {
  lang: string;
  setLang: (lang: string) => void;
  translations: {
    nav: {
      english: string;
      hindi: string;
    };
  };
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, translations }) => (
  <header className="w-full py-5 px-6 md:px-12 flex items-center justify-between bg-[#FAF9F6] border-b border-stone-200 sticky top-0 z-40">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-[#059669] flex items-center justify-center rounded-br-lg rounded-tl-lg shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
        <span className="text-white font-serif font-bold text-lg tracking-tighter">N</span>
      </div>
      <span className="text-lg font-bold tracking-widest uppercase text-stone-900">Nexis</span>
    </div>
    <div className="flex items-center bg-[#FAF9F6] p-1 border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
      <button
        onClick={() => setLang('en')}
        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
          lang === 'en' ? 'bg-stone-900 text-[#FAF9F6]' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        {translations.nav.english}
      </button>
      <button
        onClick={() => setLang('hi')}
        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
          lang === 'hi' ? 'bg-stone-900 text-[#FAF9F6]' : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        {translations.nav.hindi}
      </button>
    </div>
  </header>
);

// Footer Component
export const Footer: React.FC = () => (
  <footer className="w-full bg-[#FAF9F6] py-12 px-6 md:px-12 pb-32 md:pb-12 border-t border-stone-300">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-stone-900 flex items-center justify-center rounded-br-md rounded-tl-md">
          <span className="text-white font-serif font-bold text-xs">N</span>
        </div>
        <span className="text-base font-bold tracking-widest uppercase text-stone-900">Nexis</span>
      </div>
      <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">
        © {new Date().getFullYear()} NEXIS. Built to serve Indian citizens.
      </p>
    </div>
  </footer>
);

// Primary Button
interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  icon,
  iconPosition = 'right',
  disabled = false,
  className = '',
  type = 'button'
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-3 bg-[#059669] text-[#FAF9F6] px-8 py-4 text-base font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] transition-all uppercase tracking-wider border-2 border-transparent ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    {iconPosition === 'left' && icon}
    {children}
    {iconPosition === 'right' && icon}
  </button>
);

// Secondary Button
export const SecondaryButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  icon,
  iconPosition = 'right',
  disabled = false,
  className = '',
  type = 'button'
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-3 bg-[#FAF9F6] text-stone-900 border-2 border-stone-900 px-8 py-4 text-base font-bold hover:bg-stone-100 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all uppercase tracking-wider ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
  >
    {iconPosition === 'left' && icon}
    {children}
    {iconPosition === 'right' && icon}
  </button>
);

// Card Component
interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  elevated?: boolean;
  accent?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  className = '',
  elevated = false,
  accent = false
}) => {
  const baseClasses = onClick ? 'cursor-pointer' : '';
  const variantClasses = accent
    ? 'bg-[#059669] text-white border-2 border-stone-900 shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]'
    : elevated
    ? 'bg-[#FAF9F6] border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]'
    : 'bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.3)] hover:-translate-y-1 hover:border-[#059669]';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} transition-all ${className}`}
    >
      {children}
    </div>
  );
};

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'error';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => {
  const variantClasses = {
    success: 'bg-[#059669]/10 text-[#059669] border-[#059669]',
    warning: 'bg-[#D97706]/10 text-[#D97706] border-[#D97706]',
    info: 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]',
    error: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]'
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 font-bold text-xs uppercase tracking-widest border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => (
  <div className={`w-full bg-[#FAF9F6] h-3 border-2 border-stone-900 overflow-hidden shadow-[2px_2px_0px_0px_rgba(28,25,23,0.1)] ${className}`}>
    <motion.div
      className="bg-[#059669] h-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  </div>
);

// Loading Spinner
export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Loader2 size={24} className={`animate-spin text-[#059669] ${className}`} />
);

// Section Tag
interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTag: React.FC<SectionTagProps> = ({ children, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="w-8 h-[1px] bg-[#059669]"></div>
    <span className="text-[#059669] font-medium tracking-widest uppercase text-xs">{children}</span>
    <div className="w-8 h-[1px] bg-[#059669]"></div>
  </div>
);

// Stat Display
interface StatProps {
  value: string | number;
  label: string;
  accent?: boolean;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({ value, label, accent = false, className = '' }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <span className={`text-4xl md:text-5xl font-serif font-bold ${accent ? 'text-[#059669]' : 'text-stone-900'}`}>
      {value}
    </span>
    <span className="text-xs md:text-sm text-stone-500 font-bold uppercase tracking-widest mt-2">
      {label}
    </span>
  </div>
);

// Icon Box
interface IconBoxProps {
  icon: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  className?: string;
}

export const IconBox: React.FC<IconBoxProps> = ({
  icon,
  bgColor = 'bg-amber-50',
  borderColor = 'border-amber-200',
  className = ''
}) => (
  <div
    className={`w-12 h-12 rounded-none flex items-center justify-center ${bgColor} ${borderColor} border-2 shadow-[2px_2px_0px_0px_rgba(28,25,23,0.1)] ${className}`}
  >
    {icon}
  </div>
);

// Numbered Step
interface StepNumberProps {
  number: number;
  active?: boolean;
  className?: string;
}

export const StepNumber: React.FC<StepNumberProps> = ({ number, active = false, className = '' }) => (
  <div
    className={`w-10 h-10 border-2 border-stone-900 flex items-center justify-center font-serif font-bold text-lg ${
      active
        ? 'bg-[#059669] text-[#FAF9F6] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)]'
        : 'bg-[#FAF9F6] text-stone-900 shadow-[3px_3px_0px_0px_rgba(5,150,105,1)]'
    } ${className}`}
  >
    {number}
  </div>
);

// Alert/Notice Component
interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, variant = 'info', icon, className = '' }) => {
  const variantClasses = {
    info: 'bg-[#FAF9F6] border-stone-300',
    success: 'bg-[#ECFDF5] border-[#059669]',
    warning: 'bg-[#FFFBEB] border-[#D97706]',
    error: 'bg-[#FEF2F2] border-[#DC2626]'
  };

  return (
    <div className={`border-2 p-5 flex items-start gap-4 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] ${variantClasses[variant]} ${className}`}>
      {icon}
      <div className="text-sm text-stone-700 font-medium leading-relaxed font-serif italic">{children}</div>
    </div>
  );
};

// Checkbox Component
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, className = '' }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`flex items-center justify-between p-4 border-2 font-bold text-sm cursor-pointer transition-all uppercase tracking-wider ${
      checked
        ? 'bg-[#ECFDF5] border-[#059669] text-[#059669] shadow-[2px_2px_0px_0px_rgba(5,150,105,1)] translate-y-[-2px]'
        : 'bg-[#FAF9F6] border-stone-300 text-stone-600 hover:border-stone-900'
    } ${className}`}
  >
    <div className="flex items-center gap-3">
      {label}
    </div>
    {checked ? <Check size={18} strokeWidth={3} /> : <div className="w-4 h-4 border-2 border-stone-300"></div>}
  </div>
);
