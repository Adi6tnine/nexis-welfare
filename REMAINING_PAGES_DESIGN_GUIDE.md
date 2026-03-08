# Remaining Pages - Editorial Design Application Guide

## Pages Successfully Updated ✅
1. **LandingPage.tsx** - Complete editorial design
2. **ResultsPage.tsx** - Complete editorial design  
3. **UserProfilePage.tsx** - Complete editorial design
4. **SchemeCard.tsx** - Complete editorial design
5. **FloatingNav.tsx** - Complete editorial design

## Pages Needing Design Update

### Quick Reference: Design Changes to Apply

#### 1. Background Colors
```tsx
// OLD
className="bg-white"
className="bg-gray-50"
className="bg-gray-100"

// NEW
className="bg-[#FAF9F6]"
className="bg-stone-100"
className="bg-stone-50"
```

#### 2. Borders & Shadows
```tsx
// OLD
className="rounded-xl shadow-md border border-gray-200"

// NEW
className="border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)]"
```

#### 3. Buttons
```tsx
// OLD
<button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700">

// NEW
<button className="px-6 py-3 bg-[#059669] text-[#FAF9F6] border-2 border-transparent font-bold uppercase tracking-wider hover:bg-[#047857] shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] transition-all text-sm">
```

#### 4. Typography
```tsx
// OLD
<h1 className="text-3xl font-bold text-gray-900">

// NEW
<h1 className="text-3xl font-serif font-bold text-stone-900">

// OLD
<p className="text-gray-600">

// NEW
<p className="text-stone-600 font-medium">

// OLD
<span className="text-sm text-gray-500">

// NEW
<span className="text-xs font-bold uppercase tracking-widest text-stone-500">
```

#### 5. Input Fields
```tsx
// OLD
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">

// NEW
<input className="w-full px-4 py-2 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors">
```

#### 6. Progress Bars
```tsx
// OLD
<div className="w-full bg-gray-200 rounded-full h-4">
  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '50%' }}></div>
</div>

// NEW
<div className="w-full bg-[#FAF9F6] h-3 border-2 border-stone-900 overflow-hidden shadow-[2px_2px_0px_0px_rgba(28,25,23,0.1)]">
  <motion.div className="bg-[#059669] h-full" animate={{ width: "50%" }} />
</div>
```

#### 7. Badges/Tags
```tsx
// OLD
<span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">

// NEW
<span className="px-3 py-1 bg-[#059669]/10 text-[#059669] border border-[#059669] text-xs font-bold uppercase tracking-wider">
```

## Specific Page Updates

### 1. AdaptiveQuestionnairePage.tsx

**Keep ALL Logic:**
- Question bank integration
- Adaptive question flow
- Answer validation
- Progress calculation
- Navigation between questions

**Apply Design Changes:**
```tsx
// Header
<header className="bg-[#FAF9F6] border-b-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] sticky top-0 z-40">

// Question Card
<div className="bg-[#FAF9F6] border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] p-8 md:p-12">

// Question Number
<div className="w-12 h-12 bg-stone-100 text-stone-900 flex items-center justify-center font-serif font-bold text-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
  {questionNumber}
</div>

// Question Title
<h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight leading-tight">
  {question.text}
</h2>

// Input Field (for text/number)
<input className="w-full bg-transparent border-b-4 border-stone-300 text-4xl md:text-5xl font-serif font-bold text-stone-900 pb-4 outline-none transition-all placeholder:text-stone-300 focus:border-stone-900" />

// Next Button
<button className="px-10 py-4 font-bold text-sm uppercase tracking-widest bg-stone-900 text-[#FAF9F6] border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(5,150,105,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(5,150,105,1)] transition-all">
  Next Step
</button>
```

### 2. EnhancedResultsPage.tsx

**Keep ALL Logic:**
- Scheme filtering
- Match score calculation
- Scheme detail modal
- Application guidance
- AI explanation

**Apply Design Changes:**
```tsx
// Stats Cards
<div className="bg-[#059669] text-white p-6 md:p-8 border-2 border-stone-900 shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]">
  <div className="text-6xl font-serif font-bold mb-4">{count}</div>
  <div className="font-bold uppercase tracking-widest text-sm">{label}</div>
</div>

// Filter Tabs
<button className={`px-8 py-4 font-bold uppercase tracking-widest text-sm ${
  active ? 'border-b-4 border-stone-900 text-stone-900' : 'text-stone-500 hover:text-stone-900'
}`}>

// Scheme Cards - Use SchemeCard component (already updated)
<SchemeCard scheme={scheme} onViewDetails={handleView} onApply={handleApply} />
```

### 3. VoiceOnboardingPage.tsx

**Keep ALL Logic:**
- Voice recording
- Speech-to-text
- Audio playback
- Voice command handling

**Apply Design Changes:**
```tsx
// Voice Button (Recording)
<button className="w-32 h-32 bg-[#059669] text-white border-4 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] transition-all flex items-center justify-center">
  <Mic size={48} strokeWidth={2.5} />
</button>

// Waveform Container
<div className="bg-[#FAF9F6] border-2 border-stone-300 p-6 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)]">
  {/* Waveform visualization */}
</div>

// Transcript Display
<div className="bg-stone-100 border-2 border-stone-300 p-6">
  <p className="text-stone-900 font-medium text-lg leading-relaxed">
    {transcript}
  </p>
</div>
```

### 4. ChatPage.tsx

**Keep ALL Logic:**
- Message history
- AI responses
- Message sending
- Typing indicators

**Apply Design Changes:**
```tsx
// Chat Container
<div className="bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] h-full flex flex-col">

// User Message
<div className="bg-[#059669] text-white p-4 border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] max-w-md ml-auto">
  <p className="font-medium">{message}</p>
</div>

// AI Message
<div className="bg-stone-100 text-stone-900 p-4 border-2 border-stone-300 max-w-md mr-auto">
  <p className="font-medium">{message}</p>
</div>

// Input Field
<input className="flex-1 px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none" />

// Send Button
<button className="px-6 py-3 bg-[#059669] text-white border-2 border-transparent font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)]">
  Send
</button>
```

### 5. GuidedApplicationPage.tsx

**Keep ALL Logic:**
- Step-by-step guidance
- Document checklist
- Form validation
- Application submission

**Apply Design Changes:**
```tsx
// Stepper
<div className="flex items-center gap-4">
  {steps.map((step, i) => (
    <div key={i} className="flex items-center gap-2">
      <div className={`w-10 h-10 border-2 border-stone-900 flex items-center justify-center font-serif font-bold text-lg ${
        i <= currentStep ? 'bg-[#059669] text-white shadow-[3px_3px_0px_0px_rgba(28,25,23,1)]' : 'bg-[#FAF9F6] text-stone-900'
      }`}>
        {i + 1}
      </div>
      {i < steps.length - 1 && <div className="w-12 h-[2px] bg-stone-300" />}
    </div>
  ))}
</div>

// Document Checklist
<div className="space-y-3">
  {documents.map(doc => (
    <div className={`flex items-center justify-between p-4 border-2 font-bold text-sm cursor-pointer transition-all uppercase tracking-wider ${
      doc.checked ? 'bg-[#ECFDF5] border-[#059669] text-[#059669] shadow-[2px_2px_0px_0px_rgba(5,150,105,1)]' : 'bg-[#FAF9F6] border-stone-300 text-stone-600'
    }`}>
      <span>{doc.name}</span>
      {doc.checked && <Check size={18} strokeWidth={3} />}
    </div>
  ))}
</div>
```

### 6. LanguageSelectionPage.tsx

**Keep ALL Logic:**
- Language selection
- Storage saving
- Navigation

**Apply Design Changes:**
```tsx
// Language Card
<button className="bg-[#FAF9F6] border-2 border-stone-300 p-8 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.3)] hover:-translate-y-1 hover:border-[#059669] transition-all text-center">
  <div className="text-4xl font-serif font-bold text-stone-900 mb-2">
    {language.nativeName}
  </div>
  <div className="text-sm font-bold uppercase tracking-widest text-stone-500">
    {language.name}
  </div>
</button>
```

### 7. SimpleProfilePage.tsx

**Keep ALL Logic:**
- Simple form submission
- Validation
- API integration

**Apply Design Changes:**
- Same as UserProfilePage but simpler
- Use editorial input fields
- Use editorial buttons
- Use editorial cards

## Color Reference

```css
/* Backgrounds */
--cream: #FAF9F6
--stone-100: #f5f5f4
--stone-900: #1c1917

/* Primary */
--emerald-600: #059669
--emerald-700: #047857

/* Text */
--stone-900: #1c1917 (primary)
--stone-600: #57534e (secondary)
--stone-500: #78716c (tertiary)

/* Borders */
--stone-300: #d6d3d1 (light)
--stone-900: #1c1917 (strong)

/* Status */
--emerald-600: #059669 (success)
--amber-600: #d97706 (warning)
--purple-700: #7c3aed (info)
--red-600: #dc2626 (error)
```

## Shadow Reference

```css
/* Small */
shadow-[2px_2px_0px_0px_rgba(28,25,23,0.1)]

/* Medium */
shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)]
shadow-[4px_4px_0px_0px_rgba(231,229,228,1)]

/* Large */
shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]

/* Extra Large */
shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]

/* Accent (Emerald) */
shadow-[4px_4px_0px_0px_rgba(5,150,105,1)]
```

## Testing Checklist

After applying design to each page:
- [ ] Page loads without errors
- [ ] All buttons work
- [ ] All forms submit correctly
- [ ] All navigation works
- [ ] Responsive on mobile
- [ ] Accessibility maintained
- [ ] API calls still work
- [ ] Data displays correctly

## Important Reminders

1. **DO NOT** change any function logic
2. **DO NOT** change any API calls
3. **DO NOT** change any state management
4. **DO NOT** change any data structures
5. **DO NOT** change any routing
6. **ONLY** change visual styling (colors, borders, shadows, fonts)

## Quick Find & Replace

Use these patterns to quickly update styling:

```bash
# Backgrounds
bg-white → bg-[#FAF9F6]
bg-gray-50 → bg-stone-100
bg-gray-100 → bg-stone-100

# Text Colors
text-gray-900 → text-stone-900
text-gray-600 → text-stone-600
text-gray-500 → text-stone-500

# Borders
border border-gray-200 → border-2 border-stone-300
border border-gray-300 → border-2 border-stone-300

# Remove Rounded Corners
rounded-xl → (remove)
rounded-lg → (remove)
rounded-full → (remove, except for circles)

# Shadows
shadow-md → shadow-[4px_4px_0px_0px_rgba(231,229,228,1)]
shadow-lg → shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]

# Colors
emerald-600 → [#059669]
emerald-700 → [#047857]
blue-600 → [#059669]
```

## Summary

All pages need ONLY visual design updates. The editorial/brutalist design system is fully created and ready to use. Simply apply the styling patterns above while keeping ALL existing functionality intact.
