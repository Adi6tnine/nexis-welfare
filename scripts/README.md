# NEXIS Development Scripts

This directory contains utility scripts for setting up and managing the NEXIS development environment.

## Available Scripts

### setup.sh

**Purpose**: Main setup script for initializing the complete development environment.

**Usage**:
```bash
bash scripts/setup.sh
```

**What it does**:
- Checks Node.js and npm versions
- Installs frontend and backend dependencies
- Creates environment files from templates
- Starts Docker services (LocalStack and DynamoDB Local)
- Initializes S3 buckets and DynamoDB tables
- Verifies all services are running

**Requirements**:
- Node.js 18.x or higher
- npm 9.x or higher
- Docker and Docker Compose (optional but recommended)
- AWS CLI (optional but recommended)

---

### configure-aws-profiles.sh

**Purpose**: Interactive script to configure AWS CLI profiles for different environments.

**Usage**:
```bash
bash scripts/configure-aws-profiles.sh
```

**What it does**:
- Guides you through setting up AWS CLI profiles
- Configures profiles for dev, staging, and production
- Verifies credentials by calling AWS STS
- Displays account information

**Profiles created**:
- `nexis-dev` - Development environment
- `nexis-staging` - Staging environment
- `nexis-prod` - Production environment

**Requirements**:
- AWS CLI installed
- AWS Access Key ID and Secret Access Key for each environment

---

### init-local-dynamodb.sh

**Purpose**: Initialize DynamoDB Local tables for development.

**Usage**:
```bash
bash scripts/init-local-dynamodb.sh
```

**What it does**:
- Creates all required DynamoDB tables locally
- Sets up Global Secondary Indexes (GSIs)
- Configures billing mode and attributes
- Verifies table creation

**Tables created**:
- `nexis-users-dev`
- `nexis-eligibility-results-dev`
- `nexis-user-sessions-dev`
- `nexis-schemes-dev`
- `nexis-explanation-cache-dev`

**Requirements**:
- DynamoDB Local running (via Docker)
- AWS CLI installed
- DynamoDB Local accessible at `http://localhost:8000`

---

### init-localstack.sh

**Purpose**: Initialize LocalStack S3 buckets and sample data for development.

**Usage**:
```bash
bash scripts/init-localstack.sh
```

**What it does**:
- Creates S3 buckets in LocalStack
- Sets up directory structure for knowledge base
- Uploads sample scheme documents for testing
- Verifies bucket creation

**Buckets created**:
- `nexis-knowledge-base-dev`

**Sample data**:
- Sample scheme: Pradhan Mantri Jan Dhan Yojana (PMJDY)
- Policy document and FAQ

**Requirements**:
- LocalStack running (via Docker)
- AWS CLI installed
- LocalStack accessible at `http://localhost:4566`

---

### setup.ps1

**Purpose**: PowerShell version of setup.sh for Windows users.

**Usage**:
```powershell
.\scripts\setup.ps1
```

**What it does**:
- Same functionality as setup.sh but for Windows
- Uses PowerShell commands instead of Bash

**Requirements**:
- PowerShell 5.1 or higher
- Node.js 18.x or higher
- Docker Desktop for Windows (optional)
- AWS CLI for Windows (optional)

---

## Script Execution Order

For a fresh setup, run scripts in this order:

1. **setup.sh** - Main setup (runs other scripts automatically)
   ```bash
   bash scripts/setup.sh
   ```

2. **configure-aws-profiles.sh** - Only if deploying to AWS
   ```bash
   bash scripts/configure-aws-profiles.sh
   ```

If you need to re-initialize services individually:

```bash
# Re-initialize DynamoDB tables
bash scripts/init-local-dynamodb.sh

# Re-initialize LocalStack S3 buckets
bash scripts/init-localstack.sh
```

## Troubleshooting

### Script Permission Denied

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Or run with bash explicitly
bash scripts/setup.sh
```

### Docker Services Not Running

```bash
# Start Docker services first
docker-compose up -d

# Wait for services to be ready
sleep 10

# Then run initialization scripts
bash scripts/init-local-dynamodb.sh
bash scripts/init-localstack.sh
```

### AWS CLI Not Found

```bash
# Install AWS CLI
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows
# Download from: https://aws.amazon.com/cli/
```

### LocalStack/DynamoDB Connection Issues

```bash
# Check if services are running
docker ps

# View logs
docker logs nexis-localstack
docker logs nexis-dynamodb-local

# Restart services
docker-compose restart
```

## Environment Variables

Scripts use these environment variables (with defaults):

- `DYNAMODB_ENDPOINT` - Default: `http://localhost:8000`
- `LOCALSTACK_ENDPOINT` - Default: `http://localhost:4566`
- `AWS_REGION` - Default: `us-east-1`

Override them if needed:

```bash
DYNAMODB_ENDPOINT=http://localhost:9000 bash scripts/init-local-dynamodb.sh
```

## Adding New Scripts

When adding new scripts to this directory:

1. Make them executable: `chmod +x scripts/your-script.sh`
2. Add a shebang: `#!/bin/bash`
3. Use `set -e` to exit on errors
4. Add error checking and user feedback
5. Document the script in this README
6. Test on both macOS and Linux

## Additional Resources

- [Environment Setup Guide](../docs/ENVIRONMENT_SETUP.md)
- [Quick Start Guide](../docs/QUICK_START.md)
- [Docker Documentation](https://docs.docker.com/)
- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/)
- [LocalStack Documentation](https://docs.localstack.cloud/)

---

**Last Updated**: 2024-03-15  
**Version**: 1.0
