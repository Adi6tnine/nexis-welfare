# Fix Lambda Dependencies
Write-Host "Fixing Lambda dependencies..." -ForegroundColor Cyan

# Navigate to backend
Set-Location backend

# Step 1: Build TypeScript
Write-Host "[1/4] Building TypeScript..." -ForegroundColor Yellow
npm run build

# Step 2: Copy node_modules to dist
Write-Host "[2/4] Copying node_modules to dist..." -ForegroundColor Yellow
if (Test-Path .\dist\node_modules) {
    Remove-Item .\dist\node_modules -Recurse -Force
}
Copy-Item -Path .\node_modules -Destination .\dist\node_modules -Recurse -Force

# Step 3: Create ZIP
Write-Host "[3/4] Creating lambda.zip..." -ForegroundColor Yellow
if (Test-Path .\lambda.zip) {
    Remove-Item .\lambda.zip -Force
}
Compress-Archive -Path .\dist\* -DestinationPath .\lambda.zip -Force

$zipSize = (Get-Item .\lambda.zip).Length / 1MB
Write-Host "Package size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Green

# Step 4: Update Lambda function
Write-Host "[4/4] Updating Lambda function..." -ForegroundColor Yellow

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$functionName = "nexis-eligibility-api-dev"

Write-Host "Updating $functionName..." -ForegroundColor Gray

& $awsCmd lambda update-function-code `
    --function-name $functionName `
    --zip-file fileb://lambda.zip `
    --region us-east-1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success!" -ForegroundColor Green
} else {
    Write-Host "Failed!" -ForegroundColor Red
}

# Wait for function to be ready
Write-Host "Waiting for function to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Done! Test the API with:" -ForegroundColor Cyan
Write-Host "  powershell -ExecutionPolicy Bypass -File ..\test-eligibility-api.ps1" -ForegroundColor White

Set-Location ..
