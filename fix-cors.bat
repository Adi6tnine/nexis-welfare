@echo off
echo Fixing CORS for NEXIS API Gateway...
echo.

set API_ID=b73ak67e9k
set REGION=us-east-1

echo Enabling CORS on API Gateway...
aws apigateway update-rest-api --rest-api-id %API_ID% --region %REGION% --patch-operations op=replace,path=/,value=*

echo.
echo Creating new deployment to apply changes...
aws apigateway create-deployment --rest-api-id %API_ID% --stage-name dev --region %REGION%

echo.
echo CORS fixed! Restart your frontend:
echo   cd frontend
echo   npm run dev
echo.
pause
