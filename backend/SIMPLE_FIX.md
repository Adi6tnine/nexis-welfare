# Simple Fix for Auth Deployment

## The Problem

The auth stack is trying to create a `nexis-users-dev` table that already exists in the `nexis-storage-dev` stack.

## The Solution

Run this single command:

```cmd
cd backend
deploy-complete-auth.bat
```

This script will:
1. Delete the failed auth stack
2. Update the storage stack to add the EmailIndex (needed for login by email)
3. Build and package Lambda functions
4. Create the auth stack (now using the existing Users table)
5. Update Lambda code
6. Show you the Auth API URL

## What I Fixed

1. **Updated `storage-stack.yaml`**: Added EmailIndex to Users table so you can login by email
2. **Updated `auth-stack.yaml`**: Changed to use existing Users table instead of creating a new one
3. **Created `deploy-complete-auth.bat`**: One-command deployment script

## Expected Output

```
=========================================
SUCCESS! Auth Deployment Complete!
=========================================

Auth API URL: https://xxxxx.execute-api.us-east-1.amazonaws.com/dev

Endpoints:
  POST https://xxxxx.../dev/auth/register
  POST https://xxxxx.../dev/auth/login
  GET  https://xxxxx.../dev/auth/verify
  PUT  https://xxxxx.../dev/auth/profile

NEXT STEP: Update frontend/.env with:
VITE_AUTH_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/dev
```

## After Deployment

1. Copy the API URL from the output
2. Open `frontend/.env`
3. Add this line:
   ```
   VITE_AUTH_API_URL=https://YOUR-API-URL-HERE/dev
   ```
4. Commit and push:
   ```cmd
   git add frontend/.env backend/cloudformation/
   git commit -m "Fix auth deployment and add API URL"
   git push origin main
   ```

## Test It

After frontend redeploys (2-3 minutes), test at:
https://main.d2ywvs8iqkfqkz.amplifyapp.com

1. Click "Sign Up"
2. Create account
3. Login
4. Check eligibility

Everything should work!

## If It Still Fails

Check the error with:
```cmd
aws cloudformation describe-stack-events --stack-name nexis-auth-dev --region us-east-1 --max-items 10 --query "StackEvents[?ResourceStatus=='CREATE_FAILED'].[LogicalResourceId,ResourceStatusReason]" --output table
```

Then let me know what the error says.
