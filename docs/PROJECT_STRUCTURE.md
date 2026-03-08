# NEXIS Project Structure

This document describes the organization of the NEXIS codebase.

## Root Directory

```
nexis/
├── .git/                    # Git repository
├── .kiro/                   # Kiro AI assistant configuration
├── backend/                 # Backend Lambda functions and services
├── frontend/                # React frontend application
├── docs/                    # Project documentation
├── scripts/                 # Development and deployment scripts
├── .gitignore              # Git ignore patterns
├── .prettierrc.json        # Prettier code formatting configuration
└── README.md               # Project overview and setup instructions
```

## Frontend Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layout/        # Layout components (Header, Footer, Navigation)
│   │   ├── forms/         # Form components (inputs, selectors)
│   │   ├── cards/         # Card components (SchemeCard, etc.)
│   │   └── common/        # Common components (Button, Modal, etc.)
│   │
│   ├── pages/             # Page components (route-level)
│   │   ├── LandingPage.tsx
│   │   ├── LanguageSelectionPage.tsx
│   │   ├── ProfileFormPage.tsx
│   │   ├── EligibilityDashboardPage.tsx
│   │   └── AIAssistantPage.tsx
│   │
│   ├── services/          # API and storage services
│   │   ├── api/
│   │   │   └── apiClient.ts      # API client for backend communication
│   │   └── storage/
│   │       └── localStorage.ts    # Local storage wrapper
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useProfile.ts
│   │   ├── useEligibility.ts
│   │   └── useLanguage.ts
│   │
│   ├── utils/             # Utility functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── constants.ts
│   │
│   ├── types/             # TypeScript type definitions
│   │   ├── profile.ts
│   │   ├── scheme.ts
│   │   └── api.ts
│   │
│   ├── locales/           # i18n translation files
│   │   ├── en.json
│   │   └── hi.json
│   │
│   ├── App.tsx            # Root application component
│   ├── main.tsx           # Application entry point
│   ├── index.css          # Global styles
│   └── vite-env.d.ts      # Vite environment types
│
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── jest.config.js         # Jest test configuration
├── .eslintrc.json         # ESLint configuration
└── .env.example           # Environment variables template
```

## Backend Structure

```
backend/
├── src/
│   ├── lambda/                    # Lambda function handlers
│   │   ├── eligibility-checker/
│   │   │   ├── index.ts          # Handler
│   │   │   └── handler.test.ts   # Tests
│   │   │
│   │   ├── ai-explanation/
│   │   │   ├── index.ts
│   │   │   └── handler.test.ts
│   │   │
│   │   ├── chat-assistant/
│   │   │   ├── index.ts
│   │   │   └── handler.test.ts
│   │   │
│   │   ├── profile-manager/
│   │   │   ├── index.ts
│   │   │   └── handler.test.ts
│   │   │
│   │   └── scheme-uploader/
│   │       ├── index.ts
│   │       └── handler.test.ts
│   │
│   ├── services/                  # Business logic services
│   │   ├── eligibility/
│   │   │   ├── evaluator.ts      # Eligibility evaluation logic
│   │   │   └── criteria.ts       # Criterion evaluators
│   │   │
│   │   ├── ai/
│   │   │   ├── bedrock.ts        # Bedrock client wrapper
│   │   │   ├── prompts.ts        # Prompt templates
│   │   │   └── rag.ts            # RAG workflow
│   │   │
│   │   ├── data/
│   │   │   ├── dynamodb.ts       # DynamoDB client wrapper
│   │   │   └── s3.ts             # S3 client wrapper
│   │   │
│   │   └── validation/
│   │       └── schemas.ts        # Zod validation schemas
│   │
│   ├── models/                    # Data models and types
│   │   ├── UserProfile.ts
│   │   ├── Scheme.ts
│   │   ├── EligibilityResult.ts
│   │   └── index.ts
│   │
│   ├── utils/                     # Utility functions
│   │   ├── logger.ts             # Structured logging
│   │   ├── errors.ts             # Error handling
│   │   └── constants.ts          # Constants
│   │
│   └── tests/                     # Test files
│       ├── unit/                 # Unit tests
│       ├── integration/          # Integration tests
│       └── properties/           # Property-based tests
│           ├── eligibility.test.ts
│           ├── validation.test.ts
│           └── parser.test.ts
│
├── cloudformation/                # Infrastructure as Code
│   ├── main-stack.yaml           # Main stack (orchestrator)
│   ├── storage-stack.yaml        # DynamoDB and S3
│   ├── compute-stack.yaml        # Lambda functions
│   ├── api-stack.yaml            # API Gateway
│   ├── monitoring-stack.yaml     # CloudWatch
│   └── frontend-stack.yaml       # Amplify
│
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Jest test configuration
├── .eslintrc.json                 # ESLint configuration
└── .env.example                   # Environment variables template
```

## Documentation Structure

```
docs/
├── PROJECT_STRUCTURE.md          # This file
├── API_DOCUMENTATION.md          # API endpoint documentation
├── DEPLOYMENT_GUIDE.md           # Deployment instructions
├── DEVELOPMENT_GUIDE.md          # Development workflow
├── TESTING_GUIDE.md              # Testing strategies
└── ARCHITECTURE.md               # Architecture diagrams and decisions
```

## Scripts Structure

```
scripts/
├── setup.sh                      # Development environment setup (Bash)
├── setup.ps1                     # Development environment setup (PowerShell)
├── deploy.sh                     # Deployment script
└── seed-data.sh                  # Seed test data
```

## Key Files

### Configuration Files

- **package.json**: Defines dependencies, scripts, and project metadata
- **tsconfig.json**: TypeScript compiler configuration
- **.eslintrc.json**: Code linting rules
- **.prettierrc.json**: Code formatting rules
- **vite.config.ts**: Frontend build configuration
- **jest.config.js**: Test runner configuration
- **.env.example**: Environment variable templates

### Entry Points

- **Frontend**: `frontend/src/main.tsx` → `frontend/src/App.tsx`
- **Backend Lambda**: `backend/src/lambda/{function-name}/index.ts`

### Infrastructure

- **CloudFormation**: `backend/cloudformation/*.yaml`
- **Deployment**: `scripts/deploy.sh`

## Naming Conventions

### Files
- React components: PascalCase (e.g., `ProfileForm.tsx`)
- Services/utilities: camelCase (e.g., `apiClient.ts`)
- Test files: `*.test.ts` or `*.spec.ts`
- Type definitions: PascalCase (e.g., `UserProfile.ts`)

### Directories
- kebab-case for multi-word directories (e.g., `ai-explanation`)
- Plural for collections (e.g., `components`, `services`)

### Code
- Components: PascalCase (e.g., `ProfileForm`)
- Functions: camelCase (e.g., `checkEligibility`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- Types/Interfaces: PascalCase (e.g., `UserProfile`)

## Import Paths

Both frontend and backend use path aliases:

```typescript
// Instead of: import { UserProfile } from '../../../models/UserProfile'
// Use: import { UserProfile } from '@/models/UserProfile'
```

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## Environment Variables

### Frontend (.env)
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_API_KEY`: API authentication key
- `VITE_ENVIRONMENT`: Environment name (dev/staging/prod)

### Backend (.env)
- `AWS_REGION`: AWS region
- `*_TABLE`: DynamoDB table names
- `*_BUCKET`: S3 bucket names
- `BEDROCK_MODEL_ID`: Bedrock model identifier
- `LOG_LEVEL`: Logging verbosity

## Build Outputs

### Frontend
- Development: `npm run dev` (Vite dev server on port 3000)
- Production: `npm run build` → `frontend/dist/`

### Backend
- Build: `npm run build` → `backend/dist/`
- Package: `npm run package` → `backend/lambda.zip`

## Testing

### Frontend Tests
- Location: `frontend/src/**/*.test.tsx`
- Run: `npm run test`
- Coverage: `npm run test:coverage`

### Backend Tests
- Unit: `backend/src/tests/unit/**/*.test.ts`
- Integration: `backend/src/tests/integration/**/*.test.ts`
- Properties: `backend/src/tests/properties/**/*.test.ts`
- Run: `npm run test`
- Properties only: `npm run test:properties`

## Git Workflow

1. Main branch: `main` (production)
2. Development branch: `develop`
3. Feature branches: `feature/{feature-name}`
4. Bugfix branches: `bugfix/{bug-name}`
5. Release branches: `release/{version}`

## Deployment Environments

- **Development**: `nexis-dev` stack
- **Staging**: `nexis-staging` stack
- **Production**: `nexis-prod` stack

Each environment has separate:
- DynamoDB tables
- S3 buckets
- Lambda functions
- API Gateway endpoints
- Amplify apps
