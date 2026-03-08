@echo off
echo ========================================
echo QUICK FIX - Lambda Dependencies
echo ========================================
echo.

cd backend

echo [1/3] Building TypeScript...
call npm run build

echo.
echo [2/3] Copying node_modules...
xcopy /E /I /Y /Q node_modules dist\node_modules

echo.
echo [3/3] Creating and uploading lambda.zip...
powershell -Command "Compress-Archive -Path .\dist\* -DestinationPath .\lambda.zip -Force"

echo.
echo Uploading to AWS Lambda...
"C:\Program Files\Amazon\AWSCLIV2\aws.exe" lambda update-function-code --function-name nexis-eligibility-checker-dev --zip-file fileb://lambda.zip --region us-east-1

echo.
echo ========================================
echo DONE! Waiting 10 seconds for deployment...
echo ========================================
timeout /t 10 /nobreak

cd ..
echo.
echo Now test with: powershell -ExecutionPolicy Bypass -File test-eligibility-api.ps1
pause
