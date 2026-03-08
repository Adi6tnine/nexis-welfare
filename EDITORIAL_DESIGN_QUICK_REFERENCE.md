# Editorial Design System - Quick Reference

## 🎨 Color Palette

```css
/* Backgrounds */
--cream: #FAF9F6          /* Main background */
--stone-100: #f5f5f4      /* Light background */
--stone-900: #1c1917      /* Dark background */

/* Primary Actions */
--emerald-600: #059669    /* Primary buttons, accents */
--emerald-700: #047857    /* Hover states */

/* Text */
--stone-900: #1c1917      /* Primary text */
--stone-600: #57534e      /* Secondary text */
--stone-500: #78716c      /* Tertiary text */

/* Borders */
--stone-300: #d6d3d1      /* Light borders */
--stone-900: #1c1917      /* Strong borders */

/* Status Colors */
--emerald-600: #059669    /* Success */
--amber-600: #d97706      /* Warning */
--purple-700: #7c3aed     /* Info */
--red-600: #dc2626        /* Error */
```

## 📝 Typography

```tsx
/* Headings - Use Playfair Display (serif) */
<h1 className="text-5xl md:text-6xl lg:text-[76px] font-serif font-bold text-stone-900 leading-[1.05] tracking-tight">
  Main Title
</h1>

<h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900">
  Section Title
</h2>

<h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
  Card Title
</h3>

/* Subtitles - Italic serif */
<span className="text-3xl md:text-4xl font-serif font-light italic text-[#059669]">
  Subtitle
</span>

/* Body Text - Use Inter (sans) */
<p className="text-lg md:text-xl text-stone-600 font-medium">
  Body text
</p>

/* Labels - Uppercase, bold, wide tracking */
<span className="text-xs font-bold uppercase tracking-widest text-stone-900">
  Label Text
</span>
```

## 🔘 Buttons

```tsx
/* Primary Button */
<button className="flex items-center justify-center gap-3 bg-[#059669] text-[#FAF9F6] px-8 py-4 text-base font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] transition-all uppercase tracking-wider border-2 border-transparent">
  Button Text
</button>

/* Secondary Button */
<button className="flex items-center justify-center gap-3 bg-[#FAF9F6] text-stone-900 border-2 border-stone-900 px-8 py-4 text-base font-bold hover:bg-stone-100 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all uppercase tracking-wider">
  Button Text
</button>

/* Disabled Button */
<button className="bg-stone-200 text-stone-400 border-2 border-stone-300 cursor-not-allowed" disabled>
  Disabled
</button>
```

## 📦 Cards

```tsx
/* Standard Card */
<div className="bg-[#FAF9F6] border-2 border-stone-300 p-5 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.3)] hover:-translate-y-1 hover:border-[#059669] transition-all">
  Content
</div>

/* Elevated Card */
<div className="bg-[#FAF9F6] border-2 border-stone-900 p-8 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
  Content
</div>

/* Accent Card */
<div className="bg-[#059669] text-white p-6 border-2 border-stone-900 shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]">
  Content
</div>
```

## 🏷️ Badges

```tsx
/* Success Badge */
<span className="bg-[#059669]/10 text-[#059669] px-3 py-1 font-bold text-xs uppercase tracking-widest border border-[#059669]">
  Eligible
</span>

/* Warning Badge */
<span className="bg-[#D97706]/10 text-[#D97706] px-3 py-1 font-bold text-xs uppercase tracking-widest border border-[#D97706]">
  Pending
</span>

/* Info Badge */
<span className="bg-[#7C3AED]/10 text-[#7C3AED] px-3 py-1 font-bold text-xs uppercase tracking-widest border border-[#7C3AED]">
  High Confidence
</span>
```

## 📊 Progress Bar

```tsx
<div className="w-full bg-[#FAF9F6] h-3 border-2 border-stone-900 overflow-hidden shadow-[2px_2px_0px_0px_rgba(28,25,23,0.1)]">
  <motion.div 
    className="bg-[#059669] h-full" 
    initial={{ width: 0 }}
    animate={{ width: "50%" }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  />
</div>
```

## 🔢 Numbered Steps

```tsx
/* Regular Step */
<div className="w-10 h-10 border-2 border-stone-900 bg-[#FAF9F6] text-stone-900 flex items-center justify-center font-serif font-bold text-lg shadow-[3px_3px_0px_0px_rgba(5,150,105,1)]">
  1
</div>

/* Active Step */
<div className="w-10 h-10 border-2 border-stone-900 bg-[#059669] text-[#FAF9F6] flex items-center justify-center font-serif font-bold text-lg shadow-[3px_3px_0px_0px_rgba(28,25,23,1)]">
  2
</div>
```

## 📥 Input Fields

```tsx
/* Large Form Input */
<input
  type="text"
  className="w-full bg-transparent border-b-4 border-stone-300 text-4xl md:text-5xl font-serif font-bold text-stone-900 pb-4 outline-none transition-all placeholder:text-stone-300 focus:border-stone-900"
  placeholder="Enter answer"
/>

/* Small Input */
<input
  type="text"
  className="w-full bg-transparent border-b-2 border-stone-300 text-base font-bold text-stone-900 pb-2 outline-none transition-all placeholder:text-stone-400 focus:border-stone-900"
  placeholder="Enter text"
/>
```

## 🎯 Icon Boxes

```tsx
<div className="w-12 h-12 rounded-none flex items-center justify-center bg-amber-50 border-2 border-amber-200 shadow-[2px_2px_0px_0px_rgba(28,25,23,0.1)]">
  <Icon size={22} className="text-stone-800" strokeWidth={1.5} />
</div>
```

## 📢 Toast Notification

```tsx
<motion.div 
  initial={{ opacity: 0, y: 50, scale: 0.9 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 20, scale: 0.9 }}
  className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-stone-900 text-[#FAF9F6] px-6 py-4 border-2 border-[#059669] shadow-[6px_6px_0px_0px_rgba(5,150,105,1)] flex items-center gap-3 font-bold text-sm tracking-wider uppercase"
>
  <Info size={18} className="text-[#059669]" />
  <span>Message</span>
</motion.div>
```

## 📊 Stats Display

```tsx
<div className="flex flex-col items-center">
  <span className="text-4xl md:text-5xl font-serif font-bold text-stone-900">
    921+
  </span>
  <span className="text-xs md:text-sm text-stone-500 font-bold uppercase tracking-widest mt-2">
    Schemes
  </span>
</div>

/* Accent Stat */
<div className="flex flex-col items-center">
  <span className="text-4xl md:text-5xl font-serif font-bold text-[#059669]">
    95%
  </span>
  <span className="text-xs md:text-sm text-stone-500 font-bold uppercase tracking-widest mt-2">
    Accuracy
  </span>
</div>
```

## 🎨 Shadows Reference

```css
/* Small Shadow */
shadow-[2px_2px_0px_0px_rgba(28,25,23,0.1)]

/* Medium Shadow */
shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)]

/* Large Shadow */
shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]

/* Extra Large Shadow */
shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]

/* Accent Shadow (Emerald) */
shadow-[4px_4px_0px_0px_rgba(5,150,105,1)]

/* Hover State (reduce shadow) */
hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]
```

## 🎭 Animation Variants

```tsx
/* Fade Up */
const fadeUpVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

/* Page Transition */
const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

/* Slide */
const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 }
};
```

## 🔧 Common Patterns

### Section Tag
```tsx
<div className="flex items-center gap-3">
  <div className="w-8 h-[1px] bg-[#059669]"></div>
  <span className="text-[#059669] font-medium tracking-widest uppercase text-xs">
    AI-Powered Platform
  </span>
  <div className="w-8 h-[1px] bg-[#059669]"></div>
</div>
```

### Divider
```tsx
<div className="w-px h-12 bg-stone-300"></div>
```

### Background Pattern
```tsx
<div className="absolute inset-0 pattern-lines opacity-50 z-0"></div>
```

### Checkbox
```tsx
<div className="flex items-center justify-between p-4 border-2 font-bold text-sm cursor-pointer transition-all uppercase tracking-wider bg-[#ECFDF5] border-[#059669] text-[#059669] shadow-[2px_2px_0px_0px_rgba(5,150,105,1)]">
  <span>Document Name</span>
  <Check size={18} strokeWidth={3} />
</div>
```

## 📱 Responsive Breakpoints

```tsx
/* Mobile First */
className="text-base md:text-lg lg:text-xl"

/* Common Breakpoints */
sm: 640px   // Small devices
md: 768px   // Medium devices
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
```

## ♿ Accessibility

```tsx
/* Skip Link */
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#059669] focus:text-white focus:border-2 focus:border-stone-900">
  Skip to main content
</a>

/* ARIA Labels */
<button aria-label="Close dialog" aria-pressed="false">
  <Icon />
</button>

/* Semantic HTML */
<main id="main-content" role="main">
  <section aria-labelledby="section-heading">
    <h2 id="section-heading">Title</h2>
  </section>
</main>
```

## 🚀 Quick Start Template

```tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header, Footer, PrimaryButton, Card, Toast, pageVariants } from '../components/EditorialComponents';
import { getLanguage } from '../services/storage';
import { getTranslation } from '../locales/translations';

export default function MyPage() {
  const [language] = useState<string>(getLanguage());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = getTranslation(language);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FAF9F6]"
    >
      {/* Toast */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      
      {/* Header */}
      <Header lang={language} setLang={() => {}} translations={t} />
      
      {/* Main Content */}
      <main className="w-full min-h-screen pb-32 pt-12 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-8">
          Page Title
        </h1>
        
        <Card className="p-8">
          <p className="text-stone-600 font-medium">Content</p>
        </Card>
      </main>
      
      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
```

## 📚 Import Statements

```tsx
// Components
import {
  Header,
  Footer,
  PrimaryButton,
  SecondaryButton,
  Card,
  Badge,
  ProgressBar,
  LoadingSpinner,
  SectionTag,
  Stat,
  IconBox,
  StepNumber,
  Alert,
  Checkbox,
  Toast,
  fadeUpVariants,
  pageVariants,
  slideVariants
} from '../components/EditorialComponents';

// Icons (Lucide React)
import { 
  Home, 
  ChevronRight, 
  Check, 
  X, 
  Info, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  // ... more icons
} from 'lucide-react';

// Animation
import { motion, AnimatePresence } from 'framer-motion';

// Services
import { getLanguage, saveLanguage } from '../services/storage';
import { getTranslation } from '../locales/translations';
```

---

**Pro Tip**: Use the `EditorialComponents.tsx` file as your single source of truth for component patterns. All components follow the same design principles and can be easily customized with className props.
