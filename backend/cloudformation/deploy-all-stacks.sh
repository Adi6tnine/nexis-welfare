#!/bin/bash

# NEXIS CloudFormation Stack Deployment Script
# This script deploys all CloudFormation stacks in the correct order

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if environment parameter is provided
if [ -z "$1" ]; then
    print_error "Environment parameter is required"
    echo "Usage: ./deploy-all-stacks.sh <environment> [region]"
    echo "Example: ./deploy-all-stacks.sh dev us-east-1"
    exit 1
fi

ENVIRONMENT=$1
AWS_REGION=${2:-us-east-1}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    print_error "Invalid environment. Must be one of: dev, staging, prod"
    exit 1
fi

print_info "Starting NEXIS infrastructure deployment for environment: $ENVIRONMENT"
print_info "AWS Region: $AWS_REGION"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials are not configured. Please configure AWS CLI."
    exit 1
fi

print_info "AWS credentials verified"

# Function to wait for stack completion
wait_for_stack() {
    local stack_name=$1
    local operation=$2
    
    print_info "Waiting for stack $stack_name to complete $operation..."
    
    if [ "$operation" == "create" ]; then
        aws cloudformation wait stack-create-complete \
            --stack-name "$stack_name" \
            --region "$AWS_REGION"
    elif [ "$operation" == "update" ]; then
        aws cloudformation wait stack-update-complete \
            --stack-name "$stack_name" \
            --region "$AWS_REGION"
    fi
    
    if [ $? -eq 0 ]; then
        print_info "Stack $stack_name $operation completed successfully"
    else
        print_error "Stack $stack_name $operation failed"
        exit 1
    fi
}

# Function to check if stack exists
stack_exists() {
    local stack_name=$1
    aws cloudformation describe-stacks \
        --stack-name "$stack_name" \
        --region "$AWS_REGION" &> /dev/null
    return $?
}

# Function to deploy or update stack
deploy_stack() {
    local stack_name=$1
    local template_file=$2
    shift 2
    local parameters=("$@")
    
    print_info "Deploying stack: $stack_name"
    
    if stack_exists "$stack_name"; then
        print_warning "Stack $stack_name already exists. Updating..."
        
        aws cloudformation update-stack \
            --stack-name "$stack_name" \
            --template-body "file://$template_file" \
            "${parameters[@]}" \
            --region "$AWS_REGION" 2>&1 | tee /tmp/stack-update.log
        
        if grep -q "No updates are to be performed" /tmp/stack-update.log; then
            print_info "No updates needed for stack $stack_name"
        else
            wait_for_stack "$stack_name" "update"
        fi
    else
        print_info "Creating new stack: $stack_name"
        
        aws cloudformation create-stack \
            --stack-name "$stack_name" \
            --template-body "file://$template_file" \
            "${parameters[@]}" \
            --region "$AWS_REGION"
        
        wait_for_stack "$stack_name" "create"
    fi
}

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

print_info "Checking for required template files..."

# Check if all template files exist
TEMPLATES=("storage-stack.yaml" "compute-stack.yaml" "api-stack.yaml" "monitoring-stack.yaml" "frontend-stack.yaml")
for template in "${TEMPLATES[@]}"; do
    if [ ! -f "$template" ]; then
        print_error "Template file $template not found"
        exit 1
    fi
done

print_info "All template files found"

# Prompt for required parameters
print_info "Please provide the following parameters:"

read -p "Alert Email Address: " ALERT_EMAIL
if [ -z "$ALERT_EMAIL" ]; then
    print_error "Alert email is required"
    exit 1
fi

# For frontend stack (only if deploying frontend)
read -p "Deploy frontend stack? (y/n): " DEPLOY_FRONTEND
if [ "$DEPLOY_FRONTEND" == "y" ]; then
    read -p "GitHub Repository URL: " GITHUB_REPO
    read -p "GitHub Branch: " GITHUB_BRANCH
    read -sp "GitHub Token: " GITHUB_TOKEN
    echo
    
    if [ -z "$GITHUB_REPO" ] || [ -z "$GITHUB_BRANCH" ] || [ -z "$GITHUB_TOKEN" ]; then
        print_error "GitHub parameters are required for frontend deployment"
        exit 1
    fi
fi

print_info "Starting deployment process..."

# 1. Deploy Storage Stack
print_info "=========================================="
print_info "Step 1/5: Deploying Storage Stack"
print_info "=========================================="

deploy_stack \
    "nexis-storage-${ENVIRONMENT}" \
    "storage-stack.yaml" \
    --parameters "ParameterKey=Environment,ParameterValue=${ENVIRONMENT}"

# 2. Deploy Compute Stack
print_info "=========================================="
print_info "Step 2/5: Deploying Compute Stack"
print_info "=========================================="

deploy_stack \
    "nexis-compute-${ENVIRONMENT}" \
    "compute-stack.yaml" \
    --parameters \
        "ParameterKey=Environment,ParameterValue=${ENVIRONMENT}" \
        "ParameterKey=StorageStackName,ParameterValue=nexis-storage-${ENVIRONMENT}" \
    --capabilities CAPABILITY_NAMED_IAM

# 3. Deploy API Stack
print_info "=========================================="
print_info "Step 3/5: Deploying API Stack"
print_info "=========================================="

deploy_stack \
    "nexis-api-${ENVIRONMENT}" \
    "api-stack.yaml" \
    --parameters \
        "ParameterKey=Environment,ParameterValue=${ENVIRONMENT}" \
        "ParameterKey=ComputeStackName,ParameterValue=nexis-compute-${ENVIRONMENT}"

# 4. Deploy Monitoring Stack
print_info "=========================================="
print_info "Step 4/5: Deploying Monitoring Stack"
print_info "=========================================="

deploy_stack \
    "nexis-monitoring-${ENVIRONMENT}" \
    "monitoring-stack.yaml" \
    --parameters \
        "ParameterKey=Environment,ParameterValue=${ENVIRONMENT}" \
        "ParameterKey=ComputeStackName,ParameterValue=nexis-compute-${ENVIRONMENT}" \
        "ParameterKey=APIStackName,ParameterValue=nexis-api-${ENVIRONMENT}" \
        "ParameterKey=AlertEmail,ParameterValue=${ALERT_EMAIL}"

# 5. Deploy Frontend Stack (optional)
if [ "$DEPLOY_FRONTEND" == "y" ]; then
    print_info "=========================================="
    print_info "Step 5/5: Deploying Frontend Stack"
    print_info "=========================================="
    
    deploy_stack \
        "nexis-frontend-${ENVIRONMENT}" \
        "frontend-stack.yaml" \
        --parameters \
            "ParameterKey=Environment,ParameterValue=${ENVIRONMENT}" \
            "ParameterKey=GitHubRepository,ParameterValue=${GITHUB_REPO}" \
            "ParameterKey=GitHubBranch,ParameterValue=${GITHUB_BRANCH}" \
            "ParameterKey=GitHubToken,ParameterValue=${GITHUB_TOKEN}" \
            "ParameterKey=APIStackName,ParameterValue=nexis-api-${ENVIRONMENT}" \
        --capabilities CAPABILITY_NAMED_IAM
else
    print_info "Skipping frontend stack deployment"
fi

print_info "=========================================="
print_info "Deployment Complete!"
print_info "=========================================="

# Retrieve and display important outputs
print_info "Retrieving stack outputs..."

API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "nexis-api-${ENVIRONMENT}" \
    --query 'Stacks[0].Outputs[?OutputKey==`APIEndpoint`].OutputValue' \
    --output text \
    --region "$AWS_REGION")

API_KEY_ID=$(aws cloudformation describe-stacks \
    --stack-name "nexis-api-${ENVIRONMENT}" \
    --query 'Stacks[0].Outputs[?OutputKey==`APIKeyId`].OutputValue' \
    --output text \
    --region "$AWS_REGION")

print_info "API Endpoint: $API_ENDPOINT"
print_info "API Key ID: $API_KEY_ID"

# Get API Key value
print_info "Retrieving API Key value..."
API_KEY=$(aws apigateway get-api-key \
    --api-key "$API_KEY_ID" \
    --include-value \
    --query 'value' \
    --output text \
    --region "$AWS_REGION")

print_info "API Key: $API_KEY"

if [ "$DEPLOY_FRONTEND" == "y" ]; then
    AMPLIFY_URL=$(aws cloudformation describe-stacks \
        --stack-name "nexis-frontend-${ENVIRONMENT}" \
        --query 'Stacks[0].Outputs[?OutputKey==`AmplifyAppURL`].OutputValue' \
        --output text \
        --region "$AWS_REGION")
    
    print_info "Amplify App URL: $AMPLIFY_URL"
fi

print_info "=========================================="
print_info "Next Steps:"
print_info "1. Check your email ($ALERT_EMAIL) for SNS subscription confirmation"
print_info "2. Deploy Lambda function code to the created functions"
print_info "3. Upload scheme documents to S3 bucket: nexis-knowledge-base-${ENVIRONMENT}"
print_info "4. Test API endpoints using the API key"
print_info "5. Monitor CloudWatch dashboards for system health"
print_info "=========================================="

print_info "Deployment script completed successfully!"
