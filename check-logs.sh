#!/bin/bash
# Check Lambda CloudWatch Logs

echo "========================================"
echo "Checking Lambda Logs (last 10 minutes)"
echo "========================================"
echo ""

AWS_CLI="/c/Program Files/Amazon/AWSCLIV2/aws.exe"
function_name="nexis-eligibility-checker-dev"

echo "Fetching logs for $function_name..."
echo ""

"$AWS_CLI" logs tail "/aws/lambda/$function_name" \
    --since 10m \
    --region us-east-1 \
    --format short 2>&1

echo ""
echo "========================================"
echo "To follow logs in real-time, run:"
echo "  aws logs tail /aws/lambda/$function_name --follow --region us-east-1"
echo "========================================"
