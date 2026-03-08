# PLAN E: API Gateway Mock Response

## Fastest Backend Fix (2 minutes):

1. **Go to API Gateway Console:**
   - https://console.aws.amazon.com/apigateway
   - Find your API: `nexis-api-dev`

2. **Add Mock Integration:**
   - Click on `/eligibility` → POST
   - Click "Integration Request"
   - Change Integration type to "Mock"
   - Click "Integration Response"
   - Add mapping template:

```json
{
  "success": true,
  "data": {
    "eligible": [
      {
        "schemeId": "pm-kisan",
        "schemeName": "PM-KISAN Samman Nidhi",
        "status": "Eligible",
        "matchScore": 95,
        "confidence": "High",
        "satisfiedCriteria": [
          {"criterion": "age", "message": "Age requirement met"},
          {"criterion": "occupation", "message": "Occupation matches"}
        ],
        "unsatisfiedCriteria": [],
        "missingData": [],
        "recommendations": ["Apply now"]
      }
    ],
    "potential": [],
    "ineligible": [],
    "summary": {
      "totalSchemes": 5,
      "eligibleCount": 1,
      "potentialCount": 0,
      "ineligibleCount": 4
    }
  }
}
```

3. **Deploy API:**
   - Click "Actions" → "Deploy API"
   - Stage: `dev`
   - Click "Deploy"

4. **Test immediately!**

## Advantage:
- No Lambda needed
- Works instantly
- Perfect for demo
- Can explain: "Using API Gateway mock for demo, full Lambda implementation ready"
