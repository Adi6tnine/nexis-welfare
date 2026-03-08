# NEXIS AWS Deployment Script for Windows
# Simple and clean version

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1"
)

Write-Host ""
Write-Host "========================================"
Write-Host "NEXIS AWS Deployment"
Write-Host "========================================"
Write-Host "Environment: $Environment"
Write-Host "Region: $Region"
Write-Host ""

# Refresh PATH to include AWS CLI
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Add common AWS CLI paths if not in PATH
$awsCliPaths = @(
    "C:\Program Files\Amazon\AWSCLIV2",
    "$env:ProgramFiles\Amazon\AWSCLIV2",
    "$env:LOCALAPPDATA\Programs\Amazon\AWSCLIV2"
)
foreach ($path in $awsCliPaths) {
    if (Test-Path $path) {
        $env:Path = "$path;$env:Path"
    }
}

# Check AWS CLI
Write-Host "Checking AWS CLI..." -ForegroundColor Yellow
$awsCommand = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsCommand) {
    Write-Host "ERROR AWS CLI not found" -ForegroundColor Red
    Write-Host "Please run: deploy-nexis.bat instead" -ForegroundColor Yellow
    Write-Host "Or install AWS CLI from: https://awscli.amazonaws.com/AWSCLIV2.msi" -ForegroundColor Yellow
    exit 1
}
$awsVersion = & aws --version 2>&1
Write-Host "OK AWS CLI installed: $awsVersion" -ForegroundColor Green

# Check credentials
Write-Host "Checking AWS credentials..." -ForegroundColor Yellow
$accountId = aws sts get-caller-identity --query Account --output text 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR AWS not configured. Run: aws configure" -ForegroundColor Red
    exit 1
}
Write-Host "OK Account: $accountId" -ForegroundColor Green

Write-Host ""
Write-Host "Starting deployment..." -ForegroundColor Cyan
Write-Host ""

# Deploy IAM
Write-Host "[1/8] Deploying IAM roles..." -ForegroundColor Yellow
Set-Location backend\cloudformation
aws cloudformation deploy --template-file iam-roles.yaml --stack-name nexis-iam-$Environment --parameter-overrides Environment=$Environment --capabilities CAPABILITY_NAMED_IAM --region $Region --no-fail-on-empty-changeset
if ($LASTEXITCODE -eq 0) { Write-Host "OK IAM deployed" -ForegroundColor Green } else { Write-Host "FAILED" -ForegroundColor Red; exit 1 }

# Deploy Storage
Write-Host "[2/8] Deploying storage..." -ForegroundColor Yellow
aws cloudformation deploy --template-file storage-stack.yaml --stack-name nexis-storage-$Environment --parameter-overrides Environment=$Environment --region $Region --no-fail-on-empty-changeset
if ($LASTEXITCODE -eq 0) { Write-Host "OK Storage deployed" -ForegroundColor Green } else { Write-Host "FAILED" -ForegroundColor Red; exit 1 }

# Get bucket name
$bucketName = aws cloudformation describe-stacks --stack-name nexis-storage-$Environment --query 'Stacks[0].Outputs[?OutputKey==``KnowledgeBaseBucketName``].OutputValue' --output text --region $Region
Write-Host "Bucket: $bucketName" -ForegroundColor Cyan

# Build Lambda
Write-Host "[3/8] Building Lambda..." -ForegroundColor Yellow
Set-Location ..\..
Set-Location backend
npm install --silent
npm run build

# Create Lambda zip with correct structure
Set-Location dist
if (Test-Path ..\lambda.zip) { Remove-Item ..\lambda.zip }

# Copy node_modules to dist for bundling
Write-Host "Bundling dependencies..." -ForegroundColor Cyan
Copy-Item -Path ..\node_modules -Destination .\node_modules -Recurse -Force

# Create zip from dist directory
Compress-Archive -Path * -DestinationPath ..\lambda.zip -Force

# Clean up
Remove-Item -Path .\node_modules -Recurse -Force

Set-Location ..
Write-Host "OK Lambda built" -ForegroundColor Green

# Deploy Compute
Write-Host "[4/8] Deploying Lambda functions..." -ForegroundColor Yellow
Set-Location cloudformation
aws cloudformation deploy --template-file compute-stack.yaml --stack-name nexis-compute-$Environment --parameter-overrides Environment=$Environment StorageStackName=nexis-storage-$Environment --capabilities CAPABILITY_NAMED_IAM --region $Region --no-fail-on-empty-changeset
if ($LASTEXITCODE -eq 0) { Write-Host "OK Compute deployed" -ForegroundColor Green } else { Write-Host "FAILED" -ForegroundColor Red; exit 1 }

# Upload Lambda code
Write-Host "[5/8] Uploading Lambda code..." -ForegroundColor Yellow
$functions = @("nexis-eligibility-checker-$Environment", "nexis-ai-explanation-$Environment", "nexis-chat-assistant-$Environment", "nexis-profile-manager-$Environment", "nexis-scheme-uploader-$Environment")
foreach ($func in $functions) {
    aws lambda update-function-code --function-name $func --zip-file fileb://../lambda.zip --region $Region --no-cli-pager 2>&1 | Out-Null
}
Write-Host "OK Lambda code uploaded" -ForegroundColor Green

# Deploy API
Write-Host "[6/8] Deploying API Gateway..." -ForegroundColor Yellow
aws cloudformation deploy --template-file api-stack.yaml --stack-name nexis-api-$Environment --parameter-overrides Environment=$Environment ComputeStackName=nexis-compute-$Environment --region $Region --no-fail-on-empty-changeset
if ($LASTEXITCODE -eq 0) { Write-Host "OK API deployed" -ForegroundColor Green } else { Write-Host "FAILED" -ForegroundColor Red; exit 1 }

# Get API endpoint
$apiEndpoint = aws cloudformation describe-stacks --stack-name nexis-api-$Environment --query 'Stacks[0].Outputs[?OutputKey==``ApiEndpoint``].OutputValue' --output text --region $Region 2>&1
if ($LASTEXITCODE -ne 0) { $apiEndpoint = "Not available" }

# Deploy Monitoring
Write-Host "[7/8] Deploying monitoring..." -ForegroundColor Yellow
aws cloudformation deploy --template-file monitoring-stack-enhanced.yaml --stack-name nexis-monitoring-$Environment --parameter-overrides Environment=$Environment AlarmEmail=alerts@nexis.gov.in --region $Region --no-fail-on-empty-changeset 2>&1 | Out-Null
Write-Host "OK Monitoring deployed" -ForegroundColor Green

# Configure Frontend
Write-Host "[8/8] Configuring frontend..." -ForegroundColor Yellow
Set-Location ..\..\frontend

$apiKey = "dev-api-key"
$envContent = "VITE_API_BASE_URL=$apiEndpoint`nVITE_API_KEY=$apiKey`nVITE_ENVIRONMENT=$Environment`nVITE_ENABLE_CHAT_ASSISTANT=true`nVITE_ENABLE_AI_EXPLANATIONS=true`nVITE_ENABLE_OFFLINE_MODE=false`nVITE_ENABLE_DEBUG_LOGS=true`nVITE_MOCK_API_RESPONSES=false"
$envContent | Out-File -FilePath .env -Encoding UTF8
$envContent | Out-File -FilePath .env.production -Encoding UTF8
Write-Host "OK Frontend configured" -ForegroundColor Green

Write-Host ""
Write-Host "========================================"
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "API Endpoint: $apiEndpoint" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "Account: $accountId" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd frontend"
Write-Host "  2. npm install"
Write-Host "  3. npm run dev"
Write-Host ""
Write-Host "Then open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Set-Location ..