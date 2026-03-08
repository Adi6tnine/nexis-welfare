#!/bin/bash
# Check Lambda Handler Configurations

echo "========================================"
echo "Checking Lambda Configurations"
echo "========================================"
echo ""

functions=(
    "nexis-eligibility-checker-dev"
    "nexis-ai-explanation-dev"
    "nexis-chat-assistant-dev"
    "nexis-profile-manager-dev"
    "nexis-scheme-uploader-dev"
)

AWS_CLI="/c/Program Files/Amazon/AWSCLIV2/aws.exe"

for func in "${functions[@]}"; do
    echo "$func:"
    "$AWS_CLI" lambda get-function-configuration \
        --function-name "$func" \
        --region us-east-1 \
        --query "Handler" \
        --output text 2>&1
    echo ""
done

echo "========================================"
echo "Expected handlers should be:"
echo "  lambda/eligibility-checker/index.handler"
echo "  lambda/ai-explanation/index.handler"
echo "  lambda/chat-assistant/index.handler"
echo "  lambda/profile-manager/index.handler"
echo "  lambda/scheme-uploader/index.handler"
echo "========================================"
