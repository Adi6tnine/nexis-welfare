# NEXIS Frontend - Complete Overview

## 🎨 Design System

### Color Palette
**Primary Theme: Emerald Green**
- **Emerald-500**: `#10b981` - Primary buttons, active states
- **Emerald-600**: `#059669` - Hover states, gradients
- **Emerald-700**: `#047857` - Dark accents, shadows
- **Emerald-50**: `#ecfdf5` - Light backgrounds, highlights
- **Emerald-100**: `#d1fae5` - Borders, subtle backgrounds

**Supporting Colors**
- **White**: `#ffffff` - Cards, backgrounds
- **Gray-50**: `#f9fafb` - Page backgrounds
- **Gray-900**: `#111827` - Primary text
- **Gray-600**: `#4b5563` - Secondary text
- **Gray-400**: `#9ca3af` - Disabled states, placeholders
- **Blue-500**: `#3b82f6` - Information, links
- **Red-500**: `#ef4444` - Errors, warnings
- **Yellow-500**: `#eab308` - Alerts, pending states
- **Green-500**: `#22c55e` - Success states

### Typography
**Font Family**: Inter (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)

**Font Sizes**
- **Heading 1**: 2.5rem (40px) - Page titles
- **Heading 2**: 2rem (32px) - Section headers
- **Heading 3**: 1.5rem (24px) - Card titles
- **Body Large**: 1.125rem (18px) - Important text
- **Body**: 1rem (16px) - Default text
- **Body Small**: 0.875rem (14px) - Captions, labels
- **Caption**: 0.75rem (12px) - Metadata, timestamps

**Font Weights**
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Headings, buttons
- **Bold**: 700 - Strong emphasis

### Spacing System
Based on 4px grid (Tailwind default):
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### Border Radius
- **sm**: 0.25rem (4px) - Small elements
- **md**: 0.5rem (8px) - Cards, buttons
- **lg**: 1rem (16px) - Large cards
- **full**: 9999px - Pills, avatars

### Shadows
- **sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)` - Subtle elevation
- **md**: `0 4px 6px -1px rgb(0 0 0 / 0.1)` - Cards
- **lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1)` - Modals
- **xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1)` - Overlays

### Animation
**Transitions**: 150ms ease-in-out (default)
**Hover Effects**: Scale 1.02, brightness 1.05
**Loading States**: Pulse animation, skeleton screens

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite 5.0
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3.3
- **Animations**: Framer Motion 12.35
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **i18n**: react-i18next
- **Testing**: Jest + React Testing Library

### Project Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route-level page components
│   ├── services/           # API and storage services
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript definitions
│   ├── locales/            # i18n translations
│   ├── styles/             # Global styles
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html              # HTML template
└── vite.config.ts          # Build configuration
```

---

## 📄 Pages

### 1. LanguageSelectionPage (`/`)
**Purpose**: Initial language selection for the application

**Features**:
- English and Hindi language options
- Large, accessible buttons with flag icons
- Stores language preference in localStorage
- Redirects to landing page after selection

**Key Components**: Language selector cards

---

### 2. ProfessionalLandingPage (`/landing`)
**Purpose**: Main entry point showcasing NEXIS features

**Features**:
- Hero section with gradient background
- Feature cards (AI-powered, multilingual, voice-assisted)
- Multiple onboarding pathways:
  - Traditional form-based profile
  - Adaptive questionnaire
  - Voice-assisted onboarding
  - Document scanning (OCR)
- Statistics showcase
- Call-to-action buttons

**Key Components**: Hero, FeatureCards, CTAButtons

---

### 3. UserProfilePage (`/profile`)
**Purpose**: Comprehensive profile creation form

**Features**:
- Multi-section form (personal, family, financial, location)
- Real-time validation
- Progress indicator
- Demo profile quick-fill buttons
- Save to localStorage
- Navigate to results after submission

**Key Components**: FormField, DemoProfileButtons

**Form Sections**:
- Personal Information (name, age, gender, marital status)
- Family Details (dependents, household size)
- Financial Information (income, employment status)
- Location (state, district, pincode)

---

### 4. SimpleProfilePage (`/simple-profile`)
**Purpose**: Simplified profile creation with minimal fields

**Features**:
- Streamlined 6-field form
- Quick onboarding for users who want fast results
- Essential information only
- Mobile-optimized layout

**Fields**: Name, Age, Gender, State, District, Monthly Income

---

### 5. AdaptiveQuestionnairePage (`/adaptive-profile`)
**Purpose**: Intelligent questionnaire that adapts based on user responses

**Features**:
- Dynamic question flow
- Conditional logic based on previous answers
- Progress tracking
- Skip logic for irrelevant questions
- Conversational UI
- Back/forward navigation

**Question Categories**:
- Demographics
- Family composition
- Employment and income
- Education
- Health conditions
- Location

---

### 6. VoiceOnboardingPage (`/voice-onboarding`)
**Purpose**: Voice-based profile creation for low-literacy users

**Features**:
- Voice recording interface
- Real-time transcription
- Audio playback
- Conversation history display
- AI-powered information extraction
- Fallback to text input
- Accessibility-focused design

**Key Components**: VoiceRecorder, ConversationHistory

**Workflow**:
1. User speaks their information
2. Audio sent to backend for transcription
3. AI extracts structured data
4. User confirms or corrects information
5. Profile saved and eligibility checked

---

### 7. DocumentUploadPage (`/document-upload`)
**Purpose**: OCR-based profile creation from documents

**Features**:
- Drag-and-drop file upload
- Image preview
- Document scanning with OCR
- Automatic data extraction
- Manual correction interface
- Supported documents: Aadhaar, PAN, Ration Card

**Key Components**: DocumentScanner

---

### 8. EnhancedResultsPage (`/results` or `/enhanced-results`)
**Purpose**: Display eligibility results with AI explanations

**Features**:
- Scheme cards with eligibility status
- Color-coded badges (Eligible, Not Eligible, Partially Eligible)
- AI-powered explanations for each result
- Scheme details modal
- Application guidance
- Filtering and sorting
- Timeline visualization for application deadlines
- Notification bell for scheme alerts
- Export results as PDF

**Key Components**: SchemeCard, AIExplanation, SchemeDetailModal, TimelineVisualization, NotificationBell

**Scheme Information**:
- Scheme name and description
- Eligibility criteria
- Benefits and coverage
- Application process
- Required documents
- Deadlines
- Contact information

---

### 9. GuidedApplicationPage (`/guided-application/:schemeId`)
**Purpose**: Step-by-step application assistance for specific schemes

**Features**:
- Multi-step application wizard
- Progress stepper
- Document checklist
- Form pre-filling from profile
- Validation at each step
- Save draft functionality
- AI assistance for complex questions
- Submit to government portal

**Key Components**: ApplicationStepper, FormField, DocumentScanner

**Steps**:
1. Review eligibility
2. Gather required documents
3. Fill application form
4. Review and confirm
5. Submit application

---

### 10. ChatPage (`/chat`)
**Purpose**: Conversational AI assistant for scheme queries

**Features**:
- Real-time chat interface
- Message history
- Typing indicators
- Context-aware responses
- Scheme recommendations
- Application guidance
- Document requirements
- Multilingual support

**Key Components**: AIChatOverlay (reused)

---

### 11. CSCOperatorDashboard (`/csc-dashboard`)
**Purpose**: Dashboard for Common Service Center operators

**Features**:
- Bulk profile creation
- Assisted application submission
- User management
- Analytics and reporting
- Scheme database management
- Operator authentication

**Access**: Restricted to authenticated CSC operators

---

## 🧩 Components

### Core Components

#### 1. FloatingNav
**Purpose**: Persistent navigation across all pages

**Features**:
- Fixed position at bottom of screen
- Quick access to key features
- Home, Profile, Results, Chat buttons
- Active state highlighting
- Smooth transitions

---

#### 2. AIChatOverlay
**Purpose**: Overlay chat interface accessible from anywhere

**Features**:
- Slide-in animation from right
- Full-height chat interface
- Message history
- Real-time responses
- Close button
- Backdrop blur

---

#### 3. SchemeCard
**Purpose**: Display individual scheme information

**Features**:
- Scheme name and description
- Eligibility badge (color-coded)
- Benefits summary
- Application deadline
- "Learn More" button
- Hover effects
- Responsive layout

**Props**:
```typescript
interface SchemeCardProps {
  scheme: Scheme;
  eligibilityStatus: 'eligible' | 'not-eligible' | 'partial';
  onLearnMore: () => void;
}
```

---

#### 4. SchemeDetailModal
**Purpose**: Full scheme details in modal overlay

**Features**:
- Modal overlay with backdrop
- Comprehensive scheme information
- Eligibility criteria breakdown
- Required documents list
- Application process steps
- Contact information
- "Apply Now" button
- Close button

---

#### 5. AIExplanation
**Purpose**: Display AI-generated eligibility explanations

**Features**:
- Expandable/collapsible section
- Markdown rendering
- Loading skeleton
- Error handling
- Retry mechanism
- Accessibility labels

---

#### 6. FormField
**Purpose**: Reusable form input component

**Features**:
- Label and input
- Validation error display
- Required field indicator
- Multiple input types (text, number, select, textarea)
- Accessibility attributes
- Consistent styling

**Props**:
```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'select' | 'textarea';
  value: string | number;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  options?: Array<{label: string; value: string}>;
}
```

---

#### 7. VoiceRecorder
**Purpose**: Audio recording interface

**Features**:
- Record button with visual feedback
- Recording timer
- Stop recording
- Audio playback
- Waveform visualization
- Browser compatibility check
- Error handling

---

#### 8. DocumentScanner
**Purpose**: Document upload and OCR processing

**Features**:
- Drag-and-drop zone
- File input fallback
- Image preview
- Upload progress
- OCR processing indicator
- Extracted data display
- Manual correction interface

---

#### 9. ApplicationStepper
**Purpose**: Multi-step form progress indicator

**Features**:
- Step numbers and labels
- Active step highlighting
- Completed step checkmarks
- Click to navigate (if allowed)
- Responsive layout
- Progress bar

---

#### 10. TimelineVisualization
**Purpose**: Visual timeline of application deadlines

**Features**:
- Chronological scheme display
- Date markers
- Urgency indicators
- Hover tooltips
- Responsive design

---

#### 11. NotificationBell
**Purpose**: Scheme alerts and notifications

**Features**:
- Bell icon with badge count
- Dropdown notification list
- Mark as read
- Clear all
- Notification types (new scheme, deadline, status update)

---

#### 12. DemoProfileButtons
**Purpose**: Quick-fill demo profiles for testing

**Features**:
- Multiple persona buttons
- One-click profile population
- Clear visual design
- Development/demo mode only

**Personas**:
- Young Professional
- Senior Citizen
- Farmer
- Student
- Single Mother

---

#### 13. ConversationHistory
**Purpose**: Display voice conversation transcript

**Features**:
- Message bubbles (user vs assistant)
- Timestamps
- Audio playback for each message
- Auto-scroll to latest
- Copy transcript

---

## 🔌 Services

### API Service (`services/api.ts`)
**Purpose**: Centralized API communication

**Methods**:
- `checkEligibility(profile)` - Check scheme eligibility
- `getAIExplanation(profile, scheme)` - Get AI explanation
- `chatWithAssistant(message, history)` - Chat interaction
- `transcribeAudio(audioBlob)` - Voice transcription
- `scanDocument(imageFile)` - OCR processing
- `submitApplication(schemeId, data)` - Submit application
- `getSchemeDetails(schemeId)` - Fetch scheme info
- `getSchemeAlerts(userId)` - Get notifications

**Configuration**:
- Base URL from environment variable
- Request/response interceptors
- Error handling
- Retry logic
- Timeout configuration

---

### Storage Service (`services/storage.ts`)
**Purpose**: LocalStorage wrapper for client-side persistence

**Methods**:
- `saveProfile(profile)` - Save user profile
- `getProfile()` - Retrieve profile
- `clearProfile()` - Delete profile
- `saveLanguage(lang)` - Save language preference
- `getLanguage()` - Get language preference
- `saveResults(results)` - Cache eligibility results
- `getResults()` - Retrieve cached results

---

### i18n Service (`services/i18n.ts`)
**Purpose**: Internationalization configuration

**Features**:
- English and Hindi translations
- Dynamic language switching
- Fallback language (English)
- Translation key validation
- Pluralization support
- Date/number formatting

**Usage**:
```typescript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();
const text = t('landing.hero.title');
i18n.changeLanguage('hi');
```

---

## 🎣 Custom Hooks

### useProfile
**Purpose**: Manage user profile state

**Returns**:
```typescript
{
  profile: UserProfile | null;
  saveProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  isLoading: boolean;
}
```

---

### useEligibility
**Purpose**: Handle eligibility checking

**Returns**:
```typescript
{
  results: EligibilityResult[];
  checkEligibility: (profile: UserProfile) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
```

---

### useVoiceRecording
**Purpose**: Manage voice recording state

**Returns**:
```typescript
{
  isRecording: boolean;
  audioBlob: Blob | null;
  startRecording: () => void;
  stopRecording: () => void;
  error: string | null;
}
```

---

### useChat
**Purpose**: Manage chat conversation state

**Returns**:
```typescript
{
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  clearHistory: () => void;
}
```

---

## 🌐 Routing

### Route Configuration
```typescript
<Routes>
  <Route path="/" element={<LanguageSelectionPage />} />
  <Route path="/landing" element={<ProfessionalLandingPage />} />
  <Route path="/profile" element={<UserProfilePage />} />
  <Route path="/simple-profile" element={<SimpleProfilePage />} />
  <Route path="/adaptive-profile" element={<AdaptiveQuestionnairePage />} />
  <Route path="/voice-onboarding" element={<VoiceOnboardingPage />} />
  <Route path="/document-upload" element={<DocumentUploadPage />} />
  <Route path="/results" element={<EnhancedResultsPage />} />
  <Route path="/enhanced-results" element={<EnhancedResultsPage />} />
  <Route path="/guided-application/:schemeId" element={<GuidedApplicationPage />} />
  <Route path="/chat" element={<ChatPage />} />
  <Route path="/csc-dashboard" element={<CSCOperatorDashboard />} />
</Routes>
```

### Navigation Flow
1. **Language Selection** → Landing Page
2. **Landing Page** → Choose onboarding method:
   - Traditional Form → UserProfilePage
   - Simple Form → SimpleProfilePage
   - Adaptive → AdaptiveQuestionnairePage
   - Voice → VoiceOnboardingPage
   - Document → DocumentUploadPage
3. **Profile Creation** → EnhancedResultsPage
4. **Results Page** → GuidedApplicationPage (per scheme)
5. **Chat** → Accessible from anywhere via FloatingNav

---

## 🎨 UI/UX Patterns

### Responsive Design
- **Mobile-first approach**: Base styles for mobile, scale up
- **Breakpoints**:
  - sm: 640px (tablets)
  - md: 768px (small laptops)
  - lg: 1024px (desktops)
  - xl: 1280px (large screens)
- **Touch-friendly**: Minimum 44px tap targets
- **Readable text**: Minimum 16px font size on mobile

---

### Accessibility
- **ARIA labels**: All interactive elements
- **Keyboard navigation**: Full keyboard support
- **Focus indicators**: Visible focus states
- **Screen reader support**: Semantic HTML
- **Color contrast**: WCAG AA compliance
- **Alt text**: All images and icons
- **Form validation**: Clear error messages

---

### Loading States
- **Skeleton screens**: Content placeholders
- **Spinners**: For quick operations
- **Progress bars**: For multi-step processes
- **Optimistic updates**: Immediate UI feedback

---

### Error Handling
- **Inline errors**: Form field validation
- **Toast notifications**: Success/error messages
- **Error boundaries**: Catch React errors
- **Retry mechanisms**: Failed API calls
- **Fallback UI**: Graceful degradation

---

### Animations
- **Page transitions**: Fade in/out
- **Card hover**: Scale and shadow
- **Button press**: Scale down
- **Modal**: Slide in from bottom/right
- **Loading**: Pulse, spin, fade

---

## 🚀 Performance Optimizations

### Code Splitting
- Route-based splitting with React.lazy
- Component lazy loading
- Dynamic imports for heavy libraries

### Asset Optimization
- Image compression and lazy loading
- SVG icons (Lucide React)
- Font subsetting
- CSS purging (Tailwind)

### Caching
- LocalStorage for profile data
- API response caching
- Service worker (future enhancement)

### Bundle Size
- Tree shaking
- Minification
- Gzip compression
- Vite build optimizations

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Hook behavior
- Utility functions
- Service methods

### Integration Tests
- User flows
- API integration
- Form submission
- Navigation

### Accessibility Tests
- ARIA attributes
- Keyboard navigation
- Screen reader compatibility

### Test Coverage Goals
- Components: >80%
- Services: >90%
- Utilities: >95%

---

## 🌍 Internationalization

### Supported Languages
- English (en)
- Hindi (hi)

### Translation Files
- `locales/en.json`
- `locales/hi.json`

### Translation Keys Structure
```json
{
  "landing": {
    "hero": {
      "title": "...",
      "subtitle": "..."
    }
  },
  "profile": {
    "form": {
      "name": "...",
      "age": "..."
    }
  }
}
```

### Adding New Languages
1. Create new JSON file in `locales/`
2. Add language to i18n config
3. Add language option to LanguageSelectionPage
4. Test all pages with new language

---

## 📦 Build & Deployment

### Development
```bash
npm run dev          # Start dev server (port 3000)
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run test         # Run tests
```

### Production Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Variables
```env
VITE_API_BASE_URL=https://api.nexis.gov.in
VITE_ENVIRONMENT=production
```

### Deployment Targets
- **AWS Amplify**: Automatic deployment from Git
- **S3 + CloudFront**: Static hosting with CDN
- **Netlify/Vercel**: Alternative hosting options

---

## 🔐 Security Considerations

### Data Protection
- No sensitive data in localStorage (only profile metadata)
- HTTPS only
- API key rotation
- Input sanitization
- XSS prevention

### Authentication
- CSC operator authentication via backend
- Session management
- Token-based auth (future)

### Privacy
- No tracking without consent
- Data minimization
- Clear privacy policy
- User data deletion option

---

## 🐛 Known Issues & Future Enhancements

### Known Issues
- Voice recording not supported in all browsers
- OCR accuracy varies with document quality
- Large file uploads may timeout

### Planned Enhancements
- Progressive Web App (PWA) support
- Offline mode
- Push notifications
- Biometric authentication
- More languages (Tamil, Telugu, Bengali)
- Dark mode
- Advanced filtering and search
- Scheme comparison tool
- Application status tracking
- Integration with DigiLocker

---

## 📚 Key Dependencies

### Production
- **react**: ^18.2.0 - UI library
- **react-router-dom**: ^6.20.0 - Routing
- **axios**: ^1.6.2 - HTTP client
- **framer-motion**: ^12.35.1 - Animations
- **lucide-react**: ^0.577.0 - Icons
- **i18next**: ^23.7.6 - Internationalization
- **react-i18next**: ^13.5.0 - React i18n bindings

### Development
- **vite**: ^5.0.8 - Build tool
- **typescript**: ^5.3.3 - Type safety
- **tailwindcss**: ^3.3.6 - Styling
- **eslint**: ^8.55.0 - Linting
- **prettier**: ^3.1.1 - Formatting
- **jest**: ^29.7.0 - Testing
- **@testing-library/react**: ^14.1.2 - Component testing

---

## 📞 Support & Documentation

### Additional Resources
- **API Documentation**: `docs/API_DOCUMENTATION.md`
- **Deployment Guide**: `docs/DEPLOYMENT_GUIDE.md`
- **Developer Guide**: `docs/DEVELOPER_GUIDE.md`
- **Project Structure**: `docs/PROJECT_STRUCTURE.md`

### Getting Help
- Check documentation in `docs/` folder
- Review code comments
- Contact development team
- Submit issues on project repository

---

**Last Updated**: March 8, 2026
**Version**: 1.0.0
**Maintained by**: NEXIS Development Team