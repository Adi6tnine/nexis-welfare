# Enable Real AWS Bedrock Integration
# Sets MOCK_BEDROCK=false for all Lambda functions

param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-1"
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Enabling Real AWS Bedrock" -ForegroundColor Cyan
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
        
        # Update MOCK_BEDROCK to false
        $CurrentEnv | Add-Member -NotePropertyName "MOCK_BEDROCK" -NotePropertyValue "false" -Force
        
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
Write-Host "Real Bedrock Enabled!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "All Lambda functions now use real AWS Bedrock." -ForegroundColor White
Write-Host "Make sure you have:" -ForegroundColor Yellow
Write-Host "  1. AWS Bedrock access enabled in your account" -ForegroundColor Gray
Write-Host "  2. Claude 3 Haiku model access granted" -ForegroundColor Gray
Write-Host "  3. Proper IAM permissions for Bedrock" -ForegroundColor Gray
Write-Host ""
Write-Host "To revert to mock mode, run:" -ForegroundColor Yellow
Write-Host "  .\disable-real-bedrock.ps1" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Green
