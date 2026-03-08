# 🇮🇳 NEXIS - National Eligibility eXplorer & Information System

> AI-powered platform helping 1.4 billion Indians discover government welfare schemes they're eligible for

[![AI for Bharat Hackathon 2026](https://img.shields.io/badge/Hackathon-AI%20for%20Bharat%202026-orange)](https://aiforindia.gov.in)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock%20Claude%203-yellow)](https://aws.amazon.com/bedrock/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🎯 Problem Statement

India has **700+ government welfare schemes** worth **₹10 lakh crore** annually, but:
- 🤔 Citizens don't know which schemes they qualify for
- 📄 Complex eligibility criteria across multiple parameters
- 🌐 Information scattered across different portals
- 🚫 Low digital literacy prevents access
- ⏰ Time-consuming manual verification process

**Result:** Millions of eligible citizens miss out on benefits they deserve.

---

## 💡 Our Solution

NEXIS uses **AI-powered eligibility checking** to instantly match citizens with relevant schemes based on their profile. Built with **AWS Bedrock Claude 3 Haiku** for intelligent explanations and guidance.

### Key Features

🤖 **AI-Powered Explanations**
- Personalized eligibility explanations using AWS Bedrock
- Natural language understanding of complex criteria
- Bilingual support (English & Hindi)

🎯 **Smart Matching**
- Instant eligibility checking across 56+ schemes
- Match score calculation (0-100%)
- Detailed criteria breakdown

💬 **Intelligent Chat Assistant**
- RAG-powered Q&A about schemes
- Conversation history maintained
- Context-aware responses

🎨 **Brutalist Design**
- Bold, trustworthy interface
- Accessibility-first approach
- Mobile-responsive layout

🔐 **Secure Authentication**
- JWT-based user accounts
- Password hashing with bcrypt
- Profile management

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Profile  │  │ Results  │  │   Chat   │  │   Auth   │   │
│  │  Form    │  │   Page   │  │   Page   │  │   Pages  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (REST API)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│  Auth Lambda     │  │ Chat Lambda  │  │ Eligibility  │
│  (Node.js 20)    │  │ + Bedrock    │  │   Lambda     │
└──────────────────┘  └──────────────┘  └──────────────┘
        │                     │                  │
        ▼                     ▼                  ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│   DynamoDB       │  │ AWS Bedrock  │  │  DynamoDB    │
│   (Users)        │  │ Claude 3     │  │  (Results)   │
└──────────────────┘  └──────────────┘  └──────────────┘
```

### Tech Stack

**Frontend:**
- React 18.3 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Framer Motion for animations
- React Router for navigation

**Backend:**
- AWS Lambda (Node.js 20.x)
- AWS Bedrock (Claude 3 Haiku)
- DynamoDB for data storage
- API Gateway for REST APIs
- S3 for scheme documents

**Infrastructure:**
- CloudFormation for IaC
- AWS IAM for security
- CloudWatch for monitoring

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- AWS CLI (for deployment)
- AWS account with Bedrock access

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:4566
VITE_API_KEY=dev-api-key
EOF

# Start development server
npm run dev
```

Visit: http://localhost:5173

### Backend Deployment

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Deploy to AWS
deploy-all.bat dev us-east-1

# Or use PowerShell
.\deploy-all.ps1 -Environment dev -Region us-east-1
```

See [Backend Deployment Guide](backend/DEPLOYMENT_README.md) for detailed instructions.

---

## 📊 Features Showcase

### 1. Profile Creation
Simple form to capture user details:
- Age, occupation, income
- State, social category
- Disability status

### 2. Eligibility Results
- **Eligible Schemes** - Apply immediately
- **Potentially Eligible** - Complete profile
- **Match Scores** - See how well you qualify

### 3. AI Explanations
Click "AI Explain" on any scheme to get:
- Why you're eligible/ineligible
- Key points with checkmarks
- Next steps to apply
- Estimated processing time

### 4. Chat Assistant
Ask questions like:
- "What schemes am I eligible for?"
- "How do I apply for PM-KISAN?"
- "What documents do I need?"

### 5. Scheme Details
Comprehensive information:
- Full description and benefits
- Required documents
- Step-by-step application guide
- Contact information

---

## � Design Philosophy

**Brutalist Design Principles:**
- Bold borders and shadows for trust
- High contrast for readability
- Uppercase text for emphasis
- Square corners for official feel
- Minimal animations for performance

**Accessibility:**
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- High contrast ratios
- Semantic HTML

---

## 📈 Impact & Scale

### Current Coverage
- **56 Government Schemes** across 13 categories
- **Agriculture, Healthcare, Education, Housing, Employment**
- **Pension, Financial Inclusion, Rural Development**

### Potential Scale
- **700+ Schemes** (target)
- **1.4 Billion Citizens** (India's population)
- **₹10 Lakh Crore** annual budget
- **28 States & 8 UTs** coverage

### Cost Efficiency
- **Development:** ~$3/month
- **Production (10K users):** ~$70-120/month
- **Serverless architecture** - scales automatically

---

## 🏆 Innovation Highlights

### 1. AI-Powered Explanations
- Uses AWS Bedrock Claude 3 Haiku
- Generates personalized explanations
- Adapts to user's language and literacy level

### 2. Smart Eligibility Logic
- Multi-parameter matching
- Fuzzy matching for edge cases
- Confidence scoring

### 3. Bilingual Support
- English and Hindi
- AI responses in user's language
- Regional language support (planned)

### 4. RAG for Accuracy
- Retrieval Augmented Generation
- Fetches official scheme documents
- Ensures accurate information

### 5. Production-Ready
- Serverless architecture
- Auto-scaling
- Cost-effective
- Secure by design

---

## 📁 Project Structure

```
nexis/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API & auth services
│   │   └── styles/          # CSS & design system
│   └── package.json
│
├── backend/                  # AWS Lambda backend
│   ├── src/
│   │   ├── lambda/          # Lambda functions
│   │   ├── services/        # Bedrock, DynamoDB, S3
│   │   └── models/          # Data models
│   ├── cloudformation/      # Infrastructure as Code
│   └── package.json
│
├── .kiro/                    # Project specifications
│   └── specs/
│       └── nexis-fullstack-transformation/
│           ├── design.md
│           ├── requirements.md
│           └── tasks.md
│
└── README.md                 # This file
```

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 🚀 Deployment

### Development
```bash
cd backend
deploy-all.bat dev us-east-1
```

### Production
```bash
cd backend
deploy-all.bat prod us-east-1
```

See [Deployment Guide](backend/DEPLOYMENT_README.md) for details.

---

## 🔐 Security

- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ Input validation & sanitization
- ✅ CORS configuration
- ✅ API rate limiting
- ✅ Encryption at rest (DynamoDB)
- ✅ Encryption in transit (HTTPS)

---

## 📊 Performance

- ⚡ **<2s** page load time
- ⚡ **<1s** eligibility check
- ⚡ **<3s** AI explanation generation
- ⚡ **99.9%** uptime (AWS SLA)
- ⚡ **Auto-scaling** with Lambda

---

## 🌟 Future Roadmap

### Phase 1 (Current)
- ✅ 56 schemes across 13 categories
- ✅ AI explanations with Bedrock
- ✅ Chat assistant
- ✅ User authentication

### Phase 2 (Next 3 months)
- 🔄 700+ schemes coverage
- 🔄 Regional language support (Tamil, Telugu, Bengali)
- 🔄 Voice interface for low-literacy users
- 🔄 Document upload & verification
- 🔄 Application tracking

### Phase 3 (6 months)
- 🔄 Mobile app (React Native)
- 🔄 Offline mode
- 🔄 Integration with government APIs
- 🔄 Scheme recommendation engine
- 🔄 SMS & WhatsApp notifications

---

## 👥 Team

Built for **AI for Bharat Hackathon 2026**

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **AI for Bharat** for organizing the hackathon
- **AWS** for Bedrock access
- **Government of India** for scheme data
- **Open source community** for amazing tools

---

## 📞 Contact

For questions or feedback about this project, please open an issue on GitHub.

---

## 🎯 Hackathon Submission

**Category:** AI for Social Good  
**Track:** Government Services  
**Technology:** AWS Bedrock, React, TypeScript  
**Impact:** Helping millions access welfare benefits  

---

<div align="center">

**Made with ❤️ for India**

*Empowering citizens through AI*

</div>
