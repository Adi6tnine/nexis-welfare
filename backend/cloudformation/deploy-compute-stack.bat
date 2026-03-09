@echo off
echo ========================================
echo Deploy Compute Stack (Lambda Functions)
echo ========================================
echo.
echo This will deploy all Lambda functions including:
echo - nexis-chat-assistant-dev
echo - nexis-eligibility-checker-dev
echo - nexis-ai-explanation-dev
echo - And more...
echo.
echo Prerequisites:
echo - Storage stack must be deployed first
echo.
pause

set ENVIRONMENT=dev
set REGION=us-east-1
set STACK_NAME=nexis-compute-%ENVIRONMENT%
set STORAGE_STACK=nexis-storage-%ENVIRONMENT%

echo.
echo Checking if storage stack exists...
aws cloudformation describe-stacks --stack-name %STORAGE_STACK% --region %REGION% >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Storage stack not found!
    echo.
    echo You need to deploy storage stack first:
    echo   deploy-storage-stack.bat
    echo.
    pause
    exit /b 1
)

echo Storage stack found!
echo.
echo Deploying compute stack...
echo This may take 5-10 minutes...
echo.

aws cloudformation deploy ^
    --template-file compute-stack.yaml ^
    --stack-name %STACK_NAME% ^
    --parameter-overrides Environment=%ENVIRONMENT% StorageStackName=%STORAGE_STACK% ^
    --capabilities CAPABILITY_NAMED_IAM ^
    --region %REGION%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Deployment failed!
    echo Check CloudFormation console for details.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Compute Stack Deployed Successfully!
echo ========================================
echo.
echo Lambda functions created:
echo - nexis-chat-assistant-dev
echo - nexis-eligibility-checker-dev
echo - nexis-ai-explanation-dev
echo - nexis-profile-manager-dev
echo - nexis-scheme-uploader-dev
echo.
echo Next step: Update Lambda code
echo   cd ..
echo   fix-chat-lambda-now.bat
echo.
pause
