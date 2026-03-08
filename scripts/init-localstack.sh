#!/bin/bash

# Initialize LocalStack S3 Buckets for NEXIS Development

set -e

LOCALSTACK_ENDPOINT="http://localhost:4566"
AWS_REGION="us-east-1"

echo "☁️  Initializing LocalStack S3 buckets..."

# Check if LocalStack is running
if ! curl -s "$LOCALSTACK_ENDPOINT/_localstack/health" > /dev/null 2>&1; then
    echo "❌ Error: LocalStack is not running at $LOCALSTACK_ENDPOINT"
    echo "   Please start it with: docker-compose up localstack"
    exit 1
fi

echo "✅ LocalStack is running"

# Function to create bucket if it doesn't exist
create_bucket_if_not_exists() {
    BUCKET_NAME=$1
    
    # Check if bucket exists
    if aws s3 ls "s3://$BUCKET_NAME" --endpoint-url "$LOCALSTACK_ENDPOINT" --region "$AWS_REGION" > /dev/null 2>&1; then
        echo "ℹ️  Bucket $BUCKET_NAME already exists"
    else
        echo "📦 Creating bucket: $BUCKET_NAME"
        aws s3 mb "s3://$BUCKET_NAME" --endpoint-url "$LOCALSTACK_ENDPOINT" --region "$AWS_REGION"
        echo "✅ Bucket $BUCKET_NAME created"
    fi
}

# Create Knowledge Base bucket
create_bucket_if_not_exists "nexis-knowledge-base-dev"

# Create directory structure in the bucket
echo ""
echo "📁 Creating directory structure in knowledge base bucket..."

# Create sample scheme directories
aws s3api put-object \
    --bucket nexis-knowledge-base-dev \
    --key schemes/ \
    --endpoint-url "$LOCALSTACK_ENDPOINT" \
    --region "$AWS_REGION" > /dev/null 2>&1

aws s3api put-object \
    --bucket nexis-knowledge-base-dev \
    --key templates/ \
    --endpoint-url "$LOCALSTACK_ENDPOINT" \
    --region "$AWS_REGION" > /dev/null 2>&1

aws s3api put-object \
    --bucket nexis-knowledge-base-dev \
    --key indexes/ \
    --endpoint-url "$LOCALSTACK_ENDPOINT" \
    --region "$AWS_REGION" > /dev/null 2>&1

echo "✅ Directory structure created"

# Create a sample scheme for testing
echo ""
echo "📝 Creating sample scheme data..."

# Create sample policy document
cat > /tmp/sample-policy.txt << 'EOF'
Pradhan Mantri Jan Dhan Yojana (PMJDY)

This scheme aims to provide universal access to banking facilities with at least one basic banking account for every household.

Eligibility Criteria:
- Any Indian citizen
- Age: 10 years and above
- No income restrictions
- Available in all states

Benefits:
- Zero balance account
- RuPay debit card
- Accident insurance cover of ₹1 lakh
- Life insurance cover of ₹30,000
- Overdraft facility up to ₹10,000

Required Documents:
- Aadhaar card
- PAN card (optional)
- Address proof
EOF

# Create sample FAQ document
cat > /tmp/sample-faq.txt << 'EOF'
Frequently Asked Questions - PMJDY

Q: Who can open a PMJDY account?
A: Any Indian citizen aged 10 years or above can open a PMJDY account.

Q: Is there any minimum balance requirement?
A: No, PMJDY accounts are zero balance accounts.

Q: What documents are required?
A: You need Aadhaar card and address proof. PAN card is optional.

Q: Can I get a debit card?
A: Yes, you will receive a RuPay debit card with your account.

Q: Is there any insurance coverage?
A: Yes, you get accident insurance of ₹1 lakh and life insurance of ₹30,000.
EOF

# Upload sample documents to S3
aws s3 cp /tmp/sample-policy.txt \
    "s3://nexis-knowledge-base-dev/schemes/pmjdy-001/policy.txt" \
    --endpoint-url "$LOCALSTACK_ENDPOINT" \
    --region "$AWS_REGION"

aws s3 cp /tmp/sample-faq.txt \
    "s3://nexis-knowledge-base-dev/schemes/pmjdy-001/faq.txt" \
    --endpoint-url "$LOCALSTACK_ENDPOINT" \
    --region "$AWS_REGION"

# Clean up temp files
rm /tmp/sample-policy.txt /tmp/sample-faq.txt

echo "✅ Sample scheme data created"

echo ""
echo "✅ LocalStack S3 initialization complete!"
echo ""
echo "📦 Buckets created:"
echo "  - nexis-knowledge-base-dev"
echo ""
echo "To list buckets, run:"
echo "  aws s3 ls --endpoint-url $LOCALSTACK_ENDPOINT --region $AWS_REGION"
echo ""
echo "To view bucket contents, run:"
echo "  aws s3 ls s3://nexis-knowledge-base-dev --recursive --endpoint-url $LOCALSTACK_ENDPOINT --region $AWS_REGION"
