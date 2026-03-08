# NEXIS Design System - Before & After

## Visual Transformation Overview

### Before: Professional/Clean Design
- Soft rounded corners (rounded-lg, rounded-xl)
- Gradient backgrounds
- Soft shadows (shadow-md, shadow-lg)
- Blue color scheme (#3b82f6)
- Standard sans-serif fonts
- Smooth, subtle animations
- Traditional web app aesthetic

### After: Editorial/Brutalist Design
- Sharp edges (no rounded corners)
- Flat backgrounds with cream base
- Geometric hard shadows (4px 4px 0px 0px)
- Emerald accent color (#059669)
- Serif headings (Playfair Display) + Sans body (Inter)
- Snappy, bold animations
- Editorial magazine aesthetic

---

## Component Transformations

### 1. Buttons

#### Before
```tsx
<button className="px-8 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-lg font-bold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
  Button Text
</button>
```

#### After
```tsx
<button className="flex items-center justify-center gap-3 bg-[#059669] text-[#FAF9F6] px-8 py-4 text-base font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] transition-all uppercase tracking-wider border-2 border-transparent">
  Button Text
</button>
```

**Changes:**
- Removed gradient → Flat emerald color
- Removed rounded corners → Sharp edges
- Changed shadow direction → Geometric shadow
- Added uppercase + letter-spacing
- Inverted hover animation (down instead of up)

---

### 2. Cards

#### Before
```tsx
<div className="bg-white rounded-xl shadow-md border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all p-6">
  Content
</div>
```

#### After
```tsx
<div className="bg-[#FAF9F6] border-2 border-stone-300 p-5 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.3)] hover:-translate-y-1 hover:border-[#059669] transition-all">
  Content
</div>
```

**Changes:**
- White → Cream background
- Rounded corners → Sharp edges
- Soft shadow → Geometric shadow
- Blue accent → Emerald accent
- Added lift on hover

---

### 3. Typography

#### Before
```tsx
<h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
  Title Text
</h1>
<p className="text-xl text-gray-600 mb-8">
  Body text
</p>
```

#### After
```tsx
<h1 className="text-5xl md:text-6xl lg:text-[76px] font-serif font-bold text-stone-900 leading-[1.05] tracking-tight">
  Title Text
  <span className="italic font-light text-[#059669]">Accent Text</span>
</h1>
<p className="text-lg md:text-xl text-stone-600 font-medium border-l-2 border-stone-200 pl-4">
  Body text
</p>
```

**Changes:**
- Sans-serif → Serif for headings (Playfair Display)
- Larger sizes (up to 76px)
- Tighter line-height (1.05)
- Added italic accent text
- Border-left accent for body text
- Stone colors instead of gray

---

### 4. Badges

#### Before
```tsx
<div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
  Eligible
</div>
```

#### After
```tsx
<span className="bg-[#059669]/10 text-[#059669] px-3 py-1 font-bold text-xs uppercase tracking-widest border border-[#059669]">
  Eligible
</span>
```

**Changes:**
- Rounded pill → Sharp rectangle
- Added border
- Uppercase + wide tracking
- Bolder font weight

---

### 5. Progress Bar

#### Before
```tsx
<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: '50%' }}></div>
</div>
```

#### After
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

**Changes:**
- Rounded → Sharp edges
- Added border
- Added shadow
- Blue → Emerald
- Animated with Framer Motion

---

### 6. Input Fields

#### Before
```tsx
<input
  type="text"
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter text"
/>
```

#### After
```tsx
<input
  type="text"
  className="w-full bg-transparent border-b-4 border-stone-300 text-4xl md:text-5xl font-serif font-bold text-stone-900 pb-4 outline-none transition-all placeholder:text-stone-300 focus:border-stone-900"
  placeholder="Enter answer