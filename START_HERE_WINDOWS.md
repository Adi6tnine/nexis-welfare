# 🚀 NEXIS AWS Setup - Windows Quick Start

## You're Here Because: AWS CLI is Not Installed

Let's fix that! Follow these steps in order:

---

## ⚡ Step 1: Install AWS CLI (5 minutes)

### Download and Install:

1. **Click this link**: https://awscli.amazonaws.com/AWSCLIV2.msi
2. **Run the downloaded file** (AWSCLIV2.msi)
3. **Click through the installer**:
   - Next → Next → Install → Finish
4. **Close your current Command Prompt**
5. **Open a NEW Command Prompt**
6. **Test it works**:
   ```cmd
   aws --version
   ```
   You should see: `aws-cli/2.x.x ...`

✅ If you see the version, AWS CLI is installed!

---

## 🔑 Step 2: Get AWS Account & Credentials (10 minutes)

### Do You Have an AWS Account?

#### ❌ NO - Create One:

1. Go to: https://aws.amazon.com
2. Click "Create an AWS Account"
3. Fill in:
   - Email address
   - Password
   - Account name
4. Enter payment info (credit card for verification)
   - Don't worry! You won't be charged immediately
   - Free tier covers most NEXIS usage
5. Verify phone number
6. Choose "Basic Support - Free"
7. Complete signup

#### ✅ YES - Get Access Keys:

1. Sign in: https://console.aws.amazon.com
2. Click your name (top right) → "Security credentials"
3. Scroll to "Access keys" section
4. Click "Create access key"
5. Select "Command Line Interface (CLI)"
6. Check the confirmation box
7. Click "Create access key"
8. **IMPORTANT**: Copy both keys NOW:
   - Access Key ID: `AKIA...` (20 characters)
   - Secret Access Key: `wJalr...` (40 characters)
9. Download CSV file as backup

---

## ⚙️ Step 3: Configure AWS CLI (2 minutes)

Open Command Prompt and run:

```cmd
aws configure
```

Enter your information:

```
AWS Access Key ID [None]: PASTE_YOUR_ACCESS_KEY_HERE
AWS Secret Access Key [None]: PASTE_YOUR_SECRET_KEY_HERE
Default region name [None]: us-east-1
Default output format [None]: json
```

**Test it works**:
```cmd
aws sts get-caller-identity
```

You should see your account info! ✅

---

## 🤖 Step 4: Request Bedrock Access (2 minutes)

**Why?** NEXIS uses AI features that need Bedrock access.

1. Go to: https://console.aws.amazon.com/bedrock
2. Click "Model access" (left menu)
3. Click "Request model access" (orange button)
4. Find "Anthropic" section
5. Check the box for "Claude 3 Haiku"
6. Click "Request model access" at bottom
7. Wait for approval (usually instant!)

**Verify access**:
```cmd
aws bedrock list-foundation-models --region us-east-1
```

If you see a list of models, you're good! ✅

---

## 💻 Step 5: Install Git Bash (5 minutes)

**Why?** To run the deployment scripts.

1. Download: https://git-scm.com/download/win
2. Run the installer
3. Use all default settings
4. Make sure "Git Bash Here" is checked
5. Finish installation

**Test it**:
- Right-click in any folder
- You should see "Git Bash Here" option ✅

---

## 🚀 Step 6: Deploy NEXIS to AWS (10 minutes)

### In Your Project Folder:

1. **Right-click** in the project folder
2. **Select** "Git Bash Here"
3. **Run these commands**:

```bash
# Make scripts executable
chmod +x scripts/quick-aws-setup.sh
chmod +x scripts/cleanup-aws.sh

# Deploy to AWS (this takes 5-10 minutes)
./scripts/quick-aws-setup.sh dev
```

The script will:
- ✅ Deploy all AWS infrastructure
- ✅ Create databases and storage
- ✅ Set up API endpoints
- ✅ Configure your frontend
- ✅ Test everything

**Wait for**: "✓ Setup Complete!" message

---

## 🎉 Step 7: Start Your App

In Git Bash or Command Prompt:

```bash
cd frontend
npm install
npm run dev
```

**Open browser**: http://localhost:3000

**Your NEXIS app is now using real AWS backend!** 🎊

---

## 📋 Quick Checklist

- [ ] AWS CLI installed (`aws --version` works)
- [ ] AWS account created
- [ ] Access keys obtained
- [ ] AWS CLI configured (`aws configure`)
- [ ] Bedrock access requested and approved
- [ ] Git Bash installed
- [ ] Deployment script ran successfully
- [ ] Frontend started and working

---

## 🐛 Common Issues

### "aws: command not found"
**Fix**: Close and reopen Command Prompt. AWS CLI needs a fresh terminal.

### "Access Denied" errors
**Fix**: 
1. Check credentials: `aws configure list`
2. Make sure you copied the keys correctly
3. Try creating new access keys

### "Bedrock access denied"
**Fix**: 
1. Go to AWS Console → Bedrock
2. Request model access
3. Wait for approval (check email)

### Scripts won't run
**Fix**: Use Git Bash instead of Command Prompt

### "Region not found"
**Fix**: Use `us-east-1` as region

---

## 💰 Cost Information

### Free Tier (First 12 Months):
- Lambda: 1M requests/month FREE
- DynamoDB: 25GB storage FREE
- S3: 5GB storage FREE
- API Gateway: 1M requests/month FREE

### After Free Tier:
- Development: ~$35/month
- Production: ~$100-150/month

**For NEXIS development, you'll likely stay within free tier!**

---

## 📞 Need Help?

### Check These Files:
- `WINDOWS_AWS_SETUP.md` - Detailed Windows guide
- `QUICK_START_AWS.md` - Quick deployment guide
- `AWS_DEPLOYMENT_GUIDE.md` - Complete guide

### Useful Commands:
```cmd
# Check AWS CLI version
aws --version

# Check configuration
aws configure list

# Test connection
aws sts get-caller-identity

# View deployed stacks
aws cloudformation list-stacks --region us-east-1

# View Lambda logs
aws logs tail /aws/lambda/nexis-eligibility-checker-dev --follow
```

---

## 🎯 What You'll Have After Deployment

- ✅ 5 Lambda functions (eligibility, AI, chat, profile, schemes)
- ✅ 5 DynamoDB tables (users, results, sessions, schemes, cache)
- ✅ 1 S3 bucket (scheme documents)
- ✅ API Gateway (REST API with authentication)
- ✅ CloudWatch monitoring (dashboards + alarms)
- ✅ Sample PM-KISAN scheme loaded
- ✅ Frontend connected to AWS

---

## 🔄 To Delete Everything Later

When you're done testing:

```bash
# In Git Bash
./scripts/cleanup-aws.sh dev
```

This removes all AWS resources and stops billing.

---

## ✅ You're Ready!

Follow the steps above in order, and you'll have NEXIS running on AWS in about 30 minutes!

**Start with Step 1**: Install AWS CLI

**Questions?** Check `WINDOWS_AWS_SETUP.md` for detailed help.

---

**Let's get started!** 🚀
