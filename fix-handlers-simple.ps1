# Simple Lambda Handler Fix Script
# Run this with: powershell -ExecutionPolicy Bypass -File fix-handlers-simple.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " NEXIS Lambda Handler Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Try to find AWS CLI
$awsCmd = $null

# Check common locations
$locations = @(
    "C:\Program Files\Amazon\AWSCLIV2\aws.exe",
    "C:\Program Files (x86)\Amazon\AWSCLIV2\aws.exe"
)

foreach ($loc in $locations) {
    if (Test-Path $loc) {
        $awsCmd = $loc
        Write-Host "Found AWS CLI: $awsCmd" -ForegroundColor Green
        break
    }
}

# Try PATH
if (-not $awsCmd) {
    try {
        $awsCmd = (Get-Command aws -ErrorAction Stop).Source
        Write-Host "Found AWS CLI in PATH: $awsCmd" -ForegroundColor Green
    } catch {
        Write-Host "AWS CLI not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please either:" -ForegroundColor Yellow
        Write-Host "  1. Install AWS CLI from: https://aws.amazon.com/cli/" -ForegroundColor White
        Write-Host "  2. Add AWS CLI to your PATH" -ForegroundColor White
        Write-Host "  3. Use AWS Console to fix handlers manually" -ForegroundColor White
        Write-Host ""
        Write-Host "See FIX_LAMBDA_HANDLERS_NOW.md for manual steps" -ForegroundColor Cyan
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "Updating Lambda handlers..." -ForegroundColor Yellow
Write-Host ""

# Define functions and handlers
$functions = @{
    "nexis-eligibility-checker-dev" = "lambda/eligibility-checker/index.handler"
    "nexis-ai-explanation-dev" = "lambda/ai-explanation/index.handler"
    "nexis-chat-assistant-dev" = "lambda/chat-assistant/index.handler"
    "nexis-profile-manager-dev" = "lambda/profile-manager/index.handler"
    "nexis-scheme-uploader-dev" = "lambda/scheme-uploader/index.handler"
}

$successCount = 0
$failCount = 0

foreach ($funcName in $functions.Keys) {
    $handler = $functions[$funcName]
    
    Write-Host "[$($successCount + $failCount + 1)/5] $funcName" -ForegroundColor White
    Write-Host "    Handler: $handler" -ForegroundColor Gray
    
    try {
        $output = & $awsCmd lambda update-function-configuration `
            --function-name $funcName `
            --handler $handler `
            --region us-east-1 `
            --output json 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    Status: SUCCESS" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "    Status: FAILED" -ForegroundColor Red
            Write-Host "    Error: $output" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "    Status: FAILED" -ForegroundColor Red
        Write-Host "    Error: $_" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
    Start-Sleep -Milliseconds 500
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Results" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Success: $successCount/5" -ForegroundColor Green
Write-Host "Failed:  $failCount/5" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($successCount -eq 5) {
    Write-Host "All handlers updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Go to http://localhost:3000" -ForegroundColor White
    Write-Host "  2. Complete the questionnaire" -ForegroundColor White
    Write-Host "  3. Check if results load from AWS" -ForegroundColor White
    Write-Host ""
    Write-Host "If you see results, your deployment is working!" -ForegroundColor Cyan
} else {
    Write-Host "Some handlers failed to update." -ForegroundColor Red
    Write-Host "You can fix them manually in AWS Console." -ForegroundColor Yellow
    Write-Host "See FIX_LAMBDA_HANDLERS_NOW.md for instructions." -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Press Enter to exit"
