@echo off
echo ========================================
echo Deploy Storage Stack (DynamoDB + S3)
echo ========================================
echo.
echo This will create:
echo - DynamoDB tables for users, sessions, schemes
echo - S3 buckets for knowledge base and documents
echo.
pause

set ENVIRONMENT=dev
set REGION=us-east-1
set STACK_NAME=nexis-storage-%ENVIRONMENT%

echo.
echo Deploying storage stack...
echo This may take 3-5 minutes...
echo.

aws cloudformation deploy ^
    --template-file storage-stack.yaml ^
    --stack-name %STACK_NAME% ^
    --parameter-overrides Environment=%ENVIRONMENT% ^
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
echo Storage Stack Deployed Successfully!
echo ========================================
echo.
echo Created resources:
echo - DynamoDB Tables:
echo   * nexis-users-dev
echo   * nexis-user-sessions-dev
echo   * nexis-schemes-dev
echo   * nexis-eligibility-results-dev
echo   * nexis-explanation-cache-dev
echo.
echo - S3 Buckets:
echo   * nexis-knowledge-base-dev
echo.
echo Next step: Deploy compute stack
echo   deploy-compute-stack.bat
echo.
pause
