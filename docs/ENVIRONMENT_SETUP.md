# NEXIS Development Environment Setup Guide

This guide provides detailed instructions for setting up the NEXIS development environment, including local AWS service simulation with LocalStack and DynamoDB Local.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup](#quick-setup)
3. [Manual Setup](#manual-setup)
4. [Environment Configuration](#environment-configuration)
5. [AWS CLI Profiles](#aws-cli-profiles)
6. [Local Development Services](#local-development-services)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before setting up the development environment, ensure you have the following installed:

### Required

- **Node.js 18.x or higher**: [Download](https://nodejs.org/)
- **npm 9.x or higher**: Comes with Node.js
- **Git**: [Download](https://git-scm.com/)

### Recommended for Local Development

- **Docker**: [Download](https://docs.docker.com/get-docker/)
- **Docker Compose**: Usually included with Docker Desktop
- **AWS CLI**: [Installation Guide](https://aws.amazon.com/cli/)

### Optional

- **Visual Studio Code**: [Download](https://code.visualstudio.com/)
- **Postman** or **Insomnia**: For API testing

## Quick Setup

The fastest way to set up your development environment:

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd nexis-fullstack-transformation

# Run the setup script
bash scripts/setup.sh
```

This script will:
- ✅ Check Node.js and npm versions
- ✅ Install frontend and backend dependencies
- ✅ Create environment files from templates
- ✅ Start Docker services (LocalStack and DynamoDB Local)
- ✅ Initialize S3 buckets and DynamoDB tables
- ✅ Verify all services are running

## Manual Setup

If you prefer to set up components individually:

### 1. Install Dependencies

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### 2. Create Environment Files

```bash
# Copy environment templates
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

### 3. Start Docker Services

```bash
# Start LocalStack and DynamoDB Local
docker-compose up -d

# Verify services are running
docker ps
```

### 4. Initialize Local AWS Services

```bash
# Initialize LocalStack S3 buckets
bash scripts/init-localstack.sh

# Initialize DynamoDB Local tables
bash scripts/init-local-dynamodb.sh
```

## Environment Configuration

### Frontend Environment Variables

The frontend uses Vite for environment variable management. All variables must be prefixed with `VITE_`.

**File**: `frontend/.env`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:4566
VITE_API_KEY=dev-api-key-replace-in-production

# Environment
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_CHAT_ASSISTANT=true
VITE_ENABLE_AI_EXPLANATIONS=true
VITE_ENABLE_OFFLINE_MODE=true

# Development Settings
VITE_ENABLE_DEBUG_LOGS=true
VITE_MOCK_API_RESPONSES=false
```

**Environment-Specific Files**:
- `frontend/.env.example` - Development template
- `frontend/.env.staging.example` - Staging template
- `frontend/.env.production.example` - Production template

### Backend Environment Variables

The backend uses Node.js environment variables for configuration.

**File**: `backend/.env`

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=000000000000
AWS_ENDPOINT_URL=http://localhost:4566

# DynamoDB Configuration
DYNAMODB_ENDPOINT=http://localhost:8000

# DynamoDB Tables
USERS_TABLE=nexis-users-dev
ELIGIBILITY_RESULTS_TABLE=nexis-eligibility-results-dev
USER_SESSIONS_TABLE=nexis-user-sessions-dev
SCHEMES_TABLE=nexis-schemes-dev
EXPLANATION_CACHE_TABLE=nexis-explanation-cache-dev

# S3 Buckets
KNOWLEDGE_BASE_BUCKET=nexis-knowledge-base-dev
SCHEMES_BUCKET=nexis-knowledge-base-dev

# Amazon Bedrock
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
BEDROCK_REGION=us-east-1
MOCK_BEDROCK=true

# Application Settings
LOG_LEVEL=DEBUG
MAX_CONTEXT_MESSAGES=10
CACHE_TTL_DAYS=7

# Environment
ENVIRONMENT=development
NODE_ENV=development

# LocalStack Configuration
USE_LOCALSTACK=true
LOCALSTACK_ENDPOINT=http://localhost:4566
```

**Environment-Specific Files**:
- `backend/.env.example` - Development template
- `backend/.env.staging.example` - Staging template
- `backend/.env.production.example` - Production template

## AWS CLI Profiles

For deploying to actual AWS environments, configure AWS CLI profiles:

### Automatic Configuration

```bash
bash scripts/configure-aws-profiles.sh
```

This interactive script will guide you through setting up profiles for:
- `nexis-dev` - Development environment
- `nexis-staging` - Staging environment
- `nexis-prod` - Production environment

### Manual Configuration

```bash
# Configure development profile
aws configure --profile nexis-dev
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)

# Configure staging profile
aws configure --profile nexis-staging

# Configure production profile
aws configure --profile nexis-prod
```

### Using Profiles

```bash
# Set default profile for current session
export AWS_PROFILE=nexis-dev

# Or use --profile flag with AWS CLI commands
aws s3 ls --profile nexis-dev

# Verify profile
aws sts get-caller-identity --profile nexis-dev
```

## Local Development Services

### LocalStack

LocalStack simulates AWS services locally for development and testing.

**Services Provided**:
- S3 (Object Storage)
- API Gateway
- Lambda
- IAM
- CloudWatch Logs

**Endpoints**:
- Gateway: `http://localhost:4566`
- Health Check: `http://localhost:4566/_localstack/health`

**Usage**:

```bash
# Start LocalStack
docker-compose up -d localstack

# Check status
curl http://localhost:4566/_localstack/health

# List S3 buckets
aws s3 ls --endpoint-url http://localhost:4566

# Upload file to S3
aws s3 cp file.txt s3://nexis-knowledge-base-dev/ --endpoint-url http://localhost:4566
```

### DynamoDB Local

DynamoDB Local provides a local database for development.

**Endpoints**:
- DynamoDB: `http://localhost:8000`
- Admin UI: `http://localhost:8001`

**Usage**:

```bash
# Start DynamoDB Local
docker-compose up -d dynamodb-local

# List tables
aws dynamodb list-tables --endpoint-url http://localhost:8000

# Scan table
aws dynamodb scan --table-name nexis-users-dev --endpoint-url http://localhost:8000

# Access Admin UI
open http://localhost:8001
```

### DynamoDB Admin UI

A web-based interface for managing DynamoDB Local tables.

**Features**:
- View tables and items
- Create, update, delete items
- Query and scan operations
- Export/import data

**Access**: `http://localhost:8001`

## Troubleshooting

### Docker Services Not Starting

**Problem**: `docker-compose up` fails or services don't start

**Solutions**:
```bash
# Check Docker is running
docker ps

# View logs
docker-compose logs

# Restart services
docker-compose down
docker-compose up -d

# Remove volumes and restart (WARNING: deletes data)
docker-compose down -v
docker-compose up -d
```

### LocalStack Connection Refused

**Problem**: Cannot connect to LocalStack at `http://localhost:4566`

**Solutions**:
```bash
# Check if LocalStack is running
docker ps | grep localstack

# View LocalStack logs
docker logs nexis-localstack

# Restart LocalStack
docker-compose restart localstack

# Wait for LocalStack to be ready (can take 10-30 seconds)
sleep 15
curl http://localhost:4566/_localstack/health
```

### DynamoDB Local Connection Issues

**Problem**: Cannot connect to DynamoDB Local at `http://localhost:8000`

**Solutions**:
```bash
# Check if DynamoDB Local is running
docker ps | grep dynamodb

# View logs
docker logs nexis-dynamodb-local

# Restart DynamoDB Local
docker-compose restart dynamodb-local

# Test connection
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

### AWS CLI Profile Not Found

**Problem**: `aws` commands fail with "profile not found"

**Solutions**:
```bash
# List configured profiles
aws configure list-profiles

# Reconfigure profile
aws configure --profile nexis-dev

# Check profile configuration
cat ~/.aws/credentials
cat ~/.aws/config
```

### Port Already in Use

**Problem**: Docker services fail to start due to port conflicts

**Solutions**:
```bash
# Check what's using the port
lsof -i :4566  # LocalStack
lsof -i :8000  # DynamoDB Local
lsof -i :8001  # DynamoDB Admin

# Kill the process or change ports in docker-compose.yml
```

### Node.js Version Issues

**Problem**: Setup script fails due to Node.js version

**Solutions**:
```bash
# Check current version
node -v

# Install Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 18
nvm install 18
nvm use 18

# Verify version
node -v
```

### Permission Denied on Scripts

**Problem**: Cannot execute setup scripts

**Solutions**:
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Or run with bash
bash scripts/setup.sh
```

### Environment Variables Not Loading

**Problem**: Application doesn't recognize environment variables

**Solutions**:
```bash
# Verify .env file exists
ls -la frontend/.env
ls -la backend/.env

# Check file contents
cat frontend/.env

# Restart development server after changing .env
# Frontend: Ctrl+C and npm run dev
# Backend: Restart Lambda/tests
```

## Next Steps

After completing the environment setup:

1. **Start Development Servers**:
   ```bash
   # Frontend (in one terminal)
   cd frontend
   npm run dev
   
   # Backend tests (in another terminal)
   cd backend
   npm run test
   ```

2. **Verify Setup**:
   - Frontend: `http://localhost:5173`
   - DynamoDB Admin: `http://localhost:8001`
   - LocalStack Health: `http://localhost:4566/_localstack/health`

3. **Read Documentation**:
   - [Quick Start Guide](./QUICK_START.md)
   - [Project Structure](./PROJECT_STRUCTURE.md)
   - [API Documentation](./API_DOCUMENTATION.md)

4. **Start Development**:
   - Review the [Technical Design Document](../.kiro/specs/nexis-fullstack-transformation/design.md)
   - Check the [Task List](../.kiro/specs/nexis-fullstack-transformation/tasks.md)
   - Follow the [Development Workflow](./DEVELOPMENT_WORKFLOW.md)

## Additional Resources

- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/)
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [DynamoDB Local Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
- [Docker Documentation](https://docs.docker.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/your-org/nexis/issues)
2. Review the [FAQ](./FAQ.md)
3. Contact the development team
4. Consult the [Technical Design Document](../.kiro/specs/nexis-fullstack-transformation/design.md)

---

**Last Updated**: 2024-03-15  
**Version**: 1.0
