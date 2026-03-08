# Deploy NEXIS to AWS - Quick Start

## You're Ready! Just Run This:

```cmd
deploy-nexis.bat
```

That's it! The script will:
1. ✅ Check AWS CLI (already installed)
2. ✅ Use your configured credentials (Account: 771033850734)
3. ✅ Deploy all AWS resources
4. ✅ Configure frontend automatically

## What Happens During Deployment

The script deploys in this order:
1. IAM roles for Lambda functions
2. S3 bucket for scheme documents
3. DynamoDB tables for user profiles and schemes
4. Lambda functions (5 functions)
5. API Gateway
6. CloudWatch monitoring

Takes about 5-10 minutes.

## After Deployment

Once complete, you'll see:
```
API Endpoint: https://xxxxx.execute-api.us-east-1.amazonaws.com/dev
```

Then just:
```cmd
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 and you're live on AWS!

## Troubleshooting

If you see "AWS CLI not found":
- Close and reopen your terminal
- Or run: `refreshenv` (if you have Chocolatey)
- Or add to PATH: `C:\Program Files\Amazon\AWSCLIV2`

## What Gets Created

All resources are prefixed with `nexis-` and tagged with environment `dev`:
- Stack: nexis-iam-dev
- Stack: nexis-storage-dev  
- Stack: nexis-compute-dev
- Stack: nexis-api-dev
- Stack: nexis-monitoring-dev

## Cost Estimate

AWS Free Tier covers most usage:
- Lambda: 1M requests/month free
- DynamoDB: 25GB storage free
- S3: 5GB storage free
- API Gateway: 1M requests/month free

Expected cost: $0-5/month for development

## Need Help?

Check the detailed guide: `AWS_DEPLOYMENT_GUIDE.md`
