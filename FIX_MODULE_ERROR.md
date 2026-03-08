# 🔧 Fix "Cannot use import statement outside a module" Error

## The Problem
Lambda is failing with: `SyntaxError: Cannot use import statement outside a module`

This happens because TypeScript was compiling to ESM (ES Modules) but Lambda expects CommonJS.

## The Solution (Already Fixed!)

I've already updated your TypeScript configuration to output CommonJS format:
- ✅ Changed `tsconfig.json`: `module: "CommonJS"` (was "ESNext")
- ✅ Removed `"type": "module"` from `package.json`

## What You Need to Do

Run this command to rebuild and redeploy:
```cmd
rebuild-lambda.bat
```

This will:
1. Clean old build
2. Recompile TypeScript to CommonJS format
3. Package with node_modules
4. Upload to AWS Lambda
5. Wait for deployment

Takes about 2-3 minutes.

## After Rebuild

Test at http://localhost:3000 - the Lambda functions should now work!

## What Changed

Before (ESM - doesn't work in Lambda):
```javascript
import { v4 as uuidv4 } from 'uuid';
export async function handler(event) { ... }
```

After (CommonJS - works in Lambda):
```javascript
const { v4: uuidv4 } = require('uuid');
exports.handler = async function(event) { ... }
```

## If Still Failing

Check logs:
```cmd
aws logs tail /aws/lambda/nexis-eligibility-checker-dev --since 1m --region us-east-1
```

The error should be gone after rebuild!
