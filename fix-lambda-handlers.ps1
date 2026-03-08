# Fix Lambda Handler Configurations
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Lambda Handler Configurations" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Common AWS CLI installation paths
$awsPaths = @(
    "C:\Program Files\Amazon\AWSCLIV2\aws.exe",
    "C:\Program Files (x86)\Amazon\AWSCLIV2\aws.exe",
    "$env:ProgramFiles\Amazon\AWSCLIV2\aws.exe",
    "${env:ProgramFiles(x86)}\Amazon\AWSCLIV2\aws.exe"
)

$awsCmd = $null
foreach ($path in $awsPaths) {
    if (Test-Path $path) {
        $awsCmd = $path
        Write-Host "Found AWS CLI at: $awsCmd" -ForegroundColor Green
        break
    }
}

if (-not $awsCmd) {
    # Try to find it in PATH
    $awsCmd = (Get-Command aws -ErrorAction SilentlyContinue).Source
}

if (-not $awsCmd) {
    Write-Host "ERROR: AWS CLI not found!" -ForegroundColor Red
    Write-Host "Please install AWS CLI from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or add AWS CLI to your PATH" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""

# Update Lambda functions
$functions = @(
    @{Name="nexis-eligibility-checker-dev"; Handler="lambda/eligibility-checker/index.handler"},
    @{Name="nexis-ai-explanation-dev"; Handler="lambda/ai-explanation/index.handler"},
    @{Name="nexis-chat-assistant-dev"; Handler="lambda/chat-assistant/index.handler"},
    @{Name="nexis-profile-manager-dev"; Handler="lambda/profile-manager/index.handler"},
    @{Name="nexis-scheme-uploader-dev"; Handler="lambda/scheme-uploader/index.handler"}
)

foreach ($func in $functions) {
    Write-Host "Updating $($func.Name)..." -ForegroundColor Yellow
    
    $result = & $awsCmd lambda update-function-configuration `
        --function-name $func.Name `
        --handler $func.Handler `
        --region us-east-1 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Success!" -ForegroundColor Green
    } else {
        Write-Host "  Failed: $result" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Seconds 2
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All Lambda handlers updated!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now test the application:" -ForegroundColor Yellow
Write-Host "1. Go to http://localhost:3000" -ForegroundColor White
Write-Host "2. Complete the questionnaire" -ForegroundColor White
Write-Host "3. Check if results load from AWS" -ForegroundColor White
Write-Host ""
Write-Host "If still failing, check logs with:" -ForegroundColor Yellow
Write-Host "aws logs tail /aws/lambda/nexis-eligibility-checker-dev --since 1m --region us-east-1" -ForegroundColor Gray
Write-Host ""
pause
