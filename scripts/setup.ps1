# NEXIS Development Environment Setup Script (PowerShell)

Write-Host "🚀 Setting up NEXIS development environment..." -ForegroundColor Cyan

# Check Node.js version
Write-Host "`n📦 Checking Node.js version..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 18) {
        Write-Host "❌ Error: Node.js 18.x or higher is required" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js is not installed" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "`n📦 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm -v
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: npm is not installed" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location ../backend
npm install
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Create environment files if they don't exist
Write-Host "`n🔧 Setting up environment files..." -ForegroundColor Yellow
Set-Location ..
if (-not (Test-Path "frontend/.env")) {
    Copy-Item "frontend/.env.example" "frontend/.env"
    Write-Host "✅ Created frontend/.env (please update with your values)" -ForegroundColor Green
} else {
    Write-Host "ℹ️  frontend/.env already exists" -ForegroundColor Blue
}

if (-not (Test-Path "backend/.env")) {
    Copy-Item "backend/.env.example" "backend/.env"
    Write-Host "✅ Created backend/.env (please update with your values)" -ForegroundColor Green
} else {
    Write-Host "ℹ️  backend/.env already exists" -ForegroundColor Blue
}

# Check AWS CLI
Write-Host "`n🔧 Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version
    Write-Host "✅ AWS CLI version: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: AWS CLI not found. Install it for backend deployment." -ForegroundColor Yellow
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update frontend/.env with your API configuration"
Write-Host "2. Update backend/.env with your AWS configuration"
Write-Host "3. Run 'cd frontend; npm run dev' to start the frontend"
Write-Host "4. Run 'cd backend; npm run test' to run backend tests"
Write-Host "`n📚 See README.md for more information" -ForegroundColor Cyan
