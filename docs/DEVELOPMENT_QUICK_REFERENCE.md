# NEXIS Development Quick Reference

Quick reference guide for common development tasks and commands.

## Table of Contents

- [Environment Setup](#environment-setup)
- [Development Servers](#development-servers)
- [Docker Services](#docker-services)
- [AWS CLI Commands](#aws-cli-commands)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Common Issues](#common-issues)

## Environment Setup

### Initial Setup

```bash
# Clone and setup
git clone <repository-url>
cd nexis-fullstack-transformation
bash scripts/setup.sh
```

### Manual Setup

```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Create environment files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Start Docker services
docker-compose up -d

# Initialize services
bash scripts/init-localstack.sh
bash scripts/init-local-dynamodb.sh
```

## Development Servers

### Frontend

```bash
cd frontend

# Start development server
npm run dev
# Access at: http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Backend

```bash
cd backend

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Build TypeScript
npm run build
```

## Docker Services

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Restart specific service
docker-compose restart localstack
docker-compose restart dynamodb-local
```

### Check Service Status

```bash
# List running containers
docker ps

# Check LocalStack health
curl http://localhost:4566/_localstack/health

# Check DynamoDB Local
aws dynamodb list-tables --endpoint-url http://localhost:8000

# Access DynamoDB Admin UI
open http://localhost:8001
```

## AWS CLI Commands

### LocalStack S3

```bash
# Set endpoint for convenience
ENDPOINT="--endpoint-url http://localhost:4566"

# List buckets
aws s3 ls $ENDPOINT

# List bucket contents
aws s3 ls s3://nexis-knowledge-base-dev $ENDPOINT --recursive

# Upload file
aws s3 cp file.txt s3://nexis-knowledge-base-dev/ $ENDPOINT

# Download file
aws s3 cp s3://nexis-knowledge-base-dev/file.txt . $ENDPOINT

# Delete file
aws s3 rm s3://nexis-knowledge-base-dev/file.txt $ENDPOINT
```

### DynamoDB Local

```bash
# Set endpoint for convenience
ENDPOINT="--endpoint-url http://localhost:8000"

# List tables
aws dynamodb list-tables $ENDPOINT

# Describe table
aws dynamodb describe-table --table-name nexis-users-dev $ENDPOINT

# Scan table (get all items)
aws dynamodb scan --table-name nexis-users-dev $ENDPOINT

# Get item
aws dynamodb get-item \
  --table-name nexis-users-dev \
  --key '{"userId":{"S":"user-123"}}' \
  $ENDPOINT

# Put item
aws dynamodb put-item \
  --table-name nexis-users-dev \
  --item '{"userId":{"S":"user-123"},"name":{"S":"Test User"}}' \
  $ENDPOINT

# Delete item
aws dynamodb delete-item \
  --table-name nexis-users-dev \
  --key '{"userId":{"S":"user-123"}}' \
  $ENDPOINT

# Query with GSI
aws dynamodb query \
  --table-name nexis-eligibility-results-dev \
  --index-name userId-timestamp-index \
  --key-condition-expression "userId = :uid" \
  --expression-attribute-values '{":uid":{"S":"user-123"}}' \
  $ENDPOINT
```

### AWS Profiles

```bash
# Configure profiles
bash scripts/configure-aws-profiles.sh

# Use profile
export AWS_PROFILE=nexis-dev

# Or use --profile flag
aws s3 ls --profile nexis-dev

# Verify profile
aws sts get-caller-identity --profile nexis-dev

# List profiles
aws configure list-profiles
```

## Testing

### Frontend Tests

```bash
cd frontend

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- ProfileForm.test.tsx

# Run tests matching pattern
npm run test -- --testNamePattern="validation"
```

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run property-based tests
npm run test:property

# Run specific test file
npm run test -- eligibility.test.ts

# Run with coverage
npm run test:coverage
```

## Environment Variables

### Frontend (.env)

```env
# Development
VITE_API_BASE_URL=http://localhost:4566
VITE_ENVIRONMENT=development
VITE_ENABLE_DEBUG_LOGS=true

# Staging
VITE_API_BASE_URL=https://api-staging.nexis.example.com/v1
VITE_ENVIRONMENT=staging

# Production
VITE_API_BASE_URL=https://api.nexis.gov.in/v1
VITE_ENVIRONMENT=production
```

### Backend (.env)

```env
# Development
AWS_ENDPOINT_URL=http://localhost:4566
DYNAMODB_ENDPOINT=http://localhost:8000
USE_LOCALSTACK=true
MOCK_BEDROCK=true

# Staging/Production
# Remove AWS_ENDPOINT_URL and DYNAMODB_ENDPOINT
USE_LOCALSTACK=false
MOCK_BEDROCK=false
```

### Switch Environments

```bash
# Development
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Staging
cp frontend/.env.staging.example frontend/.env
cp backend/.env.staging.example backend/.env

# Production
cp frontend/.env.production.example frontend/.env
cp backend/.env.production.example backend/.env
```

## Common Issues

### Port Already in Use

```bash
# Find process using port
lsof -i :4566  # LocalStack
lsof -i :8000  # DynamoDB
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

### Docker Services Not Starting

```bash
# Check Docker is running
docker ps

# Restart Docker Desktop (if on Mac/Windows)

# Remove and recreate containers
docker-compose down -v
docker-compose up -d
```

### LocalStack Connection Issues

```bash
# Check if running
docker ps | grep localstack

# View logs
docker logs nexis-localstack

# Restart
docker-compose restart localstack

# Wait for ready
sleep 15
curl http://localhost:4566/_localstack/health
```

### DynamoDB Connection Issues

```bash
# Check if running
docker ps | grep dynamodb

# View logs
docker logs nexis-dynamodb-local

# Restart
docker-compose restart dynamodb-local

# Reinitialize tables
bash scripts/init-local-dynamodb.sh
```

### Environment Variables Not Loading

```bash
# Verify .env exists
ls -la frontend/.env backend/.env

# Check contents
cat frontend/.env

# Restart dev server after changes
# Frontend: Ctrl+C then npm run dev
```

### AWS CLI Profile Issues

```bash
# List profiles
aws configure list-profiles

# Check profile config
aws configure list --profile nexis-dev

# Reconfigure
aws configure --profile nexis-dev

# Test profile
aws sts get-caller-identity --profile nexis-dev
```

### Node Version Issues

```bash
# Check version
node -v

# Install nvm (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node 18
nvm install 18
nvm use 18
```

## Useful Aliases

Add these to your `~/.bashrc` or `~/.zshrc`:

```bash
# NEXIS aliases
alias nexis-start="docker-compose up -d"
alias nexis-stop="docker-compose down"
alias nexis-logs="docker-compose logs -f"
alias nexis-frontend="cd frontend && npm run dev"
alias nexis-test="cd backend && npm run test"

# AWS LocalStack aliases
alias aws-local="aws --endpoint-url http://localhost:4566"
alias ddb-local="aws dynamodb --endpoint-url http://localhost:8000"

# Quick commands
alias nexis-s3="aws s3 ls --endpoint-url http://localhost:4566"
alias nexis-ddb="aws dynamodb list-tables --endpoint-url http://localhost:8000"
```

## Keyboard Shortcuts

### VS Code

- `Ctrl/Cmd + P` - Quick file open
- `Ctrl/Cmd + Shift + P` - Command palette
- `Ctrl/Cmd + B` - Toggle sidebar
- `Ctrl/Cmd + J` - Toggle terminal
- `Ctrl/Cmd + Shift + F` - Search in files
- `F5` - Start debugging
- `Ctrl/Cmd + Shift + D` - Debug view

### Terminal

- `Ctrl + C` - Stop running process
- `Ctrl + Z` - Suspend process
- `Ctrl + L` - Clear terminal
- `Ctrl + R` - Search command history
- `Ctrl + A` - Move to line start
- `Ctrl + E` - Move to line end

## Quick Links

- Frontend Dev Server: http://localhost:5173
- LocalStack: http://localhost:4566
- DynamoDB Local: http://localhost:8000
- DynamoDB Admin: http://localhost:8001
- LocalStack Health: http://localhost:4566/_localstack/health

## Documentation

- [Environment Setup](./ENVIRONMENT_SETUP.md)
- [Quick Start](./QUICK_START.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [AWS Resource Naming](./AWS_RESOURCE_NAMING.md)
- [Technical Design](../.kiro/specs/nexis-fullstack-transformation/design.md)

---

**Last Updated**: 2024-03-15  
**Version**: 1.0
