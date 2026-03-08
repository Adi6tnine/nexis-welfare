# Setting Up Amazon Bedrock Access for NEXIS

## Overview

Amazon Bedrock access is required for NEXIS AI features (explanations and chat assistant). This guide will help you request and configure Bedrock access for the AWS Hackathon.

## Step 1: Request Bedrock Access

### Via AWS Console

1. **Sign in to AWS Console**
   - Go to https://console.aws.amazon.com/
   - Sign in with your AWS account

2. **Navigate to Amazon Bedrock**
   - Search for "Bedrock" in the services search bar
   - Click on "Amazon Bedrock"

3. **Request Model Access**
   - Click "Model access" in the left sidebar
   - Click "Request model access" or "Manage model access"
   - Find "Anthropic" section
   - Check the box for "Claude 3 Haiku"
   - Click "Request model access"

4. **Wait for Approval**
   - Usually instant for Claude 3 Haiku
   - Can take up to 24 hours in some cases
   - You'll receive an email when approved

### Via AWS CLI

```bash
# Check current model access
aws bedrock list-foundation-models --region us-east-1

# If you see Claude models listed, you have access!
```

## Step 2: Verify Bedrock Access

### Test with AWS CLI

```bash
# Test Bedrock access
aws bedrock list-foundation-models \
  --region us-east-1 \
  --query 'modelSummaries[?contains(modelId, `claude`)].modelId'

# Expected output should include:
# - anthropic.claude-3-haiku-20240307-v1:0
```

### Test with Sample Invocation

```bash
# Create test payload
cat > /tmp/bedrock-test.json << 'EOF'
{
  "anthropic_version": "bedrock-2023-05-31",
  "max_tokens": 100,
  "messages": [
    {
      "role": "user",
      "content": "Hello, this is a test. Please respond with 'Bedrock is working!'"
    }
  ]
}
EOF

# Invoke Claude 3 Haiku
aws bedrock-runtime invoke-model \
  --model-id anthropic.claude-3-haiku-20240307-v1:0 \
  --body file:///tmp/bedrock-test.json \
  --region us-east-1 \
  /tmp/bedrock-response.json

# Check response
cat /tmp/bedrock-response.json | jq '.content[0].text'
```

## Step 3: Configure NEXIS for Bedrock

### Update Environment Variables

The Lambda functions need these environment variables:

```bash
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
MOCK_BEDROCK=false  # Set to true for testing without Bedrock
```

### Update Lambda Configuration

```bash
# Update environment variables for AI Lambda functions
aws lambda update-function-configuration \
  --function-name nexis-ai-explanation-dev \
  --environment Variables="{
    BEDROCK_REGION=us-east-1,
    BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0,
    MOCK_BEDROCK=false
  }" \
  --region us-east-1

aws lambda update-function-configuration \
  --function-name nexis-chat-assistant-dev \
  --environment Variables="{
    BEDROCK_REGION=us-east-1,
    BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0,
    MOCK_BEDROCK=false
  }" \
  --region us-east-1
```

## Step 4: Test AI Features

### Test AI Explanation

```bash
# Test explanation endpoint
curl -X POST https://your-api-endpoint/ai/explain \
  -H "Content-Type: application/json" \
  -d '{
    "resultId": "test-result",
    "schemeId": "pm-kisan",
    "language": "en"
  }'
```

### Test Chat Assistant

```bash
# Test chat endpoint
curl -X POST https://your-api-endpoint/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is PM-KISAN scheme?",
    "userId": "test-user",
    "profile": {
      "age": 30,
      "state": "MH",
      "occupation": "Farmer",
      "annualIncome": 100000,
      "socialCategory": "General"
    },
    "language": "en"
  }'
```

## Step 5: Mock Mode (For Testing Without Bedrock)

If you don't have Bedrock access yet, you can use mock mode:

### Enable Mock Mode

```bash
# Set MOCK_BEDROCK=true in Lambda environment
aws lambda update-function-configuration \
  --function-name nexis-ai-explanation-dev \
  --environment Variables="{MOCK_BEDROCK=true}" \
  --region us-east-1

aws lambda update-function-configuration \
  --function-name nexis-chat-assistant-dev \
  --environment Variables="{MOCK_BEDROCK=true}" \
  --region us-east-1
```

### Mock Mode Behavior

When `MOCK_BEDROCK=true`:
- AI explanation returns generic explanations
- Chat assistant returns helpful but generic responses
- No Bedrock API calls are made
- No Bedrock costs incurred
- Perfect for development and testing

## Bedrock Pricing (For Hackathon Budget)

### Claude 3 Haiku Pricing (as of 2024)
- **Input**: $0.25 per 1M tokens (~750K words)
- **Output**: $1.25 per 1M tokens (~750K words)

### Estimated Costs for Hackathon Demo
- **100 eligibility checks with explanations**: ~$0.05
- **100 chat messages**: ~$0.10
- **Total for demo**: < $1.00

### Cost Optimization Tips
1. Use explanation caching (7-day TTL)
2. Limit max_tokens to 1000
3. Use mock mode for development
4. Monitor usage in CloudWatch

## Troubleshooting

### Issue: "Access Denied" Error

**Solution**:
1. Verify model access is approved
2. Check IAM role has `bedrock:InvokeModel` permission
3. Verify correct region (us-east-1)

### Issue: "Model Not Found" Error

**Solution**:
1. Check model ID is correct: `anthropic.claude-3-haiku-20240307-v1:0`
2. Verify region supports Bedrock (us-east-1, us-west-2)
3. Confirm model access is approved

### Issue: "Throttling" Error

**Solution**:
1. Bedrock has rate limits (default: 10 requests/second)
2. Implement exponential backoff (already in code)
3. Request quota increase if needed

## For AWS Hackathon Judges

### Demo Without Bedrock Access

If Bedrock access is pending:
1. Enable mock mode (`MOCK_BEDROCK=true`)
2. Demo shows full functionality
3. Explain that real AI would provide better responses
4. Show code that integrates Bedrock

### Demo With Bedrock Access

1. Show real AI explanations
2. Demonstrate chat assistant
3. Highlight RAG implementation
4. Show safety mechanisms

## Additional Resources

- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Claude 3 Model Card](https://www.anthropic.com/claude)
- [Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)
- [Bedrock Quotas](https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html)

## Support

For Bedrock access issues:
- AWS Support (if you have support plan)
- AWS Forums: https://repost.aws/
- Hackathon organizers

---

**For AWS Hackathon - AI for Bharat**

This setup enables NEXIS to use Amazon Bedrock for AI-powered explanations and chat assistance, making government schemes accessible to all Indian citizens.
