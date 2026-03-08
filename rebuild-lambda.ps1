# Rebuild and Redeploy Lambda Functions
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Rebuilding Lambda Functions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find AWS CLI
$awsPaths = @(
    "C:\Program Files\Amazon\AWSCLIV2\aws.exe",
    "C:\Program Files (x86)\Amazon\AWSCLIV2\aws.exe"
)

$awsCmd = $null
foreach ($path in $awsPaths) {
    if (Test-Path $path) {
        $awsCmd = $path
        break
    }
}

if (-not $awsCmd) {
    $awsCmd = (Get-Command aws -ErrorAction SilentlyContinue).Source
}

if (-not $awsCmd) {
    Write-Host "ERROR: AWS CLI not found!" -ForegroundColor Red
    exit 1
}

# Get the backend directory path
$backendPath = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "ERROR: Backend directory not found at $backendPath" -ForegroundColor Red
    exit 1
}

Write-Host "Step 0: Installing missing dependencies..." -ForegroundColor Yellow
Set-Location $backendPath
npm install @aws-sdk/client-textract @aws-sdk/client-polly @aws-sdk/client-transcribe-streaming @types/aws-lambda --save 2>&1 | Out-Null
Write-Host "  Done!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Cleaning old build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
}
if (Test-Path "lambda.zip") {
    Remove-Item -Path "lambda.zip" -Force
}
Write-Host "  Done!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Compiling TypeScript..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Done!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Packaging Lambda code..." -ForegroundColor Yellow
Set-Location dist
Copy-Item -Path ..\node_modules -Destination .\node_modules -Recurse -Force
Compress-Archive -Path * -DestinationPath ..\lambda.zip -Force
Remove-Item -Path .\node_modules -Recurse -Force
Set-Location ..
Write-Host "  Done! Package size: $((Get-Item lambda.zip).Length / 1MB) MB" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Uploading to AWS Lambda..." -ForegroundColor Yellow
& $awsCmd lambda update-function-code `
    --function-name nexis-eligibility-checker-dev `
    --zip-file fileb://lambda.zip `
    --region us-east-1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Success!" -ForegroundColor Green
} else {
    Write-Host "  Failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host ""
Write-Host "Step 5: Waiting for Lambda to update..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "  Done!" -ForegroundColor Green

# Return to original directory
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Lambda Rebuilt and Deployed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now test at: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
pause
