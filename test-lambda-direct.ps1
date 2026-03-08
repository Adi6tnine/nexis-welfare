# Test Lambda directly
$payloadObj = @{
    userId = "test-user-123"
    profile = @{
        age = 25
        gender = "Female"
        state = "MH"
        occupation = "Student"
        annualIncome = 600000
        socialCategory = "General"
        hasDisability = $false
    }
}

$payloadJson = $payloadObj | ConvertTo-Json -Depth 10 -Compress
$payloadFile = "payload.json"
$payloadJson | Out-File -FilePath $payloadFile -Encoding utf8 -NoNewline

Write-Host "Testing Lambda directly..." -ForegroundColor Yellow
Write-Host "Payload: $payloadJson" -ForegroundColor Gray
Write-Host ""

try {
    $result = & 'C:\Program Files\Amazon\AWSCLIV2\aws.exe' lambda invoke `
        --function-name nexis-eligibility-checker-dev `
        --region us-east-1 `
        --payload "file://$payloadFile" `
        response.json
    
    Write-Host "Lambda invocation result:" -ForegroundColor Cyan
    Write-Host $result
    Write-Host ""
    
    if (Test-Path response.json) {
        Write-Host "Response:" -ForegroundColor Cyan
        Get-Content response.json | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
        Remove-Item response.json
    }
    
    if (Test-Path $payloadFile) {
        Remove-Item $payloadFile
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if (Test-Path $payloadFile) {
        Remove-Item $payloadFile
    }
}

Write-Host ""
Read-Host "Press Enter to exit"
