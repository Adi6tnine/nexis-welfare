# Rebuild and Deploy Lambda Functions
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Rebuilding Lambda Functions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build TypeScript
Write-Host "[1/4] Building TypeScript..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Build complete!" -ForegroundColor Green
Write-Host ""

# Step 2: Create Lambda package
Write-Host "[2/4] Creating Lambda package..." -ForegroundColor Yellow

# Copy node_modules to dist
Write-Host "  Copying node_modules..." -ForegroundColor Gray
Copy-Item -Path .\node_modules -Destination .\dist\node_modules -Recurse -Force

# Create ZIP
Write-Host "  Creating lambda.zip..." -ForegroundColor Gray
if (Test-Path .\lambda.zip) {
    Remove-Item .\lambda.zip -Force
}
Compress-Archive -Path .\dist\* -DestinationPath .\lambda.zip -Force

# Clean up
Write-Host "  Cleaning up..." -ForegroundColor Gray
Remove-Item -Path .\dist\node_modules -Recurse -Force

$zipSize = (Get-Item .\lambda.zip).Length / 1MB
Write-Host "  Package size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Green
Write-Host ""

# Step 3: Update Lambda functions
Write-Host "[3/4] Updating Lambda functions..." -ForegroundColor Yellow

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$functions = @(
    "nexis-eligibility-checker-dev",
    "nexis-ai-explanation-dev",
    "nexis-chat-assistant-dev",
    "nexis-profile-manager-dev",
    "nexis-scheme-uploader-dev"
)

foreach ($func in $functions) {
    Write-Host "  Updating $func..." -ForegroundColor Gray
    
    & $awsCmd lambda update-function-code `
        --function-name $func `
        --zip-file fileb://lambda.zip `
        --region us-east-1 `
        --output text > $null 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    Success!" -ForegroundColor Green
    } else {
        Write-Host "    Failed!" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 2
}

Write-Host ""

# Step 4: Wait for functions to be ready
Write-Host "[4/4] Waiting for functions to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Write-Host "  Functions should be ready!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Deployment Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test the API with:" -ForegroundColor Yellow
Write-Host "  powershell -ExecutionPolicy Bypass -File ..\test-eligibility-api.ps1" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
