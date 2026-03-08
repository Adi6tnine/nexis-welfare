#!/bin/bash

# NEXIS Quick AWS Setup Script
# This script helps you quickly set up AWS backend and connect frontend

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   NEXIS Quick AWS Setup                ║${NC}"
echo -e "${BLUE}║   From Mock to Production              ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not configured${NC}"
    echo ""
    echo "Please run: aws configure"
    echo ""
    echo "You'll need:"
    echo "  - AWS Access Key ID"
    echo "  - AWS Secret Access Key"
    echo "  - Default region (us-east-1 recommended)"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✓ AWS Account: ${ACCOUNT_ID}${NC}"

# Get environment
ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-east-1}

echo -e "${GREEN}✓ Environment: ${ENVIRONMENT}${NC}"
echo -e "${GREEN}✓ Region: ${AWS_REGION}${NC}"
echo ""

# Check Bedrock access
echo -e "${YELLOW}Checking Amazon Bedrock access...${NC}"
if aws bedrock list-foundation-models --region ${AWS_REGION} &> /dev/null 2>&1; then
    echo -e "${GREEN}✓ Bedrock access confirmed${NC}"
else
    echo -e "${YELLOW}⚠ Bedrock access not available${NC}"
    echo -e "${YELLOW}  AI features will not work until you request access${NC}"
    echo ""
    echo "To request access:"
    echo "  1. Go to AWS Console → Amazon Bedrock"
    echo "  2. Click 'Model access' in left menu"
    echo "  3. Click 'Request model access'"
    echo "  4. Select 'Anthropic Claude 3 Haiku'"
    echo "  5. Submit request (usually instant approval)"
    echo ""
    read -p "Continue without Bedrock? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 1: Deploy Backend Infrastructure${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Check if deployment script exists
if [ ! -f "scripts/deploy-to-aws.sh" ]; then
    echo -e "${RED}❌ Deployment script not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Make deployment script executable
chmod +x scripts/deploy-to-aws.sh

# Run deployment
echo "Deploying backend infrastructure..."
echo "This will take 5-10 minutes..."
echo ""

./scripts/deploy-to-aws.sh ${ENVIRONMENT}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    echo "Check the error messages above"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Backend deployed successfully${NC}"
echo ""

# Get API endpoint
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 2: Get API Configuration${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name nexis-api-${ENVIRONMENT} \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text \
  --region ${AWS_REGION} 2>/dev/null || echo "")

if [ -z "$API_ENDPOINT" ]; then
    echo -e "${YELLOW}⚠ Could not retrieve API endpoint${NC}"
    echo "You may need to wait a few minutes for API Gateway to be ready"
    echo ""
    echo "Run this command later to get the endpoint:"
    echo "  aws cloudformation describe-stacks --stack-name nexis-api-${ENVIRONMENT} --query 'Stacks[0].Outputs[?OutputKey==\`ApiEndpoint\`].OutputValue' --output text"
    exit 0
fi

echo -e "${GREEN}API Endpoint: ${API_ENDPOINT}${NC}"

# Get API Key
API_KEY_ID=$(aws cloudformation describe-stacks \
  --stack-name nexis-api-${ENVIRONMENT} \
  --query 'Stacks[0].Outputs[?OutputKey==`APIKeyId`].OutputValue' \
  --output text \
  --region ${AWS_REGION} 2>/dev/null || echo "")

if [ -n "$API_KEY_ID" ]; then
    API_KEY=$(aws apigateway get-api-key \
      --api-key $API_KEY_ID \
      --include-value \
      --query 'value' \
      --output text \
      --region ${AWS_REGION} 2>/dev/null || echo "dev-api-key")
    echo -e "${GREEN}API Key: ${API_KEY}${NC}"
else
    API_KEY="dev-api-key"
    echo -e "${YELLOW}⚠ Using default API key${NC}"
fi

echo ""

# Configure frontend
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 3: Configure Frontend${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

cd frontend

# Create .env file
cat > .env << EOF
# AWS Backend Configuration
VITE_API_BASE_URL=${API_ENDPOINT}
VITE_API_KEY=${API_KEY}
VITE_ENVIRONMENT=${ENVIRONMENT}

# Feature Flags
VITE_ENABLE_CHAT_ASSISTANT=true
VITE_ENABLE_AI_EXPLANATIONS=true
VITE_ENABLE_OFFLINE_MODE=false
VITE_ENABLE_DEBUG_LOGS=true
VITE_MOCK_API_RESPONSES=false
EOF

echo -e "${GREEN}✓ Frontend .env file created${NC}"

# Create production env file
cat > .env.production << EOF
# AWS Backend Configuration
VITE_API_BASE_URL=${API_ENDPOINT}
VITE_API_KEY=${API_KEY}
VITE_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_CHAT_ASSISTANT=true
VITE_ENABLE_AI_EXPLANATIONS=true
VITE_ENABLE_OFFLINE_MODE=false
VITE_ENABLE_DEBUG_LOGS=false
VITE_MOCK_API_RESPONSES=false
EOF

echo -e "${GREEN}✓ Frontend .env.production file created${NC}"
echo ""

# Test API
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 4: Test API Connection${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

echo "Testing API endpoint..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" ${API_ENDPOINT}/health 2>/dev/null || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
    echo -e "${GREEN}✓ API is responding${NC}"
else
    echo -e "${YELLOW}⚠ API health check returned: ${HEALTH_CHECK}${NC}"
    echo "The API might still be initializing. Wait a few minutes and try again."
fi

echo ""

# Summary
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Your NEXIS application is now connected to AWS!${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the frontend development server:"
echo -e "   ${YELLOW}cd frontend && npm run dev${NC}"
echo ""
echo "2. Open your browser to:"
echo -e "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "3. Test the application with real AWS backend"
echo ""
echo "4. View CloudWatch dashboards:"
echo -e "   ${YELLOW}https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:${NC}"
echo ""
echo "5. Monitor Lambda functions:"
echo -e "   ${YELLOW}https://console.aws.amazon.com/lambda/home?region=${AWS_REGION}${NC}"
echo ""
echo -e "${BLUE}API Configuration:${NC}"
echo "  Endpoint: ${API_ENDPOINT}"
echo "  API Key: ${API_KEY}"
echo "  Region: ${AWS_REGION}"
echo "  Environment: ${ENVIRONMENT}"
echo ""
echo -e "${YELLOW}Important Notes:${NC}"
echo "  - AI features require Amazon Bedrock access"
echo "  - Check CloudWatch logs if you encounter issues"
echo "  - Estimated cost: ~\$35/month for dev environment"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""

# Save configuration
cd ..
cat > aws-config-${ENVIRONMENT}.txt << EOF
NEXIS AWS Configuration
Environment: ${ENVIRONMENT}
Region: ${AWS_REGION}
Account: ${ACCOUNT_ID}
Configured: $(date)

API Endpoint: ${API_ENDPOINT}
API Key: ${API_KEY}

CloudFormation Stacks:
- nexis-iam-${ENVIRONMENT}
- nexis-storage-${ENVIRONMENT}
- nexis-compute-${ENVIRONMENT}
- nexis-api-${ENVIRONMENT}
- nexis-monitoring-${ENVIRONMENT}

To view resources:
  aws cloudformation list-stacks --region ${AWS_REGION}

To view logs:
  aws logs tail /aws/lambda/nexis-eligibility-checker-${ENVIRONMENT} --follow

To delete all resources:
  ./scripts/cleanup-aws.sh ${ENVIRONMENT}
EOF

echo -e "${GREEN}Configuration saved to: aws-config-${ENVIRONMENT}.txt${NC}"
echo ""
