# GitHub Secrets Setup Guide

This document provides instructions for setting up GitHub secrets required for the NEXIS CI/CD pipeline.

## Required Secrets

### AWS Credentials (Development & Staging)

**Secret Name**: `AWS_ACCESS_KEY_ID`
**Description**: AWS Access Key ID for development and staging deployments
**How to obtain**:
1. Log in to AWS Console
2. Navigate to IAM → Users
3. Create a new user: `nexis-github-actions-dev`
4. Attach policy: `PowerUserAccess` or custom deployment policy
5. Create access key and copy the Access Key ID

**Secret Name**: `AWS_SECRET_ACCESS_KEY`
**Description**: AWS Secret Access Key for development and staging deployments
**How to obtain**: Copy the Secret Access Key from the same access key creation step above

### AWS Credentials (Production)

**Secret Name**: `AWS_ACCESS_KEY_ID_PROD`
**Description**: AWS Access Key ID for production deployments
**How to obtain**:
1. Create a separate IAM user: `nexis-github-actions-prod`
2. Attach more restrictive policies for production
3. Create access key and copy the Access Key ID

**Secret Name**: `AWS_SECRET_ACCESS_KEY_PROD`
**Description**: AWS Secret Access Key for production deployments
**How to obtain**: Copy the Secret Access Key from production user creation

### API Configuration

**Secret Name**: `API_BASE_URL`
**Description**: Base URL for the backend API (used during frontend build)
**Example Values**:
- Development: `https://api-dev.nexis.example.com`
- Staging: `https://api-staging.nexis.example.com`
- Production: `https://api.nexis.gov.in`

### AWS Amplify App IDs

**Secret Name**: `AMPLIFY_APP_ID_DEV`
**Description**: AWS Amplify App ID for development environment
**How to obtain**:
1. Navigate to AWS Amplify Console
2. Select the NEXIS development app
3. Copy the App ID from the URL or app settings

**Secret Name**: `AMPLIFY_APP_ID_STAGING`
**Description**: AWS Amplify App ID for staging environment

**Secret Name**: `AMPLIFY_APP_ID_PROD`
**Description**: AWS Amplify App ID for production environment

## Setting Up Secrets in GitHub

### Repository Secrets

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

### Environment Secrets

For environment-specific secrets (recommended for production):

1. Navigate to **Settings** → **Environments**
2. Create environments: `development`, `staging`, `production`
3. For each environment, click **Add secret**
4. Add environment-specific secrets

### Environment Protection Rules

Configure protection rules for production environment:

1. Go to **Settings** → **Environments** → **production**
2. Enable **Required reviewers** and add team members
3. Enable **Wait timer** (optional): 5 minutes
4. Enable **Deployment branches**: Only `main` branch

## IAM Policy for GitHub Actions

Create a custom IAM policy for GitHub Actions with least privilege:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:DescribeStackResources",
        "cloudformation:GetTemplate",
        "cloudformation:ValidateTemplate"
      ],
      "Resource": "arn:aws:cloudformation:*:*:stack/nexis-*/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:CreateFunction",
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "lambda:PublishVersion",
        "lambda:UpdateAlias",
        "lambda:GetFunction",
        "lambda:ListVersionsByFunction"
      ],
      "Resource": "arn:aws:lambda:*:*:function:nexis-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::nexis-artifacts-*",
        "arn:aws:s3:::nexis-artifacts-*/*",
        "arn:aws:s3:::nexis-frontend-*",
        "arn:aws:s3:::nexis-frontend-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:UpdateTable",
        "dynamodb:DescribeTable"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/nexis-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:GET",
        "apigateway:POST",
        "apigateway:PUT",
        "apigateway:DELETE",
        "apigateway:PATCH"
      ],
      "Resource": "arn:aws:apigateway:*::/restapis/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "amplify:StartDeployment",
        "amplify:GetApp",
        "amplify:GetBranch"
      ],
      "Resource": "arn:aws:amplify:*:*:apps/*/branches/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:DescribeAlarms",
        "cloudwatch:GetMetricStatistics"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:PassRole",
        "iam:GetRole"
      ],
      "Resource": "arn:aws:iam::*:role/nexis-*"
    }
  ]
}
```

## Verification

After setting up secrets, verify the configuration:

1. Go to **Actions** tab in GitHub
2. Manually trigger a workflow or push to a branch
3. Check the workflow run logs for any authentication errors
4. Verify that secrets are masked in logs (shown as `***`)

## Security Best Practices

1. **Rotate credentials regularly**: Update AWS access keys every 90 days
2. **Use environment secrets**: Store production secrets at environment level
3. **Enable MFA**: Require MFA for production deployments
4. **Audit access**: Regularly review IAM user permissions
5. **Monitor usage**: Set up CloudWatch alarms for unusual API activity
6. **Separate accounts**: Consider using separate AWS accounts for prod/non-prod

## Troubleshooting

### Secret Not Found Error

**Error**: `Secret AWS_ACCESS_KEY_ID not found`
**Solution**: Verify the secret name matches exactly (case-sensitive)

### Authentication Failed

**Error**: `The security token included in the request is invalid`
**Solution**: 
- Verify AWS credentials are correct
- Check if IAM user has necessary permissions
- Ensure credentials haven't expired

### Deployment Permission Denied

**Error**: `User is not authorized to perform: cloudformation:CreateStack`
**Solution**: Update IAM policy to include required permissions

## Additional Resources

- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Amplify CLI Documentation](https://docs.amplify.aws/cli/)
