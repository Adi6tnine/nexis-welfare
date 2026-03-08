# Check Bedrock Access
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking AWS Bedrock Access" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

Write-Host "Checking available Bedrock models..." -ForegroundColor Yellow
Write-Host ""

try {
    $models = & $awsCmd bedrock list-foundation-models --region us-east-1 --output json 2>&1 | ConvertFrom-Json
    
    if ($models.modelSummaries) {
        Write-Host "✓ Bedrock is accessible!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Available models:" -ForegroundColor Yellow
        
        $claudeModels = $models.modelSummaries | Where-Object { $_.modelId -like "*claude*" }
        $titanModels = $models.modelSummaries | Where-Object { $_.modelId -like "*titan*" }
        
        if ($claudeModels) {
            Write-Host "  Claude models:" -ForegroundColor Cyan
            foreach ($model in $claudeModels) {
                Write-Host "    - $($model.modelId)" -ForegroundColor White
            }
        }
        
        if ($titanModels) {
            Write-Host "  Titan models:" -ForegroundColor Cyan
            foreach ($model in $titanModels) {
                Write-Host "    - $($model.modelId)" -ForegroundColor White
            }
        }
        
        Write-Host ""
        Write-Host "✓ NEXIS can use Bedrock AI!" -ForegroundColor Green
    } else {
        Write-Host "✗ No models available" -ForegroundColor Red
        Write-Host ""
        Write-Host "You need to enable model access:" -ForegroundColor Yellow
        Write-Host "1. Go to AWS Console → Bedrock → Model access" -ForegroundColor White
        Write-Host "2. Click 'Manage model access'" -ForegroundColor White
        Write-Host "3. Enable Claude 3 Haiku" -ForegroundColor White
        Write-Host "4. Click 'Request model access'" -ForegroundColor White
    }
} catch {
    Write-Host "✗ Bedrock not accessible" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "To enable Bedrock:" -ForegroundColor Yellow
    Write-Host "1. Go to AWS Console → Bedrock" -ForegroundColor White
    Write-Host "2. Click 'Model access' in left menu" -ForegroundColor White
    Write-Host "3. Click 'Manage model access'" -ForegroundColor White
    Write-Host "4. Enable 'Claude 3 Haiku'" -ForegroundColor White
    Write-Host "5. Click 'Request model access'" -ForegroundColor White
    Write-Host ""
    Write-Host "Bedrock is available in us-east-1 (your region)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
pause
