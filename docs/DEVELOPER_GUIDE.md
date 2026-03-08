# NEXIS Developer Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured
- Docker and Docker Compose
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/nexis.git
   cd nexis
   ```

2. **Run setup script**
   ```bash
   # Linux/macOS
   ./scripts/setup.sh
   
   # Windows
   .\scripts\setup.ps1
   ```

3. **Start local services**
   ```bash
   docker-compose up -d
   ```

4. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

5. **Configure environment**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

## Project Structure

```
nexis/
├── backend/                    # Backend services
│   ├── cloudformation/        # AWS infrastructure
│   │   ├── storage-stack.yaml
│   │   ├── compute-stack.yaml
│   │   ├── api-stack.yaml
│   │   ├── monitoring-stack-enhanced.yaml
│   │   └── iam-roles.yaml
│   ├── src/
│   │   ├── lambda/           # Lambda functions
│   │   │   ├── eligibility-checker/
│   │   │   ├── ai-explanation/
│   │   │   ├── chat-assistant/
│   │   │   ├── profile-manager/
│   │   │   └── scheme-uploader/
│   │   ├── models/           # Data models
│   │   ├── services/         # Business logic
│   │   │   ├── dynamodb.ts
│   │   │   ├── s3.ts
│   │   │   ├── bedrock.ts
│   │   │   ├── rag.ts
│   │   │   └── eligibility.ts
│   │   ├── utils/            # Utilities
│   │   │   ├── logger.ts
│   │   │   ├── ai-safety.ts
│   │   │   └── data-retention.ts
│   │   └── tests/            # Tests
│   │       ├── unit/
│   │       ├── integration/
│   │       └── properties/
│   ├── package.json
│   └── tsconfig.json
├── frontend/                  # React application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API clients
│   │   ├── hooks/            # Custom hooks
│   │   └── utils/            # Utilities
│   ├── package.json
│   └── vite.config.ts
├── docs/                      # Documentation
├── scripts/                   # Utility scripts
└── docker-compose.yml        # Local development
```

## Development Workflow

### Backend Development

1. **Start local services**
   ```bash
   docker-compose up -d
   ```

2. **Run in watch mode**
   ```bash
   cd backend
   npm run watch
   ```

3. **Run tests**
   ```bash
   npm test                    # All tests
   npm run test:watch         # Watch mode
   npm run test:coverage      # With coverage
   npm run test:properties    # Property-based tests
   ```

4. **Lint and format**
   ```bash
   npm run lint
   npm run format
   ```

### Frontend Development

1. **Start dev server**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Build for production**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for TypeScript
- **Prettier**: Consistent formatting
- **Naming Conventions**:
  - Files: kebab-case (e.g., `eligibility-checker.ts`)
  - Components: PascalCase (e.g., `ProfileForm.tsx`)
  - Functions: camelCase (e.g., `checkEligibility`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)

### Git Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Commit message format**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `test:` Tests
   - `refactor:` Code refactoring
   - `chore:` Maintenance

## Testing

### Unit Tests

Located in `backend/src/tests/unit/`

```bash
# Run all unit tests
npm test

# Run specific test file
npm test eligibility.test.ts

# Watch mode
npm run test:watch
```

### Property-Based Tests

Located in `backend/src/tests/properties/`

```bash
# Run property tests
npm run test:properties
```

### Integration Tests

Located in `backend/src/tests/integration/`

```bash
# Requires LocalStack running
docker-compose up -d
npm run test:integration
```

### Test Coverage

```bash
npm run test:coverage
```

Target: 80%+ coverage

### Writing Tests

```typescript
// Unit test example
describe('evaluateEligibility', () => {
  it('should return eligible when all criteria met', () => {
    const profile = { age: 30, /* ... */ };
    const scheme = { /* ... */ };
    
    const result = evaluateEligibility(profile, scheme);
    
    expect(result.isEligible).toBe(true);
    expect(result.matchScore).toBe(100);
  });
});

// Property test example
import * as fc from 'fast-check';

it('should always return score 0-100', () => {
  fc.assert(
    fc.property(profileArbitrary, schemeArbitrary, (profile, scheme) => {
      const result = evaluateEligibility(profile, scheme);
      expect(result.matchScore).toBeGreaterThanOrEqual(0);
      expect(result.matchScore).toBeLessThanOrEqual(100);
    }),
    { numRuns: 1000 }
  );
});
```

## Deployment

### Deploy to Development

```bash
# Deploy infrastructure
cd backend/cloudformation
./deploy-all-stacks.sh dev

# Deploy Lambda functions
cd ..
npm run build
npm run package
aws lambda update-function-code \
  --function-name nexis-eligibility-checker-dev \
  --zip-file fileb://lambda.zip
```

### Deploy to Staging

```bash
./deploy-all-stacks.sh staging
# Update Lambda functions...
```

### Deploy to Production

```bash
./deploy-all-stacks.sh prod
# Update Lambda functions...
```

### CI/CD Pipeline

GitHub Actions automatically:
1. Runs tests on PR
2. Builds on merge to main
3. Deploys to dev automatically
4. Deploys to staging with approval
5. Deploys to prod with approval

## Troubleshooting

### Common Issues

#### 1. LocalStack Connection Issues

```bash
# Check if LocalStack is running
docker ps | grep localstack

# Restart LocalStack
docker-compose restart localstack

# Check logs
docker-compose logs localstack
```

#### 2. DynamoDB Local Issues

```bash
# Initialize tables
./scripts/init-local-dynamodb.sh

# Check tables
aws dynamodb list-tables \
  --endpoint-url http://localhost:8000
```

#### 3. Build Errors

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### 4. Test Failures

```bash
# Run tests with verbose output
npm test -- --verbose

# Run single test
npm test -- eligibility.test.ts
```

### Debugging

#### Backend Debugging

Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/backend/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

#### Frontend Debugging

Use browser DevTools or VS Code debugger with Chrome.

### Logging

```typescript
import { createLogger } from './utils/logger';

const logger = createLogger({ operation: 'my-operation' });

logger.info('Processing request', { userId: 'user-123' });
logger.error('Failed to process', error, { userId: 'user-123' });
```

Logs are automatically:
- Structured as JSON
- PII redacted
- Sent to CloudWatch

## Best Practices

### Code Quality

1. **Write tests first** (TDD)
2. **Keep functions small** (<50 lines)
3. **Use TypeScript strictly** (no `any`)
4. **Document complex logic**
5. **Handle errors gracefully**

### Performance

1. **Cache frequently accessed data**
2. **Use pagination for large datasets**
3. **Optimize database queries**
4. **Minimize Lambda cold starts**
5. **Use CDN for static assets**

### Security

1. **Never commit secrets**
2. **Validate all inputs**
3. **Use least privilege IAM**
4. **Sanitize user input**
5. **Log security events**

### Accessibility

1. **Use semantic HTML**
2. **Add ARIA labels**
3. **Test with screen readers**
4. **Ensure keyboard navigation**
5. **Meet WCAG AA standards**

## Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Privacy Policy](./PRIVACY_POLICY.md)
- [Accessibility Guide](./ACCESSIBILITY.md)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Getting Help

- **Slack**: #nexis-dev
- **Email**: dev-team@nexis.gov.in
- **Issues**: GitHub Issues
- **Wiki**: Internal Wiki

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

---

© 2026 NEXIS Development Team
