#!/bin/bash

# NEXIS Auth Stack Deployment Script
# Deploys authentication Lambda and infrastructure

set -e

ENVIRONMENT=${1:-dev}
REGION=${2:-us-east-1}
JWT_SECRET=${3:-nexis-jwt-secret-change-in-production}

echo "========================================="
echo "NEXIS Auth Stack Deployment"
echo "========================================="
echo "Environment: $ENVIRONMENT"
echo "Region: $REGION"
echo "========================================="

# Step 1: Install dependencies
echo "Step 1: Installing dependencies..."
npm install

# Step 2: Build TypeScript
echo "Step 2: Building TypeScript..."
npm run build

# Step 3: Package Lambda
echo "Step 3: Packaging Lambda function..."
cd dist
zip -r ../lambda.zip . -x "*.map"
cd ..

# Step 4: Deploy CloudFormation stack
echo "Step 4: Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file cloudformation/auth-stack.yaml \
  --stack-name nexis-auth-$ENVIRONMENT \
  --parameter-overrides \
    Environment=$ENVIRONMENT \
    JWTSecret=$JWT_SECRET \
  --capabilities CAPABILITY_NAMED_IAM \
  --region $REGION

# Step 5: Get Lambda function name
echo "Step 5: Getting Lambda function name..."
LAMBDA_NAME=$(aws cloudformation describe-stacks \
  --stack-name nexis-auth-$ENVIRONMENT \
  --region $REGION \
  --query "Stacks[0].Outputs[?OutputKey=='AuthLambdaArn'].OutputValue" \
  --output text | awk -F: '{print $NF}')

echo "Lambda function: $LAMBDA_NAME"

# Step 6: Update Lambda code
echo "Step 6: Updating Lambda function code..."
aws lambda update-function-code \
  --function-name $LAMBDA_NAME \
  --zip-file fileb://lambda.zip \
  --region $REGION

# Step 7: Wait for update to complete
echo "Step 7: Waiting for Lambda update to complete..."
aws lambda wait function-updated \
  --function-name $LAMBDA_NAME \
  --region $REGION

# Step 8: Get API Gateway URL
echo "Step 8: Getting API Gateway URL..."
API_URL=$(aws cloudformation describe-stacks \
  --stack-name nexis-auth-$ENVIRONMENT \
  --region $REGION \
  --query "Stacks[0].Outputs[?OutputKey=='AuthApiUrl'].OutputValue" \
  --output text)

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo "API Gateway URL: $API_URL"
echo ""
echo "Endpoints:"
echo "  POST $API_URL/auth/register"
echo "  POST $API_URL/auth/login"
echo "  GET  $API_URL/auth/verify"
echo "  PUT  $API_URL/auth/profile"
echo ""
echo "Update your frontend .env file:"
echo "VITE_API_BASE_URL=$API_URL"
echo "========================================="
