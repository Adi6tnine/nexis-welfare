# Editorial Design System Migration Guide

## Overview
This guide documents the migration from the professional/clean design to the new editorial/brutalist design system inspired by bold typography, strong borders, and geometric shadows.

## Design Philosophy

### Key Characteristics
1. **Editorial Typography**: Serif headings (Playfair Display) + Sans body (Inter)
2. **Brutalist Elements**: Hard borders, geometric shadows, no rounded corners
3. **Bold Shadows**: `4px 4px 0px 0px` style shadows instead of soft shadows
4. **Strong Borders**: 2px solid borders everywhere
5. **Cream Background**: `#FAF9F6` instead of pure white
6. **Emerald Accent**: `#059669` as primary action color
7. **Stone Grays**: Stone color palette for neutrals

## Color Palette

```css
--cream: #FAF9F6;
--stone-900: #1c1917;
--emerald-600: #059669;
--purple-700: #7c3aed;
--blue-900: #1e3a8a;
```

## Typography Scale

### Headings
- **Hero Title**: 48-76px, Playfair Display, Bold
- **Section Title**: 32-48px, Playfair Display, Bold
- **Card Title**: 24-32px, Playfair Display, Bold
- **Subtitle**: Italic, Playfair Display, Light weight

### Body
- **Large Body**: 18-20px, Inter, Medium (500)
- **Body**: 16px, Inter, Medium (500)
- **Small**: 14px, Inter, Medium (500)
- **Label**: 12px, Inter, Bold (700), UPPERCASE, Letter-spacing: 0.1em

## Component Patterns

### Buttons
```tsx
// Primary Button
<button className="flex items-center justify-center gap-3 bg-[#059669] text-[#FAF9F6] px-8 py-4 text-base font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] transition-all w-full sm:w-auto uppercase tracking-wider border-2 border-transparent">
  <Icon size={18} />
  Button Text
</button>

// Secondary Button
<button className="flex items-center justify-center gap-3 bg-[#FAF9F6] text-stone-900 border-2 border-stone-900 px-8 py-4 text-base font-bold hover:bg-stone-100 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all uppercase tracking-wider">
  Button Text
  <Icon size={18} />
</button>
```

### Cards
```tsx
// Standard Card
<div className="bg-[#FAF9F6] border-2 border-stone-300 p-5 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.3)] hover:-translate-y-1 hover:border-[#059669] transition-all cursor-pointer">
  {/* Content */}
</div>

// Elevated Card
<div className="bg-[#FAF9F6] border-2 border-stone-900 p-8 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
  {/* Content */}
</div>

// Accent Card
<div className="bg-[#059669] text-white p-6 border-2 border-stone-900 shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]">
  {/* Content */}
</div>
```

### Inputs
```tsx
// Large Form Input
<input
  type="number"
  className="w-full bg-transparent border-b-4 border-stone-300 text-4xl md:text-5xl font-serif font-bold text-stone-900 pb-4 outline-none transition-all placeholder:text-stone-300 focus:border-stone-900"
  placeholder="Enter answer"
/>

// Small Input
<input
  type="text"
  className="w-full bg-transparent border-b-2 border-stone-300 text-base font-bold text-stone-900 pb-2 outline-none transition-all placeholder:text-stone-400 focus:border-stone-900"
  placeholder="Enter text"
/>
```

### Badges
```tsx
// Success Badge
<span className="bg-[#059669]/10 text-[#059669] px-3 py-1 font-bold text-xs uppercase tracking-widest border border-[#059669]">
  Eligible
</span>

// Info Badge
<span className="bg-[#7C3AED]/10 text-[#7C3AED] px-3 py-1 font-bold text-xs uppercase tracking-widest border border-[#7C3AED]">
  High Confidence
</span>
```

### Progress Bar
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

### Icons
```tsx
// Icon Box
<div className="w-12 h-12 rounded-none flex items-center justify-center bg-amber-50 border-2 border-amber-200 shadow-[2px_2px_0px_0px_rgba(28,25,23,0.1)]">
  <Icon size={22} className="text-stone-800" strokeWidth={1.5} />
</div>

// Numbered Step
<div className="w-10 h-10 border-2 border-stone-900 bg-[#FAF9F6] text-stone-900 flex items-center justify-center font-serif font-bold text-lg shadow-[3px_3px_0px_0px_rgba(5,150,105,1)]">
  1
</div>
```

### Toast/Notification
```tsx
<motion.div 
  className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-stone-900 text-[#FAF9F6] px-6 py-4 border-2 border-[#059669] shadow-[6px_6px_0px_0px_rgba(5,150,105,1)] flex items-center gap-3 font-bold text-sm tracking-wider uppercase w-max max-w-[90vw]"
>
  <Info size={18} className="text-[#059669] shrink-0" />
  <span className="truncate">{message}</span>
</motion.div>
```

## Layout Patterns

### Header
```tsx
<header className="w-full py-5 px-6 md:px-12 flex items-center justify-between bg-[#FAF9F6] border-b border-stone-200 sticky top-0 z-40">
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-[#059669] flex items-center justify-center rounded-br-lg rounded-tl-lg shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
      <span className="text-white font-serif font-bold text-lg tracking-tighter">N</span>
    </div>
    <span className="text-lg font-bold tracking-widest uppercase text-stone-900">Nexis</span>
  </div>
  {/* Language Toggle */}
</header>
```

### Hero Section
```tsx
<section className="px-6 md:px-12 pt-24 pb-16 w-full flex flex-col items-center text-center relative overflow-hidden">
  {/* Decorative Circle */}
  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-3xl max-h-3xl border-[1px] border-stone-200 rounded-full opacity-40 -z-10 pointer-events-none" />
  
  {/* Tag */}
  <div className="flex items-center gap-3 mb-6">
    <div className="w-8 h-[1px] bg-[#059669]"></div>
    <span className="text-[#059669] font-medium tracking-widest uppercase text-xs">AI-Powered Platform</span>
    <div className="w-8 h-[1px] bg-[#059669]"></div>
  </div>
  
  {/* Title */}
  <h1 className="text-5xl md:text-6xl lg:text-[76px] font-serif font-bold text-stone-900 leading-[1.05] tracking-tight max-w-5xl">
    Discover Government
    <br />
    <span className="italic font-light text-[#059669]">Schemes You Qualify For</span>
  </h1>
  
  {/* Description */}
  <p className="mt-8 text-lg md:text-xl text-stone-600 font-medium max-w-2xl border-l-2 border-stone-200 pl-4">
    Description text
  </p>
</section>
```

### Stats Display
```tsx
<div className="flex items-center justify-center gap-12 md:gap-32 border-y border-stone-200 py-8 w-full max-w-4xl">
  <div className="flex flex-col items-center">
    <span className="text-4xl md:text-5xl font-serif font-bold text-stone-900">921+</span>
    <span className="text-xs md:text-sm text-stone-500 font-bold uppercase tracking-widest mt-2">Schemes</span>
  </div>
  <div className="hidden md:block w-px h-12 bg-stone-300"></div>
  <div className="flex flex-col items-center">
    <span className="text-4xl md:text-5xl font-serif font-bold text-[#059669]">95%</span>
    <span className="text-xs md:text-sm text-stone-500 font-bold uppercase tracking-widest mt-2">Accuracy</span>
  </div>
</div>
```

## Animation Patterns

### Framer Motion Variants
```tsx
const transition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

const fadeUpVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition }
};

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 }
};
```

## Migration Checklist

### For Each Page:
- [ ] Update background from white to `#FAF9F6`
- [ ] Replace rounded corners with sharp edges
- [ ] Update shadows from soft to geometric (4px 4px 0px 0px)
- [ ] Change borders to 2px solid
- [ ] Update primary color to emerald-600 (#059669)
- [ ] Replace heading fonts with Playfair Display
- [ ] Update button styles to brutalist pattern
- [ ] Add uppercase + letter-spacing to labels
- [ ] Update card styles with hard shadows
- [ ] Replace smooth animations with snappier ones

### Typography Updates:
- [ ] Hero titles: font-serif, 48-76px, bold
- [ ] Section titles: font-serif, 32-48px, bold
- [ ] Body text: Inter, 16-20px, medium (500)
- [ ] Labels: Inter, 12px, bold (700), uppercase, tracking-widest

### Component Updates:
- [ ] Buttons: Add geometric shadows, uppercase text
- [ ] Cards: Hard borders, geometric shadows
- [ ] Inputs: Border-bottom style, large serif font
- [ ] Badges: Border + background, uppercase
- [ ] Progress bars: Hard borders, no rounded corners
- [ ] Icons: Square containers with borders

## Files to Update

### Core Files:
1. `frontend/src/index.css` - Import new design system
2. `frontend/src/locales/translations.ts` - Extended translations
3. `frontend/src/styles/editorial-design-system.css` - New design system (✓ Created)

### Pages:
1. `frontend/src/pages/LandingPage.tsx`
2. `frontend/src/pages/ResultsPage.tsx`
3. `frontend/src/pages/EnhancedResultsPage.tsx`
4. `frontend/src/pages/ProfileFormPage.tsx`
5. `frontend/src/pages/AdaptiveQuestionnairePage.tsx`
6. `frontend/src/pages/GuidedApplicationPage.tsx`
7. `frontend/src/pages/DocumentUploadPage.tsx`

### Components:
1. `frontend/src/components/SchemeCard.tsx`
2. `frontend/src/components/SchemeDetailModal.tsx`
3. `frontend/src/components/AIExplanation.tsx`
4. `frontend/src/components/FloatingNav.tsx`
5. `frontend/src/components/FormField.tsx`
6. `frontend/src/components/ApplicationStepper.tsx`

## Testing Checklist
- [ ] All pages render correctly
- [ ] Responsive design works on mobile
- [ ] Language switching works
- [ ] Animations are smooth
- [ ] Hover states work correctly
- [ ] Focus states are visible
- [ ] Colors have sufficient contrast
- [ ] Typography is readable

## Notes
- Keep the design consistent across all pages
- Maintain accessibility standards
- Test on multiple screen sizes
- Ensure all interactive elements have proper hover/focus states
