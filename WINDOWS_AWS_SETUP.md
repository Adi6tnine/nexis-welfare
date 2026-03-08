# AWS CLI Installation for Windows

## Step 1: Install AWS CLI

### Option A: Using MSI Installer (Recommended)

1. **Download AWS CLI Installer**
   - Go to: https://awscli.amazonaws.com/AWSCLIV2.msi
   - Or visit: https://aws.amazon.com/cli/
   - Click "Download for Windows"

2. **Run the Installer**
   - Double-click the downloaded `AWSCLIV2.msi` file
   - Follow the installation wizard
   - Click "Next" → "Next" → "Install"
   - Click "Finish" when done

3. **Verify Installation**
   - Open a NEW Command Prompt (important!)
   - Run:
   ```cmd
   aws --version
   ```
   - You should see: `aws-cli/2.x.x Python/3.x.x Windows/...`

### Option B: Using Chocolatey (If you have it)

```powershell
choco install awscli
```

### Option C: Using Winget (Windows 11)

```powershell
winget install Amazon.AWSCLI
```

---

## Step 2: Get AWS Credentials

You need AWS Access Keys to use AWS CLI.

### If You Have an AWS Account:

1. **Sign in to AWS Console**
   - Go to: https://console.aws.amazon.com
   - Sign in with your AWS account

2. **Create Access Keys**
   - Click your name (top right) → "Security credentials"
   - Scroll to "Access keys"
   - Click "Create access key"
   - Select "Command Line Interface (CLI)"
   - Check the confirmation box
   - Click "Create access key"
   - **IMPORTANT**: Download the CSV file or copy the keys NOW!
     - Access Key ID: `AKIA...`
     - Secret Access Key: `wJalr...`

### If You DON'T Have an AWS Account:

1. **Create AWS Account**
   - Go to: https://aws.amazon.com
   - Click "Create an AWS Account"
   - Follow the signup process
   - You'll need:
     - Email address
     - Credit card (for verification, won't be charged immediately)
     - Phone number for verification

2. **Free Tier Benefits**
   - First 12 months: Many services are free
   - Lambda: 1M requests/month free
   - DynamoDB: 25GB storage free
   - S3: 5GB storage free
   - Perfect for NEXIS development!

---

## Step 3: Configure AWS CLI

Open a NEW Command Prompt and run:

```cmd
aws configure
```

Enter your credentials:

```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

**Important Notes:**
- Replace the example keys with YOUR actual keys
- Region: Use `us-east-1` (recommended for NEXIS)
- Output format: Use `json`

---

## Step 4: Verify Configuration

```cmd
aws sts get-caller-identity
```

You should see:
```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

If you see this, AWS CLI is configured correctly! ✅

---

## Step 5: Request Amazon Bedrock Access

**IMPORTANT**: Do this BEFORE deploying NEXIS!

1. **Open AWS Console**
   - Go to: https://console.aws.amazon.com/bedrock

2. **Request Model Access**
   - Click "Model access" in the left menu
   - Click "Request model access" button
   - Find "Anthropic" section
   - Check "Claude 3 Haiku"
   - Click "Request model access" at bottom
   - Wait for approval (usually instant!)

3. **Verify Access**
   ```cmd
   aws bedrock list-foundation-models --region us-east-1
   ```
   - If you see a list of models, you have access! ✅

---

## Step 6: Install Git Bash (For Running Scripts)

Since you're on Windows, you'll need Git Bash to run the deployment scripts.

### Install Git for Windows:

1. **Download Git**
   - Go to: https://git-scm.com/download/win
   - Download the installer

2. **Run Installer**
   - Double-click the downloaded file
   - Use default settings
   - Make sure "Git Bash Here" is checked

3. **Verify Installation**
   - Right-click in any folder
   - You should see "Git Bash Here" option

---

## Step 7: Deploy NEXIS to AWS

### Open Git Bash:

1. Navigate to your project folder
2. Right-click → "Git Bash Here"

### Run Deployment:

```bash
# Make scripts executable
chmod +x scripts/quick-aws-setup.sh
chmod +x scripts/cleanup-aws.sh

# Deploy to AWS
./scripts/quick-aws-setup.sh dev
```

This will take 5-10 minutes and deploy everything!

---

## Alternative: Use PowerShell

If you prefer PowerShell over Git Bash:

### Create PowerShell Deployment Script:

Save this as `deploy-nexis.ps1`:

```powershell
# NEXIS AWS Deployment - PowerShell Version

Write-Host "NEXIS AWS Deployment" -ForegroundColor Blue
Write-Host "===================" -ForegroundColor Blue
Write-Host ""

# Check AWS CLI
try {
    $account = aws sts get-caller-identity --query Account --output text
    Write-Host "✓ AWS Account: $account" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS CLI not configured" -ForegroundColor Red
    Write-Host "Run: aws configure" -ForegroundColor Yellow
    exit 1
}

$env = "dev"
$region = "us-east-1"

Write-Host "Environment: $env" -ForegroundColor Green
Write-Host "Region: $region" -ForegroundColor Green
Write-Host ""

# Deploy IAM roles
Write-Host "Deploying IAM roles..." -ForegroundColor Yellow
Set-Location backend/cloudformation
aws cloudformation deploy `
  --template-file iam-roles.yaml `
  --stack-name nexis-iam-$env `
  --parameter-overrides Environment=$env `
  --capabilities CAPABILITY_NAMED_IAM `
  --region $region

# Deploy storage
Write-Host "Deploying storage..." -ForegroundColor Yellow
aws cloudformation deploy `
  --template-file storage-stack.yaml `
  --stack-name nexis-storage-$env `
  --parameter-overrides Environment=$env `
  --region $region

# Build Lambda
Write-Host "Building Lambda functions..." -ForegroundColor Yellow
Set-Location ../..
Set-Location backend
npm install
npm run build

# Package Lambda
Set-Location dist
Compress-Archive -Path * -DestinationPath ../lambda.zip -Force
Set-Location ..

# Deploy compute
Write-Host "Deploying Lambda functions..." -ForegroundColor Yellow
Set-Location cloudformation
aws cloudformation deploy `
  --template-file compute-stack.yaml `
  --stack-name nexis-compute-$env `
  --parameter-overrides Environment=$env `
  --region $region

# Update Lambda code
Write-Host "Uploading Lambda code..." -ForegroundColor Yellow
$functions = @(
    "nexis-eligibility-checker-$env",
    "nexis-ai-explanation-$env",
    "nexis-chat-assistant-$env",
    "nexis-profile-manager-$env",
    "nexis-scheme-uploader-$env"
)

foreach ($func in $functions) {
    Write-Host "Updating $func..." -ForegroundColor Gray
    aws lambda update-function-code `
      --function-name $func `
      --zip-file fileb://../lambda.zip `
      --region $region
}

# Deploy API
Write-Host "Deploying API Gateway..." -ForegroundColor Yellow
aws cloudformation deploy `
  --template-file api-stack.yaml `
  --stack-name nexis-api-$env `
  --parameter-overrides Environment=$env `
  --region $region

# Get API endpoint
$apiEndpoint = aws cloudformation describe-stacks `
  --stack-name nexis-api-$env `
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' `
  --output text `
  --region $region

Write-Host ""
Write-Host "✓ Deployment Complete!" -ForegroundColor Green
Write-Host "API Endpoint: $apiEndpoint" -ForegroundColor Cyan
Write-Host ""

# Configure frontend
Set-Location ../../frontend
$envContent = @"
VITE_API_BASE_URL=$apiEndpoint
VITE_API_KEY=dev-api-key
VITE_ENVIRONMENT=$env
VITE_ENABLE_CHAT_ASSISTANT=true
VITE_ENABLE_AI_EXPLANATIONS=true
VITE_ENABLE_OFFLINE_MODE=false
VITE_ENABLE_DEBUG_LOGS=true
VITE_MOCK_API_RESPONSES=false
"@

$envContent | Out-File -FilePath .env -Encoding UTF8

Write-Host "✓ Frontend configured" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd frontend" -ForegroundColor White
Write-Host "  2. npm run dev" -ForegroundColor White
Write-Host ""
```

### Run PowerShell Script:

```powershell
# Allow script execution (run as Administrator)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run deployment
.\deploy-nexis.ps1
```

---

## Troubleshooting

### Issue: "aws: command not found"

**Solution**: 
1. Close and reopen Command Prompt/PowerShell
2. AWS CLI needs a fresh terminal to work
3. Verify: `aws --version`

### Issue: "Access Denied" errors

**Solution**:
1. Check your AWS credentials: `aws configure list`
2. Verify IAM user has admin permissions
3. Try creating new access keys

### Issue: "Region not found"

**Solution**:
1. Use `us-east-1` as region
2. Run: `aws configure set region us-east-1`

### Issue: PowerShell script won't run

**Solution**:
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Quick Reference

### Check AWS CLI Version
```cmd
aws --version
```

### Check Configuration
```cmd
aws configure list
```

### Test Connection
```cmd
aws sts get-caller-identity
```

### List S3 Buckets (test permissions)
```cmd
aws s3 ls
```

### View CloudFormation Stacks
```cmd
aws cloudformation list-stacks --region us-east-1
```

---

## Next Steps

Once AWS CLI is installed and configured:

1. ✅ Request Bedrock access (see Step 5)
2. ✅ Run deployment script (Git Bash or PowerShell)
3. ✅ Wait 5-10 minutes for deployment
4. ✅ Start frontend: `cd frontend && npm run dev`
5. ✅ Test at http://localhost:3000

---

## Cost Reminder

- **Free Tier**: First 12 months, many services free
- **Development**: ~$35/month after free tier
- **Production**: ~$100-150/month with traffic

---

## Support Links

- **AWS CLI Docs**: https://docs.aws.amazon.com/cli/
- **AWS Free Tier**: https://aws.amazon.com/free/
- **Bedrock Docs**: https://docs.aws.amazon.com/bedrock/
- **Git for Windows**: https://git-scm.com/download/win

---

## Summary

1. ✅ Install AWS CLI (MSI installer)
2. ✅ Create AWS account (if needed)
3. ✅ Get access keys from AWS Console
4. ✅ Run `aws configure`
5. ✅ Request Bedrock access
6. ✅ Install Git Bash
7. ✅ Run deployment script

**You're ready to deploy NEXIS to AWS!** 🚀
