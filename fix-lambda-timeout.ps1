# Fix Lambda Timeout and Check S3 Access
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Lambda Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

# Increase Lambda timeout to 60 seconds
Write-Host "Increasing Lambda timeout to 60 seconds..." -ForegroundColor Yellow

& $awsCmd lambda update-function-configuration `
    --function-name nexis-eligibility-checker-dev `
    --timeout 60 `
    --region us-east-1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Success!" -ForegroundColor Green
} else {
    Write-Host "  Failed!" -ForegroundColor Red
}

Write-Host ""

# Check S3 bucket access
Write-Host "Checking S3 bucket access..." -ForegroundColor Yellow

$bucket = "nexis-knowledge-base-dev"
$schemes = & $awsCmd s3 ls "s3://$bucket/schemes/" --region us-east-1 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  S3 bucket accessible!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Schemes in bucket:" -ForegroundColor Cyan
    Write-Host $schemes
} else {
    Write-Host "  S3 access failed!" -ForegroundColor Red
    Write-Host "  Error: $schemes" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration Updated" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 10 seconds for Lambda to update, then test again" -ForegroundColor Yellow
Write-Host ""
pause
