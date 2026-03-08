# NEXIS Complete Deployment Script
# Deploys everything: Auth Lambda, enables Bedrock, and provides setup instructions

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1",
    [string]$JWTSecret = "nexis-jwt-secret-change-in-production",
    [switch]$SkipChecks = $false,
    [switch]$EnableBedrock = $true
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   NEXIS Complete Deployment Script    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment: $Environment" -ForegroundColor White
Write-Host "Region: $Region" -ForegroundColor White
Write-Host "Enable Bedrock: $EnableBedrock" -ForegroundColor White
Write-Host ""

# Step 0: Pre-deployment checks
if (!$SkipChecks) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "Step 0: Running pre-deployment checks..." -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    & .\check-deployment-ready.ps1 -Environment $Environment -Region $Region
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "✗ Pre-deployment checks failed. Fix errors and try again." -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Press Enter to continue with deployment or Ctrl+C to cancel..." -ForegroundColor Yellow
    Read-Host
}

# Step 1: Install dependencies
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if (!(Test-Path "node_modules")) {
    npm install
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

# Step 2: Build TypeScript
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 2: Building TypeScript..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

npm run build
Write-Host "✓ TypeScript compiled" -ForegroundColor Green

# Step 3: Deploy Auth Stack
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 3: Deploying Auth Stack..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

& .\deploy-auth.ps1 -Environment $Environment -Region $Region -JWTSecret $JWTSecret

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Auth deployment failed" -ForegroundColor Red
    exit 1
}

# Step 4: Enable Real Bedrock (optional)
if ($EnableBedrock) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "Step 4: Enabling Real AWS Bedrock..." -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    & .\enable-real-bedrock.ps1 -Environment $Environment -Region $Region
}
else {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "Step 4: Skipping Bedrock (using mock mode)" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "✓ Mock mode will be used for AI features" -ForegroundColor Green
}

# Step 5: Get deployment info
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Step 5: Retrieving deployment information..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

try {
    $ApiUrl = aws cloudformation describe-stacks `
        --stack-name "nexis-auth-$Environment" `
        --region $Region `
        --query "Stacks[0].Outputs[?OutputKey=='AuthApiUrl'].OutputValue" `
        --output text
    
    $UsersTable = aws cloudformation describe-stacks `
        --stack-name "nexis-auth-$Environment" `
        --region $Region `
        --query "Stacks[0].Outputs[?OutputKey=='UsersTableName'].OutputValue" `
        --output text
    
    Write-Host "✓ Deployment information retrieved" -ForegroundColor Green
}
catch {
    Write-Host "⚠ Could not retrieve all deployment info" -ForegroundColor Yellow
}

# Final Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     Deployment Complete! 🎉            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Environment:    $Environment" -ForegroundColor White
Write-Host "Region:         $Region" -ForegroundColor White
Write-Host "API URL:        $ApiUrl" -ForegroundColor White
Write-Host "Users Table:    $UsersTable" -ForegroundColor White
Write-Host "Bedrock Mode:   $(if ($EnableBedrock) { 'Real AI' } else { 'Mock' })" -ForegroundColor White
Write-Host ""

Write-Host "🔗 API Endpoints:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "POST $ApiUrl/auth/register" -ForegroundColor Gray
Write-Host "POST $ApiUrl/auth/login" -ForegroundColor Gray
Write-Host "GET  $ApiUrl/auth/verify" -ForegroundColor Gray
Write-Host "PUT  $ApiUrl/auth/profile" -ForegroundColor Gray
Write-Host ""

Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "1. Update frontend/.env file:" -ForegroundColor White
Write-Host "   VITE_API_BASE_URL=$ApiUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test the API:" -ForegroundColor White
Write-Host "   curl -X POST $ApiUrl/auth/register \" -ForegroundColor Gray
Write-Host "     -H 'Content-Type: application/json' \" -ForegroundColor Gray
Write-Host "     -d '{""email"":""test@test.com"",""password"":""test123"",""name"":""Test""}'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start frontend:" -ForegroundColor White
Write-Host "   cd ../frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "- DEPLOYMENT_GUIDE.md - Complete deployment guide" -ForegroundColor Gray
Write-Host "- DEPLOYMENT_QUICK_REFERENCE.md - Quick reference" -ForegroundColor Gray
Write-Host "- FEATURES_IMPLEMENTED.md - Feature list" -ForegroundColor Gray
Write-Host ""

Write-Host "✨ Your NEXIS platform is now deployed and ready!" -ForegroundColor Green
Write-Host ""
