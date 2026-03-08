# NEXIS API Documentation

## Base URL

- **Development**: `https://api-dev.nexis.gov.in`
- **Staging**: `https://api-staging.nexis.gov.in`
- **Production**: `https://api.nexis.gov.in`

## Authentication

All API requests require an API key in the header:

```
X-API-Key: your-api-key-here
```

## Rate Limiting

- **Rate Limit**: 100 requests per minute per API key
- **Burst Limit**: 200 requests
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests per minute
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Endpoints

### 1. Check Eligibility

Check user eligibility for government schemes.

**Endpoint**: `POST /eligibility/check`

**Request Body**:
```json
{
  "userId": "string (optional)",
  "profile": {
    "age": 30,
    "state": "MH",
    "occupation": "Farmer",
    "annualIncome": 100000,
    "gender": "Male",
    "socialCategory": "General",
    "hasDisability": false
  }
}
```

**Response** (200 OK):
```json
{
  "resultId": "result-123",
  "userId": "user-456",
  "timestamp": "2026-03-08T10:30:00Z",
  "eligibleSchemes": [
    {
      "schemeId": "pm-kisan",
      "schemeName": "PM-KISAN",
      "description": "Income support for farmers",
      "benefits": "₹6,000 per year",
      "matchScore": 100,
      "eligibilityCriteria": {
        "ageMin": 18,
        "incomeMax": 200000,
        "occupations": ["Farmer"]
      }
    }
  ],
  "ineligibleSchemes": [
    {
      "schemeId": "student-scholarship",
      "schemeName": "Student Scholarship",
      "description": "Scholarship for students",
      "reasons": ["Occupation must be Student"]
    }
  ],
  "totalSchemes": 50
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

### 2. Get AI Explanation

Get AI-generated explanation for eligibility decision.

**Endpoint**: `POST /ai/explain`

**Request Body**:
```json
{
  "resultId": "result-123",
  "schemeId": "pm-kisan",
  "language": "en"
}
```

**Response** (200 OK):
```json
{
  "explanation": "You qualify for PM-KISAN because you are a farmer with annual income below ₹2 lakh...",
  "alternativeSchemes": ["scheme-1", "scheme-2"],
  "confidence": "high",
  "generatedAt": "2026-03-08T10:31:00Z"
}
```

---

### 3. Chat with AI Assistant

Send a message to the AI assistant.

**Endpoint**: `POST /chat/message`

**Request Body**:
```json
{
  "message": "What schemes am I eligible for?",
  "sessionId": "session-123 (optional)",
  "userId": "user-456",
  "profile": {
    "age": 30,
    "state": "MH",
    "occupation": "Farmer",
    "annualIncome": 100000,
    "socialCategory": "General"
  },
  "language": "en"
}
```

**Response** (200 OK):
```json
{
  "sessionId": "session-123",
  "response": "Based on your profile, you may be eligible for PM-KISAN...",
  "confidence": "high",
  "sources": ["pm-kisan/policy.txt", "pm-kisan/faq.txt"],
  "followUpSuggestions": [
    "What documents do I need?",
    "How do I apply?"
  ],
  "timestamp": "2026-03-08T10:32:00Z"
}
```

---

### 4. Create User Profile

Create a new user profile.

**Endpoint**: `POST /profiles`

**Request Body**:
```json
{
  "userId": "user-456",
  "profile": {
    "age": 30,
    "state": "MH",
    "occupation": "Farmer",
    "annualIncome": 100000,
    "gender": "Male",
    "socialCategory": "General",
    "hasDisability": false
  }
}
```

**Response** (201 Created):
```json
{
  "userId": "user-456",
  "createdAt": "2026-03-08T10:33:00Z",
  "message": "Profile created successfully"
}
```

---

### 5. Get User Profile

Retrieve a user profile.

**Endpoint**: `GET /profiles/{userId}`

**Response** (200 OK):
```json
{
  "userId": "user-456",
  "profile": {
    "age": 30,
    "state": "MH",
    "occupation": "Farmer",
    "annualIncome": 100000,
    "gender": "Male",
    "socialCategory": "General",
    "hasDisability": false
  },
  "createdAt": "2026-03-08T10:33:00Z",
  "updatedAt": "2026-03-08T10:33:00Z"
}
```

---

### 6. Update User Profile

Update an existing user profile.

**Endpoint**: `PUT /profiles/{userId}`

**Request Body**:
```json
{
  "profile": {
    "age": 31,
    "annualIncome": 120000
  }
}
```

**Response** (200 OK):
```json
{
  "userId": "user-456",
  "updatedAt": "2026-03-08T10:34:00Z",
  "message": "Profile updated successfully"
}
```

---

### 7. Delete User Profile

Delete a user profile and all associated data.

**Endpoint**: `DELETE /profiles/{userId}`

**Response** (200 OK):
```json
{
  "userId": "user-456",
  "deletedAt": "2026-03-08T10:35:00Z",
  "message": "Profile and all associated data deleted successfully"
}
```

---

### 8. Upload Scheme

Upload a new government scheme (Admin only).

**Endpoint**: `POST /schemes`

**Request Body**:
```json
{
  "scheme": {
    "schemeId": "new-scheme",
    "schemeName": "New Scheme",
    "description": "Description",
    "benefits": "Benefits",
    "eligibilityCriteria": {
      "ageMin": 18,
      "ageMax": 60,
      "incomeMax": 200000
    }
  },
  "documents": {
    "policy": "Policy document text...",
    "faq": "FAQ document text..."
  }
}
```

**Response** (201 Created):
```json
{
  "schemeId": "new-scheme",
  "version": 1,
  "uploadedAt": "2026-03-08T10:36:00Z",
  "message": "Scheme uploaded successfully"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

## Error Response Format

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Age must be between 1 and 120",
    "details": {
      "field": "age",
      "value": 150
    }
  },
  "requestId": "req-123",
  "timestamp": "2026-03-08T10:37:00Z"
}
```

## Data Types

### UserProfile
```typescript
{
  age: number;              // 1-120
  state: string;            // 2-letter state code
  occupation: string;       // Predefined list
  annualIncome: number;     // In rupees
  gender: "Male" | "Female" | "Other";
  socialCategory: "General" | "OBC" | "SC" | "ST";
  hasDisability: boolean;
}
```

### Scheme
```typescript
{
  schemeId: string;
  schemeName: string;
  description: string;
  benefits: string;
  eligibilityCriteria: {
    ageMin?: number;
    ageMax?: number;
    incomeMax?: number;
    states?: string[];
    occupations?: string[];
    gender?: string[];
    socialCategories?: string[];
    requiresDisability?: boolean;
  };
}
```

## Best Practices

1. **Cache Responses**: Cache eligibility results for 5 minutes
2. **Retry Logic**: Implement exponential backoff for retries
3. **Timeout**: Set request timeout to 30 seconds
4. **Error Handling**: Always handle error responses gracefully
5. **Rate Limiting**: Monitor rate limit headers and throttle requests
6. **Security**: Never expose API keys in client-side code
7. **Logging**: Log all API requests for debugging

## SDK Examples

### JavaScript/TypeScript
```typescript
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.nexis.gov.in',
  headers: {
    'X-API-Key': process.env.NEXIS_API_KEY,
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Check eligibility
const result = await client.post('/eligibility/check', {
  profile: {
    age: 30,
    state: 'MH',
    occupation: 'Farmer',
    annualIncome: 100000,
    gender: 'Male',
    socialCategory: 'General',
    hasDisability: false
  }
});
```

### Python
```python
import requests

headers = {
    'X-API-Key': os.environ['NEXIS_API_KEY'],
    'Content-Type': 'application/json'
}

response = requests.post(
    'https://api.nexis.gov.in/eligibility/check',
    headers=headers,
    json={
        'profile': {
            'age': 30,
            'state': 'MH',
            'occupation': 'Farmer',
            'annualIncome': 100000,
            'gender': 'Male',
            'socialCategory': 'General',
            'hasDisability': False
        }
    },
    timeout=30
)
```

## Support

For API support, contact:
- Email: api-support@nexis.gov.in
- Documentation: https://docs.nexis.gov.in
- Status Page: https://status.nexis.gov.in

---

© 2026 NEXIS. All rights reserved.
