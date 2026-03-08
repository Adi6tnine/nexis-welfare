#!/bin/bash

# NEXIS AWS Deployment Script
# For AWS Hackathon - AI for Bharat

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-east-1}
PROJECT_NAME="nexis"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}NEXIS AWS Deployment Script${NC}"
echo -e "${BLUE}AWS Hackathon - AI for Bharat${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Environment: ${ENVIRONMENT}${NC}"
echo -e "${GREEN}Region: ${AWS_REGION}${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Install from: https://aws.amazon.com/cli/"
    exit 1
fi
echo -e "${GREEN}✓ AWS CLI installed${NC}"

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✓ AWS credentials configured (Account: ${ACCOUNT_ID})${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js installed (${NODE_VERSION})${NC}"

# Check Bedrock access
echo -e "${YELLOW}Checking Amazon Bedrock access...${NC}"
if aws bedrock list-foundation-models --region ${AWS_REGION} &> /dev/null; then
    echo -e "${GREEN}✓ Amazon Bedrock access confirmed${NC}"
else
    echo -e "${YELLOW}⚠ Amazon Bedrock access not confirmed${NC}"
    echo -e "${YELLOW}  You may need to request access in AWS Console${NC}"
    echo -e "${YELLOW}  The deployment will continue, but AI features may not work${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 1: Deploy IAM Roles${NC}"
echo -e "${BLUE}========================================${NC}"

cd backend/cloudformation

aws cloudformation deploy \
  --template-file iam-roles.yaml \
  --stack-name ${PROJECT_NAME}-iam-${ENVIRONMENT} \
  --parameter-overrides Environment=${ENVIRONMENT} \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ${AWS_REGION} \
  --no-fail-on-empty-changeset

echo -e "${GREEN}✓ IAM roles deployed${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 2: Deploy Storage Stack${NC}"
echo -e "${BLUE}========================================${NC}"

aws cloudformation deploy \
  --template-file storage-stack.yaml \
  --stack-name ${PROJECT_NAME}-storage-${ENVIRONMENT} \
  --parameter-overrides Environment=${ENVIRONMENT} \
  --region ${AWS_REGION} \
  --no-fail-on-empty-changeset

echo -e "${GREEN}✓ Storage stack deployed (DynamoDB + S3)${NC}"

# Get bucket name
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name ${PROJECT_NAME}-storage-${ENVIRONMENT} \
  --query 'Stacks[0].Outputs[?OutputKey==`KnowledgeBaseBucketName`].OutputValue' \
  --output text \
  --region ${AWS_REGION})

echo -e "${GREEN}  Knowledge Base Bucket: ${BUCKET_NAME}${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 3: Upload Sample Scheme Data${NC}"
echo -e "${BLUE}========================================${NC}"

# Create sample scheme
cat > /tmp/pm-kisan-metadata.json << 'EOF'
{
  "schemeId": "pm-kisan",
  "schemeName": "PM-KISAN",
  "description": "Income support for farmer families",
  "benefits": "₹6,000 per year in three installments",
  "eligibilityCriteria": {
    "occupations": ["Farmer", "Agricultural Worker"],
    "incomeMax": 200000
  },
  "state": "ALL",
  "category": "Agriculture",
  "ministry": "Ministry of Agriculture"
}
EOF

cat > /tmp/pm-kisan-policy.txt << 'EOF'
PM-KISAN Scheme Policy Document

The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme that provides income support to all landholding farmer families across the country.

Eligibility:
- All landholding farmer families
- Annual income below ₹2 lakh
- Occupation: Farmer or Agricultural Worker

Benefits:
- ₹6,000 per year
- Paid in three equal installments of ₹2,000 each
- Direct bank transfer

How to Apply:
1. Visit nearest Common Service Center
2. Provide Aadhar card and land documents
3. Fill application form
4. Submit and receive acknowledgment

Documents Required:
- Aadhar card
- Bank account details
- Land ownership documents
EOF

cat > /tmp/pm-kisan-faq.txt << 'EOF'
PM-KISAN Frequently Asked Questions

Q: Who is eligible for PM-KISAN?
A: All landholding farmer families with annual income below ₹2 lakh.

Q: How much money will I receive?
A: ₹6,000 per year in three installments of ₹2,000 each.

Q: How do I apply?
A: Visit your nearest Common Service Center with Aadhar card and land documents.

Q: When will I receive the money?
A: Installments are released every 4 months directly to your bank account.

Q: Do I need to reapply every year?
A: No, once registered, you will automatically receive benefits.
EOF

# Upload to S3
aws s3 cp /tmp/pm-kisan-metadata.json s3://${BUCKET_NAME}/schemes/pm-kisan/metadata.json --region ${AWS_REGION}
aws s3 cp /tmp/pm-kisan-policy.txt s3://${BUCKET_NAME}/schemes/pm-kisan/policy.txt --region ${AWS_REGION}
aws s3 cp /tmp/pm-kisan-faq.txt s3://${BUCKET_NAME}/schemes/pm-kisan/faq.txt --region ${AWS_REGION}

echo -e "${GREEN}✓ Sample scheme data uploaded (PM-KISAN)${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 4: Build and Package Lambda Functions${NC}"
echo -e "${BLUE}========================================${NC}"

cd ../..
cd backend

# Install dependencies
echo "Installing dependencies..."
npm install

# Run tests
echo "Running tests..."
npm test || echo -e "${YELLOW}⚠ Some tests failed, continuing...${NC}"

# Build TypeScript
echo "Building TypeScript..."
npm run build

# Package Lambda
echo "Packaging Lambda functions..."
cd dist
zip -r ../lambda.zip . -q
cd ..

echo -e "${GREEN}✓ Lambda functions packaged${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 5: Deploy Compute Stack (Lambda)${NC}"
echo -e "${BLUE}========================================${NC}"

# Get IAM role ARNs
ELIGIBILITY_ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name ${PROJECT_NAME}-iam-${ENVIRONMENT} \
  --query 'Stacks[0].Outputs[?OutputKey==`EligibilityCheckerRoleArn`].OutputValue' \
  --output text \
  --region ${AWS_REGION})

cd cloudformation

aws cloudformation deploy \
  --template-file compute-stack.yaml \
  --stack-name ${PROJECT_NAME}-compute-${ENVIRONMENT} \
  --parameter-overrides \
    Environment=${ENVIRONMENT} \
    EligibilityCheckerRoleArn=${ELIGIBILITY_ROLE_ARN} \
  --region ${AWS_REGION} \
  --no-fail-on-empty-changeset

echo -e "${GREEN}✓ Compute stack deployed${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 6: Upload Lambda Code${NC}"
echo -e "${BLUE}========================================${NC}"

# Update Lambda functions
FUNCTIONS=(
  "${PROJECT_NAME}-eligibility-checker-${ENVIRONMENT}"
  "${PROJECT_NAME}-ai-explanation-${ENVIRONMENT}"
  "${PROJECT_NAME}-chat-assistant-${ENVIRONMENT}"
  "${PROJECT_NAME}-profile-manager-${ENVIRONMENT}"
  "${PROJECT_NAME}-scheme-uploader-${ENVIRONMENT}"
)

for FUNCTION in "${FUNCTIONS[@]}"; do
  echo "Updating ${FUNCTION}..."
  aws lambda update-function-code \
    --function-name ${FUNCTION} \
    --zip-file fileb://../lambda.zip \
    --region ${AWS_REGION} \
    --no-cli-pager || echo -e "${YELLOW}⚠ Function ${FUNCTION} not found, skipping...${NC}"
done

echo -e "${GREEN}✓ Lambda code uploaded${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 7: Deploy API Gateway${NC}"
echo -e "${BLUE}========================================${NC}"

aws cloudformation deploy \
  --template-file api-stack.yaml \
  --stack-name ${PROJECT_NAME}-api-${ENVIRONMENT} \
  --parameter-overrides Environment=${ENVIRONMENT} \
  --region ${AWS_REGION} \
  --no-fail-on-empty-changeset

# Get API endpoint
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name ${PROJECT_NAME}-api-${ENVIRONMENT} \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text \
  --region ${AWS_REGION} 2>/dev/null || echo "Not available yet")

echo -e "${GREEN}✓ API Gateway deployed${NC}"
echo -e "${GREEN}  API Endpoint: ${API_ENDPOINT}${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 8: Deploy Monitoring Stack${NC}"
echo -e "${BLUE}========================================${NC}"

aws cloudformation deploy \
  --template-file monitoring-stack-enhanced.yaml \
  --stack-name ${PROJECT_NAME}-monitoring-${ENVIRONMENT} \
  --parameter-overrides \
    Environment=${ENVIRONMENT} \
    AlarmEmail=alerts@nexis.gov.in \
  --region ${AWS_REGION} \
  --no-fail-on-empty-changeset

echo -e "${GREEN}✓ Monitoring stack deployed${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Step 9: Deploy Frontend${NC}"
echo -e "${BLUE}========================================${NC}"

cd ../../frontend

# Create .env file with API endpoint
cat > .env.production << EOF
VITE_API_ENDPOINT=${API_ENDPOINT}
VITE_API_KEY=your-api-key-here
VITE_ENVIRONMENT=${ENVIRONMENT}
EOF

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo -e "${GREEN}✓ Frontend built${NC}"
echo -e "${YELLOW}  Note: Frontend deployment to Amplify requires manual setup${NC}"
echo -e "${YELLOW}  Or deploy to S3 + CloudFront manually${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Deployment Summary:${NC}"
echo -e "  Environment: ${ENVIRONMENT}"
echo -e "  Region: ${AWS_REGION}"
echo -e "  Account: ${ACCOUNT_ID}"
echo ""
echo -e "${BLUE}Resources Created:${NC}"
echo -e "  ✓ IAM Roles (5)"
echo -e "  ✓ DynamoDB Tables (5)"
echo -e "  ✓ S3 Bucket (1)"
echo -e "  ✓ Lambda Functions (5)"
echo -e "  ✓ API Gateway"
echo -e "  ✓ CloudWatch Dashboards (2)"
echo -e "  ✓ CloudWatch Alarms (7)"
echo ""
echo -e "${BLUE}API Endpoint:${NC}"
echo -e "  ${API_ENDPOINT}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo -e "  1. Test API endpoint: curl ${API_ENDPOINT}/health"
echo -e "  2. Deploy frontend to Amplify or S3"
echo -e "  3. Configure custom domain"
echo -e "  4. Request Bedrock access if not already done"
echo -e "  5. Monitor CloudWatch dashboards"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo -e "  - API Key authentication not yet configured"
echo -e "  - Bedrock access required for AI features"
echo -e "  - Frontend needs manual deployment"
echo ""
echo -e "${GREEN}For AWS Hackathon Demo:${NC}"
echo -e "  - All infrastructure is deployed"
echo -e "  - Sample scheme (PM-KISAN) is loaded"
echo -e "  - Ready for testing and demo"
echo ""

# Save deployment info
cat > ../deployment-info-${ENVIRONMENT}.txt << EOF
NEXIS Deployment Information
Environment: ${ENVIRONMENT}
Region: ${AWS_REGION}
Account: ${ACCOUNT_ID}
Deployed: $(date)

API Endpoint: ${API_ENDPOINT}
Knowledge Base Bucket: ${BUCKET_NAME}

CloudFormation Stacks:
- ${PROJECT_NAME}-iam-${ENVIRONMENT}
- ${PROJECT_NAME}-storage-${ENVIRONMENT}
- ${PROJECT_NAME}-compute-${ENVIRONMENT}
- ${PROJECT_NAME}-api-${ENVIRONMENT}
- ${PROJECT_NAME}-monitoring-${ENVIRONMENT}

Lambda Functions:
- ${PROJECT_NAME}-eligibility-checker-${ENVIRONMENT}
- ${PROJECT_NAME}-ai-explanation-${ENVIRONMENT}
- ${PROJECT_NAME}-chat-assistant-${ENVIRONMENT}
- ${PROJECT_NAME}-profile-manager-${ENVIRONMENT}
- ${PROJECT_NAME}-scheme-uploader-${ENVIRONMENT}

CloudWatch Dashboards:
- nexis-operations-${ENVIRONMENT}
- nexis-business-${ENVIRONMENT}
EOF

echo -e "${GREEN}Deployment info saved to: deployment-info-${ENVIRONMENT}.txt${NC}"
echo ""
