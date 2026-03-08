# 🚀 NEXIS Deployment Guide

## Complete deployment instructions for Auth Lambda, API Gateway, and Real Bedrock

---

## Prerequisites

### 1. AWS Account Setup
- AWS account with admin access
- AWS CLI installed and configured
- AWS credentials set up (`aws configure`)

### 2. AWS Bedrock Access
```bash
# Request model access in AWS Console
# Go to: AWS Bedrock > Model access > Request access
# Enable: Claude 3 Haiku
```

### 3. Required Tools
- Node.js 18+ and npm
- AWS CLI 2.x
- PowerShell (Windows) or Bash (Linux/Mac)
- Git

---

## Quick Deployment (5 minutes)

### Option 1: PowerShell (Windows)

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Deploy Auth Stack
.\deploy-auth.ps1 -Environment dev -Region us-east-1

# Enable Real Bedrock
.\enable-real-bedrock.ps1 -Environment dev -Region us-east-1
```

### Option 2: Bash (Linux/Mac)

```bash
# Navigate to backend
cd backend

# Make scripts executable
chmod +x deploy-auth.sh enable-real-bedrock.sh

# Install dependencies
npm install

# Deploy Auth Stack
./deploy-auth.sh dev us-east-1

# Enable Real Bedrock
./enable-real-bedrock.sh dev us-east-1
```

---

## Step-by-Step Deployment

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- AWS SDK packages
- bcryptjs (password hashing)
- jsonwebtoken (JWT tokens)
- TypeScript and build tools

### Step 2: Build TypeScript

```bash
npm run build
```

Compiles TypeScript to JavaScript in `dist/` folder.

### Step 3: Deploy Auth Stack

**PowerShell:**
```powershell
.\deploy-auth.ps1 -Environment dev -Region us-east-1 -JWTSecret "your-secret-key"
```

**Bash:**
```bash
./deploy-auth.sh dev us-east-1 "your-secret-key"
```

This creates:
- DynamoDB table: `nexis-users-dev`
- Lambda function: `nexis-auth-dev`
- API Gateway: Auth endpoints
- IAM roles and permissions

**Output:**
```
API Gateway URL: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev

Endpoints:
  POST https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/auth/register
  POST https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/auth/login
  GET  https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/auth/verify
  PUT  https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/auth/profile
```

### Step 4: Update Frontend Environment

Create/update `frontend/.env`:

```env
VITE_API_BASE_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
VITE_API_KEY=your-api-key-here
```

### Step 5: Enable Real Bedrock

**PowerShell:**
```powershell
.\enable-real-bedrock.ps1 -Environment dev -Region us-east-1
```

**Bash:**
```bash
./enable-real-bedrock.sh dev us-east-1
```

This sets `MOCK_BEDROCK=false` for:
- `nexis-chat-assistant-dev`
- `nexis-ai-explanation-dev`
- `nexis-eligibility-checker-dev`

### Step 6: Test Deployment

```bash
# Test auth endpoint
curl -X POST https://your-api-url/dev/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Should return:
# {
#   "statusCode": 201,
#   "data": {
#     "user": { ... },
#     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#     "expiresAt": "2026-03-15T..."
#   }
# }
```

---

## Manual Deployment (Alternative)

### 1. Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name nexis-users-dev \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=EmailIndex,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL} \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 2. Create IAM Role

```bash
# Create trust policy
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

# Create role
aws iam create-role \
  --role-name nexis-auth-lambda-role \
  --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name nexis-auth-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

### 3. Create Lambda Function

```bash
# Package code
cd backend
npm run build
cd dist
zip -r ../lambda.zip .
cd ..

# Create function
aws lambda create-function \
  --function-name nexis-auth-dev \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/nexis-auth-lambda-role \
  --handler lambda/auth/index.handler \
  --zip-file fileb://lambda.zip \
  --timeout 30 \
  --memory-size 512 \
  --environment Variables="{DYNAMODB_TABLE_USERS=nexis-users-dev,JWT_SECRET=your-secret}" \
  --region us-east-1
```

### 4. Create API Gateway

```bash
# Create REST API
aws apigateway create-rest-api \
  --name nexis-auth-api-dev \
  --region us-east-1

# Get API ID
API_ID=$(aws apigateway get-rest-apis \
  --query "items[?name=='nexis-auth-api-dev'].id" \
  --output text)

# Create resources and methods
# (See CloudFormation template for full configuration)
```

---

## Environment Variables

### Backend Lambda Functions

**Auth Lambda:**
```
DYNAMODB_TABLE_USERS=nexis-users-dev
JWT_SECRET=your-secret-key-here
ENVIRONMENT=dev
AWS_REGION=us-east-1
```

**Chat Assistant Lambda:**
```
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
MOCK_BEDROCK=false
DYNAMODB_TABLE_SESSIONS=nexis-sessions-dev
S3_BUCKET_SCHEMES=nexis-schemes-dev
```

**AI Explanation Lambda:**
```
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
MOCK_BEDROCK=false
DYNAMODB_TABLE_RESULTS=nexis-eligibility-results-dev
S3_BUCKET_SCHEMES=nexis-schemes-dev
```

**Eligibility Checker Lambda:**
```
DYNAMODB_TABLE_RESULTS=nexis-eligibility-results-dev
S3_BUCKET_SCHEMES=nexis-schemes-dev
```

### Frontend (.env)

```env
VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/dev
VITE_API_KEY=your-api-key-here
```

---

## Verification Checklist

### ✅ Auth Stack Deployed
```bash
# Check CloudFormation stack
aws cloudformation describe-stacks \
  --stack-name nexis-auth-dev \
  --region us-east-1

# Should show: CREATE_COMPLETE or UPDATE_COMPLETE
```

### ✅ DynamoDB Table Created
```bash
# Check table
aws dynamodb describe-table \
  --table-name nexis-users-dev \
  --region us-east-1

# Should show: TableStatus: ACTIVE
```

### ✅ Lambda Function Deployed
```bash
# Check function
aws lambda get-function \
  --function-name nexis-auth-dev \
  --region us-east-1

# Should show function details
```

### ✅ API Gateway Working
```bash
# Test register endpoint
curl -X POST https://your-api-url/dev/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'

# Should return 201 with user data and token
```

### ✅ Real Bedrock Enabled
```bash
# Check Lambda environment
aws lambda get-function-configuration \
  --function-name nexis-chat-assistant-dev \
  --region us-east-1 \
  --query "Environment.Variables.MOCK_BEDROCK"

# Should return: "false"
```

---

## Troubleshooting

### Issue: CloudFormation Stack Failed

**Check logs:**
```bash
aws cloudformation describe-stack-events \
  --stack-name nexis-auth-dev \
  --region us-east-1
```

**Common causes:**
- IAM permissions insufficient
- Table name already exists
- Invalid parameter values

**Solution:**
```bash
# Delete failed stack
aws cloudformation delete-stack \
  --stack-name nexis-auth-dev \
  --region us-east-1

# Wait for deletion
aws cloudformation wait stack-delete-complete \
  --stack-name nexis-auth-dev \
  --region us-east-1

# Redeploy
.\deploy-auth.ps1
```

### Issue: Lambda Function Not Found

**Check function exists:**
```bash
aws lambda list-functions \
  --region us-east-1 \
  --query "Functions[?contains(FunctionName, 'nexis')]"
```

**Solution:**
- Verify CloudFormation stack deployed successfully
- Check function name matches environment
- Ensure correct region

### Issue: API Gateway 403 Forbidden

**Check Lambda permissions:**
```bash
aws lambda get-policy \
  --function-name nexis-auth-dev \
  --region us-east-1
```

**Solution:**
```bash
# Add API Gateway permission
aws lambda add-permission \
  --function-name nexis-auth-dev \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --region us-east-1
```

### Issue: Bedrock Access Denied

**Check model access:**
- Go to AWS Console > Bedrock > Model access
- Ensure Claude 3 Haiku is enabled
- Wait 5-10 minutes for access to propagate

**Check IAM permissions:**
```json
{
  "Effect": "Allow",
  "Action": [
    "bedrock:InvokeModel",
    "bedrock:InvokeModelWithResponseStream"
  ],
  "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
}
```

### Issue: CORS Errors

**Update API Gateway:**
```bash
# Enable CORS for all methods
aws apigateway update-method \
  --rest-api-id YOUR_API_ID \
  --resource-id YOUR_RESOURCE_ID \
  --http-method POST \
  --patch-operations \
    op=replace,path=/methodResponses/200/responseParameters/method.response.header.Access-Control-Allow-Origin,value=true
```

---

## Cost Estimation

### Development Environment (1000 users/month)

**AWS Bedrock:**
- Input: ~500K tokens/month = $0.125
- Output: ~2M tokens/month = $2.50
- **Total: ~$2.65/month**

**Lambda:**
- Requests: ~50K/month
- Duration: ~5 seconds average
- **Total: Free tier**

**DynamoDB:**
- Storage: <1GB
- Reads/Writes: <25 units
- **Total: Free tier**

**API Gateway:**
- Requests: ~50K/month
- **Total: Free tier**

**S3:**
- Storage: <1GB
- **Total: ~$0.02/month**

**Total Estimated Cost: ~$3/month**

### Production Environment (10,000 users/month)

**AWS Bedrock:** ~$50-100/month  
**Lambda:** ~$5/month  
**DynamoDB:** ~$10/month  
**API Gateway:** ~$3.50/month  
**S3:** ~$0.50/month  

**Total Estimated Cost: ~$70-120/month**

---

## Rollback Procedure

### Rollback Auth Stack

```bash
# Delete CloudFormation stack
aws cloudformation delete-stack \
  --stack-name nexis-auth-dev \
  --region us-east-1

# Wait for deletion
aws cloudformation wait stack-delete-complete \
  --stack-name nexis-auth-dev \
  --region us-east-1
```

### Disable Real Bedrock

```powershell
# PowerShell
.\disable-real-bedrock.ps1 -Environment dev
```

```bash
# Bash
./disable-real-bedrock.sh dev
```

---

## Next Steps

1. ✅ Deploy Auth Stack
2. ✅ Enable Real Bedrock
3. ⏳ Deploy other Lambda functions (chat, eligibility)
4. ⏳ Test end-to-end flow
5. ⏳ Set up monitoring (CloudWatch)
6. ⏳ Configure alerts
7. ⏳ Set up CI/CD pipeline
8. ⏳ Deploy to staging
9. ⏳ Deploy to production

---

## Support

**AWS Documentation:**
- [Lambda](https://docs.aws.amazon.com/lambda/)
- [API Gateway](https://docs.aws.amazon.com/apigateway/)
- [DynamoDB](https://docs.aws.amazon.com/dynamodb/)
- [Bedrock](https://docs.aws.amazon.com/bedrock/)

**NEXIS Documentation:**
- `IMPLEMENTATION_GUIDE.md` - Technical guide
- `FEATURES_IMPLEMENTED.md` - What's built
- `QUICK_START.md` - Demo guide

---

**Deployment Status: Ready to Deploy! 🚀**
