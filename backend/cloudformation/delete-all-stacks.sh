#!/bin/bash

# NEXIS CloudFormation Stack Deletion Script
# This script deletes all CloudFormation stacks in the correct reverse order

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
    echo "Usage: ./delete-all-stacks.sh <environment> [region]"
    echo "Example: ./delete-all-stacks.sh dev us-east-1"
    exit 1
fi

ENVIRONMENT=$1
AWS_REGION=${2:-us-east-1}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    print_error "Invalid environment. Must be one of: dev, staging, prod"
    exit 1
fi

print_warning "=========================================="
print_warning "WARNING: This will DELETE all NEXIS infrastructure for environment: $ENVIRONMENT"
print_warning "This includes:"
print_warning "  - All DynamoDB tables and data"
print_warning "  - All S3 buckets and objects"
print_warning "  - All Lambda functions"
print_warning "  - API Gateway and endpoints"
print_warning "  - CloudWatch dashboards and alarms"
print_warning "  - Amplify app and deployments"
print_warning "=========================================="

read -p "Are you sure you want to continue? Type 'DELETE' to confirm: " CONFIRM

if [ "$CONFIRM" != "DELETE" ]; then
    print_info "Deletion cancelled"
    exit 0
fi

print_warning "Starting deletion process in 5 seconds... Press Ctrl+C to cancel"
sleep 5

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

# Function to check if stack exists
stack_exists() {
    local stack_name=$1
    aws cloudformation describe-stacks \
        --stack-name "$stack_name" \
        --region "$AWS_REGION" &> /dev/null
    return $?
}

# Function to wait for stack deletion
wait_for_deletion() {
    local stack_name=$1
    
    print_info "Waiting for stack $stack_name to be deleted..."
    
    aws cloudformation wait stack-delete-complete \
        --stack-name "$stack_name" \
        --region "$AWS_REGION"
    
    if [ $? -eq 0 ]; then
        print_info "Stack $stack_name deleted successfully"
    else
        print_error "Stack $stack_name deletion failed"
        exit 1
    fi
}

# Function to delete stack
delete_stack() {
    local stack_name=$1
    
    if stack_exists "$stack_name"; then
        print_info "Deleting stack: $stack_name"
        
        aws cloudformation delete-stack \
            --stack-name "$stack_name" \
            --region "$AWS_REGION"
        
        wait_for_deletion "$stack_name"
    else
        print_warning "Stack $stack_name does not exist, skipping"
    fi
}

# Function to empty S3 bucket before deletion
empty_s3_bucket() {
    local bucket_name=$1
    
    print_info "Checking if S3 bucket $bucket_name exists..."
    
    if aws s3 ls "s3://$bucket_name" --region "$AWS_REGION" 2>/dev/null; then
        print_warning "Emptying S3 bucket: $bucket_name"
        aws s3 rm "s3://$bucket_name" --recursive --region "$AWS_REGION"
        
        # Delete all versions if versioning is enabled
        print_info "Deleting all object versions..."
        aws s3api list-object-versions \
            --bucket "$bucket_name" \
            --region "$AWS_REGION" \
            --output json | \
        jq -r '.Versions[]? | .Key + " " + .VersionId' | \
        while read key version; do
            aws s3api delete-object \
                --bucket "$bucket_name" \
                --key "$key" \
                --version-id "$version" \
                --region "$AWS_REGION" 2>/dev/null || true
        done
        
        # Delete all delete markers
        print_info "Deleting all delete markers..."
        aws s3api list-object-versions \
            --bucket "$bucket_name" \
            --region "$AWS_REGION" \
            --output json | \
        jq -r '.DeleteMarkers[]? | .Key + " " + .VersionId' | \
        while read key version; do
            aws s3api delete-object \
                --bucket "$bucket_name" \
                --key "$key" \
                --version-id "$version" \
                --region "$AWS_REGION" 2>/dev/null || true
        done
        
        print_info "S3 bucket $bucket_name emptied"
    else
        print_warning "S3 bucket $bucket_name does not exist, skipping"
    fi
}

print_info "Starting deletion process..."

# Delete stacks in reverse order

# 5. Delete Frontend Stack
print_info "=========================================="
print_info "Step 1/5: Deleting Frontend Stack"
print_info "=========================================="
delete_stack "nexis-frontend-${ENVIRONMENT}"

# 4. Delete Monitoring Stack
print_info "=========================================="
print_info "Step 2/5: Deleting Monitoring Stack"
print_info "=========================================="
delete_stack "nexis-monitoring-${ENVIRONMENT}"

# 3. Delete API Stack
print_info "=========================================="
print_info "Step 3/5: Deleting API Stack"
print_info "=========================================="
delete_stack "nexis-api-${ENVIRONMENT}"

# 2. Delete Compute Stack
print_info "=========================================="
print_info "Step 4/5: Deleting Compute Stack"
print_info "=========================================="
delete_stack "nexis-compute-${ENVIRONMENT}"

# 1. Delete Storage Stack (after emptying S3 bucket)
print_info "=========================================="
print_info "Step 5/5: Deleting Storage Stack"
print_info "=========================================="

# Empty S3 bucket first
empty_s3_bucket "nexis-knowledge-base-${ENVIRONMENT}"

# Now delete the storage stack
delete_stack "nexis-storage-${ENVIRONMENT}"

print_info "=========================================="
print_info "Deletion Complete!"
print_info "=========================================="

print_info "All NEXIS infrastructure for environment '$ENVIRONMENT' has been deleted."
print_warning "Note: Some resources like CloudWatch Logs may have retention policies and will be deleted after the retention period expires."

print_info "Deletion script completed successfully!"
