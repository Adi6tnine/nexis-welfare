@echo off
echo Installing missing AWS SDK packages...
cd backend
call npm install @aws-sdk/client-textract @aws-sdk/client-polly @aws-sdk/client-transcribe-streaming @types/aws-lambda --save
echo Done!
pause
