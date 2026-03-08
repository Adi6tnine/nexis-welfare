# Check if NEXIS is ready for deployment
# Verifies all prerequisites and configurations

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1"
)

$ErrorCount = 0
$WarningCount = 0

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "NEXIS Deployment Readiness Check" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Environment: $Environment"
Write-Host "Region: $Region"
Write-Host "=========================================" -ForegroundColor Cyan

# Check 1: AWS CLI installed
Write-Host "`n[1/10] Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version 2>&1
    Write-Host "  ✓ AWS CLI installed: $awsVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ AWS CLI not found. Install from: https://aws.amazon.com/cli/" -ForegroundColor Red
    $ErrorCount++
}

# Check 2: AWS credentials configured
Write-Host "`n[2/10] Checking AWS credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --output json 2>&1 | ConvertFrom-Json
    Write-Host "  ✓ AWS credentials configured" -ForegroundColor Green
    Write-Host "    Account: $($identity.Account)" -ForegroundColor Gray
    Write-Host "    User: $($identity.Arn)" -ForegroundColor Gray
}
catch {
    Write-Host "  ✗ AWS credentials not configured. Run: aws configure" -ForegroundColor Red
    $ErrorCount++
}

# Check 3: Node.js installed
Write-Host "`n[3/10] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
    
    # Check version is 18+
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "  ⚠ Node.js 18+ recommended (you have $nodeVersion)" -ForegroundColor Yellow
        $WarningCount++
    }
}
catch {
    Write-Host "  ✗ Node.js not found. Install from: https://nodejs.org/" -ForegroundColor Red
    $ErrorCount++
}

# Check 4: npm installed
Write-Host "`n[4/10] Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm installed: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ npm not found. Install Node.js from: https://nodejs.org/" -ForegroundColor Red
    $ErrorCount++
}

# Check 5: Backend dependencies
Write-Host "`n[5/10] Checking backend dependencies..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    if (Test-Path "node_modules") {
        Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠ Dependencies not installed. Run: npm install" -ForegroundColor Yellow
        $WarningCount++
    }
}
else {
    Write-Host "  ✗ package.json not found. Are you in the backend directory?" -ForegroundColor Red
    $ErrorCount++
}

# Check 6: TypeScript build
Write-Host "`n[6/10] Checking TypeScript build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Write-Host "  ✓ TypeScript compiled (dist/ exists)" -ForegroundColor Green
}
else {
    Write-Host "  ⚠ TypeScript not compiled. Run: npm run build" -ForegroundColor Yellow
    $WarningCount++
}

# Check 7: Auth Lambda source
Write-Host "`n[7/10] Checking Auth Lambda source..." -ForegroundColor Yellow
if (Test-Path "src/lambda/auth/index.ts") {
    Write-Host "  ✓ Auth Lambda source exists" -ForegroundColor Green
}
else {
    Write-Host "  ✗ Auth Lambda source not found" -ForegroundColor Red
    $ErrorCount++
}

# Check 8: CloudFormation template
Write-Host "`n[8/10] Checking CloudFormation template..." -ForegroundColor Yellow
if (Test-Path "cloudformation/auth-stack.yaml") {
    Write-Host "  ✓ Auth stack template exists" -ForegroundColor Green
}
else {
    Write-Host "  ✗ Auth stack template not found" -ForegroundColor Red
    $ErrorCount++
}

# Check 9: Deployment scripts
Write-Host "`n[9/10] Checking deployment scripts..." -ForegroundColor Yellow
$scriptsExist = $true
if (!(Test-Path "deploy-auth.ps1")) {
    Write-Host "  ✗ deploy-auth.ps1 not found" -ForegroundColor Red
    $scriptsExist = $false
}
if (!(Test-Path "enable-real-bedrock.ps1")) {
    Write-Host "  ✗ enable-real-bedrock.ps1 not found" -ForegroundColor Red
    $scriptsExist = $false
}
if ($scriptsExist) {
    Write-Host "  ✓ Deployment scripts exist" -ForegroundColor Green
}
else {
    $ErrorCount++
}

# Check 10: AWS Bedrock access (optional check)
Write-Host "`n[10/10] Checking AWS Bedrock access..." -ForegroundColor Yellow
try {
    # Try to list foundation models
    $models = aws bedrock list-foundation-models --region $Region --output json 2>&1 | ConvertFrom-Json
    
    # Check if Claude 3 Haiku is available
    $claudeHaiku = $models.modelSummaries | Where-Object { $_.modelId -like "*claude-3-haiku*" }
    
    if ($claudeHaiku) {
        Write-Host "  ✓ AWS Bedrock access enabled" -ForegroundColor Green
        Write-Host "    Claude 3 Haiku available" -ForegroundColor Gray
    }
    else {
        Write-Host "  ⚠ Bedrock access enabled but Claude 3 Haiku not found" -ForegroundColor Yellow
        Write-Host "    Enable in Console: Bedrock > Model access" -ForegroundColor Gray
        $WarningCount++
    }
}
catch {
    Write-Host "  ⚠ Cannot verify Bedrock access" -ForegroundColor Yellow
    Write-Host "    Enable in Console: Bedrock > Model access > Request access" -ForegroundColor Gray
    $WarningCount++
}

# Summary
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

if ($ErrorCount -eq 0 -and $WarningCount -eq 0) {
    Write-Host "✓ All checks passed! Ready to deploy." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "  1. Run: .\deploy-auth.ps1 -Environment $Environment -Region $Region" -ForegroundColor Gray
    Write-Host "  2. Run: .\enable-real-bedrock.ps1 -Environment $Environment -Region $Region" -ForegroundColor Gray
    Write-Host "  3. Update frontend/.env with API URL" -ForegroundColor Gray
}
elseif ($ErrorCount -eq 0) {
    Write-Host "⚠ $WarningCount warning(s) found. You can proceed but may need to fix warnings." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Recommended:" -ForegroundColor White
    Write-Host "  - Fix warnings above before deploying" -ForegroundColor Gray
}
else {
    Write-Host "✗ $ErrorCount error(s) and $WarningCount warning(s) found." -ForegroundColor Red
    Write-Host ""
    Write-Host "Required:" -ForegroundColor White
    Write-Host "  - Fix all errors above before deploying" -ForegroundColor Gray
}

Write-Host "=========================================" -ForegroundColor Cyan

# Exit with error code if there are errors
if ($ErrorCount -gt 0) {
    exit 1
}
