# 🚀 NEXIS Backend Deployment

Complete guide for deploying NEXIS backend to AWS.

---

## 📋 Quick Start

### One-Command Deployment:

```powershell
.\deploy-all.ps1 -Environment dev -Region us-east-1
```

This will:
1. Check prerequisites
2. Install dependencies
3. Build TypeScript
4. Deploy Auth Stack
5. Enable real Bedrock
6. Display API endpoints

**Time:** ~5 minutes

---

## 📦 Available Scripts

### 1. Complete Deployment
```powershell
.\deploy-all.ps1 -Environment dev -Region us-east-1
```
Deploys everything in one command.

**Options:**
- `-Environment` - dev, staging, or prod (default: dev)
- `-Region` - AWS region (default: us-east-1)
- `-JWTSecret` - Secret key for JWT tokens
- `-SkipChecks` - Skip pre-deployment checks
- `-EnableBedrock` - Enable real Bedrock (default: true)

**Examples:**
```powershell
# Deploy to dev with mock Bedrock
.\deploy-all.ps1 -EnableBedrock:$false

# Deploy to production
.\deploy-all.ps1 -Environment prod -JWTSecret "your-production-secret"

# Skip checks (faster)
.\deploy-all.ps1 -SkipChecks
```

### 2. Check Deployment Readiness
```powershell
.\check-deployment-ready.ps1
```
Verifies all prerequisites before deployment.

Checks:
- ✓ AWS CLI installed
- ✓ AWS credentials configured
- ✓ Node.js 18+ installed
- ✓ npm installed
- ✓ Dependencies installed
- ✓ TypeScript compiled
- ✓ Source files exist
- ✓ CloudFormation templates exist
- ✓ Deployment scripts exist
- ✓ AWS Bedrock access (optional)

### 3. Deploy Auth Stack Only
```powershell
.\deploy-auth.ps1 -Environment dev -Region us-east-1
```
Deploys only the authentication infrastructure.

Creates:
- DynamoDB table for users
- Lambda function for auth
- API Gateway with endpoints
- IAM roles and permissions

### 4. Enable Real Bedrock
```powershell
.\enable-real-bedrock.ps1 -Environment dev -Region us-east-1
```
Sets `MOCK_BEDROCK=false` for all Lambda functions.

Updates:
- nexis-chat-assistant-{env}
- nexis-ai-explanation-{env}
- nexis-eligibility-checker-{env}

### 5. Disable Real Bedrock (Mock Mode)
```powershell
.\disable-real-bedrock.ps1 -Environment dev -Region us-east-1
```
Sets `MOCK_BEDROCK=true` to use mock responses.

Useful for:
- Development and testing
- Avoiding Bedrock costs
- Working without Bedrock access

---

## 🔧 Prerequisites

### Required:
1. **AWS Account** with admin access
2. **AWS CLI** installed and configured
   ```bash
   aws configure
   ```
3. **Node.js 18+** and npm
   ```bash
   node --version  # Should be v18.x or higher
   ```
4. **PowerShell** (Windows) or Bash (Linux/Mac)

### Optional (for real Bedrock):
5. **AWS Bedrock Access** enabled
   - Go to AWS Console > Bedrock > Model access
   - Request access to Claude 3 Haiku
   - Wait 5-10 minutes for approval

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── lambda/
│   │   ├── auth/
│   │   │   └── index.ts          ← Auth Lambda
│   │   ├── chat-assistant/
│   │   ├── ai-explanation/
│   │   └── eligibility-checker/
│   ├── services/
│   │   ├── bedrock.ts            ← Bedrock integration
│   │   ├── dynamodb.ts
│   │   └── s3.ts
│   └── models/
├── cloudformation/
│   ├── auth-stack.yaml           ← Auth infrastructure
│   ├── compute-stack.yaml
│   └── storage-stack.yaml
├── dist/                         ← Compiled JavaScript
├── deploy-all.ps1                ← Complete deployment
├── deploy-auth.ps1               ← Auth deployment
├── enable-real-bedrock.ps1       ← Enable Bedrock
├── disable-real-bedrock.ps1      ← Disable Bedrock
├── check-deployment-ready.ps1    ← Pre-deployment checks
└── package.json
```

---

## 🎯 Deployment Workflow

### Development Environment:

```powershell
# 1. Check readiness
.\check-deployment-ready.ps1

# 2. Deploy everything
.\deploy-all.ps1 -Environment dev

# 3. Get API URL from output
# Example: https://abc123.execute-api.us-east-1.amazonaws.com/dev

# 4. Update frontend/.env
# VITE_API_BASE_URL=https://abc123.execute-api.us-east-1.amazonaws.com/dev

# 5. Test
cd ../frontend
npm run dev
```

### Staging Environment:

```powershell
.\deploy-all.ps1 -Environment staging -Region us-east-1
```

### Production Environment:

```powershell
.\deploy-all.ps1 `
  -Environment prod `
  -Region us-east-1 `
  -JWTSecret "your-secure-production-secret-key"
```

---

## 🧪 Testing Deployment

### 1. Test Auth Endpoints:

```bash
# Set API URL
$API_URL = "https://your-api-url.amazonaws.com/dev"

# Test register
curl -X POST "$API_URL/auth/register" `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

# Should return 201 with user data and JWT token
```

### 2. Test Login:

```bash
curl -X POST "$API_URL/auth/login" `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"test123"}'

# Should return 200 with user data and JWT token
```

### 3. Test Token Verification:

```bash
curl -X GET "$API_URL/auth/verify" `
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Should return 200 with valid: true
```

### 4. Check Lambda Logs:

```powershell
# View auth logs
aws logs tail /aws/lambda/nexis-auth-dev --follow

# View chat logs
aws logs tail /aws/lambda/nexis-chat-assistant-dev --follow
```

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] CloudFormation stack created successfully
  ```powershell
  aws cloudformation describe-stacks --stack-name nexis-auth-dev
  ```

- [ ] DynamoDB table is active
  ```powershell
  aws dynamodb describe-table --table-name nexis-users-dev
  ```

- [ ] Lambda function deployed
  ```powershell
  aws lambda get-function --function-name nexis-auth-dev
  ```

- [ ] API Gateway endpoints working
  ```powershell
  curl -X POST $API_URL/auth/register -H "Content-Type: application/json" -d '{...}'
  ```

- [ ] Bedrock environment variable set
  ```powershell
  aws lambda get-function-configuration `
    --function-name nexis-chat-assistant-dev `
    --query "Environment.Variables.MOCK_BEDROCK"
  # Should return: "false"
  ```

- [ ] Frontend can connect to API
  - Update frontend/.env
  - Test register/login
  - Test AI features

---

## 💰 Cost Estimation

### Development (1000 users/month):
| Service | Cost |
|---------|------|
| AWS Bedrock | ~$3/month |
| Lambda | Free tier |
| DynamoDB | Free tier |
| API Gateway | Free tier |
| S3 | ~$0.02/month |
| **Total** | **~$3/month** |

### Production (10,000 users/month):
| Service | Cost |
|---------|------|
| AWS Bedrock | ~$50-100/month |
| Lambda | ~$5/month |
| DynamoDB | ~$10/month |
| API Gateway | ~$3.50/month |
| S3 | ~$0.50/month |
| **Total** | **~$70-120/month** |

---

## 🐛 Troubleshooting

### Issue: "AWS CLI not found"
**Solution:**
```powershell
# Install AWS CLI
# Windows: Download from https://aws.amazon.com/cli/
# Mac: brew install awscli
# Linux: sudo apt install awscli
```

### Issue: "AWS credentials not configured"
**Solution:**
```powershell
aws configure
# Enter: Access Key ID, Secret Access Key, Region, Output format
```

### Issue: "CloudFormation stack failed"
**Solution:**
```powershell
# Check stack events
aws cloudformation describe-stack-events --stack-name nexis-auth-dev

# Delete failed stack
aws cloudformation delete-stack --stack-name nexis-auth-dev

# Wait for deletion
aws cloudformation wait stack-delete-complete --stack-name nexis-auth-dev

# Redeploy
.\deploy-auth.ps1
```

### Issue: "Lambda function not found"
**Solution:**
```powershell
# List all Lambda functions
aws lambda list-functions --query "Functions[?contains(FunctionName, 'nexis')]"

# Verify CloudFormation stack deployed
aws cloudformation describe-stacks --stack-name nexis-auth-dev
```

### Issue: "Bedrock access denied"
**Solution:**
1. Go to AWS Console > Bedrock > Model access
2. Request access to Claude 3 Haiku
3. Wait 5-10 minutes for approval
4. Verify IAM permissions include `bedrock:InvokeModel`

### Issue: "API Gateway 403 Forbidden"
**Solution:**
```powershell
# Add Lambda permission
aws lambda add-permission `
  --function-name nexis-auth-dev `
  --statement-id apigateway-invoke `
  --action lambda:InvokeFunction `
  --principal apigateway.amazonaws.com
```

### Issue: "CORS errors in frontend"
**Solution:**
- Verify API Gateway CORS configuration in CloudFormation
- Check OPTIONS method exists for each endpoint
- Verify response headers include Access-Control-Allow-Origin

---

## 🔄 Rollback Procedure

### Rollback Auth Stack:
```powershell
# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name nexis-auth-dev

# Wait for deletion
aws cloudformation wait stack-delete-complete --stack-name nexis-auth-dev
```

### Revert to Mock Bedrock:
```powershell
.\disable-real-bedrock.ps1 -Environment dev
```

---

## 📊 Monitoring

### CloudWatch Logs:
```powershell
# Auth Lambda logs
aws logs tail /aws/lambda/nexis-auth-dev --follow

# Chat Lambda logs
aws logs tail /aws/lambda/nexis-chat-assistant-dev --follow

# AI Explanation Lambda logs
aws logs tail /aws/lambda/nexis-ai-explanation-dev --follow
```

### CloudWatch Metrics:
- Lambda invocations
- Lambda errors
- Lambda duration
- API Gateway requests
- API Gateway 4xx/5xx errors
- DynamoDB read/write capacity

### Set Up Alarms:
```powershell
# Lambda error alarm
aws cloudwatch put-metric-alarm `
  --alarm-name nexis-auth-errors `
  --alarm-description "Alert on Lambda errors" `
  --metric-name Errors `
  --namespace AWS/Lambda `
  --statistic Sum `
  --period 300 `
  --threshold 5 `
  --comparison-operator GreaterThanThreshold
```

---

## 🔐 Security Best Practices

1. **Change JWT Secret** in production
   ```powershell
   .\deploy-all.ps1 -Environment prod -JWTSecret "your-secure-random-secret"
   ```

2. **Enable CloudTrail** for audit logging

3. **Set up AWS WAF** for API Gateway

4. **Enable DynamoDB encryption** (already enabled in template)

5. **Use AWS Secrets Manager** for sensitive data

6. **Implement rate limiting** in API Gateway

7. **Regular security audits** with AWS Security Hub

---

## 📚 Additional Documentation

- **DEPLOYMENT_GUIDE.md** - Complete deployment guide
- **DEPLOYMENT_COMPLETE.md** - Deployment package summary
- **DEPLOYMENT_QUICK_REFERENCE.md** - One-page reference
- **IMPLEMENTATION_GUIDE.md** - Technical architecture
- **FEATURES_IMPLEMENTED.md** - Feature list

---

## 🆘 Support

For issues or questions:
1. Check troubleshooting section above
2. Review CloudWatch logs
3. Verify environment variables
4. Check IAM permissions
5. Ensure Bedrock access enabled

---

## ✅ Success Indicators

Your deployment is successful when:
- ✓ CloudFormation stack shows `CREATE_COMPLETE`
- ✓ DynamoDB table status is `ACTIVE`
- ✓ Lambda function is deployed and invocable
- ✓ API Gateway endpoints return 200/201
- ✓ Frontend can register/login users
- ✓ AI features work (real or mock)
- ✓ No CORS errors in browser console

---

**Ready to deploy? Run: `.\deploy-all.ps1`** 🚀
