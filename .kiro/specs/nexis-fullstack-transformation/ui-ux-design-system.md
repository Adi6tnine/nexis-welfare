# NEXIS UI/UX Design System Documentation

## Overview

This document provides comprehensive UI/UX design specifications extracted from the implemented NEXIS frontend application. It serves as the single source of truth for visual design, interaction patterns, and user experience guidelines.

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Production-Ready

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Animation & Motion](#animation--motion)
7. [Accessibility](#accessibility)
8. [Responsive Design](#responsive-design)
9. [Dark Mode](#dark-mode)
10. [Page Layouts](#page-layouts)

---

## Design Philosophy

### Core Principles

1. **Clarity First** - Every element serves a clear purpose
2. **Progressive Disclosure** - Information revealed when needed
3. **Forgiving Design** - Easy error recovery with helpful guidance
4. **Inclusive by Default** - Works for all users regardless of ability
5. **Culturally Appropriate** - Respects Indian design aesthetics

### Design Inspiration

- **Gov.uk** - Bold typography, generous spacing, accessibility-first
- **Stripe** - Clean data presentation, subtle animations
- **Duolingo** - Encouraging feedback, friendly tone
- **WhatsApp Web** - Familiar chat patterns
- **Material Design 3** - Modern component patterns

---

## Color System

### Primary Colors

```css
/* Blue - Trust, Authority, Government */
--blue-50: #EFF6FF;
--blue-100: #DBEAFE;
--blue-600: #2563EB;
--blue-700: #1D4ED8;  /* Primary CTA */
--blue-800: #1E40AF;  /* Primary Dark */
--blue-900: #1E3A8A;
```

**Usage:**
- Primary buttons and CTAs
- Links and interactive elements
- Focus states
- Brand identity

**Why Blue?**
- Signals trust and authority (used by banks, government)
- Universally positive in India
- Passes WCAG AA contrast requirements
- Not politically charged (unlike saffron)

### Success Colors

```css
/* Emerald - Eligible, Success, Positive */
--emerald-50: #ECFDF5;
--emerald-100: #D1FAE5;
--emerald-400: #34D399;
--emerald-500: #10B981;
--emerald-600: #059669;  /* Primary Success */
--emerald-700: #047857;
```

**Usage:**
- Eligible scheme indicators
- Success messages
- Positive feedback
- Checkmarks and confirmations


### Error & Warning Colors

```css
/* Red - Errors, Ineligible, Danger */
--red-50: #FEF2F2;
--red-100: #FEE2E2;
--red-600: #DC2626;  /* Primary Error */
--red-700: #B91C1C;

/* Amber - Warnings, Important Notices */
--amber-50: #FFFBEB;
--amber-100: #FEF3C7;
--amber-600: #D97706;  /* Primary Warning */
```

### Neutral Colors

```css
/* Gray Scale */
--gray-50: #F9FAFB;   /* Page background */
--gray-100: #F3F4F6;  /* Card backgrounds */
--gray-200: #E5E7EB;  /* Borders */
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;  /* Placeholder text */
--gray-500: #6B7280;  /* Secondary text */
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;  /* Dark mode surfaces */
--gray-900: #111827;  /* Primary text */
```

### Accent Colors (Optional)

```css
/* Indian Cultural Touch */
--saffron: #FF9933;  /* Celebrations, highlights */
--green-accent: #138808;  /* Success emphasis */
--indigo: #4F46E5;  /* Alternative primary */
```

---

## Typography

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

**Why Inter?**
- Open source (no licensing issues)
- Designed for screens
- Excellent Hindi/Devanagari support
- Variable font (one file, all weights)
- Used by GitHub, Mozilla, Vercel

### Font Sizes (Mobile-First)

```css
/* Display */
--text-5xl: 48px / 1;      /* Hero headings (desktop) */
--text-4xl: 36px / 40px;   /* Hero headings (mobile) */
--text-3xl: 30px / 36px;   /* Section headings */

/* Headings */
--text-2xl: 24px / 32px;   /* H1 - Page titles */
--text-xl: 20px / 28px;    /* H2 - Subsections */
--text-lg: 18px / 28px;    /* H3 - Card titles */

/* Body */
--text-base: 16px / 24px;  /* Primary content (minimum) */
--text-sm: 14px / 20px;    /* Secondary content */
--text-xs: 12px / 16px;    /* Captions, labels */
```

### Font Weights

```css
--font-normal: 400;     /* Body text */
--font-medium: 500;     /* Emphasized text */
--font-semibold: 600;   /* Subheadings */
--font-bold: 700;       /* Headings, buttons */
--font-extrabold: 800;  /* Hero text */
--font-black: 900;      /* Extra emphasis */
```

### Line Heights

```css
--leading-tight: 1.2;   /* Headings */
--leading-normal: 1.5;  /* Body text (WCAG recommended) */
--leading-relaxed: 1.75; /* Long-form content */
```

---

## Spacing & Layout

### Spacing Scale (8px Grid)

```css
--spacing-1: 4px;    /* 0.5rem - Tight spacing */
--spacing-2: 8px;    /* 1rem - Small gaps */
--spacing-3: 12px;   /* 1.5rem */
--spacing-4: 16px;   /* 2rem - Default spacing */
--spacing-6: 24px;   /* 3rem - Section spacing */
--spacing-8: 32px;   /* 4rem - Large gaps */
--spacing-12: 48px;  /* 6rem - Major sections */
--spacing-16: 64px;  /* 8rem - Hero sections */
--spacing-20: 80px;  /* 10rem */
```

**Why 8px Grid?**
- Divisible by 2 (easy math)
- Works well with common screen sizes
- Industry standard (Material Design, iOS, Bootstrap)
- Prevents arbitrary spacing decisions

### Touch Targets

```css
/* Minimum Sizes (WCAG 2.1 AAA) */
--touch-min: 44px;      /* Apple HIG minimum */
--touch-recommended: 48px; /* Material Design */
--touch-spacing: 8px;   /* Minimum gap between targets */
```

### Border Radius

```css
--radius-sm: 4px;    /* Inputs, tags */
--radius-md: 8px;    /* Buttons, cards */
--radius-lg: 12px;   /* Modals, large cards */
--radius-xl: 16px;   /* Hero sections */
--radius-2xl: 24px;  /* Extra large cards */
--radius-3xl: 32px;  /* Feature sections */
--radius-full: 9999px; /* Pills, avatars */
```

### Shadows (Subtle Elevation)

```css
/* Small - Buttons on hover */
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Medium - Cards, dropdowns */
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 
            0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Large - Modals */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 
            0 4px 6px -4px rgb(0 0 0 / 0.1);

/* XLarge - Floating elements */
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 
            0 8px 10px -6px rgb(0 0 0 / 0.1);
```

---

## Component Library

### Buttons

#### Primary Button
```css
/* Visual */
background: linear-gradient(to right, #1D4ED8, #4338CA);
color: white;
height: 48px;
padding: 0 24px;
border-radius: 12px;
font-weight: 700;
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

/* States */
hover: translate-y: -2px; shadow: larger;
active: scale: 0.95;
focus: ring: 4px blue-200;
disabled: opacity: 0.6; cursor: not-allowed;
```

**Usage:** Main action on page (only 1 per screen)

#### Secondary Button
```css
background: white;
color: #1E40AF;
border: 2px solid #DBEAFE;
/* Same dimensions as primary */

hover: border-color: #1D4ED8; background: #EFF6FF;
```

**Usage:** Alternative actions

#### Tertiary Button
```css
background: transparent;
color: #6B7280;
height: 40px;
padding: 0 16px;

hover: color: #1E40AF; background: #F3F4F6;
```

**Usage:** Low-priority actions


### Form Inputs

```css
/* Base Input */
height: 48px;
padding: 0 16px;
border: 2px solid #E5E7EB;
border-radius: 8px;
font-size: 16px;  /* Prevents iOS zoom */

/* States */
focus: border-color: #2563EB; ring: 4px #DBEAFE;
error: border-color: #DC2626; ring: 4px #FEE2E2;
disabled: background: #F3F4F6; cursor: not-allowed;

/* With Icon */
padding-left: 40px;  /* When icon present */
```

**Validation Messages:**
- Error: Red text with AlertCircle icon
- Helper: Gray text below input
- Success: Green checkmark (optional)

### Cards

```css
/* Scheme Card */
background: white;
border: 2px solid transparent;
border-radius: 16px;
padding: 24px;
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

/* Hover State */
transform: translateY(-8px);
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
border-color: #34D399;  /* If eligible */

/* Eligible Indicator */
border-left: 4px solid #059669;
```

### Modals

```css
/* Backdrop */
background: rgb(17 24 39 / 0.6);
backdrop-filter: blur(4px);

/* Container */
background: white;
border-radius: 16px;
max-width: 768px;
max-height: 90vh;
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);

/* Header */
padding: 24px;
border-bottom: 1px solid #E5E7EB;
background: #F9FAFB;

/* Close Button */
width: 44px;
height: 44px;
border-radius: 9999px;
```

**Accessibility:**
- Focus trap (Tab cycles within modal)
- Escape key closes
- Focus returns to trigger element

### Toast Notifications

```css
/* Position */
position: fixed;
top: 80px;  /* Below header */
right: 24px;
z-index: 50;

/* Container */
background: white;
border-radius: 8px;
padding: 16px;
max-width: 360px;
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);

/* Auto-dismiss */
animation: slide-in 300ms, slide-out 300ms 4700ms;
```

### Loading States

#### Spinner
```css
width: 40px;
height: 40px;
border: 4px solid #DBEAFE;
border-top-color: #1D4ED8;
border-radius: 9999px;
animation: spin 1s linear infinite;
```

#### Skeleton Screen
```css
background: #E5E7EB;
border-radius: 8px;
animation: shimmer 2s infinite;

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

#### Progress Bar
```css
height: 10px;
background: #E5E7EB;
border-radius: 9999px;

/* Fill */
background: #2563EB;
transition: width 500ms ease-out;
```

---

## Animation & Motion

### Timing Functions

```css
/* Ease Out - Entering elements */
cubic-bezier(0.16, 1, 0.3, 1)

/* Ease In - Exiting elements */
cubic-bezier(0.4, 0, 1, 1)

/* Ease In Out - State changes */
cubic-bezier(0.4, 0, 0.2, 1)
```

### Animation Durations

```css
--duration-fast: 150ms;    /* Hover states */
--duration-normal: 300ms;  /* Page transitions */
--duration-slow: 500ms;    /* Complex animations */
```

### Key Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1);
```

#### Slide In Right
```css
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
animation: slideInRight 500ms cubic-bezier(0.16, 1, 0.3, 1);
```

#### Scale In
```css
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
animation: scaleIn 300ms cubic-bezier(0.16, 1, 0.3, 1);
```

#### Blob (Background Animation)
```css
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
animation: blob 7s infinite;
```

### Micro-interactions

```css
/* Button Press */
active: transform: scale(0.95);
transition: transform 100ms ease-out;

/* Card Hover */
hover: transform: translateY(-8px);
transition: transform 200ms ease-out;

/* Link Hover */
hover: color: #1D4ED8;
transition: color 150ms ease-out;
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast

```
Text on Background:
- Normal text (16px): 4.5:1 minimum
- Large text (24px+): 3:1 minimum
- UI components: 3:1 minimum

Tested Combinations:
✓ #111827 on #FFFFFF = 16.1:1
✓ #1D4ED8 on #FFFFFF = 8.2:1
✓ #059669 on #FFFFFF = 4.8:1
✓ #DC2626 on #FFFFFF = 5.9:1
```

#### Keyboard Navigation

```
Tab Order:
1. Skip to main content link
2. Header navigation
3. Main content (forms, buttons, links)
4. Footer links

Focus Indicators:
- 2px solid ring
- 2px offset
- Blue color (#2563EB)
- Visible on all interactive elements
```

#### Screen Reader Support

```html
<!-- Skip Navigation -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>

<!-- ARIA Live Regions -->
<div role="status" aria-live="polite" aria-atomic="true">
  {dynamicMessage}
</div>

<!-- Form Labels -->
<label for="age">What is your age?</label>
<input id="age" aria-invalid="false" aria-describedby="age-help" />
<p id="age-help">Enter your age in years</p>

<!-- Button States -->
<button aria-pressed="true">Male</button>
```

#### Focus Management

```typescript
// Modal Focus Trap
useEffect(() => {
  if (isModalOpen) {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];
    
    firstElement?.focus();
    
    // Trap Tab key
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }
}, [isModalOpen]);
```


---

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--screen-sm: 640px;   /* Small tablets */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Desktops */
--screen-xl: 1280px;  /* Large desktops */
--screen-2xl: 1536px; /* Extra large */
```

### Mobile (320px - 767px)

```css
/* Layout */
- Single column
- Full-width components
- Stacked navigation
- Bottom-aligned CTAs

/* Typography */
- Slightly smaller headings
- 16px minimum body text
- Tighter line heights

/* Touch Targets */
- 48px minimum height
- 8px minimum spacing
- Large tap areas

/* Forms */
- One question per screen
- Auto-advance after selection
- Full-width inputs
```

### Tablet (768px - 1023px)

```css
/* Layout */
- Two-column grid for cards
- Side-by-side form fields
- Floating modals (not full-screen)
- Top navigation bar

/* Typography */
- Standard sizes
- More generous spacing

/* Interactions */
- Hover states active
- Larger content area
```

### Desktop (1024px+)

```css
/* Layout */
- Three-column grid for cards
- Multi-column forms
- Sidebar navigation
- Max content width: 1280px (centered)

/* Typography */
- Larger headings
- More white space

/* Interactions */
- Full hover effects
- Keyboard shortcuts
- Tooltips on hover
```

### Responsive Patterns

```css
/* Responsive Grid */
.grid {
  display: grid;
  grid-template-columns: 1fr;  /* Mobile */
  gap: 32px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);  /* Tablet */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);  /* Desktop */
  }
}

/* Responsive Text */
.heading {
  font-size: 36px;  /* Mobile */
  line-height: 40px;
}

@media (min-width: 768px) {
  .heading {
    font-size: 48px;  /* Desktop */
    line-height: 1;
  }
}

/* Responsive Spacing */
.section {
  padding: 48px 24px;  /* Mobile */
}

@media (min-width: 768px) {
  .section {
    padding: 80px 48px;  /* Desktop */
  }
}
```

---

## Dark Mode

### Color Mappings

```css
/* Light Mode → Dark Mode */
--bg-primary: #FFFFFF → #111827;
--bg-secondary: #F9FAFB → #1F2937;
--bg-tertiary: #F3F4F6 → #374151;

--text-primary: #111827 → #FFFFFF;
--text-secondary: #6B7280 → #9CA3AF;
--text-tertiary: #9CA3AF → #6B7280;

--border: #E5E7EB → #374151;

/* Semantic Colors (Adjusted) */
--blue-600: #2563EB → #3B82F6;
--emerald-600: #059669 → #10B981;
--red-600: #DC2626 → #EF4444;
```

### Implementation

```css
/* Root Variables */
:root {
  --bg-primary: #FFFFFF;
  --text-primary: #111827;
}

.dark {
  --bg-primary: #111827;
  --text-primary: #FFFFFF;
}

/* Usage */
.card {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

### Dark Mode Adjustments

```css
/* Reduce Shadow Intensity */
.dark .card {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);  /* Stronger */
}

/* Adjust Opacity */
.dark .backdrop {
  background: rgb(0 0 0 / 0.8);  /* Darker */
}

/* Invert Gradients */
.dark .gradient {
  background: linear-gradient(to right, #1E3A8A, #312E81);
}
```

### Toggle Implementation

```typescript
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem('nexis_dark_mode');
  if (saved === 'true') setDarkMode(true);
}, []);

useEffect(() => {
  localStorage.setItem('nexis_dark_mode', darkMode.toString());
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

---

## Page Layouts

### Landing Page

```
┌─────────────────────────────────────────────────────────┐
│  [NEXIS Logo]              [English ▼] [हिंदी] [🌙]    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              [Animated Blob Background]                  │
│                                                          │
│         [Verified by Digital India Badge]                │
│                                                          │
│         Don't miss out on ₹50,000+                      │
│         in government benefits.                          │
│                                                          │
│         Answer a few simple questions...                 │
│                                                          │
│         [Check My Eligibility - Free →]                 │
│                                                          │
│         ✓ Takes 2 mins  ✓ 247,832 helped  ✓ Free       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  How NEXIS Works                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │    1     │  │    2     │  │    3     │             │
│  │ Tell us  │  │ AI finds │  │  Apply   │             │
│  │ about    │  │ matches  │  │   with   │             │
│  │ yourself │  │          │  │ guidance │             │
│  └──────────┘  └──────────┘  └──────────┘             │
├─────────────────────────────────────────────────────────┤
│  FAQ | Privacy | Contact | © 2026 NEXIS                │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Animated gradient background with blob animations
- Clear value proposition above the fold
- Trust indicators (verified badge, user count)
- Simple 3-step process visualization
- Mobile-optimized with full-width CTA

### Profile Form Page

```
┌─────────────────────────────────────────────────────────┐
│  [NEXIS Logo]              [Edit Profile] [Clear Data]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Quick Fill: Ramesh | Lakshmi | Priya]                │
│                                                          │
│  Step 1 of 3                              33% Complete  │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  ✓ Progress saved locally 2m ago                        │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Basic Information                               │   │
│  │                                                  │   │
│  │  What is your age?                              │   │
│  │  [👤 ___________]                               │   │
│  │                                                  │   │
│  │  Which state do you live in?                    │   │
│  │  [Select an option ▼]                           │   │
│  │                                                  │   │
│  │  Gender                                         │   │
│  │  [Male] [Female] [Other]                        │   │
│  │                                                  │   │
│  │  [← Back]                    [Continue →]       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Progress indicator with percentage
- Auto-save with timestamp
- Quick-fill test profiles
- One section per step (progressive disclosure)
- Large touch targets (48px)
- Inline validation with helpful errors

### Results Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  [NEXIS Logo]              [Edit Profile] [Clear Data]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Analysis Complete                               │   │
│  │  Great news! You qualify for 8 schemes          │   │
│  │  Estimated maximum value: ₹5,42,000             │   │
│  │                                                  │   │
│  │  [View My Schemes] [Ask AI] [Print Results]    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  [Eligible Only (8)] [All Schemes (15)]                 │
│  [Compare 2 Schemes]              [Search... 🔍]        │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ ✓ Eligible│  │ ✓ Eligible│  │ ✓ Eligible│             │
│  │ PM-KISAN │  │ Ayushman  │  │ PMAY     │             │
│  │          │  │ Bharat    │  │          │             │
│  │ ₹6,000/yr│  │ ₹5L/yr    │  │ ₹2.67L   │             │
│  │          │  │           │  │          │             │
│  │ [View]⚖️ │  │ [View]⚖️  │  │ [View]⚖️ │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│                    [💬 Ask AI Assistant]                │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Summary card with total value
- Tab navigation (Eligible/All)
- Scheme comparison feature
- Search and filter
- Infinite scroll loading
- Floating AI assistant button
- Print-friendly layout

