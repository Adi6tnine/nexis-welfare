# Quick Lambda Update (code only, no node_modules)
Write-Host ""
Write-Host "Quick Lambda Update" -ForegroundColor Cyan
Write-Host ""

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

# Create a lightweight ZIP with just the code
Write-Host "Creating code package..." -ForegroundColor Yellow
if (Test-Path .\lambda-code.zip) {
    Remove-Item .\lambda-code.zip -Force
}

# ZIP only the dist folder (without node_modules)
Compress-Archive -Path .\dist\* -DestinationPath .\lambda-code.zip -Force

$zipSize = (Get-Item .\lambda-code.zip).Length / 1KB
Write-Host "Package size: $([math]::Round($zipSize, 2)) KB" -ForegroundColor Green
Write-Host ""

# Update eligibility checker (the one with the fix)
Write-Host "Updating nexis-eligibility-checker-dev..." -ForegroundColor Yellow

& $awsCmd lambda update-function-code `
    --function-name nexis-eligibility-checker-dev `
    --zip-file fileb://lambda-code.zip `
    --region us-east-1 `
    --query 'LastUpdateStatus' `
    --output text

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success!" -ForegroundColor Green
} else {
    Write-Host "Failed!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Waiting for function to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "Done! Test with:" -ForegroundColor Cyan
Write-Host "  powershell -ExecutionPolicy Bypass -File ..\test-eligibility-api.ps1" -ForegroundColor White
Write-Host ""
