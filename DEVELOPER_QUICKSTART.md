# NEXIS V2 - Developer Quick Start

**Last Updated:** March 8, 2026  
**Status:** Production Ready ✅

---

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd nexis-v2

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Run Development Mode
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev
# Access at http://localhost:5173

# Terminal 2 - Backend (optional, if using local API)
cd backend
npm run dev
# API at http://localhost:3000
```

---

## 🎯 Key Routes

### Citizen Routes
- `/` - Language selection
- `/landing` - Home page
- `/voice-onboarding` - Voice profile creation
- `/documents` - Document upload
- `/profile` - Manual profile form
- `/results` - Basic eligibility results
- `/enhanced-results` - Enhanced results with timeline
- `/guided-application/:schemeId` - Step-by-step application
- `/chat` - AI assistant

### Operator Routes
- `/csc-dashboard` - CSC operator dashboard
- `/csc-login` - Operator login (to be created)

---

## 🧪 Testing Features

### 1. Voice Onboarding
```
URL: /voice-onboarding
Mock: Enabled by default
Test: Click mic → Speak → See AI extract data
```

### 2. Document Upload
```
URL: /documents
Mock: Enabled by default
Test: Select Aadhaar → Upload image → See OCR results
```

### 3. Guided Application
```
URL: /enhanced-results → Click "Apply"
Mock: Enabled by default
Test: Follow steps → See AI guidance → Complete application
```

### 4. CSC Dashboard
```
URL: /csc-dashboard
Mock: Enabled by default
Test: Login with any email → View stats → Manage users
```

### 5. Proactive Alerts
```
Component: NotificationBell (add to header)
Mock: Enabled by default
Test: Click bell → View alerts → Mark read/dismiss
```

---

## 🔧 Environment Variables

### Backend (.env)
```bash
# AWS Configuration
AWS_REGION=us-east-1

# Mock Mode (set to false for real AWS)
MOCK_TRANSCRIBE=true
MOCK_POLLY=true
MOCK_TEXTRACT=true
MOCK_BEDROCK=true
MOCK_CSC_AUTH=true
MOCK_ALERTS=true

# DynamoDB Tables
PROFILES_TABLE=nexis-user-profiles-dev
SCHEMES_TABLE=nexis-schemes-dev
CONVERSATIONS_TABLE=nexis-voice-conversations-dev
DOCUMENTS_TABLE=nexis-documents-dev
APPLICATIONS_TABLE=nexis-applications-dev
OPERATORS_TABLE=nexis-csc-operators-dev
SESSIONS_TABLE=nexis-csc-sessions-dev
ALERTS_TABLE=nexis-alerts-dev

# S3 Buckets
VOICE_BUCKET=nexis-voice-dev
DOCUMENTS_BUCKET=nexis-documents-dev
KNOWLEDGE_BUCKET=nexis-knowledge-dev
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000/api
VITE_MOCK_MODE=true
```

---

## 📁 Project Structure

```
nexis-v2/
├── backend/
│   ├── src/
│   │   ├── lambda/              # Lambda functions
│   │   │   ├── voice-transcription/
│   │   │   ├── voice-synthesis/
│   │   │   ├── voice-conversation-manager/
│   │   │   ├── document-ocr/
│   │   │   ├── guided-application-manager/
│   │   │   ├── csc-operator-auth/
│   │   │   └── scheme-alert-engine/
│   │   ├── services/            # Shared services
│   │   │   ├── eligibility-v2.ts
│   │   │   ├── bedrock.ts
│   │   │   ├── dynamodb.ts
│   │   │   ├── s3.ts
│   │   │   └── rag.ts
│   │   ├── models/              # Data models
│   │   │   ├── UserProfileV2.ts
│   │   │   ├── SchemeV2.ts
│   │   │   └── EligibilityResult.ts
│   │   └── utils/               # Utilities
│   ├── cloudformation/          # AWS infrastructure
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/               # Page components
│   │   │   ├── VoiceOnboardingPage.tsx
│   │   │   ├── DocumentUploadPage.tsx
│   │   │   ├── GuidedApplicationPage.tsx
│   │   │   ├── EnhancedResultsPage.tsx
│   │   │   └── CSCOperatorDashboard.tsx
│   │   ├── components/          # Reusable components
│   │   │   ├── VoiceRecorder.tsx
│   │   │   ├── ConversationHistory.tsx
│   │   │   ├── DocumentScanner.tsx
│   │   │   ├── ApplicationStepper.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── SchemeCard.tsx
│   │   │   ├── TimelineVisualization.tsx
│   │   │   └── NotificationBell.tsx
│   │   ├── services/            # API services
│   │   ├── App.tsx              # Main app with routing
│   │   └── index.css
│   └── package.json
│
└── docs/                        # Documentation
    ├── NEXIS_VOICE_ASSISTED_UPGRADE_PLAN.md
    ├── API_SPECIFICATION_V2.md
    ├── DATABASE_SCHEMA_V2.md
    └── IMPLEMENTATION_GUIDE_V2.md
```

---

## 🔌 API Endpoints

### Voice Services
```
POST /api/voice/transcribe
POST /api/voice/synthesize
POST /api/voice/conversation
```

### Document Services
```
POST /api/documents/ocr
GET  /api/documents/:documentId
```

### Eligibility Services
```
POST /api/eligibility/check
GET  /api/eligibility/:userId/timeline
```

### Application Services
```
POST /api/applications/start
POST /api/applications/next
POST /api/applications/submit
GET  /api/applications/:applicationId
```

### CSC Services
```
POST /api/csc/login
POST /api/csc/verify
POST /api/csc/logout
POST /api/csc/register
```

### Alert Services
```
POST /api/alerts/check-new-schemes
POST /api/alerts/check-eligibility-changes
POST /api/alerts/user
POST /api/alerts/mark-read
POST /api/alerts/dismiss
```

---

## 🎨 Component Usage

### VoiceRecorder
```tsx
import { VoiceRecorder } from '../components/VoiceRecorder';

<VoiceRecorder
  onTranscript={(text) => console.log(text)}
  language="hi-IN"
  disabled={false}
/>
```

### DocumentScanner
```tsx
import { DocumentScanner } from '../components/DocumentScanner';

<DocumentScanner
  documentType="aadhaar"
  onCapture={(imageData) => console.log(imageData)}
/>
```

### NotificationBell
```tsx
import { NotificationBell } from '../components/NotificationBell';

<NotificationBell />
```

### SchemeCard
```tsx
import { SchemeCard } from '../components/SchemeCard';

<SchemeCard
  scheme={schemeData}
  onViewDetails={() => {}}
  onApply={() => {}}
/>
```

---

## 🧩 Adding NotificationBell to Header

Update your header component:

```tsx
import { NotificationBell } from './components/NotificationBell';

function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1>NEXIS</h1>
          
          {/* Add notification bell */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <button>Profile</button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

## 🐛 Debugging

### Enable Detailed Logging
```bash
# Backend
export DEBUG=nexis:*

# Frontend
localStorage.setItem('debug', 'nexis:*')
```

### Check Mock Mode
```bash
# Backend - check .env
echo $MOCK_TRANSCRIBE

# Frontend - check console
console.log(import.meta.env.VITE_MOCK_MODE)
```

### Common Issues

**Issue:** Voice recording not working  
**Fix:** Check browser permissions for microphone

**Issue:** Document upload fails  
**Fix:** Ensure MOCK_TEXTRACT=true in backend .env

**Issue:** API calls fail  
**Fix:** Check VITE_API_URL in frontend .env

**Issue:** CSC login fails  
**Fix:** Ensure MOCK_CSC_AUTH=true in backend .env

---

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Backend
```bash
cd backend
npm run build
# Output in backend/dist/
```

### Deploy to AWS
```bash
# Deploy CloudFormation stacks
cd backend/cloudformation
./deploy-all-stacks.sh

# Deploy Lambda functions
cd ..
npm run deploy

# Deploy frontend to S3/CloudFront
cd ../frontend
npm run deploy
```

---

## 🧪 Testing

### Run Tests
```bash
# Backend unit tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Integration tests
npm run test:integration
```

### Manual Testing Checklist
- [ ] Voice onboarding flow
- [ ] Document upload and OCR
- [ ] Eligibility check
- [ ] Guided application
- [ ] CSC dashboard login
- [ ] Notification alerts
- [ ] Mobile responsiveness
- [ ] Hindi/English language switch

---

## 📚 Documentation

- **Design:** `docs/NEXIS_VOICE_ASSISTED_UPGRADE_PLAN.md`
- **API:** `docs/API_SPECIFICATION_V2.md`
- **Database:** `docs/DATABASE_SCHEMA_V2.md`
- **Implementation:** `docs/IMPLEMENTATION_GUIDE_V2.md`
- **Status:** `PROTOTYPE_IMPLEMENTATION_STATUS.md`
- **Complete:** `PROTOTYPE_COMPLETE.md`

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally with mock mode
4. Run linter: `npm run lint`
5. Run tests: `npm test`
6. Submit pull request

---

## 💡 Tips

- Use mock mode for rapid development
- Check browser console for errors
- Use React DevTools for debugging
- Monitor network tab for API calls
- Test on mobile devices early
- Use TypeScript for type safety

---

## 🎯 Quick Commands

```bash
# Start everything
npm run dev

# Build everything
npm run build

# Test everything
npm test

# Lint everything
npm run lint

# Deploy everything
npm run deploy

# Clean everything
npm run clean
```

---

## 📞 Need Help?

- Check documentation in `docs/`
- Review code comments in Lambda functions
- Check `PROTOTYPE_COMPLETE.md` for feature list
- Review `PROTOTYPE_IMPLEMENTATION_STATUS.md` for progress

---

**Happy Coding! 🚀**
