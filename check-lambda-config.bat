@echo off
echo ========================================
echo Checking Lambda Configurations
echo ========================================
echo.

echo nexis-eligibility-checker-dev:
aws lambda get-function-configuration --function-name nexis-eligibility-checker-dev --region us-east-1 --query "Handler" --output text
echo.

echo nexis-ai-explanation-dev:
aws lambda get-function-configuration --function-name nexis-ai-explanation-dev --region us-east-1 --query "Handler" --output text
echo.

echo nexis-chat-assistant-dev:
aws lambda get-function-configuration --function-name nexis-chat-assistant-dev --region us-east-1 --query "Handler" --output text
echo.

echo nexis-profile-manager-dev:
aws lambda get-function-configuration --function-name nexis-profile-manager-dev --region us-east-1 --query "Handler" --output text
echo.

echo nexis-scheme-uploader-dev:
aws lambda get-function-configuration --function-name nexis-scheme-uploader-dev --region us-east-1 --query "Handler" --output text
echo.

pause
