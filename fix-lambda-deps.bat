@echo off
echo Fixing Lambda dependencies...

cd backend

echo [1/4] Building TypeScript...
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo [2/4] Copying node_modules to dist...
if exist dist\node_modules rmdir /s /q dist\node_modules
xcopy /E /I /Y node_modules dist\node_modules

echo [3/4] Creating lambda.zip...
if exist lambda.zip del /f lambda.zip
powershell -Command "Compress-Archive -Path .\dist\* -DestinationPath .\lambda.zip -Force"

echo [4/4] Updating Lambda function...
"C:\Program Files\Amazon\AWSCLIV2\aws.exe" lambda update-function-code --function-name nexis-eligibility-api-dev --zip-file fileb://lambda.zip --region us-east-1

echo.
echo Waiting for function to be ready...
timeout /t 10 /nobreak

echo.
echo Done! Test the API with:
echo   powershell -ExecutionPolicy Bypass -File ..\test-eligibility-api.ps1

cd ..
pause
