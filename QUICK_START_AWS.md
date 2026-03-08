# NEXIS - Quick Start with AWS Backend

## 🚀 Switch from Mock to Real AWS in 3 Steps

This guide helps you quickly deploy NEXIS to AWS and connect your frontend.

---

## Prerequisites

1. **AWS Account** with admin access
2. **AWS CLI** installed and configured
3. **Node.js** v18+ installed
4. **Amazon Bedrock Access** (request before deployment)

---

## Step 1: Configure AWS CLI

```bash
# Configure AWS credentials
aws configure

# Enter your credentials:
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region: us-east-1
# Default output format: json

# Verify
aws sts get-caller-identity
```

---

## Step 2: Request Amazon Bedrock Access

**IMPORTANT**: Do this BEFORE deployment!

1. Go to [AWS Console → Amazon Bedrock](https://console.aws.amazon.com/bedrock)
2. Click "Model access" in left menu
3. Click "Request model access"
4. Select **"Anthropic Claude 3 Haiku"**
5. Submit request (usually instant approval)

---

## Step 3: Deploy to AWS

### Option A: Quick Setup (Recommended)

```bash
# On Linux/Mac
chmod +x scripts/quick-aws-setup.sh
./scripts/quick-aws-setup.sh dev

# On Windows (Git Bash or WSL)
bash scripts/quick-aws-setup.sh dev
```

This single command will:
- ✅ Deploy all AWS infrastructure
- ✅ Create DynamoDB tables
- ✅ Deploy Lambda functions
- ✅ Set up API Gateway
- ✅ Configure CloudWatch monitoring
- ✅ Update frontend configuration
- ✅ Test API connection

**Time**: 5-10 minutes

### Option B: Manual Deployment

```bash
# 1. Deploy backend
cd backend/cloudformation
bash ../scripts/deploy-to-aws.sh dev

# 2. Get API endpoint
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name nexis-api-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text)

# 3. Get API key
API_KEY_ID=$(aws cloudformation describe-stacks \
  --stack-name nexis-api-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`APIKeyId`].OutputValue' \
  --output text)

API_KEY=$(aws apigateway get-api-key \
  --api-key $API_KEY_ID \
  --include-value \
  --query 'value' \
  --output text)

# 4. Configure frontend
cd ../../frontend
cat > .env << EOF
VITE_API_BASE_URL=${API_ENDPOINT}
VITE_API_KEY=${API_KEY}
VITE_ENVIRONMENT=development
VITE_ENABLE_CHAT_ASSISTANT=true
VITE_ENABLE_AI_EXPLANATIONS=true
VITE_ENABLE_OFFLINE_MODE=false
VITE_ENABLE_DEBUG_LOGS=true
VITE_MOCK_API_RESPONSES=false
EOF
```

---

## Step 4: Test Your Deployment

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000

### Test API Directly

```bash
# Test health check
curl ${API_ENDPOINT}/health

# Test eligibility check
curl -X POST ${API_ENDPOINT}/eligibility/check \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: ${API_KEY}" \
  -d '{
    "profile": {
      "age": 45,
      "state": "Maharashtra",
      "occupation": "Farmer",
      "annualIncome": 150000,
      "gender": "Male",
      "socialCategory": "General",
      "hasDisability": false
    }
  }'
```

---

## What Gets Deployed?

### AWS Resources Created

1. **DynamoDB Tables** (5)
   - nexis-users-dev
   - nexis-eligibility-results-dev
   - nexis-user-sessions-dev
   - nexis-schemes-dev
   - nexis-explanation-cache-dev

2. **Lambda Functions** (5)
   - nexis-eligibility-checker-dev
   - nexis-ai-explanation-dev
   - nexis-chat-assistant-dev
   - nexis-profile-manager-dev
   - nexis-scheme-uploader-dev

3. **S3 Bucket** (1)
   - nexis-knowledge-base-dev (for scheme documents)

4. **API Gateway** (1)
   - REST API with 5 endpoints
   - API key authentication
   - CORS enabled

5. **CloudWatch** (2 dashboards, 7 alarms)
   - Operations dashboard
   - Business metrics dashboard

6. **IAM Roles** (5)
   - One role per Lambda function
   - Least-privilege policies

---

## Frontend Configuration Changes

### Before (Mock API)
```env
VITE_API_BASE_URL=http://localhost:4566
VITE_API_KEY=dev-api-key
VITE_MOCK_API_RESPONSES=true
```

### After (AWS Backend)
```env
VITE_API_BASE_URL=https://abc123.execute-api.us-east-1.amazonaws.com/dev
VITE_API_KEY=your-real-api-key
VITE_MOCK_API_RESPONSES=false
```

---

## Monitoring Your Deployment

### CloudWatch Dashboards

```bash
# View dashboards
aws cloudwatch list-dashboards --region us-east-1

# Open in browser
https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:
```

### Lambda Logs

```bash
# View logs in real-time
aws logs tail /aws/lambda/nexis-eligibility-checker-dev --follow

# View last 100 lines
aws logs tail /aws/lambda/nexis-eligibility-checker-dev --since 1h
```

### API Gateway Logs

```bash
aws logs tail /aws/apigateway/nexis-dev --follow
```

---

## Cost Estimate

### Development Environment
- **Monthly Cost**: ~$35
  - Lambda: $15
  - DynamoDB: $5
  - S3: $2
  - API Gateway: $3.50
  - Bedrock: $5
  - CloudWatch: $5

### Production Environment
- **Monthly Cost**: ~$100-150 (with higher traffic)

---

## Troubleshooting

### Issue: Lambda Timeout

```bash
# Increase timeout to 60 seconds
aws lambda update-function-configuration \
  --function-name nexis-eligibility-checker-dev \
  --timeout 60
```

### Issue: Bedrock Access Denied

1. Go to AWS Console → Amazon Bedrock
2. Request model access
3. Wait for approval
4. Redeploy Lambda functions

### Issue: API 403 Errors

```bash
# Verify API key
aws apigateway get-api-key \
  --api-key $API_KEY_ID \
  --include-value
```

### Issue: Frontend Can't Connect

1. Check `.env` file has correct API endpoint
2. Verify API key is correct
3. Check browser console for CORS errors
4. Verify API Gateway CORS configuration

---

## Cleanup (Delete Everything)

**WARNING**: This permanently deletes all data!

```bash
# On Linux/Mac
chmod +x scripts/cleanup-aws.sh
./scripts/cleanup-aws.sh dev

# On Windows (Git Bash or WSL)
bash scripts/cleanup-aws.sh dev
```

This will delete:
- All CloudFormation stacks
- All DynamoDB data
- All S3 files
- All Lambda functions
- All CloudWatch dashboards

---

## Next Steps

1. ✅ **Load More Schemes**: Upload all 500 government schemes to S3
2. ✅ **Custom Domain**: Configure Route 53 and CloudFront
3. ✅ **CI/CD**: Set up GitHub Actions for automated deployment
4. ✅ **Production Deploy**: Deploy to production environment
5. ✅ **Performance Testing**: Load test with JMeter
6. ✅ **Security Audit**: Run AWS Security Hub scan

---

## Useful Commands

### View All Stacks
```bash
aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
  --region us-east-1
```

### Get API Endpoint
```bash
aws cloudformation describe-stacks \
  --stack-name nexis-api-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text
```

### View Lambda Functions
```bash
aws lambda list-functions \
  --query 'Functions[?starts_with(FunctionName, `nexis`)].FunctionName' \
  --output table
```

### View DynamoDB Tables
```bash
aws dynamodb list-tables \
  --query 'TableNames[?starts_with(@, `nexis`)]' \
  --output table
```

---

## Support

- **Documentation**: See `AWS_DEPLOYMENT_GUIDE.md` for detailed guide
- **CloudWatch Logs**: Check Lambda logs for errors
- **AWS Console**: Monitor resources in AWS Console
- **Issues**: Check CloudFormation events for deployment issues

---

## Summary

You now have:
- ✅ Full AWS backend infrastructure
- ✅ Real API endpoints (not mock)
- ✅ DynamoDB for data storage
- ✅ S3 for scheme documents
- ✅ Lambda functions for business logic
- ✅ CloudWatch for monitoring
- ✅ Frontend connected to AWS

**Your NEXIS application is production-ready!** 🎉

---

## Quick Reference

| Resource | Command |
|----------|---------|
| Deploy | `bash scripts/quick-aws-setup.sh dev` |
| Test API | `curl ${API_ENDPOINT}/health` |
| View Logs | `aws logs tail /aws/lambda/nexis-eligibility-checker-dev --follow` |
| Cleanup | `bash scripts/cleanup-aws.sh dev` |
| Get Endpoint | `aws cloudformation describe-stacks --stack-name nexis-api-dev --query 'Stacks[0].Outputs[?OutputKey==\`ApiEndpoint\`].OutputValue' --output text` |

---

**Ready to deploy? Run:**
```bash
bash scripts/quick-aws-setup.sh dev
```
