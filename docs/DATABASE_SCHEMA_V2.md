# NEXIS Database Schema V2
## DynamoDB Table Designs for Voice-Assisted Platform

---

## Table 1: Citizens (Enhanced)

**Table Name:** `nexis-citizens-{env}`

**Primary Key:**
- PK: `userId` (String)
- SK: `PROFILE#timestamp` (String)

**GSI-1:** By State
- PK: `state` (String)
- SK: `userId` (String)

**GSI-2:** By CSC Operator
- PK: `cscOperatorId` (String)
- SK: `lastActive` (String)

**Attributes:**
```json
{
  "userId": "user-123456",
  "personalInfo": {
    "name": "Ramesh Kumar",
    "age": 45,
    "gender": "Male",
    "phone": "+91-9876543210",
    "email": "ramesh@example.com"
  },
  "location": {
    "state": "MH",
    "district": "Pune",
    "pincode": "411001",
    "village": "Kothrud",
    "isRural": false
  },
  "occupation": {
    "primary": "Farmer",
    "details": {
      "ownsLand": true,
      "landSize": 2.5,
      "crops": ["Rice", "Wheat"],
      "hasKisanCreditCard": true
    }
  },
  "economic": {
    "annualIncome": 150000,
    "incomeSource": ["Agriculture", "Dairy"],
    "bplCard": false,
    "aplCard": true
  },
  "family": {
    "size": 5,
    "dependents": 3,
    "children": [
      { "age": 12, "education": "7th Grade", "gender": "Male" },
      { "age": 8, "education": "3rd Grade", "gender": "Female" }
    ],
    "elderlyMembers": 1
  },
  "socialCategory": "OBC",
  "hasDisability": false,
  "documents": {
    "aadhaar": { "available": true, "verified": true },
    "pan": { "available": true, "verified": false },
    "rationCard": { "available": true, "type": "APL", "verified": true }
  },
  "preferences": {
    "language": "hi",
    "voiceEnabled": true,
    "notifications": {
      "sms": true,
      "email": false,
      "push": true
    }
  },
  "metadata": {
    "createdAt": "2026-03-01T10:00:00Z",
    "updatedAt": "2026-03-08T15:30:00Z",
    "lastActive": "2026-03-08T15:30:00Z",
    "profileCompleteness": 85,
    "verificationStatus": "partial",
    "cscOperatorId": "csc-op-789",
    "collectionMethod": "voice"
  }
}
```

**Access Patterns:**
1. Get user by userId
2. Query users by state
3. Query users assisted by CSC operator
4. Query users by last active date

---

## Table 2: Schemes (Enhanced)

**Table Name:** `nexis-schemes-{env}`

**Primary Key:**
- PK: `schemeId` (String)
- SK: `VERSION#v1` (String)

**GSI-1:** By Category
- PK: `category` (String)
- SK: `popularity` (Number)

**GSI-2:** By State
- PK: `state` (String)
- SK: `schemeId` (String)

**Attributes:**
```json
{
  "schemeId": "pm-kisan-2024",
  "schemeName": "PM-KISAN",
  "nameTranslations": {
    "en": "PM-KISAN",
    "hi": "पीएम-किसान",
    "mr": "पीएम-किसान"
  },
  "description": "Income support for farmers",
  "ministry": "Ministry of Agriculture",
  "state": null,
  "category": "Agriculture",
  "benefits": {
    "type": "Financial",
    "amount": 6000,
    "frequency": "Yearly",
    "duration": "Ongoing",
    "description": "₹6,000 per year in 3 installments"
  },
  "eligibilityRules": {
    "ageMin": 18,
    "incomeMax": 200000,
    "occupations": ["Farmer"],
    "requiredDocuments": ["aadhaar", "landRecords", "bankAccount"],
    "customRules": [
      {
        "ruleId": "land-ownership",
        "description": "Must own agricultural land",
        "condition": "profile.occupation.details.ownsLand === true",
        "errorMessage": "You must own agricultural land to be eligible"
      }
    ]
  },
  "applicationProcess": {
    "mode": "Online",
    "steps": ["Register", "Upload documents", "Bank verification", "Submit"],
    "estimatedTime": "15 minutes",
    "applicationUrl": "https://pmkisan.gov.in",
    "helplineNumber": "155261"
  },
  "s3Paths": {
    "policy": "schemes/pm-kisan/policy.pdf",
    "faq": "schemes/pm-kisan/faq.txt",
    "guidelines": "schemes/pm-kisan/guidelines.pdf"
  },
  "metadata": {
    "popularity": 95,
    "successRate": 78,
    "averageProcessingTime": 30,
    "lastUpdated": "2026-01-15T00:00:00Z",
    "status": "Active",
    "tags": ["agriculture", "income-support", "central-scheme"]
  }
}
```

---

## Table 3: VoiceConversations

**Table Name:** `nexis-voice-conversations-{env}`

**Primary Key:**
- PK: `sessionId` (String)
- SK: `TURN#timestamp` (String)

**GSI-1:** By User
- PK: `userId` (String)
- SK: `timestamp` (String)

**Attributes:**
```json
{
  "sessionId": "session-abc123",
  "userId": "user-123456",
  "turnNumber": 5,
  "userInput": {
    "text": "Main kisan hoon aur mere paas do acre zameen hai",
    "audioS3Path": "voice-recordings/session-abc123/turn-5-input.mp3",
    "language": "hi",
    "confidence": 0.92
  },
  "systemResponse": {
    "text": "Samajh gaya. Aapki saalana aamdani kitni hai?",
    "audioS3Path": "voice-output/session-abc123/turn-5-output.mp3"
  },
  "intent": "profile_collection",
  "extractedData": {
    "occupation": "Farmer",
    "landSize": 2,
    "ownsLand": true
  },
  "context": {
    "currentStep": "economic_info",
    "completedFields": ["name", "age", "occupation", "landSize"],
    "remainingFields": ["annualIncome", "state", "documents"]
  },
  "timestamp": "2026-03-08T10:15:30Z"
}
```

---

## Table 4: Documents

**Table Name:** `nexis-documents-{env}`

**Primary Key:**
- PK: `userId` (String)
- SK: `DOC#docType#timestamp` (String)

**GSI-1:** By Validation Status
- PK: `validationStatus` (String)
- SK: `uploadedAt` (String)

**Attributes:**
```json
{
  "userId": "user-123456",
  "documentId": "doc-789xyz",
  "documentType": "aadhaar",
  "s3Path": "documents/user-123456/aadhaar-20260308.jpg",
  "extractedData": {
    "aadhaarNumber": "1234-5678-9012",
    "name": "Ramesh Kumar",
    "dob": "1980-05-15",
    "gender": "Male",
    "address": "Kothrud, Pune, Maharashtra"
  },
  "validationStatus": "verified",
  "validationResults": [
    {
      "field": "aadhaarNumber",
      "status": "valid",
      "message": "Valid 12-digit Aadhaar number"
    },
    {
      "field": "name",
      "status": "match",
      "message": "Name matches profile"
    }
  ],
  "uploadedAt": "2026-03-08T10:20:00Z",
  "verifiedAt": "2026-03-08T10:21:30Z",
  "verifiedBy": "system",
  "expiryDate": null
}
```

---

## Table 5: Applications

**Table Name:** `nexis-applications-{env}`

**Primary Key:**
- PK: `applicationId` (String)
- SK: `userId` (String)

**GSI-1:** By User
- PK: `userId` (String)
- SK: `submittedAt` (String)

**GSI-2:** By Scheme
- PK: `schemeId` (String)
- SK: `submittedAt` (String)

**Attributes:**
```json
{
  "applicationId": "app-xyz789",
  "userId": "user-123456",
  "schemeId": "pm-kisan-2024",
  "status": "submitted",
  "formData": {
    "applicantName": "Ramesh Kumar",
    "aadhaarNumber": "1234-5678-9012",
    "landSize": 2.5,
    "bankAccount": "12345678901234",
    "ifscCode": "SBIN0001234"
  },
  "documents": ["doc-789xyz", "doc-456abc"],
  "timeline": {
    "created": "2026-03-08T10:00:00Z",
    "submitted": "2026-03-08T10:30:00Z",
    "underReview": null,
    "approved": null,
    "rejected": null
  },
  "guidanceHistory": [
    {
      "step": "bank_details",
      "aiSuggestion": "Please enter your 11-digit IFSC code",
      "userAction": "corrected_ifsc"
    }
  ],
  "submittedVia": "voice",
  "trackingNumber": "PMKISAN2026030812345",
  "estimatedProcessingTime": 30
}
```

---

## Table 6: SchemeAlerts

**Table Name:** `nexis-scheme-alerts-{env}`

**Primary Key:**
- PK: `userId` (String)
- SK: `ALERT#timestamp` (String)

**GSI-1:** By Status
- PK: `status` (String)
- SK: `priority#timestamp` (String)

**Attributes:**
```json
{
  "alertId": "alert-abc123",
  "userId": "user-123456",
  "alertType": "new_scheme",
  "schemeId": "kisan-credit-card",
  "message": "New scheme available: Kisan Credit Card - Get credit up to ₹3 lakh",
  "priority": "high",
  "status": "sent",
  "channels": ["sms", "push"],
  "createdAt": "2026-03-08T09:00:00Z",
  "sentAt": "2026-03-08T09:01:00Z",
  "readAt": "2026-03-08T10:15:00Z"
}
```

---

## Table 7: CSCOperators

**Table Name:** `nexis-csc-operators-{env}`

**Primary Key:**
- PK: `operatorId` (String)
- SK: `CSC#cscId` (String)

**GSI-1:** By Location
- PK: `state#district` (String)
- SK: `rating` (Number)

**Attributes:**
```json
{
  "operatorId": "csc-op-789",
  "cscId": "csc-mh-pune-001",
  "name": "Suresh Patil",
  "phone": "+91-9876543210",
  "email": "suresh@csc.gov.in",
  "cscLocation": {
    "state": "MH",
    "district": "Pune",
    "village": "Kothrud",
    "address": "Shop No. 5, Main Road, Kothrud"
  },
  "certifications": ["Basic Computer", "Digital Literacy", "NEXIS Operator"],
  "stats": {
    "citizensAssisted": 1250,
    "applicationsSubmitted": 890,
    "successRate": 82,
    "averageTimePerCitizen": 25
  },
  "activeUsers": ["user-123456", "user-789012"],
  "rating": 4.7,
  "reviews": 156,
  "status": "active",
  "joinedAt": "2025-06-01T00:00:00Z",
  "lastActive": "2026-03-08T15:30:00Z"
}
```

---

## Table 8: EligibilityTimeline

**Table Name:** `nexis-eligibility-timeline-{env}`

**Primary Key:**
- PK: `userId` (String)
- SK: `TIMELINE#schemeId` (String)

**Attributes:**
```json
{
  "userId": "user-123456",
  "schemeId": "senior-citizen-pension",
  "schemeName": "Senior Citizen Pension",
  "currentStatus": "not_eligible",
  "blockers": [
    {
      "criterion": "age",
      "currentValue": 45,
      "requiredValue": 60,
      "gap": "15 years",
      "estimatedDate": "2041-05-15"
    }
  ],
  "predictions": [
    {
      "date": "2041-05-15",
      "event": "You will turn 60 years old",
      "probability": 100,
      "action": "Apply for Senior Citizen Pension"
    }
  ],
  "recommendations": [
    "Save this scheme for future reference",
    "Set a reminder for 2041"
  ],
  "lastCalculated": "2026-03-08T10:00:00Z"
}
```

---

## DynamoDB Capacity Planning

### Read/Write Capacity Units

**Production Environment:**

| Table | RCU | WCU | Auto-Scaling |
|-------|-----|-----|--------------|
| Citizens | 1000 | 500 | Yes (100-5000) |
| Schemes | 500 | 50 | Yes (100-1000) |
| VoiceConversations | 2000 | 1000 | Yes (500-10000) |
| Documents | 500 | 300 | Yes (100-2000) |
| Applications | 300 | 200 | Yes (50-1000) |
| SchemeAlerts | 200 | 100 | Yes (50-500) |
| CSCOperators | 100 | 50 | Yes (20-200) |
| EligibilityTimeline | 200 | 100 | Yes (50-500) |

### Cost Estimation (Monthly)

**On-Demand Pricing:**
- Citizens: ~$500
- Schemes: ~$100
- VoiceConversations: ~$800
- Documents: ~$300
- Applications: ~$200
- Others: ~$200

**Total: ~$2,100/month** for 10M users

---

## Backup & Recovery

**Point-in-Time Recovery (PITR):** Enabled for all tables  
**Backup Retention:** 35 days  
**Cross-Region Replication:** Enabled for disaster recovery

