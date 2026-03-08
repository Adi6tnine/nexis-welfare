# NEXIS Deployment Guide

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js 18+ installed
- Docker installed (for local testing)
- Access to AWS account with necessary permissions

## Deployment Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Testing and development | https://dev.nexis.gov.in |
| Staging | Pre-production testing | https://staging.nexis.gov.in |
| Production | Live system | https://nexis.gov.in |

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] AWS credentials set up
- [ ] Backup plan in place
- [ ] Rollback procedure documented
- [ ] Stakeholders notified

## Deployment Steps

### 1. Deploy Infrastructure (CloudFormation)

#### Development Environment

```bash
cd backend/cloudformation

# Deploy IAM roles
aws cloudformation deploy \
  --template-file iam-roles.yaml \
  --stack-name nexis-iam-dev \
  --parameter-overrides Environment=dev \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1

# Deploy storage stack
aws cloudformation deploy \
  --template-file storage-stack.yaml \
  --stack-name nexis-storage-dev \
  --parameter-overrides Environment=dev \
  --region us-east-1

# Deploy compute stack
aws cloudformation deploy \
  --template-file compute-stack.yaml \
  --stack-name nexis-compute-dev \
  --parameter-overrides Environment=dev \
  --region us-east-1

# Deploy API Gateway
aws cloudformation deploy \
  --template-file api-stack.yaml \
  --stack-name nexis-api-dev \
  --parameter-overrides Environment=dev \
  --region us-east-1

# Deploy monitoring
aws cloudformation deploy \
  --template-file monitoring-stack-enhanced.yaml \
  --stack-name nexis-monitoring-dev \
  --parameter-overrides Environment=dev AlarmEmail=alerts@nexis.gov.in \
  --region us-east-1
```

#### Staging Environment

Replace `dev` with `staging` in all commands above.

#### Production Environment

Replace `dev` with `prod` in all commands above.

**⚠️ Production Deployment Requires:**
- Change approval from team lead
- Backup verification
- Maintenance window scheduled
- Rollback plan ready

### 2. Deploy Backend (Lambda Functions)

```bash
cd backend

# Install dependencies
npm install

# Run tests
npm test
npm run test:properties

# Build TypeScript
npm run build

# Package Lambda functions
npm run package

# Deploy each Lambda function
aws lambda update-function-code \
  --function-name nexis-eligibility-checker-dev \
  --zip-file fileb://lambda.zip \
  --region us-east-1

aws lambda update-function-code \
  --function-name nexis-ai-explanation-dev \
  --zip-file fileb://lambda.zip \
  --region us-east-1

aws lambda update-function-code \
  --function-name nexis-chat-assistant-dev \
  --zip-file fileb://lambda.zip \
  --region us-east-1

aws lambda update-function-code \
  --function-name nexis-profile-manager-dev \
  --zip-file fileb://lambda.zip \
  --region us-east-1

aws lambda update-function-code \
  --function-name nexis-scheme-uploader-dev \
  --zip-file fileb://lambda.zip \
  --region us-east-1
```

### 3. Deploy Frontend (AWS Amplify)

#### Option A: Automatic Deployment (Recommended)

Amplify automatically deploys when you push to the configured branch:

```bash
# Development
git push origin develop

# Staging
git push origin staging

# Production
git push origin main
```

#### Option B: Manual Deployment

```bash
cd frontend

# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Deploy to S3 + CloudFront (if not using Amplify)
aws s3 sync dist/ s3://nexis-frontend-dev \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### 4. Post-Deployment Verification

#### Smoke Tests

```bash
# Check API health
curl https://api-dev.nexis.gov.in/health

# Check eligibility endpoint
curl -X POST https://api-dev.nexis.gov.in/eligibility/check \
  -H "X-API-Key: YOUR_API_KEY" \
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

# Check frontend
curl https://dev.nexis.gov.in
```

#### Verify CloudWatch Metrics

1. Go to CloudWatch Console
2. Check Operations Dashboard
3. Verify metrics are being collected
4. Check for any errors or alarms

#### Verify Logs

```bash
# Check Lambda logs
aws logs tail /aws/lambda/nexis-eligibility-checker-dev --follow

# Check for errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/nexis-eligibility-checker-dev \
  --filter-pattern "ERROR"
```

## Rollback Procedures

### Rollback Lambda Functions

```bash
# List versions
aws lambda list-versions-by-function \
  --function-name nexis-eligibility-checker-dev

# Rollback to previous version
aws lambda update-alias \
  --function-name nexis-eligibility-checker-dev \
  --name LIVE \
  --function-version PREVIOUS_VERSION
```

### Rollback CloudFormation Stack

```bash
# Cancel update in progress
aws cloudformation cancel-update-stack \
  --stack-name nexis-compute-dev

# Or delete and redeploy previous version
aws cloudformation delete-stack \
  --stack-name nexis-compute-dev

# Then redeploy previous template
```

### Rollback Frontend

```bash
# Amplify: Redeploy previous build
aws amplify start-job \
  --app-id YOUR_APP_ID \
  --branch-name develop \
  --job-type RELEASE \
  --commit-id PREVIOUS_COMMIT_ID

# S3: Restore from backup
aws s3 sync s3://nexis-frontend-dev-backup/ s3://nexis-frontend-dev/
```

## Monitoring Post-Deployment

### First 24 Hours

Monitor these metrics closely:

1. **Error Rates**
   - Lambda errors
   - API Gateway 5xx errors
   - Frontend JavaScript errors

2. **Performance**
   - Lambda duration
   - API latency
   - Page load times

3. **Business Metrics**
   - Eligibility checks
   - AI usage
   - User sessions

### CloudWatch Alarms

Ensure these alarms are active:
- Lambda error rate > 5%
- API Gateway 5xx rate > 1%
- Lambda duration > 25s
- DynamoDB throttling > 10/min

### Log Analysis

```bash
# Check for errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/nexis-eligibility-checker-dev \
  --filter-pattern "ERROR" \
  --start-time $(date -d '1 hour ago' +%s)000

# Check for slow requests
aws logs filter-log-events \
  --log-group-name /aws/lambda/nexis-eligibility-checker-dev \
  --filter-pattern "{ $.duration > 5000 }"
```

## Backup and Disaster Recovery

### DynamoDB Backups

```bash
# Create on-demand backup
aws dynamodb create-backup \
  --table-name nexis-users-dev \
  --backup-name nexis-users-dev-$(date +%Y%m%d)

# List backups
aws dynamodb list-backups \
  --table-name nexis-users-dev

# Restore from backup
aws dynamodb restore-table-from-backup \
  --target-table-name nexis-users-dev-restored \
  --backup-arn BACKUP_ARN
```

### S3 Backups

S3 versioning is enabled. To restore:

```bash
# List versions
aws s3api list-object-versions \
  --bucket nexis-knowledge-base-dev \
  --prefix schemes/

# Restore specific version
aws s3api copy-object \
  --bucket nexis-knowledge-base-dev \
  --copy-source nexis-knowledge-base-dev/schemes/pm-kisan/metadata.json?versionId=VERSION_ID \
  --key schemes/pm-kisan/metadata.json
```

## Troubleshooting

### Common Deployment Issues

#### 1. CloudFormation Stack Fails

```bash
# Check stack events
aws cloudformation describe-stack-events \
  --stack-name nexis-compute-dev \
  --max-items 20

# Check stack status
aws cloudformation describe-stacks \
  --stack-name nexis-compute-dev
```

#### 2. Lambda Deployment Fails

```bash
# Check function configuration
aws lambda get-function-configuration \
  --function-name nexis-eligibility-checker-dev

# Check execution role
aws iam get-role \
  --role-name nexis-eligibility-checker-dev
```

#### 3. API Gateway Not Working

```bash
# Test API Gateway
aws apigateway test-invoke-method \
  --rest-api-id YOUR_API_ID \
  --resource-id YOUR_RESOURCE_ID \
  --http-method POST \
  --path-with-query-string "/eligibility/check"
```

#### 4. Frontend Not Loading

- Check CloudFront distribution status
- Verify S3 bucket permissions
- Check browser console for errors
- Verify API endpoints in environment variables

## Security Checklist

Before deploying to production:

- [ ] All secrets in AWS Secrets Manager
- [ ] IAM roles follow least privilege
- [ ] Encryption enabled (S3, DynamoDB)
- [ ] TLS 1.2+ enforced
- [ ] API keys rotated
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] CloudWatch alarms active
- [ ] Backup and recovery tested

## Performance Optimization

### Lambda Optimization

```bash
# Configure provisioned concurrency
aws lambda put-provisioned-concurrency-config \
  --function-name nexis-eligibility-checker-prod \
  --provisioned-concurrent-executions 5 \
  --qualifier LIVE

# Adjust memory allocation
aws lambda update-function-configuration \
  --function-name nexis-eligibility-checker-prod \
  --memory-size 1024
```

### DynamoDB Optimization

- Enable auto-scaling for tables
- Use on-demand billing for unpredictable workloads
- Create appropriate indexes
- Monitor capacity metrics

### Frontend Optimization

- Enable CloudFront compression
- Configure cache headers
- Use CDN for static assets
- Implement service worker for offline support

## Maintenance Windows

### Scheduled Maintenance

1. **Notify users** 48 hours in advance
2. **Schedule during low traffic** (typically 2-4 AM IST)
3. **Duration**: Maximum 2 hours
4. **Display maintenance page**

### Emergency Maintenance

1. **Notify stakeholders immediately**
2. **Display maintenance page**
3. **Fix critical issue**
4. **Post-mortem within 24 hours**

## Contact Information

### Deployment Team

- **Lead**: deployment-lead@nexis.gov.in
- **On-Call**: oncall@nexis.gov.in
- **Slack**: #nexis-deployments

### Escalation

1. Team Lead
2. Engineering Manager
3. CTO

---

© 2026 NEXIS Deployment Team
