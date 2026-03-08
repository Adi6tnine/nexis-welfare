# Update Lambda with BOM Fix
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Updating Lambda with BOM Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"
$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

try {
    # Step 1: Build
    Write-Host "[1/5] Building TypeScript..." -ForegroundColor Yellow
    Set-Location backend
    npm run build 2>&1 | Out-Null
    Write-Host "  Build complete!" -ForegroundColor Green
    Write-Host ""

    # Step 2: Create package directory
    Write-Host "[2/5] Preparing package..." -ForegroundColor Yellow
    if (Test-Path .\lambda-package) {
        Remove-Item .\lambda-package -Recurse -Force
    }
    New-Item -ItemType Directory -Path .\lambda-package | Out-Null
    
    # Copy dist contents
    Copy-Item -Path .\dist\* -Destination .\lambda-package\ -Recurse -Force
    Write-Host "  Code copied!" -ForegroundColor Green
    Write-Host ""

    # Step 3: Copy node_modules (this takes time)
    Write-Host "[3/5] Copying dependencies (this may take a minute)..." -ForegroundColor Yellow
    Copy-Item -Path .\node_modules -Destination .\lambda-package\node_modules -Recurse -Force
    Write-Host "  Dependencies copied!" -ForegroundColor Green
    Write-Host ""

    # Step 4: Create ZIP
    Write-Host "[4/5] Creating ZIP package..." -ForegroundColor Yellow
    if (Test-Path .\lambda.zip) {
        Remove-Item .\lambda.zip -Force
    }
    
    Set-Location lambda-package
    Compress-Archive -Path * -DestinationPath ..\lambda.zip -Force
    Set-Location ..
    
    # Clean up
    Remove-Item .\lambda-package -Recurse -Force
    
    $zipSize = (Get-Item .\lambda.zip).Length / 1MB
    Write-Host "  Package size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Green
    Write-Host ""

    # Step 5: Update Lambda
    Write-Host "[5/5] Updating Lambda function..." -ForegroundColor Yellow
    
    & $awsCmd lambda update-function-code `
        --function-name nexis-eligibility-checker-dev `
        --zip-file fileb://lambda.zip `
        --region us-east-1 `
        --output json | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Lambda updated successfully!" -ForegroundColor Green
    } else {
        Write-Host "  Lambda update failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Waiting for function to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    Set-Location ..
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " Update Complete!" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "The BOM fix has been deployed." -ForegroundColor Green
    Write-Host ""
    Write-Host "Test the API now:" -ForegroundColor Yellow
    Write-Host "  powershell -ExecutionPolicy Bypass -File test-eligibility-api.ps1" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Set-Location "C:\ALL PROJECTS\HACKATHON 1 - AI FOR BHARAT"
    exit 1
}

Read-Host "Press Enter to exit"
