# NEXIS API Specification V2
## Voice-Assisted Welfare Discovery Platform

**Base URL:** `https://api.nexis.gov.in/v2`  
**Authentication:** API Key + AWS Cognito JWT  
**Rate Limit:** 1000 requests/minute per user

---

## 1. Voice Services

### 1.1 Transcribe Voice Input

**Endpoint:** `POST /voice/transcribe`

**Request:**
```json
{
  "audioData": "base64_encoded_audio",
  "language": "hi-IN",
  "sessionId": "session-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Main kisan hoon",
    "confidence": 0.92,
    "language": "hi-IN",
    "duration": 2.5
  }
}
```

### 1.2 Synthesize Voice Output

**Endpoint:** `POST /voice/synthesize`

**Request:**
```json
{
  "text": "Aapki umar kitni hai?",
  "language": "hi-IN",
  "voiceId": "Aditi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "audioUrl": "https://cdn.nexis.gov.in/voice/output-123.mp3",
    "duration": 3.2,
    "text": "Aapki umar kitni hai?"
  }
}
```

### 1.3 Voice Conversation Turn

**Endpoint:** `POST /voice/conversation`

**Request:**
```json
{
  "sessionId": "session-123",
  "userInput": "Main kisan hoon aur mere paas do acre zameen hai",
  "language": "hi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Samajh gaya. Aapki saalana aamdani kitni hai?",
    "audioUrl": "https://cdn.nexis.gov.in/voice/response-456.mp3",
    "extractedData": {
      "occupation": "Farmer",
      "landSize": 2,
      "ownsLand": true
    },
    "progress": 60,
    "isComplete": false
  }
}
```

---

## 2. Profile Services V2

### 2.1 Create Enhanced Profile

**Endpoint:** `POST /profiles/v2`

**Request:**
```json
{
  "personalInfo": {
    "name": "Ramesh Kumar",
    "age": 45,
    "gender": "Male",
    "phone": "+91-9876543210"
  },
  "location": {
    "state": "MH",
    "district": "Pune",
    "isRural": false
  },
  "occupation": {
    "primary": "Farmer",
    "details": {
      "ownsLand": true,
      "landSize": 2.5,
      "crops": ["Rice", "Wheat"]
    }
  },
  "economic": {
    "annualIncome": 150000,
    "bplCard": false
  },
  "preferences": {
    "language": "hi",
    "voiceEnabled": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user-123456",
    "profileCompleteness": 75,
    "missingFields": ["documents", "family"],
    "createdAt": "2026-03-08T10:00:00Z"
  }
}
```

### 2.2 Get Profile Completeness

**Endpoint:** `GET /profiles/{userId}/completeness`

**Response:**
```json
{
  "success": true,
  "data": {
    "completeness": 75,
    "completedSections": ["personal", "location", "occupation", "economic"],
    "missingSections": ["documents", "family"],
    "recommendations": [
      "Upload Aadhaar card to verify identity",
      "Add family information to check more schemes"
    ]
  }
}
```

---

## 3. Document Services

### 3.1 Upload Document

**Endpoint:** `POST /documents/upload`

**Request:** (multipart/form-data)
```
file: [image file]
userId: user-123456
documentType: aadhaar
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "doc-789xyz",
    "s3Path": "documents/user-123456/aadhaar-20260308.jpg",
    "status": "processing",
    "estimatedTime": 10
  }
}
```

### 3.2 Get OCR Results

**Endpoint:** `GET /documents/{documentId}/ocr`

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "doc-789xyz",
    "documentType": "aadhaar",
    "extractedData": {
      "aadhaarNumber": "1234-5678-9012",
      "name": "Ramesh Kumar",
      "dob": "1980-05-15",
      "gender": "Male"
    },
    "confidence": 0.95,
    "validationStatus": "verified"
  }
}
```

### 3.3 Validate Document

**Endpoint:** `POST /documents/{documentId}/validate`

**Response:**
```json
{
  "success": true,
  "data": {
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
    "overallStatus": "verified"
  }
}
```

---

## 4. Eligibility Services V2

### 4.1 Check Eligibility (Enhanced)

**Endpoint:** `POST /eligibility/v2/check`

**Request:**
```json
{
  "userId": "user-123456",
  "includeTimeline": true,
  "includeAlternatives": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resultId": "result-abc123",
    "timestamp": "2026-03-08T10:00:00Z",
    "eligibleSchemes": [
      {
        "schemeId": "pm-kisan",
        "schemeName": "PM-KISAN",
        "status": "Eligible",
        "matchScore": 100,
        "confidence": "High",
        "benefits": "₹6,000 per year",
        "satisfiedCriteria": [
          "Age: 45 years (required: 18+)",
          "Occupation: Farmer",
          "Land ownership: Yes"
        ]
      }
    ],
    "potentiallyEligibleSchemes": [
      {
        "schemeId": "kisan-credit-card",
        "schemeName": "Kisan Credit Card",
        "status": "Potentially Eligible",
        "matchScore": 80,
        "missingData": ["Bank account details"],
        "estimatedEligibilityDate": "2026-03-15"
      }
    ],
    "ineligibleSchemes": [
      {
        "schemeId": "student-scholarship",
        "schemeName": "Student Scholarship",
        "status": "Not Eligible",
        "reasons": [
          "Occupation must be Student (current: Farmer)"
        ],
        "alternativeSchemes": ["pm-kisan", "kisan-credit-card"]
      }
    ],
    "totalSchemes": 50
  }
}
```

### 4.2 Get Eligibility Timeline

**Endpoint:** `GET /eligibility/{userId}/timeline`

**Response:**
```json
{
  "success": true,
  "data": {
    "timeline": [
      {
        "date": "2026-04-01",
        "event": "New agricultural scheme launching",
        "schemeId": "new-agri-scheme",
        "probability": 90,
        "action": "Check eligibility on launch date"
      },
      {
        "date": "2041-05-15",
        "event": "You will turn 60 years old",
        "schemeId": "senior-citizen-pension",
        "probability": 100,
        "action": "Apply for Senior Citizen Pension"
      }
    ]
  }
}
```

---

## 5. Application Services

### 5.1 Start Guided Application

**Endpoint:** `POST /applications/start`

**Request:**
```json
{
  "userId": "user-123456",
  "schemeId": "pm-kisan"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "app-xyz789",
    "totalSteps": 8,
    "currentStep": {
      "stepNumber": 1,
      "title": "Applicant Name",
      "description": "Enter your full name as per Aadhaar",
      "fieldType": "text",
      "fieldName": "applicantName",
      "required": true,
      "helpText": "Name should match your Aadhaar card",
      "aiGuidance": "Your profile shows name as 'Ramesh Kumar'. Use this if it matches your Aadhaar."
    },
    "prefilledFields": {
      "applicantName": "Ramesh Kumar",
      "aadhaarNumber": "1234-5678-9012"
    },
    "progress": 0
  }
}
```

### 5.2 Submit Application Step

**Endpoint:** `POST /applications/{applicationId}/step`

**Request:**
```json
{
  "fieldValue": "Ramesh Kumar",
  "action": "next"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currentStep": {
      "stepNumber": 2,
      "title": "Aadhaar Number",
      "fieldType": "text",
      "aiGuidance": "We found your Aadhaar from uploaded documents. Please verify."
    },
    "progress": 12,
    "canGoBack": true
  }
}
```

### 5.3 Submit Complete Application

**Endpoint:** `POST /applications/{applicationId}/submit`

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "app-xyz789",
    "status": "submitted",
    "trackingNumber": "PMKISAN2026030812345",
    "submittedAt": "2026-03-08T10:30:00Z",
    "estimatedProcessingTime": 30,
    "nextSteps": [
      "Your application is under review",
      "You will receive SMS updates",
      "Check status using tracking number"
    ]
  }
}
```

### 5.4 Track Application

**Endpoint:** `GET /applications/{applicationId}/status`

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "app-xyz789",
    "trackingNumber": "PMKISAN2026030812345",
    "status": "under_review",
    "timeline": {
      "submitted": "2026-03-08T10:30:00Z",
      "underReview": "2026-03-09T09:00:00Z",
      "approved": null,
      "rejected": null
    },
    "currentStage": "Document verification",
    "estimatedCompletion": "2026-04-07"
  }
}
```

---

## 6. Scheme Alert Services

### 6.1 Get User Alerts

**Endpoint:** `GET /alerts/{userId}`

**Query Parameters:**
- `status`: pending | sent | read
- `priority`: high | medium | low
- `limit`: number (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "alertId": "alert-abc123",
        "alertType": "new_scheme",
        "schemeId": "kisan-credit-card",
        "message": "New scheme available: Kisan Credit Card",
        "priority": "high",
        "status": "sent",
        "createdAt": "2026-03-08T09:00:00Z"
      }
    ],
    "unreadCount": 3
  }
}
```

### 6.2 Mark Alert as Read

**Endpoint:** `PUT /alerts/{alertId}/read`

**Response:**
```json
{
  "success": true,
  "data": {
    "alertId": "alert-abc123",
    "status": "read",
    "readAt": "2026-03-08T10:15:00Z"
  }
}
```

---

## 7. CSC Operator Services

### 7.1 Operator Login

**Endpoint:** `POST /csc/login`

**Request:**
```json
{
  "operatorId": "csc-op-789",
  "password": "encrypted_password",
  "cscId": "csc-mh-pune-001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "operatorId": "csc-op-789",
    "name": "Suresh Patil",
    "cscLocation": {
      "state": "MH",
      "district": "Pune"
    },
    "permissions": ["create_profile", "assist_application", "upload_documents"]
  }
}
```

### 7.2 Get Operator Dashboard

**Endpoint:** `GET /csc/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "todayCount": 12,
      "weekCount": 67,
      "monthCount": 245,
      "applicationsSubmitted": 189,
      "successRate": 82,
      "earnings": 15600
    },
    "activeUsers": [
      {
        "userId": "user-123456",
        "name": "Ramesh Kumar",
        "status": "in_progress",
        "startedAt": "2026-03-08T10:00:00Z"
      }
    ],
    "recentActivity": []
  }
}
```

### 7.3 Create Profile on Behalf

**Endpoint:** `POST /csc/profiles/create`

**Request:**
```json
{
  "operatorId": "csc-op-789",
  "citizenData": {
    "name": "Ramesh Kumar",
    "phone": "+91-9876543210",
    "age": 45
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user-123456",
    "cscOperatorId": "csc-op-789",
    "createdAt": "2026-03-08T10:00:00Z"
  }
}
```

---

## 8. Analytics & Reporting

### 8.1 Get User Analytics

**Endpoint:** `GET /analytics/user/{userId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "profileViews": 5,
    "eligibilityChecks": 3,
    "applicationsStarted": 2,
    "applicationsSubmitted": 1,
    "documentsUploaded": 4,
    "voiceInteractions": 15,
    "lastActive": "2026-03-08T15:30:00Z"
  }
}
```

### 8.2 Get Scheme Analytics

**Endpoint:** `GET /analytics/scheme/{schemeId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalViews": 15000,
    "eligibilityChecks": 8500,
    "applications": 3200,
    "approvalRate": 78,
    "averageProcessingTime": 28,
    "popularStates": ["MH", "UP", "MP"]
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Age must be between 1 and 120",
    "details": {
      "field": "age",
      "value": 150
    }
  },
  "requestId": "req-123456",
  "timestamp": "2026-03-08T10:00:00Z"
}
```

**Error Codes:**
- `INVALID_INPUT` - Invalid request data
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error
- `SERVICE_UNAVAILABLE` - Service temporarily unavailable

---

## Rate Limiting

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1709899200
```

**Limits by Endpoint Type:**
- Voice services: 100/minute
- Profile services: 200/minute
- Eligibility checks: 500/minute
- Document uploads: 50/minute
- Applications: 100/minute

