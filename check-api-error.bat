@echo off
echo Checking API Gateway deployment error...
echo.

aws cloudformation describe-stack-events --stack-name nexis-api-dev --region us-east-1 --max-items 10 --query "StackEvents[?contains(ResourceStatus, 'FAILED')].[Timestamp,LogicalResourceId,ResourceStatusReason]" --output table

echo.
pause
