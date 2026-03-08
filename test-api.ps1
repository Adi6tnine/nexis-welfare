$body = @{
    userId = "test-user-123"
    profile = @{
        age = 19
        state = "AP"
        occupation = "Student"
        annualIncome = 12313
        gender = "Male"
        socialCategory = "General"
        hasDisability = $false
    }
} | ConvertTo-Json -Depth 10

Write-Host "Testing API with payload:" -ForegroundColor Yellow
Write-Host $body
Write-Host ""

$headers = @{
    "Content-Type" = "application/json"
    "x-api-key" = "SX6unNPbujaAPaTOF8q8Y8CH44x0gWWcWtkh0QF2"
}

try {
    $response = Invoke-RestMethod -Uri "https://b73ak67e9k.execute-api.us-east-1.amazonaws.com/dev/eligibility/check" -Method Post -Headers $headers -Body $body
    Write-Host "Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host $_.ErrorDetails.Message
}

pause
