#!/bin/bash

# Initialize Local DynamoDB Tables for NEXIS Development

set -e

DYNAMODB_ENDPOINT="http://localhost:8000"
AWS_REGION="us-east-1"

echo "🗄️  Initializing local DynamoDB tables..."

# Check if DynamoDB Local is running
if ! curl -s "$DYNAMODB_ENDPOINT" > /dev/null 2>&1; then
    echo "❌ Error: DynamoDB Local is not running at $DYNAMODB_ENDPOINT"
    echo "   Please start it with: docker-compose up dynamodb-local"
    exit 1
fi

echo "✅ DynamoDB Local is running"

# Function to create table if it doesn't exist
create_table_if_not_exists() {
    TABLE_NAME=$1
    TABLE_DEFINITION=$2
    
    # Check if table exists
    if aws dynamodb describe-table --table-name "$TABLE_NAME" --endpoint-url "$DYNAMODB_ENDPOINT" --region "$AWS_REGION" > /dev/null 2>&1; then
        echo "ℹ️  Table $TABLE_NAME already exists"
    else
        echo "📝 Creating table: $TABLE_NAME"
        eval "$TABLE_DEFINITION"
        echo "✅ Table $TABLE_NAME created"
    fi
}

# Create Users Table
create_table_if_not_exists "nexis-users-dev" \
"aws dynamodb create-table \
    --table-name nexis-users-dev \
    --attribute-definitions \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url $DYNAMODB_ENDPOINT \
    --region $AWS_REGION"

# Create Eligibility Results Table
create_table_if_not_exists "nexis-eligibility-results-dev" \
"aws dynamodb create-table \
    --table-name nexis-eligibility-results-dev \
    --attribute-definitions \
        AttributeName=resultId,AttributeType=S \
        AttributeName=timestamp,AttributeType=S \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=resultId,KeyType=HASH \
        AttributeName=timestamp,KeyType=RANGE \
    --global-secondary-indexes \
        'IndexName=userId-timestamp-index,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=timestamp,KeyType=RANGE}],Projection={ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url $DYNAMODB_ENDPOINT \
    --region $AWS_REGION"

# Create User Sessions Table
create_table_if_not_exists "nexis-user-sessions-dev" \
"aws dynamodb create-table \
    --table-name nexis-user-sessions-dev \
    --attribute-definitions \
        AttributeName=sessionId,AttributeType=S \
    --key-schema \
        AttributeName=sessionId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url $DYNAMODB_ENDPOINT \
    --region $AWS_REGION"

# Create Schemes Table
create_table_if_not_exists "nexis-schemes-dev" \
"aws dynamodb create-table \
    --table-name nexis-schemes-dev \
    --attribute-definitions \
        AttributeName=schemeId,AttributeType=S \
        AttributeName=state,AttributeType=S \
    --key-schema \
        AttributeName=schemeId,KeyType=HASH \
    --global-secondary-indexes \
        'IndexName=state-index,KeySchema=[{AttributeName=state,KeyType=HASH}],Projection={ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url $DYNAMODB_ENDPOINT \
    --region $AWS_REGION"

# Create Explanation Cache Table
create_table_if_not_exists "nexis-explanation-cache-dev" \
"aws dynamodb create-table \
    --table-name nexis-explanation-cache-dev \
    --attribute-definitions \
        AttributeName=cacheKey,AttributeType=S \
    --key-schema \
        AttributeName=cacheKey,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url $DYNAMODB_ENDPOINT \
    --region $AWS_REGION"

echo ""
echo "✅ All DynamoDB tables initialized successfully!"
echo ""
echo "📊 View tables at: http://localhost:8001 (DynamoDB Admin UI)"
echo ""
echo "To list tables, run:"
echo "  aws dynamodb list-tables --endpoint-url $DYNAMODB_ENDPOINT --region $AWS_REGION"
