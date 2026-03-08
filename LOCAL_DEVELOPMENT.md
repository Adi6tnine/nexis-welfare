# NEXIS Local Development Setup

## Quick Start - Test Locally Before AWS Deployment

This guide will help you run NEXIS locally on your Windows machine without deploying to AWS.

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Git** - Already installed
3. **VS Code** (optional but recommended)

## Step 1: Install Dependencies

### Backend

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# This will install:
# - TypeScript
# - AWS SDK (for local testing)
# - Jest (testing)
# - All other dependencies
```

### Frontend

```powershell
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# This will install:
# - React
# - Vite
# - Tailwind CSS
# - Axios
# - All other dependencies
```

## Step 2: Configure Environment Variables

### Backend Environment

```powershell
# In backend folder
cd backend

# Copy example env file
Copy-Item .env.example .env

# Edit .env file
notepad .env
```

Add these values to `.env`:
```env
# Local Development Configuration
NODE_ENV=development
AWS_REGION=us-east-1

# Mock AWS Services (no real AWS needed)
DYNAMODB_ENDPOINT=http://localhost:8000
AWS_ENDPOINT_URL=http://localhost:4566

# DynamoDB Table Names (local)
USERS_TABLE=nexis-users-local
ELIGIBILITY_RESULTS_TABLE=nexis-eligibility-results-local
USER_SESSIONS_TABLE=nexis-user-sessions-local
SCHEMES_TABLE=nexis-schemes-local
EXPLANATION_CACHE_TABLE=nexis-explanation-cache-local

# S3 Bucket (local)
KNOWLEDGE_BASE_BUCKET=nexis-knowledge-base-local

# Bedrock Configuration (MOCK MODE for local testing)
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
MOCK_BEDROCK=true

# Logging
LOG_LEVEL=DEBUG
```

### Frontend Environment

```powershell
# In frontend folder
cd frontend

# Copy example env file
Copy-Item .env.example .env

# Edit .env file
notepad .env
```

Add these values to `.env`:
```env
# Local Development
VITE_API_ENDPOINT=http://localhost:3001
VITE_ENVIRONMENT=local
```

## Step 3: Run Tests

### Backend Tests

```powershell
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run property-based tests
npm run test:properties

# Run in watch mode
npm run test:watch
```

Expected output:
```
PASS  src/tests/unit/eligibility.test.ts
PASS  src/tests/unit/dynamodb.test.ts
PASS  src/tests/unit/s3.test.ts
PASS  src/tests/unit/rag.test.ts
PASS  src/tests/unit/bedrock.test.ts

Test Suites: 5 passed, 5 total
Tests:       63 passed, 63 total
```

### Frontend Tests (if available)

```powershell
cd frontend

# Run tests
npm test
```

## Step 4: Build Backend

```powershell
cd backend

# Build TypeScript
npm run build

# Output will be in dist/ folder
```

## Step 5: Run Frontend Locally

```powershell
cd frontend

# Start development server
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open browser to: **http://localhost:3000**

## Step 6: Test Frontend Features

### What You Can Test Locally

✅ **UI/UX**:
- Landing page
- Language toggle (English/Hindi)
- Profile form
- Form validation
- Responsive design

✅ **Accessibility**:
- Keyboard navigation (Tab, Enter)
- Screen reader compatibility
- Focus indicators
- ARIA labels

✅ **Frontend Logic**:
- Form state management
- Client-side validation
- Error handling
- Loading states

❌ **What Won't Work Without Backend**:
- Eligibility checking (needs API)
- AI explanations (needs API)
- Chat assistant (needs API)
- Profile saving (needs API)

## Step 7: Create Mock API Server (Optional)

To test the full flow locally, create a simple mock API:

```powershell
# Create mock-api folder
New-Item -ItemType Directory -Path mock-api
cd mock-api

# Initialize npm
npm init -y

# Install express
npm install express cors body-parser
```

Create `mock-api/server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock eligibility check
app.post('/eligibility/check', (req, res) => {
  const { profile } = req.body;
  
  res.json({
    resultId: 'mock-result-123',
    userId: 'mock-user-456',
    timestamp: new Date().toISOString(),
    eligibleSchemes: [
      {
        schemeId: 'pm-kisan',
        schemeName: 'PM-KISAN',
        description: 'Income support for farmer families',
        benefits: '₹6,000 per year',
        matchScore: 100,
        eligibilityCriteria: {
          occupations: ['Farmer'],
          incomeMax: 200000
        }
      }
    ],
    ineligibleSchemes: [],
    totalSchemes: 1
  });
});

// Mock AI explanation
app.post('/ai/explain', (req, res) => {
  res.json({
    explanation: 'You qualify for PM-KISAN because you are a farmer with income below ₹2 lakh. This scheme provides ₹6,000 per year in three installments.',
    alternativeSchemes: [],
    confidence: 'high',
    generatedAt: new Date().toISOString()
  });
});

// Mock chat
app.post('/chat/message', (req, res) => {
  const { message } = req.body;
  
  res.json({
    sessionId: 'mock-session-123',
    response: `Thank you for asking about "${message}". This is a mock response. In production, this would be powered by Amazon Bedrock.`,
    confidence: 'high',
    sources: ['pm-kisan/policy.txt'],
    followUpSuggestions: [
      'What documents do I need?',
      'How do I apply?'
    ],
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mode: 'mock' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /eligibility/check');
  console.log('  POST /ai/explain');
  console.log('  POST /chat/message');
  console.log('  GET  /health');
});
```

Run mock API:
```powershell
cd mock-api
node server.js
```

## Step 8: Test Full Flow Locally

With both frontend and mock API running:

1. **Open Frontend**: http://localhost:3000
2. **Fill Profile Form**:
   - Age: 30
   - State: Maharashtra (MH)
   - Occupation: Farmer
   - Income: 100000
   - Gender: Male
   - Social Category: General

3. **Click "Check My Eligibility"**
4. **See Results**: Should show PM-KISAN as eligible
5. **Test AI Explanation**: Click on scheme
6. **Test Chat**: Ask questions

## Step 9: Check for Errors

### Frontend Console

Open browser DevTools (F12):
- Check Console tab for errors
- Check Network tab for API calls
- Check Application tab for localStorage

### Common Issues

**Issue: Port 3000 already in use**
```powershell
# Change port in frontend/vite.config.ts
# Or kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Issue: API calls failing**
```
Error: Network Error
```
Solution: Make sure mock API is running on port 3001

**Issue: CORS errors**
```
Access to fetch blocked by CORS policy
```
Solution: Mock API already has CORS enabled

## Step 10: Verify TypeScript Compilation

```powershell
# Backend
cd backend
npm run build
# Should complete without errors

# Frontend
cd frontend
npm run build
# Should create dist/ folder
```

## Step 11: Run Linting

```powershell
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Local Testing Checklist

Before deploying to AWS, verify:

- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] All tests passing (npm test)
- [ ] TypeScript compiles without errors
- [ ] Frontend runs on localhost:3000
- [ ] Mock API runs on localhost:3001
- [ ] Profile form works
- [ ] Form validation works
- [ ] Language toggle works
- [ ] Responsive design works
- [ ] No console errors
- [ ] Accessibility features work (keyboard navigation)

## Performance Testing Locally

### Lighthouse Audit

1. Open frontend in Chrome
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+

### Bundle Size

```powershell
cd frontend
npm run build

# Check dist/ folder size
Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum
```

Target: < 500KB gzipped

## Debugging Tips

### VS Code Debugging

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend Tests",
      "program": "${workspaceFolder}/backend/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

### Chrome DevTools

- **Console**: Check for JavaScript errors
- **Network**: Monitor API calls
- **Application**: Check localStorage
- **Performance**: Profile page load
- **Lighthouse**: Audit accessibility

## Next Steps

Once local testing is complete:

1. ✅ All tests passing
2. ✅ Frontend works locally
3. ✅ No TypeScript errors
4. ✅ No console errors
5. ✅ Accessibility verified

**You're ready to deploy to AWS!**

Run:
```powershell
.\scripts\deploy-to-aws.ps1
```

## Quick Commands Reference

```powershell
# Install all dependencies
cd backend && npm install && cd ../frontend && npm install && cd ..

# Run all tests
cd backend && npm test && cd ..

# Build everything
cd backend && npm run build && cd ../frontend && npm run build && cd ..

# Start frontend dev server
cd frontend && npm run dev

# Start mock API
cd mock-api && node server.js
```

## Troubleshooting

### Node.js Version Issues

```powershell
# Check version
node --version

# Should be 18.x or higher
# If not, download from nodejs.org
```

### npm Install Fails

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### TypeScript Errors

```powershell
# Rebuild
npm run build

# Check for errors
npx tsc --noEmit
```

---

**Ready to test locally? Start with:**

```powershell
# 1. Install dependencies
cd backend
npm install

cd ../frontend
npm install

# 2. Run tests
cd ../backend
npm test

# 3. Start frontend
cd ../frontend
npm run dev
```

Then open http://localhost:3000 in your browser! 🚀
