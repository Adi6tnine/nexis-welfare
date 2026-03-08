# NEXIS V2 Architecture Diagrams
## Visual System Design Reference

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Mobile  │  │   Web    │  │   USSD   │  │   IVR    │      │
│  │   App    │  │ Browser  │  │  *99#    │  │  Voice   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│              AWS Amplify + CloudFront (CDN)                     │
│              - Static hosting with edge caching                 │
│              - DDoS protection via AWS Shield                   │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│  - REST API + WebSocket for real-time chat                     │
│  - Rate limiting: 1000 req/min per user                        │
│  - API key + Cognito authentication                             │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                             │
│                  AWS Lambda Functions                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Voice Services | Profile | Eligibility | Documents      │  │
│  │  Applications | Alerts | CSC Operator | Analytics        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │DynamoDB  │  │    S3    │  │ElastiCache│  │CloudWatch│      │
│  │8 Tables  │  │Documents │  │  Redis   │  │  Logs    │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI/ML LAYER                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Bedrock  │  │Transcribe│  │  Polly   │  │ Textract │      │
│  │ Claude 3 │  │Speech-to-│  │Text-to-  │  │Document  │      │
│  │  Haiku   │  │   Text   │  │  Speech  │  │   OCR    │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
```


---

## 2. Voice Interaction Flow

```
┌─────────────┐
│    User     │
│  (Speaks)   │
└──────┬──────┘
       │ "Main kisan hoon"
       ▼
┌─────────────────────┐
│  Frontend (React)   │
│  - VoiceRecorder    │
│  - Audio capture    │
└──────┬──────────────┘
       │ Audio blob
       ▼
┌─────────────────────┐
│ Lambda: Transcribe  │
│ - Amazon Transcribe │
│ - Language: hi-IN   │
└──────┬──────────────┘
       │ Text: "Main kisan hoon"
       ▼
┌─────────────────────────────┐
│ Lambda: Conversation Mgr    │
│ - Load context              │
│ - Extract data (AI)         │
│ - Determine next question   │
└──────┬──────────────────────┘
       │ Response + Extracted data
       ▼
┌─────────────────────┐
│ Lambda: Synthesize  │
│ - Amazon Polly      │
│ - Voice: Aditi      │
└──────┬──────────────┘
       │ Audio URL
       ▼
┌─────────────────────┐
│  Frontend (React)   │
│  - Play audio       │
│  - Show transcript  │
└──────┬──────────────┘
       │
       ▼
┌─────────────┐
│    User     │
│  (Hears)    │
└─────────────┘
```

---

## 3. Document Upload & OCR Flow

```
┌─────────────┐
│    User     │
│ Takes photo │
└──────┬──────┘
       │ Image
       ▼
┌─────────────────────┐
│  Frontend (React)   │
│  - Camera API       │
│  - Image preview    │
└──────┬──────────────┘
       │ Upload
       ▼
┌─────────────────────┐
│ Lambda: Upload      │
│ - Save to S3        │
│ - Create record     │
└──────┬──────────────┘
       │ S3 path
       ▼
┌─────────────────────┐
│ Lambda: OCR         │
│ - Amazon Textract   │
│ - Extract fields    │
└──────┬──────────────┘
       │ Extracted data
       ▼
┌─────────────────────┐
│ Lambda: Validator   │
│ - Check format      │
│ - Match profile     │
│ - Verify data       │
└──────┬──────────────┘
       │ Validation result
       ▼
┌─────────────────────┐
│  DynamoDB           │
│  Documents table    │
│  - Save data        │
│  - Update status    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Frontend (React)   │
│  - Show results     │
│  - Display status   │
└─────────────────────┘
```

---

## 4. Eligibility Check Flow (Enhanced)

```
┌─────────────┐
│    User     │
│  Profile    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ Lambda: Eligibility V2  │
│ - Load profile          │
│ - Get all schemes       │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ For each scheme:        │
│ - Evaluate rules        │
│ - Calculate match score │
│ - Determine status      │
└──────┬──────────────────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────┐              ┌──────────────────┐
│  Eligible    │              │  Not Eligible    │
│  Schemes     │              │  Schemes         │
└──────┬───────┘              └──────┬───────────┘
       │                             │
       │                             ▼
       │                      ┌──────────────────┐
       │                      │ Timeline         │
       │                      │ Predictor        │
       │                      │ - Future dates   │
       │                      └──────┬───────────┘
       │                             │
       └─────────────┬───────────────┘
                     ▼
          ┌──────────────────┐
          │ Lambda: AI       │
          │ Explanation      │
          │ - Bedrock Claude │
          └──────┬───────────┘
                 │
                 ▼
          ┌──────────────────┐
          │  Frontend        │
          │  - Results page  │
          │  - Explanations  │
          │  - Timeline      │
          └──────────────────┘
```


---

## 5. Guided Application Flow

```
┌─────────────┐
│    User     │
│ Starts app  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ Lambda: Start App       │
│ - Load scheme           │
│ - Generate steps        │
│ - Prefill from profile  │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Frontend               │
│  Step 1: Name           │
│  - Show prefilled       │
│  - AI guidance          │
└──────┬──────────────────┘
       │ User input
       ▼
┌─────────────────────────┐
│ Lambda: Validate Step   │
│ - Check format          │
│ - AI suggestion         │
└──────┬──────────────────┘
       │
       ├─── Valid ──────────┐
       │                    │
       ▼                    ▼
┌──────────────┐    ┌──────────────┐
│  Next Step   │    │  Show Error  │
│  Progress++  │    │  + AI Help   │
└──────┬───────┘    └──────────────┘
       │
       ▼
┌─────────────────────────┐
│  Repeat for all steps   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Lambda: Submit App      │
│ - Final validation      │
│ - Generate tracking #   │
│ - Send confirmation     │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  DynamoDB               │
│  Applications table     │
│  - Save application     │
│  - Status: submitted    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  SNS/SES                │
│  - Send SMS             │
│  - Send email           │
└──────┬──────────────────┘
       │
       ▼
┌─────────────┐
│    User     │
│ Receives    │
│ confirmation│
└─────────────┘
```

---

## 6. CSC Operator Workflow

```
┌─────────────────┐
│  CSC Operator   │
│  Login          │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Lambda: Operator Auth   │
│ - Cognito verification  │
│ - Load permissions      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Frontend Dashboard     │
│  - Active users         │
│  - Stats (today/week)   │
│  - Quick actions        │
└────────┬────────────────┘
         │
         ├──────────────────────────┐
         │                          │
         ▼                          ▼
┌──────────────────┐      ┌──────────────────┐
│ Create Profile   │      │ Assist Existing  │
│ - Voice input    │      │ - Load profile   │
│ - Doc scanning   │      │ - Check schemes  │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         └────────┬────────────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Guide Application│
         │ - Step-by-step   │
         │ - Upload docs    │
         │ - Submit         │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Update Stats     │
         │ - Citizens++     │
         │ - Applications++ │
         │ - Earnings++     │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  Dashboard       │
         │  Updated stats   │
         └──────────────────┘
```

---

## 7. Proactive Alert System

```
┌─────────────────────────┐
│ CloudWatch Event        │
│ (Daily at 9 AM)         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Lambda: Alert Engine    │
│ - Get all active users  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ For each user:          │
│ - Check new schemes     │
│ - Check eligibility     │
│ - Check doc expiry      │
└────────┬────────────────┘
         │
         ├──────────────────────────┐
         │                          │
         ▼                          ▼
┌──────────────────┐      ┌──────────────────┐
│ New Scheme       │      │ Doc Expiring     │
│ Alert            │      │ Alert            │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         └────────┬────────────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ DynamoDB         │
         │ SchemeAlerts     │
         │ - Save alert     │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Lambda: Notifier │
         │ - Send SMS (SNS) │
         │ - Send email     │
         │ - Push notif     │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  User            │
         │  Receives alert  │
         └──────────────────┘
```

---

## 8. Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    USER INTERACTIONS                     │
└────────┬─────────────────────────────────────────────────┘
         │
         ├─── Voice Input ────────────────────┐
         │                                    │
         ├─── Form Input ─────────────────┐  │
         │                                │  │
         ├─── Document Upload ─────────┐  │  │
         │                             │  │  │
         └─── API Requests ─────────┐  │  │  │
                                    │  │  │  │
                                    ▼  ▼  ▼  ▼
                          ┌──────────────────────┐
                          │   API Gateway        │
                          └──────────┬───────────┘
                                     │
                          ┌──────────┴───────────┐
                          │                      │
                          ▼                      ▼
                  ┌───────────────┐      ┌───────────────┐
                  │  Lambda       │      │  Lambda       │
                  │  Functions    │      │  Functions    │
                  └───────┬───────┘      └───────┬───────┘
                          │                      │
                          └──────────┬───────────┘
                                     │
                          ┌──────────┴───────────┐
                          │                      │
                          ▼                      ▼
                  ┌───────────────┐      ┌───────────────┐
                  │  DynamoDB     │      │  S3 Buckets   │
                  │  8 Tables     │      │  Documents    │
                  └───────┬───────┘      └───────┬───────┘
                          │                      │
                          └──────────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │  AI/ML Services      │
                          │  - Bedrock           │
                          │  - Transcribe        │
                          │  - Polly             │
                          │  - Textract          │
                          └──────────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │  Response to User    │
                          └──────────────────────┘
```

---

## 9. Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                      │
└─────────────────────────────────────────────────────────┘

Layer 1: Network Security
┌─────────────────────────────────────────────────────────┐
│  AWS WAF (Web Application Firewall)                     │
│  - DDoS protection                                      │
│  - SQL injection prevention                             │
│  - XSS prevention                                       │
└─────────────────────────────────────────────────────────┘

Layer 2: Authentication & Authorization
┌─────────────────────────────────────────────────────────┐
│  Amazon Cognito                                         │
│  - User authentication                                  │
│  - JWT tokens                                           │
│  - MFA support                                          │
│                                                         │
│  API Gateway                                            │
│  - API key validation                                   │
│  - Rate limiting                                        │
│  - Request throttling                                   │
└─────────────────────────────────────────────────────────┘

Layer 3: Data Encryption
┌─────────────────────────────────────────────────────────┐
│  In Transit:                                            │
│  - TLS 1.2+ for all connections                        │
│  - HTTPS only                                           │
│                                                         │
│  At Rest:                                               │
│  - DynamoDB encryption (SSE-KMS)                       │
│  - S3 encryption (SSE-S3)                              │
│  - EBS encryption for Lambda                           │
└─────────────────────────────────────────────────────────┘

Layer 4: Access Control
┌─────────────────────────────────────────────────────────┐
│  IAM Roles & Policies                                   │
│  - Least privilege principle                            │
│  - Service-specific roles                               │
│  - No hardcoded credentials                             │
└─────────────────────────────────────────────────────────┘

Layer 5: Monitoring & Auditing
┌─────────────────────────────────────────────────────────┐
│  CloudWatch Logs                                        │
│  - All API calls logged                                 │
│  - Lambda execution logs                                │
│                                                         │
│  CloudTrail                                             │
│  - AWS API audit trail                                  │
│  - Compliance reporting                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  MULTI-REGION SETUP                     │
└─────────────────────────────────────────────────────────┘

Primary Region: us-east-1
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Lambda      │  │  DynamoDB    │  │  S3          │ │
│  │  Functions   │  │  Tables      │  │  Buckets     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Replication
                          ▼
Secondary Region: ap-south-1 (Mumbai)
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Lambda      │  │  DynamoDB    │  │  S3          │ │
│  │  Functions   │  │  Replica     │  │  Replica     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘

Global Services:
┌─────────────────────────────────────────────────────────┐
│  CloudFront (CDN)                                       │
│  - Edge locations across India                         │
│  - Automatic failover                                   │
│                                                         │
│  Route 53 (DNS)                                         │
│  - Health checks                                        │
│  - Automatic routing                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Legend

```
┌─────────┐
│  Box    │  = Component/Service
└─────────┘

    │
    ▼         = Data flow direction

────────      = Connection/Relationship

┌─────────────────────────────────┐
│  Grouped components             │
└─────────────────────────────────┘
```

