# PLAN D: Manual Lambda Upload via AWS Console

## Steps (3 minutes):

1. **Create the ZIP manually:**
   - Go to `backend/dist` folder
   - Select ALL files and folders
   - Right-click → Send to → Compressed (zipped) folder
   - Name it `lambda-manual.zip`

2. **Upload via AWS Console:**
   - Go to: https://console.aws.amazon.com/lambda
   - Find function: `nexis-eligibility-checker-dev`
   - Click "Upload from" → ".zip file"
   - Select `lambda-manual.zip`
   - Click "Save"
   - Wait 30 seconds

3. **Test immediately:**
   - Run: `test-eligibility-api.ps1`

## If ZIP is too large (>50MB):

1. **Upload to S3 first:**
   ```powershell
   aws s3 cp backend/lambda.zip s3://nexis-schemes-dev/lambda.zip
   aws lambda update-function-code --function-name nexis-eligibility-checker-dev --s3-bucket nexis-schemes-dev --s3-key lambda.zip --region us-east-1
   ```

2. **Or reduce size:**
   - Delete `dist/node_modules/@types` folder
   - Delete `dist/node_modules/typescript` folder
   - Delete `dist/node_modules/jest` folder
   - Re-zip and upload
