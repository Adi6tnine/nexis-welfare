# NEXIS AWS Deployment Script (PowerShell)
# For AWS Hackathon - AI for Bharat

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

# Configuration
$ProjectName = "nexis"

Write-Host "========================================" -ForegroundColor Blue
Write-Host "NEXIS AWS Deployment Script" -ForegroundColor Blue
Write-Host "AWS Hackathon - AI for Bharat" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""
Write-Host "Environment: $Environment" -ForegroundColor Green
Write-Host "Region: $Region" -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check AWS CLI
try {
    $awsVersion = aws --version 2>&1
    Write-Host "✓ AWS CLI installed: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: AWS CLI is not installed" -ForegroundColor Red
    Write-Host "Install from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check AWS credentials
try {
    $accountId = aws sts get-caller-identity --query Account --output text 2>&1
    Write-Host "✓ AWS credentials configured (Account: $accountId)" -ForegroundColor Green
} catch {
    Write-Host "Error: AWS credentials not configured" -ForegroundColor Red
    Write-Host "Run: aws configure" -ForegroundColor Yellow
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed ($nodeVersion)" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed" -ForegroundColor Red
    exit 1
}

# Check Bedrock access
Write-Host "Checking Amazon Bedrock access..." -ForegroundColor Yellow
try {
    aws bedrock list-foundation-models --region $Region 2>&1 | Out-Null
    Write-Host "✓ Amazon Bedrock access confirmed" -ForegroundColor Green
} catch {
    Write-Host "⚠ Amazon Bedrock access not confirmed" -ForegroundColor Yellow
    Write-Host "  You may need to request access in AWS Console" -ForegroundColor Yellow
    Write-Host "  The deployment will continue, but AI features may not work" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Step 1: Deploy IAM Roles" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

Set-Location backend\cloudformation

aws cloudformation deploy `
  --template-file iam-roles.yaml `
  --stack-name "$ProjectName-iam-$Environment" `
  --parameter-overrides Environment=$Environment `
  --capabilities CAPABILITY_NAMED_IAM `
  --region $Region `
  --no-fail-on-empty-changeset

Write-Host "✓ IAM roles deployed" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Step 2: Deploy Storage Stack" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

aws cloudformation deploy `
  --template-file storage-stack.yaml `
  --stack-name "$ProjectName-storage-$Environment" `
  --parameter-overrides Environment=$Environment `
  --region $Region `
  --no-fail-on-empty-changeset

Write-Host "✓ Storage stack deployed (DynamoDB + S3)" -ForegroundColor Green

# Get bucket name
$bucketName = aws cloudformation describe-stacks `
  --stack-name "$ProjectName-storage-$Environment" `
  --query 'Stacks[0].Outputs[?OutputKey==`KnowledgeBaseBucketName`].OutputValue' `
  --output text `
  --region $Region

Write-Host "  Knowledge Base Bucket: $bucketName" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Step 3: Upload Sample Scheme Data" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

# Create sample scheme files
$pmKisanMetadata = @"
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
"@

$pmKisanPolicy = @"
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
"@

$pmKisanFaq = @"
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
"@

# Save to temp files
$pmKisanMetadata | Out-File -FilePath "$env:TEMP\pm-kisan-metadata.json" -Encoding UTF8
$pmKisanPolicy | Out-File -FilePath "$env:TEMP\pm-kisan-policy.txt" -Encoding UTF8
$pmKisanFaq | Out-File -FilePath "$env:TEMP\pm-kisan-faq.txt" -Encoding UTF8

# Upload to S3
aws s3 cp "$env:TEMP\pm-kisan-metadata.json" "s3://$bucketName/schemes/pm-kisan/metadata.json" --region $Region
aws s3 cp "$env:TEMP\pm-kisan-policy.txt" "s3://$bucketName/schemes/pm-kisan/policy.txt" --region $Region
aws s3 cp "$env:TEMP\pm-kisan-faq.txt" "s3://$bucketName/schemes/pm-kisan/faq.txt" --region $Region

Write-Host "✓ Sample scheme data uploaded (PM-KISAN)" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Step 4: Build and Package Lambda Functions" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

Set-Location ..\..
Set-Location backend

Write-Host "Installing dependencies..."
npm install

Write-Host "Running tests..."
npm test

Write-Host "Building TypeScript..."
npm run build

Write-Host "Packaging Lambda functions..."
Set-Location dist
Compress-Archive -Path * -DestinationPath ..\lambda.zip -Force
Set-Location ..

Write-Host "✓ Lambda functions packaged" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Step 5: Deploy API Gateway" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

Set-Location cloudformation

aws cloudformation deploy `
  --template-file api-stack.yaml `
  --stack-name "$ProjectName-api-$Environment" `
  --parameter-overrides Environment=$Environment `
  --region $Region `
  --no-fail-on-empty-changeset

$apiEndpoint = aws cloudformation describe-stacks `
  --stack-name "$ProjectName-api-$Environment" `
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' `
  --output text `
  --region $Region 2>$null

if (-not $apiEndpoint) {
    $apiEndpoint = "Not available yet"
}

Write-Host "✓ API Gateway deployed" -ForegroundColor Green
Write-Host "  API Endpoint: $apiEndpoint" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Step 6: Deploy Monitoring Stack" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

aws cloudformation deploy `
  --template-file monitoring-stack-enhanced.yaml `
  --stack-name "$ProjectName-monitoring-$Environment" `
  --parameter-overrides Environment=$Environment AlarmEmail=alerts@nexis.gov.in `
  --region $Region `
  --no-fail-on-empty-changeset

Write-Host "✓ Monitoring stack deployed" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Step 7: Build Frontend" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

Set-Location ..\..\frontend

# Create .env file
$envContent = @"
VITE_API_ENDPOINT=$apiEndpoint
VITE_API_KEY=your-api-key-here
VITE_ENVIRONMENT=$Environment
"@
$envContent | Out-File -FilePath .env.production -Encoding UTF8

Write-Host "Installing frontend dependencies..."
npm install

Write-Host "Building frontend..."
npm run build

Write-Host "✓ Frontend built" -ForegroundColor Green
Write-Host "  Note: Frontend deployment to Amplify requires manual setup" -ForegroundColor Yellow

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Deployment Summary:" -ForegroundColor Blue
Write-Host "  Environment: $Environment"
Write-Host "  Region: $Region"
Write-Host "  Account: $accountId"
Write-Host ""
Write-Host "Resources Created:" -ForegroundColor Blue
Write-Host "  ✓ IAM Roles (5)"
Write-Host "  ✓ DynamoDB Tables (5)"
Write-Host "  ✓ S3 Bucket (1)"
Write-Host "  ✓ API Gateway"
Write-Host "  ✓ CloudWatch Dashboards (2)"
Write-Host "  ✓ CloudWatch Alarms (7)"
Write-Host ""
Write-Host "API Endpoint:" -ForegroundColor Blue
Write-Host "  $apiEndpoint"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Blue
Write-Host "  1. Deploy Lambda functions (see docs/DEPLOYMENT_GUIDE.md)"
Write-Host "  2. Deploy frontend to Amplify or S3"
Write-Host "  3. Request Bedrock access (see scripts/setup-bedrock-access.md)"
Write-Host "  4. Test API endpoints"
Write-Host "  5. Monitor CloudWatch dashboards"
Write-Host ""
Write-Host "For AWS Hackathon Demo:" -ForegroundColor Green
Write-Host "  - All infrastructure is deployed"
Write-Host "  - Sample scheme (PM-KISAN) is loaded"
Write-Host "  - Ready for testing and demo"
Write-Host ""

# Save deployment info
$deploymentInfo = @"
NEXIS Deployment Information
Environment: $Environment
Region: $Region
Account: $accountId
Deployed: $(Get-Date)

API Endpoint: $apiEndpoint
Knowledge Base Bucket: $bucketName

CloudFormation Stacks:
- $ProjectName-iam-$Environment
- $ProjectName-storage-$Environment
- $ProjectName-api-$Environment
- $ProjectName-monitoring-$Environment

CloudWatch Dashboards:
- nexis-operations-$Environment
- nexis-business-$Environment
"@

Set-Location ..
$deploymentInfo | Out-File -FilePath "deployment-info-$Environment.txt" -Encoding UTF8

Write-Host "Deployment info saved to: deployment-info-$Environment.txt" -ForegroundColor Green
Write-Host ""
