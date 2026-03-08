@echo off
REM NEXIS Complete Deployment Script (Batch)
REM Works without PowerShell execution policy issues

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
set REGION=%2
set JWT_SECRET=%3

if "%ENVIRONMENT%"=="" set ENVIRONMENT=dev
if "%REGION%"=="" set REGION=us-east-1
if "%JWT_SECRET%"=="" set JWT_SECRET=nexis-jwt-secret-change-in-production

echo ========================================
echo NEXIS Complete Deployment
echo ========================================
echo Environment: %ENVIRONMENT%
echo Region: %REGION%
echo ========================================
echo.

REM Step 1: Install dependencies
echo Step 1: Installing dependencies...
echo ----------------------------------------
if not exist "node_modules" (
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        exit /b 1
    )
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed
)
echo.

REM Step 2: Build TypeScript
echo Step 2: Building TypeScript...
echo ----------------------------------------
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    exit /b 1
)
echo [OK] TypeScript compiled
echo.

REM Step 3: Package Lambda
echo Step 3: Packaging Lambda...
echo ----------------------------------------
cd dist
if exist ..\lambda.zip del ..\lambda.zip
powershell -Command "Compress-Archive -Path * -DestinationPath ../lambda.zip -Force"
cd ..
echo [OK] Lambda packaged
echo.

REM Step 4: Deploy CloudFormation
echo Step 4: Deploying CloudFormation stack...
echo ----------------------------------------
aws cloudformation deploy ^
  --template-file cloudformation/auth-stack.yaml ^
  --stack-name nexis-auth-%ENVIRONMENT% ^
  --parameter-overrides Environment=%ENVIRONMENT% JWTSecret=%JWT_SECRET% ^
  --capabilities CAPABILITY_NAMED_IAM ^
  --region %REGION%

if errorlevel 1 (
    echo ERROR: CloudFormation deployment failed
    exit /b 1
)
echo [OK] CloudFormation deployed
echo.

REM Step 5: Get Lambda function name
echo Step 5: Getting Lambda function name...
echo ----------------------------------------
for /f "delims=" %%i in ('aws cloudformation describe-stacks --stack-name nexis-auth-%ENVIRONMENT% --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='AuthLambdaArn'].OutputValue" --output text') do set LAMBDA_ARN=%%i
for /f "tokens=8 delims=:" %%a in ("%LAMBDA_ARN%") do set LAMBDA_NAME=%%a
echo Lambda function: %LAMBDA_NAME%
echo.

REM Step 6: Update Lambda code
echo Step 6: Updating Lambda code...
echo ----------------------------------------
aws lambda update-function-code ^
  --function-name %LAMBDA_NAME% ^
  --zip-file fileb://lambda.zip ^
  --region %REGION% >nul

if errorlevel 1 (
    echo ERROR: Lambda update failed
    exit /b 1
)
echo [OK] Lambda code updated
echo.

REM Step 7: Wait for update
echo Step 7: Waiting for Lambda update...
echo ----------------------------------------
aws lambda wait function-updated ^
  --function-name %LAMBDA_NAME% ^
  --region %REGION%
echo [OK] Lambda update complete
echo.

REM Step 8: Get API URL
echo Step 8: Getting API URL...
echo ----------------------------------------
for /f "delims=" %%i in ('aws cloudformation describe-stacks --stack-name nexis-auth-%ENVIRONMENT% --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='AuthApiUrl'].OutputValue" --output text') do set API_URL=%%i
echo.

REM Final Summary
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo API URL: %API_URL%
echo.
echo Endpoints:
echo   POST %API_URL%/auth/register
echo   POST %API_URL%/auth/login
echo   GET  %API_URL%/auth/verify
echo   PUT  %API_URL%/auth/profile
echo.
echo Next Steps:
echo 1. Update frontend/.env:
echo    VITE_API_BASE_URL=%API_URL%
echo.
echo 2. Test the API:
echo    curl -X POST %API_URL%/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test123\",\"name\":\"Test\"}"
echo.
echo 3. Enable real Bedrock (optional):
echo    Run: enable-real-bedrock.bat
echo.
echo ========================================

endlocal
