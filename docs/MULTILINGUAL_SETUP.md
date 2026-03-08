# NEXIS Multilingual Support

## Overview

NEXIS now supports 12 Indian languages, providing a truly inclusive experience for citizens across India.

## Supported Languages

1. **English** (en) - English
2. **Hindi** (hi) - हिंदी
3. **Bengali** (bn) - বাংলা
4. **Telugu** (te) - తెలుగు
5. **Marathi** (mr) - मराठी
6. **Tamil** (ta) - தமிழ்
7. **Gujarati** (gu) - ગુજરાતી
8. **Kannada** (kn) - ಕನ್ನಡ
9. **Malayalam** (ml) - മലയാളം
10. **Punjabi** (pa) - ਪੰਜਾਬੀ
11. **Odia** (or) - ଓଡ଼ିଆ
12. **Assamese** (as) - অসমীয়া

## User Flow

### 1. Language Selection Screen (First Visit)

When users first visit NEXIS, they see a beautiful language selection screen:

- Grid layout with all 12 languages
- Each language shows:
  - Flag emoji
  - Native script name
  - English name
- Hover effects and animations
- Fully accessible with keyboard navigation

### 2. Language Persistence

- Selected language is saved in localStorage
- On subsequent visits, users go directly to the landing page
- Language preference persists across sessions

### 3. Language Switching

- Users can change language anytime from the dropdown in the header
- All content updates immediately
- No page reload required

## Technical Implementation

### Files Created/Modified

1. **frontend/src/pages/LanguageSelectionPage.tsx**
   - New dedicated language selection screen
   - 12 language options with native scripts
   - Beautiful gradient background
   - Responsive grid layout

2. **frontend/src/locales/translations.ts**
   - Complete translation system
   - All 12 languages fully translated
   - Covers all pages: landing, profile, results, chat
   - Type-safe with TypeScript interfaces

3. **frontend/src/services/storage.ts**
   - Updated to support all language codes
   - Changed from `'en' | 'hi'` to `string` type
   - Maintains backward compatibility

4. **frontend/src/App.tsx**
   - Added routing logic
   - First visit → Language selection
   - Has language → Landing page
   - Uses Navigate for automatic redirection

5. **frontend/src/pages/LandingPage.tsx**
   - Updated to use translation system
   - Language dropdown in header
   - Shows 6 most common languages in dropdown
   - Dynamic content based on selected language

## Translation Coverage

All sections are fully translated:

### Landing Page
- Hero title and subtitle
- Call-to-action button
- Feature highlights
- "How it works" section
- Step-by-step descriptions

### Profile Form
- Page title and subtitle
- All form field labels:
  - Age
  - State
  - Occupation
  - Annual Income
  - Gender
  - Social Category
  - Disability status
- Submit button

### Results Page
- Page title
- Eligible/Ineligible labels
- Action buttons (View Details, Apply Now)

### Chat Page
- Page title
- Input placeholder
- Send button

### Common Elements
- Loading states
- Error messages
- Navigation (Back, Next)
- Yes/No options

## Usage Example

```typescript
import { getTranslation } from '../locales/translations';
import { getLanguage } from '../services/storage';

function MyComponent() {
  const language = getLanguage();
  const t = getTranslation(language);
  
  return (
    <div>
      <h1>{t.landing.title}</h1>
      <p>{t.landing.subtitle}</p>
      <button>{t.landing.cta}</button>
    </div>
  );
}
```

## Adding New Translations

To add a new language:

1. Add language code to `TranslationKey` type
2. Add language object to `translations` record
3. Translate all required fields
4. Add language to `LanguageSelectionPage` languages array
5. Optionally add to `LandingPage` languageOptions for header dropdown

## Accessibility Features

- All language buttons have proper ARIA labels
- Keyboard navigation fully supported
- Focus indicators visible
- Screen reader friendly
- Semantic HTML structure

## Testing Locally

1. Start the frontend dev server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open http://localhost:3000

3. You'll see the language selection screen

4. Select any language

5. Navigate through the app - all content will be in your selected language

6. Change language from the dropdown in the header

## Future Enhancements

- Add more regional languages (Urdu, Kashmiri, etc.)
- RTL support for Urdu
- Voice input in regional languages
- Regional scheme highlighting based on language
- Localized date/number formats
- Regional festival greetings

## Notes

- Language preference is stored in localStorage key: `nexis_language`
- Default language is English if no preference is set
- All translations are client-side (no API calls needed)
- Translations are bundled with the app (no external loading)

---

**Built for Digital India** 🇮🇳
