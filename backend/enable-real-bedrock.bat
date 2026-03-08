@echo off
REM Enable Real AWS Bedrock Integration (Batch)
REM Sets MOCK_BEDROCK=false for all Lambda functions

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
set REGION=%2

if "%ENVIRONMENT%"=="" set ENVIRONMENT=dev
if "%REGION%"=="" set REGION=us-east-1

echo ========================================
echo Enabling Real AWS Bedrock
echo ========================================
echo Environment: %ENVIRONMENT%
echo Region: %REGION%
echo ========================================
echo.

REM List of Lambda functions to update
set FUNCTIONS=nexis-chat-assistant-%ENVIRONMENT% nexis-ai-explanation-%ENVIRONMENT% nexis-eligibility-checker-%ENVIRONMENT%

for %%F in (%FUNCTIONS%) do (
    echo Updating %%F...
    
    REM Get current environment variables
    for /f "delims=" %%i in ('aws lambda get-function-configuration --function-name %%F --region %REGION% --query "Environment.Variables" --output json 2^>nul') do set CURRENT_ENV=%%i
    
    if "!CURRENT_ENV!"=="" (
        echo   [X] Function not found
    ) else (
        REM Update MOCK_BEDROCK to false
        echo !CURRENT_ENV! > temp_env.json
        powershell -Command "$env = Get-Content temp_env.json | ConvertFrom-Json; $env | Add-Member -NotePropertyName 'MOCK_BEDROCK' -NotePropertyValue 'false' -Force; $env | ConvertTo-Json -Compress | Out-File -Encoding ASCII temp_env_updated.json"
        
        for /f "delims=" %%j in (temp_env_updated.json) do set UPDATED_ENV=%%j
        
        REM Update Lambda function
        aws lambda update-function-configuration ^
            --function-name %%F ^
            --environment Variables=!UPDATED_ENV! ^
            --region %REGION% >nul 2>&1
        
        if errorlevel 1 (
            echo   [X] Update failed
        ) else (
            echo   [OK] Updated successfully
        )
        
        del temp_env.json temp_env_updated.json 2>nul
    )
    echo.
)

echo ========================================
echo Real Bedrock Enabled!
echo ========================================
echo.
echo All Lambda functions now use real AWS Bedrock.
echo Make sure you have:
echo   1. AWS Bedrock access enabled in your account
echo   2. Claude 3 Haiku model access granted
echo   3. Proper IAM permissions for Bedrock
echo.
echo To revert to mock mode, run:
echo   disable-real-bedrock.bat
echo ========================================

endlocal
