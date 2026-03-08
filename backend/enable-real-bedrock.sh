#!/bin/bash

# Enable Real AWS Bedrock Integration
# Sets MOCK_BEDROCK=false for all Lambda functions

set -e

ENVIRONMENT=${1:-dev}
REGION=${2:-us-east-1}

echo "========================================="
echo "Enabling Real AWS Bedrock"
echo "========================================="
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"
echo "========================================="

# List of Lambda functions to update
LAMBDA_FUNCTIONS=(
    "nexis-chat-assistant-$ENVIRONMENT"
    "nexis-ai-explanation-$ENVIRONMENT"
    "nexis-eligibility-checker-$ENVIRONMENT"
)

for FUNCTION_NAME in "${LAMBDA_FUNCTIONS[@]}"; do
    echo ""
    echo "Updating $FUNCTION_NAME..."
    
    # Get current environment variables
    CURRENT_ENV=$(aws lambda get-function-configuration \
        --function-name $FUNCTION_NAME \
        --region $REGION \
        --query "Environment.Variables" \
        --output json 2>/dev/null || echo "{}")
    
    if [ "$CURRENT_ENV" = "{}" ]; then
        echo "  ✗ Function not found"
        continue
    fi
    
    # Update MOCK_BEDROCK to false
    UPDATED_ENV=$(echo $CURRENT_ENV | jq '. + {"MOCK_BEDROCK": "false"}')
    
    # Update Lambda function
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --environment "Variables=$UPDATED_ENV" \
        --region $REGION > /dev/null
    
    echo "  ✓ Updated successfully"
done

echo ""
echo "========================================="
echo "Real Bedrock Enabled!"
echo "========================================="
echo ""
echo "All Lambda functions now use real AWS Bedrock."
echo "Make sure you have:"
echo "  1. AWS Bedrock access enabled in your account"
echo "  2. Claude 3 Haiku model access granted"
echo "  3. Proper IAM permissions for Bedrock"
echo ""
echo "To revert to mock mode, run:"
echo "  ./disable-real-bedrock.sh"
echo "========================================="
