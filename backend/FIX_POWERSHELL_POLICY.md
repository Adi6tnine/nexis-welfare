# Fix PowerShell Execution Policy

## The Problem
PowerShell is blocking script execution with this error:
```
.\deploy-all.ps1 : File cannot be loaded because running scripts is disabled on this system.
```

---

## Solution 1: Enable PowerShell Scripts (Recommended)

### Option A: For Current User Only (No Admin Required)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run:
```powershell
.\deploy-all.ps1 -Environment dev -Region us-east-1
```

### Option B: For Current Session Only
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

Then run:
```powershell
.\deploy-all.ps1 -Environment dev -Region us-east-1
```

### Option C: Run Script Directly with Bypass
```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-all.ps1 -Environment dev -Region us-east-1
```

---

## Solution 2: Use Batch Files (No Policy Change Needed)

We've created `.bat` versions that work without execution policy issues:

```cmd
deploy-all.bat dev us-east-1
```

Or:
```cmd
enable-real-bedrock.bat dev us-east-1
```

---

## Solution 3: Manual Deployment (Copy & Paste)

If you can't change the policy or use batch files, follow the manual steps in `MANUAL_DEPLOY.md`:

```powershell
# Step 1: Install dependencies
npm install

# Step 2: Build TypeScript
npm run build

# Step 3: Package Lambda
cd dist
Compress-Archive -Path * -DestinationPath ../lambda.zip -Force
cd ..

# Step 4: Deploy CloudFormation
aws cloudformation deploy `
  --template-file cloudformation/auth-stack.yaml `
  --stack-name nexis-auth-dev `
  --parameter-overrides Environment=dev JWTSecret=nexis-jwt-secret `
  --capabilities CAPABILITY_NAMED_IAM `
  --region us-east-1

# Step 5: Get Lambda name
$LambdaArn = aws cloudformation describe-stacks `
  --stack-name nexis-auth-dev `
  --region us-east-1 `
  --query "Stacks[0].Outputs[?OutputKey=='AuthLambdaArn'].OutputValue" `
  --output text
$LambdaName = $LambdaArn.Split(':')[-1]

# Step 6: Update Lambda code
aws lambda update-function-code `
  --function-name $LambdaName `
  --zip-file fileb://lambda.zip `
  --region us-east-1

# Step 7: Wait for update
aws lambda wait function-updated `
  --function-name $LambdaName `
  --region us-east-1

# Step 8: Get API URL
$ApiUrl = aws cloudformation describe-stacks `
  --stack-name nexis-auth-dev `
  --region us-east-1 `
  --query "Stacks[0].Outputs[?OutputKey=='AuthApiUrl'].OutputValue" `
  --output text

Write-Host "API URL: $ApiUrl"
```

---

## Which Solution Should I Use?

### Use Solution 1 if:
- You want the easiest experience
- You're comfortable changing execution policy
- You'll be running scripts regularly

### Use Solution 2 if:
- You can't change execution policy
- You prefer batch files
- You're on a restricted corporate machine

### Use Solution 3 if:
- You want full control
- You're troubleshooting issues
- You want to understand each step

---

## Verify Execution Policy

Check current policy:
```powershell
Get-ExecutionPolicy -List
```

Should show:
```
Scope          ExecutionPolicy
-----          ---------------
MachinePolicy  Undefined
UserPolicy     Undefined
Process        Undefined
CurrentUser    RemoteSigned  ← This should be RemoteSigned or Bypass
LocalMachine   Undefined
```

---

## Security Note

`RemoteSigned` policy:
- ✓ Allows local scripts to run
- ✓ Requires downloaded scripts to be signed
- ✓ Safe for development
- ✓ Recommended by Microsoft

This is a safe and standard setting for developers.

---

## Quick Reference

| Method | Command | Admin Required? |
|--------|---------|----------------|
| PowerShell (User) | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` | No |
| PowerShell (Session) | `Set-ExecutionPolicy Bypass -Scope Process` | No |
| PowerShell (Bypass) | `powershell -ExecutionPolicy Bypass -File .\deploy-all.ps1` | No |
| Batch File | `deploy-all.bat dev us-east-1` | No |
| Manual | Copy commands from MANUAL_DEPLOY.md | No |

---

## Still Having Issues?

1. **Check if you're in the right directory:**
   ```powershell
   Get-Location  # Should be: ...\backend
   ```

2. **Check if file exists:**
   ```powershell
   Test-Path .\deploy-all.ps1  # Should return: True
   ```

3. **Try batch file instead:**
   ```cmd
   deploy-all.bat
   ```

4. **Use manual deployment:**
   See `MANUAL_DEPLOY.md`

---

**Recommended: Use Solution 1, Option A** - It's the easiest and most permanent fix! 🚀
