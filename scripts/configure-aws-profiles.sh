#!/bin/bash

# Configure AWS CLI Profiles for NEXIS Environments

set -e

echo "🔧 Configuring AWS CLI profiles for NEXIS..."
echo ""
echo "This script will help you set up AWS CLI profiles for:"
echo "  - nexis-dev (Development environment)"
echo "  - nexis-staging (Staging environment)"
echo "  - nexis-prod (Production environment)"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI is not installed"
    echo "   Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

echo "✅ AWS CLI is installed: $(aws --version)"
echo ""

# Function to configure a profile
configure_profile() {
    PROFILE_NAME=$1
    ENVIRONMENT=$2
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Configuring profile: $PROFILE_NAME ($ENVIRONMENT)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Check if profile already exists
    if aws configure list --profile "$PROFILE_NAME" > /dev/null 2>&1; then
        echo "ℹ️  Profile $PROFILE_NAME already exists"
        read -p "Do you want to reconfigure it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "⏭️  Skipping $PROFILE_NAME"
            echo ""
            return
        fi
    fi
    
    echo "Please enter the AWS credentials for $ENVIRONMENT:"
    echo ""
    
    # Get AWS Access Key ID
    read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
    
    # Get AWS Secret Access Key
    read -sp "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
    echo ""
    
    # Get AWS Region (default: us-east-1)
    read -p "AWS Region [us-east-1]: " AWS_REGION
    AWS_REGION=${AWS_REGION:-us-east-1}
    
    # Configure the profile
    aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID" --profile "$PROFILE_NAME"
    aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY" --profile "$PROFILE_NAME"
    aws configure set region "$AWS_REGION" --profile "$PROFILE_NAME"
    aws configure set output json --profile "$PROFILE_NAME"
    
    echo "✅ Profile $PROFILE_NAME configured successfully"
    echo ""
    
    # Verify the profile
    echo "Verifying profile..."
    if aws sts get-caller-identity --profile "$PROFILE_NAME" > /dev/null 2>&1; then
        echo "✅ Profile verification successful"
        ACCOUNT_ID=$(aws sts get-caller-identity --profile "$PROFILE_NAME" --query Account --output text)
        echo "   AWS Account ID: $ACCOUNT_ID"
    else
        echo "⚠️  Warning: Could not verify profile (check your credentials)"
    fi
    
    echo ""
}

# Configure development profile
configure_profile "nexis-dev" "Development"

# Configure staging profile
configure_profile "nexis-staging" "Staging"

# Configure production profile
configure_profile "nexis-prod" "Production"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ AWS CLI profile configuration complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Configured profiles:"
echo "  - nexis-dev"
echo "  - nexis-staging"
echo "  - nexis-prod"
echo ""
echo "To use a profile, set the AWS_PROFILE environment variable:"
echo "  export AWS_PROFILE=nexis-dev"
echo ""
echo "Or use the --profile flag with AWS CLI commands:"
echo "  aws s3 ls --profile nexis-dev"
echo ""
echo "To view all configured profiles:"
echo "  aws configure list-profiles"
echo ""
echo "To view profile details:"
echo "  aws configure list --profile nexis-dev"
echo ""
