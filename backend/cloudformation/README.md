# NEXIS CloudFormation Infrastructure

This directory contains AWS CloudFormation templates for deploying the NEXIS Full-Stack Application infrastructure.

## Stack Architecture

The infrastructure is organized into 5 separate CloudFormation stacks with clear dependencies:

```
1. storage-stack.yaml       (Independent - S3 buckets, DynamoDB tables)
   ↓
2. compute-stack.yaml       (Depends on storage - Lambda functions, IAM roles)
   ↓
3. api-stack.yaml          (Depends on compute - API Gateway, endpoints)
   ↓
4. monitoring-stack.yaml   (Depends on all - CloudWatch dashboards, alarms)
   ↓
5. frontend-stack.yaml     (Depends on API - AWS Amplify configuration)
```

## Stack Descriptions

### 1. Storage Stack (`storage-stack.yaml`)
**Purpose**: Creates all data storage resources

**Resources**:
- S3 Bucket: `nexis-knowledge-base-{environment}` (scheme documents, versioning enabled, SSE-S3 encryption)
- DynamoDB Tables:
  - `nexis-users-{environment}` (user profiles)
  - `nexis-eligibility-results-{environment}` (eligibility check results, 90-day TTL)
  - `nexis-user-sessions-{environment}` (chat sessions, 90-day TTL)
  - `nexis-schemes-{environment}` (scheme metadata)
  - `nexis-explanation-cache-{environment}` (AI explanations cache, 7-day TTL)

**Exports**:
- Bucket names and ARNs
- Table names and ARNs

### 2. Compute Stack (`compute-stack.yaml`)
**Purpose**: Creates Lambda functions and IAM roles

**Resources**:
- Lambda Functions:
  - `nexis-eligibility-checker-{environment}` (1024 MB, 30s timeout)
  - `nexis-ai-explanation-{environment}` (512 MB, 30s timeout)
  - `nexis-chat-assistant-{environment}` (1024 MB, 30s timeout)
  - `nexis-profile-manager-{environment}` (512 MB, 10s timeout)
  - `nexis-scheme-uploader-{environment}` (512 MB, 60s timeout)
- IAM Roles with least-privilege policies for each Lambda

**Exports**:
- Lambda function ARNs

### 3. API Stack (`api-stack.yaml`)
**Purpose**: Creates API Gateway REST API with endpoints

**Resources**:
- API Gateway REST API: `nexis-api-{environment}`
- Endpoints:
  - `POST /eligibility/check` → Eligibility Checker Lambda
  - `POST /ai/explain` → AI Explanation Lambda
  - `POST /chat/message` → Chat Assistant Lambda
  - `POST /profiles`, `GET/PUT/DELETE /profiles/{userId}` → Profile Manager Lambda
  - `POST /schemes` → Scheme Uploader Lambda
- API Key authentication
- Usage plan with rate limiting (100 req/min)
- CORS configuration

**Exports**:
- API endpoint URL
- API Gateway ID
- API Key ID

### 4. Monitoring Stack (`monitoring-stack.yaml`)
**Purpose**: Creates CloudWatch dashboards and alarms

**Resources**:
- CloudWatch Dashboards:
  - Operations Dashboard (Lambda metrics, API Gateway metrics, DynamoDB metrics)
  - Business Metrics Dashboard (eligibility checks, AI usage, user activity)
- CloudWatch Alarms:
  - Critical: Lambda error rate > 5%, API 5xx rate > 1%, Lambda duration > 25s, DynamoDB throttling > 10/min
  - Warning: Lambda error rate > 2%, API latency p95 > 5s, Bedrock errors > 5, S3 errors > 10
- SNS Topic for alarm notifications
- Log Groups with 30-day retention

**Exports**:
- Alarm topic ARN
- Dashboard names

### 5. Frontend Stack (`frontend-stack.yaml`)
**Purpose**: Creates AWS Amplify app for frontend hosting

**Resources**:
- AWS Amplify App with GitHub integration
- Amplify Branch with auto-build enabled
- Custom domain configuration (optional)
- IAM Role for Amplify
- Environment variables for API endpoint

**Exports**:
- Amplify App ID and ARN
- Amplify default domain
- Application URL

## Deployment Instructions

### Prerequisites

1. AWS CLI installed and configured
2. AWS account with appropriate permissions
3. GitHub personal access token (for frontend stack)
4. Email address for alarm notifications

### Environment Variables

Set these environment variables before deployment:

```bash
export AWS_REGION=us-east-1
export ENVIRONMENT=dev  # or staging, prod
export GITHUB_TOKEN=your_github_token
export ALERT_EMAIL=your_email@example.com
export GITHUB_REPO=https://github.com/username/nexis
export GITHUB_BRANCH=main
```

### Deployment Order

Deploy stacks in the following order:

#### 1. Deploy Storage Stack

```bash
aws cloudformation create-stack \
  --stack-name nexis-storage-${ENVIRONMENT} \
  --template-body file://storage-stack.yaml \
  --parameters ParameterKey=Environment,ParameterValue=${ENVIRONMENT} \
  --region ${AWS_REGION}

# Wait for completion
aws cloudformation wait stack-create-complete \
  --stack-name nexis-storage-${ENVIRONMENT} \
  --region ${AWS_REGION}
```

#### 2. Deploy Compute Stack

```bash
aws cloudformation create-stack \
  --stack-name nexis-compute-${ENVIRONMENT} \
  --template-body file://compute-stack.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=${ENVIRONMENT} \
    ParameterKey=StorageStackName,ParameterValue=nexis-storage-${ENVIRONMENT} \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ${AWS_REGION}

# Wait for completion
aws cloudformation wait stack-create-complete \
  --stack-name nexis-compute-${ENVIRONMENT} \
  --region ${AWS_REGION}
```

#### 3. Deploy API Stack

```bash
aws cloudformation create-stack \
  --stack-name nexis-api-${ENVIRONMENT} \
  --template-body file://api-stack.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=${ENVIRONMENT} \
    ParameterKey=ComputeStackName,ParameterValue=nexis-compute-${ENVIRONMENT} \
  --region ${AWS_REGION}

# Wait for completion
aws cloudformation wait stack-create-complete \
  --stack-name nexis-api-${ENVIRONMENT} \
  --region ${AWS_REGION}
```

#### 4. Deploy Monitoring Stack

```bash
aws cloudformation create-stack \
  --stack-name nexis-monitoring-${ENVIRONMENT} \
  --template-body file://monitoring-stack.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=${ENVIRONMENT} \
    ParameterKey=ComputeStackName,ParameterValue=nexis-compute-${ENVIRONMENT} \
    ParameterKey=APIStackName,ParameterValue=nexis-api-${ENVIRONMENT} \
    ParameterKey=AlertEmail,ParameterValue=${ALERT_EMAIL} \
  --region ${AWS_REGION}

# Wait for completion
aws cloudformation wait stack-create-complete \
  --stack-name nexis-monitoring-${ENVIRONMENT} \
  --region ${AWS_REGION}
```

#### 5. Deploy Frontend Stack

```bash
aws cloudformation create-stack \
  --stack-name nexis-frontend-${ENVIRONMENT} \
  --template-body file://frontend-stack.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=${ENVIRONMENT} \
    ParameterKey=GitHubRepository,ParameterValue=${GITHUB_REPO} \
    ParameterKey=GitHubBranch,ParameterValue=${GITHUB_BRANCH} \
    ParameterKey=GitHubToken,ParameterValue=${GITHUB_TOKEN} \
    ParameterKey=APIStackName,ParameterValue=nexis-api-${ENVIRONMENT} \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ${AWS_REGION}

# Wait for completion
aws cloudformation wait stack-create-complete \
  --stack-name nexis-frontend-${ENVIRONMENT} \
  --region ${AWS_REGION}
```

### Automated Deployment Script

Use the provided deployment script for automated deployment:

```bash
./deploy-all-stacks.sh dev
```

## Stack Updates

To update an existing stack:

```bash
aws cloudformation update-stack \
  --stack-name nexis-{stack-type}-${ENVIRONMENT} \
  --template-body file://{stack-type}-stack.yaml \
  --parameters ParameterKey=Environment,ParameterValue=${ENVIRONMENT} \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ${AWS_REGION}
```

## Stack Deletion

To delete stacks, reverse the deployment order:

```bash
# 1. Delete Frontend Stack
aws cloudformation delete-stack --stack-name nexis-frontend-${ENVIRONMENT}

# 2. Delete Monitoring Stack
aws cloudformation delete-stack --stack-name nexis-monitoring-${ENVIRONMENT}

# 3. Delete API Stack
aws cloudformation delete-stack --stack-name nexis-api-${ENVIRONMENT}

# 4. Delete Compute Stack
aws cloudformation delete-stack --stack-name nexis-compute-${ENVIRONMENT}

# 5. Delete Storage Stack (WARNING: This deletes all data!)
aws cloudformation delete-stack --stack-name nexis-storage-${ENVIRONMENT}
```

**WARNING**: Deleting the storage stack will permanently delete all S3 objects and DynamoDB data. Ensure you have backups before deletion.

## Retrieving Stack Outputs

Get API endpoint URL:
```bash
aws cloudformation describe-stacks \
  --stack-name nexis-api-${ENVIRONMENT} \
  --query 'Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue' \
  --output text
```

Get API Key:
```bash
aws apigateway get-api-key \
  --api-key $(aws cloudformation describe-stacks \
    --stack-name nexis-api-${ENVIRONMENT} \
    --query 'Stacks[0].Outputs[?OutputKey==`APIKeyId`].OutputValue' \
    --output text) \
  --include-value \
  --query 'value' \
  --output text
```

Get Amplify App URL:
```bash
aws cloudformation describe-stacks \
  --stack-name nexis-frontend-${ENVIRONMENT} \
  --query 'Stacks[0].Outputs[?OutputKey==`AmplifyAppURL`].OutputValue' \
  --output text
```

## Cost Estimation

Estimated monthly costs for each environment (based on 1M requests/month):

- **Development**: ~$30-40/month
- **Staging**: ~$40-50/month
- **Production**: ~$50-70/month

Cost breakdown:
- Lambda: $15-20
- DynamoDB: $2-5
- S3: $1-2
- API Gateway: $3-5
- Bedrock (Claude 3 Haiku): $5-10
- CloudWatch: $5-8
- Amplify: $10-15

## Monitoring and Alarms

After deployment, confirm alarm subscription:
1. Check your email for SNS subscription confirmation
2. Click the confirmation link
3. Verify alarms are active in CloudWatch console

Access dashboards:
- Operations Dashboard: CloudWatch → Dashboards → `NEXIS-Operations-{environment}`
- Business Metrics Dashboard: CloudWatch → Dashboards → `NEXIS-Business-Metrics-{environment}`

## Troubleshooting

### Stack Creation Failed

1. Check CloudFormation events:
```bash
aws cloudformation describe-stack-events \
  --stack-name nexis-{stack-type}-${ENVIRONMENT} \
  --max-items 20
```

2. Common issues:
   - **Insufficient permissions**: Ensure IAM user has required permissions
   - **Resource limits**: Check AWS service quotas
   - **Invalid parameters**: Verify parameter values
   - **Missing dependencies**: Ensure prerequisite stacks are deployed

### Lambda Functions Not Working

1. Check Lambda logs:
```bash
aws logs tail /aws/lambda/nexis-{function-name}-${ENVIRONMENT} --follow
```

2. Verify IAM permissions:
```bash
aws iam get-role-policy \
  --role-name nexis-{function-name}-role-${ENVIRONMENT} \
  --policy-name {PolicyName}
```

### API Gateway Errors

1. Enable CloudWatch logs for API Gateway
2. Check API Gateway execution logs:
```bash
aws logs tail /aws/apigateway/nexis-${ENVIRONMENT} --follow
```

## Security Best Practices

1. **API Keys**: Rotate API keys every 90 days
2. **IAM Roles**: Review and audit IAM policies regularly
3. **Encryption**: All data encrypted at rest (DynamoDB KMS, S3 SSE)
4. **HTTPS**: All API endpoints use HTTPS only
5. **Secrets**: Store sensitive values in AWS Secrets Manager
6. **Logging**: Enable CloudTrail for audit logging

## Support

For issues or questions:
1. Check CloudFormation stack events
2. Review CloudWatch logs
3. Consult AWS documentation
4. Contact the development team

## License

Copyright © 2024 NEXIS Project. All rights reserved.
