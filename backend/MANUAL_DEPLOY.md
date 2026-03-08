# Manual Deployment Steps (No Scripts)

If PowerShell scripts are blocked, follow these manual steps:

## Step 1: Install Dependencies
```powershell
npm install
```

## Step 2: Build TypeScript
```powershell
npm run build
```

## Step 3: Package Lambda
```powershell
cd dist
Compress-Archive -Path * -DestinationPath ../lambda.zip -Force
cd ..
```

## Step 4: Deploy CloudFormation Stack
```powershell
aws cloudformation deploy `
  --template-file cloudformation/auth-stack.yaml `
  --stack-name nexis-auth-dev `
  --parameter-overrides Environment=dev JWTSecret=nexis-jwt-secret-change-in-production `
  --capabilities CAPABILITY_NAMED_IAM `
  --region us-east-1
```

## Step 5: Get Lambda Function Name
```powershell
$LambdaArn = aws cloudformation describe-stacks `
  --stack-name nexis-auth-dev `
  --region us-east-1 `
  --query "Stacks[0].Outputs[?OutputKey=='AuthLambdaArn'].OutputValue" `
  --output text

$LambdaName = $LambdaArn.Split(':')[-1]
Write-Host "Lambda function: $LambdaName"
```

## Step 6: Update Lambda Code
```powershell
aws lambda update-function-code `
  --function-name $LambdaName `
  --zip-file fileb://lambda.zip `
  --region us-east-1
```

## Step 7: Wait for Update
```powershell
aws lambda wait function-updated `
  --function-name $LambdaName `
  --region us-east-1
```

## Step 8: Get API URL
```powershell
$ApiUrl = aws cloudformation describe-stacks `
  --stack-name nexis-auth-dev `
  --region us-east-1 `
  --query "Stacks[0].Outputs[?OutputKey=='AuthApiUrl'].OutputValue" `
  --output text

Write-Host "API URL: $ApiUrl"
```

## Step 9: Enable Real Bedrock (Optional)

For each Lambda function, update environment variables:

```powershell
# Chat Assistant
aws lambda update-function-configuration `
  --function-name nexis-chat-assistant-dev `
  --environment Variables="{MOCK_BEDROCK=false,BEDROCK_REGION=us-east-1,BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0}" `
  --region us-east-1

# AI Explanation
aws lambda update-function-configuration `
  --function-name nexis-ai-explanation-dev `
  --environment Variables="{MOCK_BEDROCK=false,BEDROCK_REGION=us-east-1,BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0}" `
  --region us-east-1

# Eligibility Checker
aws lambda update-function-configuration `
  --function-name nexis-eligibility-checker-dev `
  --environment Variables="{MOCK_BEDROCK=false}" `
  --region us-east-1
```

## Step 10: Update Frontend .env
```
VITE_API_BASE_URL=<your-api-url-from-step-8>
```

## Done! 🎉
