# 🚀 NEXIS V2 Prototype - Quick Start Guide

Get the prototype running in 5 minutes!

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Modern web browser (Chrome/Firefox/Edge)

---

## Step 1: Install Dependencies (2 minutes)

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

---

## Step 2: Enable Mock Mode (No AWS needed!)

```bash
# Create backend/.env file
cat > backend/.env << EOF
AWS_REGION=us-east-1
MOCK_TRANSCRIBE=true
MOCK_POLLY=true
MOCK_TEXTRACT=true
MOCK_BEDROCK=true
VOICE_BUCKET=nexis-voice-dev
DOCUMENTS_BUCKET=nexis-documents-dev
CONVERSATIONS_TABLE=nexis-voice-conversations-dev
DOCUMENTS_TABLE=nexis-documents-dev
APPLICATIONS_TABLE=nexis-applications-dev
EOF
```

---

## Step 3: Start Backend (1 minute)

```bash
cd backend
npm run dev
```

Backend will start on `http://localhost:3000`

---

## Step 4: Start Frontend (1 minute)

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173`

---

## Step 5: Test Features (1 minute)

### Test Voice Onboarding

1. Open browser: `http://localhost:5173/voice-onboarding`
2. Click the blue microphone button
3. Allow microphone access
4. Speak: "Main kisan hoon" (I am a farmer)
5. Watch AI extract data and respond!

### Test Document Upload

1. Navigate to: `http://localhost:5173/documents`
2. Click "Aadhaar Card"
3. Click "Upload File" or "Take Photo"
4. Upload any image (mock OCR will extract sample data)
5. See extracted data and validation!

---

## 🎉 You're Ready!

The prototype is now running with:
- ✅ Voice transcription (mock mode)
- ✅ Voice synthesis (mock mode)
- ✅ AI conversation (mock mode)
- ✅ Document OCR (mock mode)
- ✅ Eligibility engine

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Backend (change port)
PORT=3001 npm run dev

# Frontend (change port)
PORT=5174 npm run dev
```

### Microphone Not Working

1. Check browser permissions
2. Use HTTPS (required for microphone)
3. Try different browser

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. **Explore the code:**
   - Backend: `backend/src/lambda/`
   - Frontend: `frontend/src/components/`

2. **Read the docs:**
   - [PROTOTYPE_READY.md](PROTOTYPE_READY.md) - Full feature list
   - [PROTOTYPE_IMPLEMENTATION_STATUS.md](PROTOTYPE_IMPLEMENTATION_STATUS.md) - Progress tracker

3. **Deploy to AWS:**
   - Follow deployment guide in docs
   - Enable real AWS services
   - Test with production data

---

## 🎯 Demo URLs

- **Voice Onboarding:** http://localhost:5173/voice-onboarding
- **Document Upload:** http://localhost:5173/documents
- **Landing Page:** http://localhost:5173/
- **Profile Form:** http://localhost:5173/profile

---

## 💡 Tips

- **Mock mode** works without AWS - perfect for development
- **Voice works best** in quiet environment
- **Document upload** accepts any image in mock mode
- **All data** is stored in browser localStorage

---

**Happy coding! 🚀**

