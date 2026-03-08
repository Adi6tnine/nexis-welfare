#!/bin/bash
# Fix Lambda Handler Configurations

echo "========================================"
echo "Fixing Lambda Handler Configurations"
echo "========================================"
echo ""

AWS_CLI="/c/Program Files/Amazon/AWSCLIV2/aws.exe"

# Array of function names and their correct handlers
declare -A functions=(
    ["nexis-eligibility-checker-dev"]="lambda/eligibility-checker/index.handler"
    ["nexis-ai-explanation-dev"]="lambda/ai-explanation/index.handler"
    ["nexis-chat-assistant-dev"]="lambda/chat-assistant/index.handler"
    ["nexis-profile-manager-dev"]="lambda/profile-manager/index.handler"
    ["nexis-scheme-uploader-dev"]="lambda/scheme-uploader/index.handler"
)

for func in "${!functions[@]}"; do
    handler="${functions[$func]}"
    echo "Updating $func..."
    echo "  Handler: $handler"
    
    "$AWS_CLI" lambda update-function-configuration \
        --function-name "$func" \
        --handler "$handler" \
        --region us-east-1 \
        --output text > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo "  ✓ Success!"
    else
        echo "  ✗ Failed"
    fi
    
    echo ""
    sleep 2
done

echo "========================================"
echo "All Lambda handlers updated!"
echo "========================================"
echo ""
echo "Now test the application:"
echo "1. Go to http://localhost:3000"
echo "2. Complete the questionnaire"
echo "3. Check if results load from AWS"
echo ""
echo "To check logs:"
echo "  bash check-logs.sh"
