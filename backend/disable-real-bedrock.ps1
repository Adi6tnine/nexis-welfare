# Disable Real AWS Bedrock Integration
# Sets MOCK_BEDROCK=true for all Lambda functions (revert to mock mode)

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1"
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Disabling Real AWS Bedrock (Mock Mode)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Environment: $Environment"
Write-Host "Region: $Region"
Write-Host "=========================================" -ForegroundColor Cyan

# List of Lambda functions to update
$LambdaFunctions = @(
    "nexis-chat-assistant-$Environment",
    "nexis-ai-explanation-$Environment",
    "nexis-eligibility-checker-$Environment"
)

foreach ($FunctionName in $LambdaFunctions) {
    Write-Host "`nUpdating $FunctionName..." -ForegroundColor Yellow
    
    try {
        # Get current environment variables
        $CurrentEnv = aws lambda get-function-configuration `
            --function-name $FunctionName `
            --region $Region `
            --query "Environment.Variables" `
            --output json | ConvertFrom-Json
        
        # Update MOCK_BEDROCK to true
        $CurrentEnv | Add-Member -NotePropertyName "MOCK_BEDROCK" -NotePropertyValue "true" -Force
        
        # Convert back to JSON
        $EnvJson = $CurrentEnv | ConvertTo-Json -Compress
        
        # Update Lambda function
        aws lambda update-function-configuration `
            --function-name $FunctionName `
            --environment "Variables=$EnvJson" `
            --region $Region | Out-Null
        
        Write-Host "  ✓ Updated successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Function not found or error: $_" -ForegroundColor Red
    }
}

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "Mock Mode Enabled!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "All Lambda functions now use mock responses." -ForegroundColor White
Write-Host "This is useful for:" -ForegroundColor Yellow
Write-Host "  1. Development and testing" -ForegroundColor Gray
Write-Host "  2. Avoiding Bedrock costs" -ForegroundColor Gray
Write-Host "  3. Working without Bedrock access" -ForegroundColor Gray
Write-Host ""
Write-Host "To enable real Bedrock again, run:" -ForegroundColor Yellow
Write-Host "  .\enable-real-bedrock.ps1" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Green
