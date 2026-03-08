# Check Lambda CloudWatch Logs
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Lambda CloudWatch Logs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$functionName = "nexis-eligibility-checker-dev"

Write-Host "Fetching logs for $functionName..." -ForegroundColor Yellow
Write-Host "(Last 10 minutes)" -ForegroundColor Gray
Write-Host ""

try {
    & $awsCmd logs tail "/aws/lambda/$functionName" `
        --since 10m `
        --region us-east-1 `
        --format short
} catch {
    Write-Host "Error fetching logs: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
