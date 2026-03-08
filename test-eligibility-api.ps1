# Test NEXIS Eligibility API
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Testing NEXIS Eligibility API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$apiUrl = "https://b73ak67e9k.execute-api.us-east-1.amazonaws.com/dev/eligibility/check"
$apiKey = "SX6unNPbujaAPaTOF8q8Y8CH44x0gWWcWtkh0QF2"

# Test profile - must match Lambda validation schema
$testRequest = @{
    userId = "test-user-123"
    profile = @{
        age = 25
        gender = "Female"
        state = "MH"  # Maharashtra state code
        occupation = "Student"
        annualIncome = 600000  # ₹50,000/month = ₹6,00,000/year
        socialCategory = "General"
        hasDisability = $false
    }
} | ConvertTo-Json -Depth 10

Write-Host "Sending test request..." -ForegroundColor Yellow
Write-Host "API: $apiUrl" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $apiUrl `
        -Method Post `
        -Headers @{
            "x-api-key" = $apiKey
            "Content-Type" = "application/json"
        } `
        -Body $testRequest `
        -TimeoutSec 30
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ""
    
    if ($response.data) {
        $result = $response.data
        Write-Host "Eligibility Check Results:" -ForegroundColor Cyan
        Write-Host "  Result ID: $($result.resultId)" -ForegroundColor Gray
        Write-Host "  Total Schemes: $($result.totalSchemes)" -ForegroundColor White
        Write-Host "  Eligible: $($result.eligibleSchemes.Count)" -ForegroundColor Green
        Write-Host "  Ineligible: $($result.ineligibleSchemes.Count)" -ForegroundColor Yellow
        Write-Host ""
        
        if ($result.eligibleSchemes.Count -gt 0) {
            Write-Host "Eligible Schemes:" -ForegroundColor Green
            foreach ($scheme in $result.eligibleSchemes) {
                Write-Host "  - $($scheme.schemeName) (Match: $($scheme.matchScore)%)" -ForegroundColor White
            }
        } else {
            Write-Host "No eligible schemes found" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Response:" -ForegroundColor Cyan
        $response | ConvertTo-Json -Depth 10 | Write-Host
    }
    
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            
            Write-Host ""
            Write-Host "Response Body:" -ForegroundColor Yellow
            
            # Try to parse as JSON for better formatting
            try {
                $errorJson = $responseBody | ConvertFrom-Json
                $errorJson | ConvertTo-Json -Depth 10 | Write-Host
                
                if ($errorJson.error.validationErrors) {
                    Write-Host ""
                    Write-Host "Validation Errors:" -ForegroundColor Red
                    $errorJson.error.validationErrors.PSObject.Properties | ForEach-Object {
                        Write-Host "  $($_.Name): $($_.Value)" -ForegroundColor Yellow
                    }
                }
            } catch {
                Write-Host $responseBody
            }
        } catch {
            Write-Host "Could not read response body" -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
