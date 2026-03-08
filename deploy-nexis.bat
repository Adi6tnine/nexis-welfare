@echo off
REM NEXIS AWS Deployment Wrapper for Windows
REM This ensures AWS CLI is in PATH before running PowerShell script

echo.
echo ========================================
echo NEXIS AWS Deployment
echo ========================================
echo.

REM Check if AWS CLI is in PATH
where aws >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo AWS CLI not found in PATH. Adding common locations...
    
    REM Add common AWS CLI installation paths
    set "PATH=%PATH%;C:\Program Files\Amazon\AWSCLIV2"
    set "PATH=%PATH%;%ProgramFiles%\Amazon\AWSCLIV2"
    set "PATH=%PATH%;%LOCALAPPDATA%\Programs\Amazon\AWSCLIV2"
    
    REM Check again
    where aws >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: AWS CLI not found!
        echo Please install from: https://awscli.amazonaws.com/AWSCLIV2.msi
        echo Or add AWS CLI to your PATH
        pause
        exit /b 1
    )
)

echo AWS CLI found!
echo.

REM Run PowerShell script with proper execution policy
powershell.exe -ExecutionPolicy Bypass -Command "& '%~dp0deploy-nexis.ps1' %*"

echo.
pause
