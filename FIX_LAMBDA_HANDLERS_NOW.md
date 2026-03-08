# Fix Lambda Handlers - Quick Guide

## Current Issue

Your Lambda functions are deployed but can't find their entry points because the handler configuration is wrong.

**Current handler**: `index.handler` ❌  
**Correct handler**: `lambda/eligibility-checker/index.handler` ✅

## Why This Happened

The Lambda ZIP file has this structure:
```
lambda.zip
├── lambda/
│   ├── eligibility-checker/index.js
│   ├── ai-explanation/index.js
│   ├── chat-assistant/index.js
│   ├── profile-manager/index.js
│   └── scheme-uploader/index.js
├── models/
├── services/
└── node_modules/
```

But Lambda is looking for `index.js` at the root, not inside `lambda/eligibility-checker/`.

## Solution: Update Handler Configuration

### Option 1: Use AWS Console (Easiest)

1. Go to https://console.aws.amazon.com/lambda
2. For each function, do this:

**nexis-eligibility-checker-dev**:
- Click on the function name
- Go to "Configuration" → "General configuration"
- Click "Edit"
- Change Handler from `index.handler` to `lambda/eligibility-checker/index.handler`
- Click "Save"

**nexis-ai-explanation-dev**:
- Handler: `lambda/ai-explanation/index.handler`

**nexis-chat-assistant-dev**:
- Handler: `lambda/chat-assistant/index.handler`

**nexis-profile-manager-dev**:
- Handler: `lambda/profile-manager/index.handler`

**nexis-scheme-uploader-dev**:
- Handler: `lambda/scheme-uploader/index.handler`

### Option 2: Use AWS CLI (If Available)

If AWS CLI is in your PATH, run:

```bash
# Check current configuration
aws lambda get-function-configuration --function-name nexis-eligibility-checker-dev --region us-east-1 --query "Handler"

# Fix all handlers
aws lambda update-function-configuration --function-name nexis-eligibility-checker-dev --handler lambda/eligibility-checker/index.handler --region us-east-1

aws lambda update-function-configuration --function-name nexis-ai-explanation-dev --handler lambda/ai-explanation/index.handler --region us-east-1

aws lambda update-function-configuration --function-name nexis-chat-assistant-dev --handler lambda/chat-assistant/index.handler --region us-east-1

aws lambda update-function-configuration --function-name nexis-profile-manager-dev --handler lambda/profile-manager/index.handler --region us-east-1

aws lambda update-function-configuration --function-name nexis-scheme-uploader-dev --handler lambda/scheme-uploader/index.handler --region us-east-1
```

### Option 3: Add AWS CLI to PATH

If AWS CLI is installed but not in PATH:

1. Find AWS CLI location (usually `C:\Program Files\Amazon\AWSCLIV2\`)
2. Add to PATH:
   - Open System Properties → Environment Variables
   - Edit "Path" variable
   - Add: `C:\Program Files\Amazon\AWSCLIV2`
   - Click OK and restart terminal
3. Then run the commands from Option 2

## After Fixing

1. Go to http://localhost:3000
2. Complete the questionnaire
3. Click "Check Eligibility"
4. You should see results from AWS (not "No schemes found")

## Check Logs

After fixing, if you still have issues:

```bash
aws logs tail /aws/lambda/nexis-eligibility-checker-dev --since 5m --region us-east-1
```

Or in AWS Console:
1. Go to Lambda → nexis-eligibility-checker-dev
2. Click "Monitor" → "View CloudWatch logs"
3. Click the latest log stream

## Expected Behavior After Fix

✅ API returns scheme results  
✅ Frontend shows eligibility matches  
✅ No "Cannot find module 'index'" errors  

## Next Steps After This Works

1. Enable Bedrock AI (see `ENABLE_BEDROCK_AI.md`)
2. Upload production schemes (run `upload-production-schemes.ps1`)
3. Test the full application flow

## Summary

This is a simple configuration fix - just update the handler path in each Lambda function. Once done, your NEXIS app will be fully operational on AWS!
