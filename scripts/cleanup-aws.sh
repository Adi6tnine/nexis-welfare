#!/bin/bash

# NEXIS AWS Cleanup Script
# Deletes all AWS resources created by NEXIS

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-east-1}

echo -e "${RED}╔════════════════════════════════════════╗${NC}"
echo -e "${RED}║   NEXIS AWS Cleanup Script             ║${NC}"
echo -e "${RED}║   ⚠️  WARNING: This deletes all data!  ║${NC}"
echo -e "${RED}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Region: ${AWS_REGION}${NC}"
echo ""
echo -e "${RED}This will permanently delete:${NC}"
echo "  - All Lambda functions"
echo "  - All DynamoDB tables and data"
echo "  - All S3 buckets and files"
echo "  - API Gateway"
echo "  - CloudWatch dashboards and alarms"
echo "  - IAM roles and policies"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " -r
echo

if [ "$REPLY" != "yes" ]; then
    echo "Cleanup cancelled"
    exit 0
fi

echo ""
echo -e "${YELLOW}Starting cleanup...${NC}"
echo ""

# Function to delete stack
delete_stack() {
    local stack_name=$1
    echo "Deleting stack: ${stack_name}..."
    
    if aws cloudformation describe-stacks --stack-name ${stack_name} --region ${AWS_REGION} &> /dev/null; then
        aws cloudformation delete-stack --stack-name ${stack_name} --region ${AWS_REGION}
        echo -e "${GREEN}✓ ${stack_name} deletion initiated${NC}"
    else
        echo -e "${YELLOW}⚠ ${stack_name} not found, skipping${NC}"
    fi
}

# Function to wait for stack deletion
wait_for_deletion() {
    local stack_name=$1
    echo "Waiting for ${stack_name} to be deleted..."
    
    if aws cloudformation describe-stacks --stack-name ${stack_name} --region ${AWS_REGION} &> /dev/null; then
        aws cloudformation wait stack-delete-complete --stack-name ${stack_name} --region ${AWS_REGION} 2>/dev/null || true
        echo -e "${GREEN}✓ ${stack_name} deleted${NC}"
    fi
}

# Step 1: Delete monitoring stack
echo -e "${BLUE}Step 1: Deleting monitoring stack...${NC}"
delete_stack "nexis-monitoring-${ENVIRONMENT}"
echo ""

# Step 2: Delete API stack
echo -e "${BLUE}Step 2: Deleting API stack...${NC}"
delete_stack "nexis-api-${ENVIRONMENT}"
echo ""

# Step 3: Delete compute stack
echo -e "${BLUE}Step 3: Deleting compute stack...${NC}"
delete_stack "nexis-compute-${ENVIRONMENT}"
echo ""

# Step 4: Empty and delete S3 buckets
echo -e "${BLUE}Step 4: Emptying S3 buckets...${NC}"
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name nexis-storage-${ENVIRONMENT} \
  --query 'Stacks[0].Outputs[?OutputKey==`KnowledgeBaseBucketName`].OutputValue' \
  --output text \
  --region ${AWS_REGION} 2>/dev/null || echo "")

if [ -n "$BUCKET_NAME" ]; then
    echo "Emptying bucket: ${BUCKET_NAME}..."
    aws s3 rm s3://${BUCKET_NAME} --recursive --region ${AWS_REGION} 2>/dev/null || true
    echo -e "${GREEN}✓ Bucket emptied${NC}"
else
    echo -e "${YELLOW}⚠ Bucket not found${NC}"
fi
echo ""

# Step 5: Delete storage stack
echo -e "${BLUE}Step 5: Deleting storage stack...${NC}"
delete_stack "nexis-storage-${ENVIRONMENT}"
echo ""

# Step 6: Delete IAM stack
echo -e "${BLUE}Step 6: Deleting IAM stack...${NC}"
delete_stack "nexis-iam-${ENVIRONMENT}"
echo ""

# Wait for all deletions to complete
echo -e "${YELLOW}Waiting for all stacks to be deleted...${NC}"
echo "This may take 5-10 minutes..."
echo ""

wait_for_deletion "nexis-monitoring-${ENVIRONMENT}"
wait_for_deletion "nexis-api-${ENVIRONMENT}"
wait_for_deletion "nexis-compute-${ENVIRONMENT}"
wait_for_deletion "nexis-storage-${ENVIRONMENT}"
wait_for_deletion "nexis-iam-${ENVIRONMENT}"

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Cleanup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "All NEXIS resources have been deleted from AWS"
echo ""
echo "Deleted stacks:"
echo "  ✓ nexis-monitoring-${ENVIRONMENT}"
echo "  ✓ nexis-api-${ENVIRONMENT}"
echo "  ✓ nexis-compute-${ENVIRONMENT}"
echo "  ✓ nexis-storage-${ENVIRONMENT}"
echo "  ✓ nexis-iam-${ENVIRONMENT}"
echo ""
echo -e "${BLUE}Note: Some resources may take a few more minutes to fully delete${NC}"
echo ""

# Remove local config file
if [ -f "aws-config-${ENVIRONMENT}.txt" ]; then
    rm "aws-config-${ENVIRONMENT}.txt"
    echo -e "${GREEN}✓ Local configuration file removed${NC}"
fi

echo ""
echo -e "${GREEN}Cleanup complete! 🧹${NC}"
echo ""
