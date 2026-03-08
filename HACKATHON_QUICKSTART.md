# NEXIS - AWS Hackathon Quick Start Guide
## AI for Bharat - Government Scheme Eligibility Platform

![Status](https://img.shields.io/badge/Status-Hackathon%20Ready-success)
![AWS](https://img.shields.io/badge/AWS-Serverless-orange)
![AI](https://img.shields.io/badge/AI-Bedrock%20Claude-blue)

## 🎯 Hackathon Project Overview

**NEXIS** (National Eligibility eXpert and Information System) is an AI-powered platform that helps Indian citizens discover government welfare schemes they're eligible for.

### Problem Statement
- 1000+ government schemes exist in India
- Citizens don't know which schemes they qualify for
- Complex eligibility criteria
- Language barriers
- Low digital literacy

### Our Solution
- **AI-Powered Eligibility Checking**: Instant matching with schemes
- **Natural Language Explanations**: Claude 3 Haiku explains decisions
- **Conversational AI Assistant**: RAG-powered chatbot
- **Multi-language Support**: English and Hindi
- **Accessible Design**: WCAG AA compliant for all citizens

## 🏗️ AWS Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  AWS Amplify    │  ← Frontend (React + Vite)
│  CloudFront     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │  ← REST API
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│         AWS Lambda Functions        │
│  ┌──────────┐  ┌──────────┐        │
│  │Eligibility│  │   AI     │        │
│  │ Checker  │  │Explanation│        │
│  └──────────┘  └──────────┘        │
│  ┌──────────┐  ┌──────────┐        │
│  │   Chat   │  │ Profile  │        │
│  │Assistant │  │ Manager  │        │
│  └──────────┘  └──────────┘        │
└─────────┬───────────────────────────┘
          │
    ┌─────┴─────┬──────────┬─────────┐
    ▼           ▼          ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│DynamoDB│ │   S3   │ │Bedrock │ │CloudWatch│
│Tables  │ │Knowledge│ │Claude 3│ │Monitoring│
│(5)     │ │  Base  │ │ Haiku  │ │Dashboards│
└────────┘ └────────┘ └────────┘ └────────┘
```

## 🚀 Quick Deployment (15 minutes)

### Prerequisites

```bash
# 1. AWS CLI installed and configured
aws --version
aws configure

# 2. Node.js 18+ installed
node --version  # Should be 18+

# 3. Git repository cloned
git clone <your-repo>
cd nexis
```

### One-Command Deployment

```bash
# Make script executable
chmod +x scripts/deploy-to-aws.sh

# Deploy everything to AWS
./scripts/deploy-to-aws.sh dev

# This will:
# ✓ Deploy IAM roles
# ✓ Create DynamoDB tables
# ✓ Create S3 bucket
# ✓ Deploy Lambda functions
# ✓ Configure API Gateway
# ✓ Set up CloudWatch monitoring
# ✓ Upload sample scheme data
```

### Expected Output

```
========================================
NEXIS AWS Deployment Script
AWS Hackathon - AI for Bharat
========================================

Environment: dev
Region: us-east-1

✓ IAM roles deployed
✓ Storage stack deployed (DynamoDB + S3)
✓ Sample scheme data uploaded (PM-KISAN)
✓ Lambda functions packaged
✓ Compute stack deployed
✓ Lambda code uploaded
✓ API Gateway deployed
  API Endpoint: https://xxxxx.execute-api.us-east-1.amazonaws.com/dev
✓ Monitoring stack deployed
✓ Frontend built

Deployment Complete!
```

## 🤖 Setting Up Amazon Bedrock (AI Features)

### Option 1: Request Bedrock Access (Recommended)

```bash
# 1. Go to AWS Console → Amazon Bedrock
# 2. Click "Model access"
# 3. Request access to "Claude 3 Haiku"
# 4. Wait for approval (usually instant)

# 5. Verify access
aws bedrock list-foundation-models --region us-east-1

# 6. Update Lambda environment variables
aws lambda update-function-configuration \
  --function-name nexis-ai-explanation-dev \
  --environment Variables="{MOCK_BEDROCK=false}" \
  --region us-east-1
```

### Option 2: Use Mock Mode (For Demo Without Bedrock)

```bash
# Enable mock mode (no Bedrock needed)
aws lambda update-function-configuration \
  --function-name nexis-ai-explanation-dev \
  --environment Variables="{MOCK_BEDROCK=true}" \
  --region us-east-1

aws lambda update-function-configuration \
  --function-name nexis-chat-assistant-dev \
  --environment Variables="{MOCK_BEDROCK=true}" \
  --region us-east-1
```

**See detailed guide**: `scripts/setup-bedrock-access.md`

## 🧪 Testing the Deployment

### Test 1: Check API Health

```bash
# Get your API endpoint from deployment output
API_ENDPOINT="https://xxxxx.execute-api.us-east-1.amazonaws.com/dev"

# Test health endpoint
curl ${API_ENDPOINT}/health
```

### Test 2: Check Eligibility

```bash
curl -X POST ${API_ENDPOINT}/eligibility/check \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "age": 30,
      "state": "MH",
      "occupation": "Farmer",
      "annualIncome": 100000,
      "gender": "Male",
      "socialCategory": "General",
      "hasDisability": false
    }
  }'
```

### Test 3: Test AI Explanation

```bash
curl -X POST ${API_ENDPOINT}/ai/explain \
  -H "Content-Type: application/json" \
  -d '{
    "schemeId": "pm-kisan",
    "language": "en"
  }'
```

### Test 4: Test Chat Assistant

```bash
curl -X POST ${API_ENDPOINT}/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is PM-KISAN scheme?",
    "userId": "test-user",
    "profile": {
      "age": 30,
      "state": "MH",
      "occupation": "Farmer",
      "annualIncome": 100000,
      "socialCategory": "General"
    },
    "language": "en"
  }'
```

## 📊 Monitoring Your Deployment

### CloudWatch Dashboards

```bash
# Open Operations Dashboard
echo "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=nexis-operations-dev"

# Open Business Metrics Dashboard
echo "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=nexis-business-dev"
```

### View Lambda Logs

```bash
# View eligibility checker logs
aws logs tail /aws/lambda/nexis-eligibility-checker-dev --follow

# View AI explanation logs
aws logs tail /aws/lambda/nexis-ai-explanation-dev --follow
```

### Check Metrics

```bash
# Lambda invocations
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=nexis-eligibility-checker-dev \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum
```

## 🎨 Frontend Deployment

### Option 1: AWS Amplify (Recommended)

```bash
# 1. Go to AWS Amplify Console
# 2. Click "New app" → "Host web app"
# 3. Connect your Git repository
# 4. Configure build settings:
#    - Build command: npm run build
#    - Output directory: dist
# 5. Add environment variables:
#    - VITE_API_ENDPOINT: <your-api-endpoint>
# 6. Deploy!
```

### Option 2: S3 + CloudFront

```bash
# Build frontend
cd frontend
npm install
npm run build

# Create S3 bucket
aws s3 mb s3://nexis-frontend-dev --region us-east-1

# Enable static website hosting
aws s3 website s3://nexis-frontend-dev \
  --index-document index.html \
  --error-document index.html

# Upload files
aws s3 sync dist/ s3://nexis-frontend-dev --delete

# Make public (for demo only)
aws s3api put-bucket-policy \
  --bucket nexis-frontend-dev \
  --policy file://bucket-policy.json
```

## 💰 Cost Estimate (Hackathon Demo)

### AWS Free Tier Eligible
- Lambda: 1M requests/month free
- DynamoDB: 25GB storage free
- S3: 5GB storage free
- API Gateway: 1M requests/month free

### Bedrock Costs (Pay-as-you-go)
- Claude 3 Haiku: $0.25 per 1M input tokens
- **Estimated for 100 demos**: < $1.00

### Total Estimated Cost for Hackathon
- **Development/Testing**: $0 (Free Tier)
- **Demo Day**: < $5
- **One Month**: < $20

## 🏆 Hackathon Demo Script

### 1. Introduction (2 minutes)
"NEXIS helps Indian citizens discover government schemes using AI..."

### 2. Live Demo (5 minutes)

**Scenario**: Farmer from Maharashtra
```
Age: 30
State: Maharashtra (MH)
Occupation: Farmer
Income: ₹1,00,000/year
```

**Show**:
1. Enter profile information
2. Get instant eligibility results
3. Click on PM-KISAN scheme
4. Get AI explanation in simple language
5. Ask chatbot: "How do I apply?"
6. Show Hindi language support

### 3. Technical Deep Dive (3 minutes)
- Show AWS architecture diagram
- Explain Bedrock integration
- Demonstrate RAG implementation
- Show CloudWatch monitoring

### 4. Impact & Future (2 minutes)
- Target: 100M+ Indian citizens
- Potential: Increase scheme uptake by 50%
- Future: Mobile app, more languages, voice interface

## 📝 Hackathon Submission Checklist

- [ ] GitHub repository public
- [ ] README with clear instructions
- [ ] Architecture diagram included
- [ ] Demo video recorded (< 5 minutes)
- [ ] AWS deployment working
- [ ] Bedrock integration demonstrated
- [ ] CloudWatch monitoring shown
- [ ] Code well-documented
- [ ] Accessibility features highlighted
- [ ] Cost optimization explained

## 🐛 Troubleshooting

### Issue: Deployment fails

```bash
# Check CloudFormation stack status
aws cloudformation describe-stacks \
  --stack-name nexis-storage-dev \
  --region us-east-1

# View stack events
aws cloudformation describe-stack-events \
  --stack-name nexis-storage-dev \
  --max-items 20
```

### Issue: Lambda function errors

```bash
# Check function logs
aws logs tail /aws/lambda/nexis-eligibility-checker-dev --follow

# Check function configuration
aws lambda get-function-configuration \
  --function-name nexis-eligibility-checker-dev
```

### Issue: Bedrock access denied

```bash
# Verify Bedrock access
aws bedrock list-foundation-models --region us-east-1

# If no access, use mock mode
aws lambda update-function-configuration \
  --function-name nexis-ai-explanation-dev \
  --environment Variables="{MOCK_BEDROCK=true}"
```

## 📚 Additional Resources

- **Full Documentation**: `docs/` folder
- **API Documentation**: `docs/API_DOCUMENTATION.md`
- **Deployment Guide**: `docs/DEPLOYMENT_GUIDE.md`
- **Bedrock Setup**: `scripts/setup-bedrock-access.md`

## 🎯 Key Differentiators for Judges

1. **Real AWS Services**: Not a mock-up, fully deployed on AWS
2. **AI Integration**: Amazon Bedrock (Claude 3 Haiku) for explanations
3. **RAG Implementation**: Retrieval-Augmented Generation for accurate answers
4. **Accessibility**: WCAG AA compliant, works on 3G
5. **Security**: Enterprise-grade with encryption, IAM, PII protection
6. **Monitoring**: Full observability with CloudWatch
7. **Scalability**: Serverless architecture, auto-scaling
8. **Cost-Effective**: < $20/month for production

## 🤝 Support

For hackathon support:
- Check `docs/` folder for detailed guides
- Review CloudWatch logs for errors
- Test with mock mode if Bedrock unavailable

---

**Built for AWS Hackathon - AI for Bharat**

Empowering Indian citizens to discover government welfare schemes through AI.

Good luck with your hackathon! 🚀🇮🇳
