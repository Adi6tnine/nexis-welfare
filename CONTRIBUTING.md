# Contributing to NEXIS

Thank you for your interest in NEXIS!

## For Hackathon Judges

### Quick Demo

1. **View Live Demo** (if deployed):
   - Frontend: [URL]
   - API: [URL]

2. **Run Locally**:
   ```bash
   # Frontend
   cd frontend
   npm install
   npm run dev
   # Visit: http://localhost:5173
   ```

3. **Test Features**:
   - Create a profile (age: 25, occupation: Farmer, income: ₹2L)
   - View eligible schemes
   - Click "AI Explain" button
   - Try the chat assistant

### Key Files to Review

**Frontend:**
- `frontend/src/pages/EnhancedResultsPage.tsx` - Main results page
- `frontend/src/components/AIExplanationPanel.tsx` - AI explanation modal
- `frontend/src/services/bedrockAI.ts` - Bedrock integration
- `frontend/src/services/mockEligibility.ts` - 56 schemes with logic

**Backend:**
- `backend/src/lambda/auth/index.ts` - Authentication
- `backend/src/lambda/chat-assistant/index.ts` - Chat with Bedrock
- `backend/src/services/bedrock.ts` - AWS Bedrock service
- `backend/cloudformation/auth-stack.yaml` - Infrastructure

**Specifications:**
- `.kiro/specs/nexis-fullstack-transformation/design.md` - System design
- `.kiro/specs/nexis-fullstack-transformation/requirements.md` - Requirements
- `.kiro/specs/nexis-fullstack-transformation/tasks.md` - Implementation tasks

### Architecture Highlights

1. **AI Integration**: Real AWS Bedrock Claude 3 Haiku integration
2. **Serverless**: Lambda + DynamoDB + API Gateway
3. **Scalable**: Auto-scaling, pay-per-use
4. **Secure**: JWT auth, bcrypt passwords, input validation
5. **Production-Ready**: Error handling, logging, monitoring

### Innovation Points

1. **AI-Powered Explanations**: Personalized using Bedrock
2. **Smart Matching**: Multi-parameter eligibility logic
3. **Bilingual**: English & Hindi support
4. **RAG**: Retrieval Augmented Generation for accuracy
5. **Cost-Effective**: ~$3/month dev, ~$70-120/month prod

### Testing Credentials

**Mock Mode** (default):
- No authentication required
- All features work with mock data
- Perfect for demo

**Real Mode** (if deployed):
- Register: Any email + password
- Or use guest access

## For Developers

### Setup

```bash
# Clone repository
git clone https://github.com/your-username/nexis.git
cd nexis

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run build
```

### Development Workflow

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

### Code Style

- TypeScript for type safety
- ESLint for linting
- Prettier for formatting
- Conventional commits

### Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

## Questions?

For hackathon judges: Contact via hackathon platform  
For developers: Open an issue on GitHub

---

**Thank you for reviewing NEXIS!** 🙏
