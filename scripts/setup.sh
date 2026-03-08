#!/bin/bash

# NEXIS Development Environment Setup Script

set -e

echo "🚀 Setting up NEXIS development environment..."
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18.x or higher is required"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Check npm
echo "📦 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi
echo "✅ npm version: $(npm -v)"

# Check Docker
echo ""
echo "🐳 Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "⚠️  Warning: Docker is not installed"
    echo "   Docker is required for LocalStack and local DynamoDB"
    echo "   Install Docker from: https://docs.docker.com/get-docker/"
    DOCKER_AVAILABLE=false
else
    echo "✅ Docker version: $(docker --version)"
    DOCKER_AVAILABLE=true
fi

# Check Docker Compose
if [ "$DOCKER_AVAILABLE" = true ]; then
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
        echo "⚠️  Warning: Docker Compose is not installed"
        DOCKER_COMPOSE_AVAILABLE=false
    else
        if command -v docker-compose &> /dev/null; then
            echo "✅ Docker Compose version: $(docker-compose --version)"
        else
            echo "✅ Docker Compose version: $(docker compose version)"
        fi
        DOCKER_COMPOSE_AVAILABLE=true
    fi
fi

# Check AWS CLI
echo ""
echo "🔧 Checking AWS CLI..."
if command -v aws &> /dev/null; then
    echo "✅ AWS CLI version: $(aws --version)"
    AWS_CLI_AVAILABLE=true
else
    echo "⚠️  Warning: AWS CLI not found"
    echo "   Install it from: https://aws.amazon.com/cli/"
    echo "   AWS CLI is required for LocalStack and DynamoDB Local setup"
    AWS_CLI_AVAILABLE=false
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd ../backend
npm install
echo "✅ Backend dependencies installed"

# Create environment files if they don't exist
echo ""
echo "🔧 Setting up environment files..."
cd ..

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
else
    echo "ℹ️  frontend/.env already exists"
fi

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
else
    echo "ℹ️  backend/.env already exists"
fi

# Start Docker services if available
if [ "$DOCKER_AVAILABLE" = true ] && [ "$DOCKER_COMPOSE_AVAILABLE" = true ]; then
    echo ""
    echo "🐳 Starting Docker services (LocalStack and DynamoDB Local)..."
    
    # Check if services are already running
    if docker ps | grep -q "nexis-localstack\|nexis-dynamodb-local"; then
        echo "ℹ️  Docker services are already running"
    else
        docker-compose up -d
        echo "✅ Docker services started"
        
        # Wait for services to be ready
        echo "⏳ Waiting for services to be ready..."
        sleep 10
    fi
fi

# Initialize LocalStack S3 buckets
if [ "$AWS_CLI_AVAILABLE" = true ] && [ "$DOCKER_AVAILABLE" = true ]; then
    echo ""
    echo "☁️  Initializing LocalStack S3 buckets..."
    
    # Make script executable
    chmod +x scripts/init-localstack.sh
    
    # Run initialization script
    if bash scripts/init-localstack.sh; then
        echo "✅ LocalStack initialized"
    else
        echo "⚠️  LocalStack initialization failed (service may not be ready yet)"
        echo "   You can run 'bash scripts/init-localstack.sh' manually later"
    fi
fi

# Initialize DynamoDB Local tables
if [ "$AWS_CLI_AVAILABLE" = true ] && [ "$DOCKER_AVAILABLE" = true ]; then
    echo ""
    echo "🗄️  Initializing DynamoDB Local tables..."
    
    # Make script executable
    chmod +x scripts/init-local-dynamodb.sh
    
    # Run initialization script
    if bash scripts/init-local-dynamodb.sh; then
        echo "✅ DynamoDB Local initialized"
    else
        echo "⚠️  DynamoDB Local initialization failed (service may not be ready yet)"
        echo "   You can run 'bash scripts/init-local-dynamodb.sh' manually later"
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Configure AWS CLI profiles (if deploying to AWS):"
echo "   bash scripts/configure-aws-profiles.sh"
echo ""
echo "2. Start the development environment:"
echo "   - Frontend: cd frontend && npm run dev"
echo "   - Backend tests: cd backend && npm run test"
echo ""
echo "3. Access local services:"
echo "   - Frontend: http://localhost:5173"
echo "   - LocalStack: http://localhost:4566"
echo "   - DynamoDB Local: http://localhost:8000"
echo "   - DynamoDB Admin UI: http://localhost:8001"
echo ""
echo "4. View documentation:"
echo "   - Environment Setup: docs/ENVIRONMENT_SETUP.md"
echo "   - Quick Start: docs/QUICK_START.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Display warnings if any tools are missing
if [ "$DOCKER_AVAILABLE" = false ] || [ "$AWS_CLI_AVAILABLE" = false ]; then
    echo "⚠️  WARNINGS:"
    [ "$DOCKER_AVAILABLE" = false ] && echo "   - Docker is not installed (required for local development)"
    [ "$AWS_CLI_AVAILABLE" = false ] && echo "   - AWS CLI is not installed (required for AWS operations)"
    echo ""
fi

