# NEXIS Auth Stack Deployment Script (PowerShell)
# Deploys authentication Lambda and infrastructure

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1",
    [string]$JWTSecret = "nexis-jwt-secret-change-in-production"
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "NEXIS Auth Stack Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Environment: $Environment"
Write-Host "Region: $Region"
Write-Host "=========================================" -ForegroundColor Cyan

# Step 1: Install dependencies
Write-Host "`nStep 1: Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 2: Build TypeScript
Write-Host "`nStep 2: Building TypeScript..." -ForegroundColor Yellow
npm run build

# Step 3: Package Lambda
Write-Host "`nStep 3: Packaging Lambda function..." -ForegroundColor Yellow
Set-Location dist
if (Test-Path ../lambda.zip) {
    Remove-Item ../lambda.zip
}
Compress-Archive -Path * -DestinationPath ../lambda.zip -Force
Set-Location ..

# Step 4: Deploy CloudFormation stack
Write-Host "`nStep 4: Deploying CloudFormation stack..." -ForegroundColor Yellow
aws cloudformation deploy `
  --template-file cloudformation/auth-stack.yaml `
  --stack-name "nexis-auth-$Environment" `
  --parameter-overrides `
    Environment=$Environment `
    JWTSecret=$JWTSecret `
  --capabilities CAPABILITY_NAMED_IAM `
  --region $Region

# Step 5: Get Lambda function name
Write-Host "`nStep 5: Getting Lambda function name..." -ForegroundColor Yellow
$LambdaArn = aws cloudformation describe-stacks `
  --stack-name "nexis-auth-$Environment" `
  --region $Region `
  --query "Stacks[0].Outputs[?OutputKey=='AuthLambdaArn'].OutputValue" `
  --output text

$LambdaName = $LambdaArn.Split(':')[-1]
Write-Host "Lambda function: $LambdaName"

# Step 6: Update Lambda code
Write-Host "`nStep 6: Updating Lambda function code..." -ForegroundColor Yellow
aws lambda update-function-code `
  --function-name $LambdaName `
  --zip-file fileb://lambda.zip `
  --region $Region

# Step 7: Wait for update to complete
Write-Host "`nStep 7: Waiting for Lambda update to complete..." -ForegroundColor Yellow
aws lambda wait function-updated `
  --function-name $LambdaName `
  --region $Region

# Step 8: Get API Gateway URL
Write-Host "`nStep 8: Getting API Gateway URL..." -ForegroundColor Yellow
$ApiUrl = aws cloudformation describe-stacks `
  --stack-name "nexis-auth-$Environment" `
  --region $Region `
  --query "Stacks[0].Outputs[?OutputKey=='AuthApiUrl'].OutputValue" `
  --output text

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "API Gateway URL: $ApiUrl" -ForegroundColor White
Write-Host ""
Write-Host "Endpoints:" -ForegroundColor White
Write-Host "  POST $ApiUrl/auth/register" -ForegroundColor Gray
Write-Host "  POST $ApiUrl/auth/login" -ForegroundColor Gray
Write-Host "  GET  $ApiUrl/auth/verify" -ForegroundColor Gray
Write-Host "  PUT  $ApiUrl/auth/profile" -ForegroundColor Gray
Write-Host ""
Write-Host "Update your frontend .env file:" -ForegroundColor Yellow
Write-Host "VITE_API_BASE_URL=$ApiUrl" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Green
