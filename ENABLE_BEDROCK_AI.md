# Enable AWS Bedrock AI for NEXIS

## Current Status
- ✅ Lambda functions deployed
- ✅ API Gateway working
- ✅ Frontend connected to AWS
- ⚠️ Bedrock AI needs to be enabled

## What Bedrock AI Does in NEXIS

1. **Eligibility Explanations**: Provides natural language explanations of why a user is eligible/ineligible for schemes
2. **AI Chat Assistant**: Answers questions about schemes, application processes, and eligibility criteria
3. **Personalized Recommendations**: Suggests schemes based on user profile

## Step 1: Enable Bedrock Model Access

1. Go to AWS Console → Bedrock → Model access
2. Click "Manage model access"
3. Enable these models:
   - **Claude 3 Haiku** (recommended - fast and cost-effective)
   - **Claude 3 Sonnet** (optional - more capable)
   - **Titan Text models** (optional - alternative)

4. Click "Request model access" and wait for approval (usually instant)

## Step 2: Verify Bedrock Access

Run this command to test:
```powershell
aws bedrock list-foundation-models --region us-east-1
```

You should see a list of available models.

## Step 3: Update Lambda Environment Variables

The Lambda functions are already configured to use Bedrock. Check the environment variables:

```powershell
aws lambda get-function-configuration --function-name nexis-eligibility-checker-dev --region us-east-1 --query "Environment.Variables"
```

Should show:
- `BEDROCK_MODEL_ID`: anthropic.claude-3-haiku-20240307-v1:0
- `AWS_REGION`: us-east-1

## Step 4: Test Bedrock Integration

After enabling model access, test the eligibility checker:

1. Go to http://localhost:3000
2. Complete the questionnaire
3. View results - you should see AI-generated explanations

## Step 5: Enable AI Chat Assistant

The chat assistant Lambda (`nexis-chat-assistant-dev`) is already deployed. To test:

1. Go to http://localhost:3000/chat
2. Ask questions like:
   - "What schemes am I eligible for?"
   - "How do I apply for PM-KISAN?"
   - "What documents do I need for Ayushman Bharat?"

## Bedrock Pricing (Very Affordable)

Claude 3 Haiku pricing:
- Input: $0.25 per 1M tokens (~750,000 words)
- Output: $1.25 per 1M tokens (~750,000 words)

Estimated cost for NEXIS:
- 1,000 eligibility checks: ~$0.50
- 1,000 chat messages: ~$1.00
- **Total: ~$1.50 per 1,000 users**

## Troubleshooting

### Error: "Access denied to model"
- Go to Bedrock console and enable model access
- Wait 1-2 minutes for permissions to propagate

### Error: "Bedrock not available in region"
- Bedrock is available in us-east-1 (your current region)
- No changes needed

### Chat not working
- Check Lambda logs:
  ```powershell
  aws logs tail /aws/lambda/nexis-chat-assistant-dev --since 5m --region us-east-1
  ```

## Alternative: Use Mock AI (for testing)

If you want to test without Bedrock:
1. The Lambda functions have fallback mock responses
2. Set environment variable: `USE_MOCK_AI=true`

## Next Steps

1. Run `upload-production-schemes.ps1` to upload 10 real schemes
2. Enable Bedrock model access in AWS Console
3. Test the application with real AI explanations
4. Try the chat assistant at /chat

Your NEXIS app will then have:
- ✅ 10 real government schemes
- ✅ AI-powered eligibility explanations
- ✅ Interactive chat assistant
- ✅ Personalized recommendations
