# NEXIS Voice-Assisted Welfare Discovery Platform
## Production-Grade Upgrade & Redesign Specification

**Version**: 2.0  
**Date**: March 8, 2026  
**Status**: Design & Implementation Ready

---

## Executive Summary

This document outlines the comprehensive redesign of NEXIS (National Eligibility eXplorer and Information System) into a production-grade **Voice-Assisted Welfare Discovery Platform** for India. The upgraded system will serve 100M+ citizens across rural and urban India, with special focus on low-literacy populations, elderly users, and CSC operators.

### Core Philosophy
**"Explain eligibility before rejection, not after failure"**

### Key Upgrade Areas
1. Voice-first interaction using AWS Transcribe & Polly
2. Dynamic conversational profile collection
3. Enhanced eligibility simulation engine
4. Document intelligence with OCR
5. Guided application mode
6. CSC operator dashboard
7. Proactive scheme alerts & timeline prediction
8. Multi-modal accessibility

---

## 1. SYSTEM ARCHITECTURE UPGRADE

### 1.1 Enhanced AWS Serverless Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACES                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Mobile  │  │   Web    │  │   USSD   │  │   IVR    │  │
│  │   App    │  │ Browser  │  │  *99#    │  │  Voice   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              AWS AMPLIFY + CLOUDFRONT (CDN)                 │
│              - Static hosting with edge caching             │
│              - DDoS protection via AWS Shield               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  AMAZON API GATEWAY                         │
│  - REST API + WebSocket for real-time chat                 │
│  - Rate limiting: 1000 req/min per user                    │
│  - API key + Cognito authentication                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   AWS LAMBDA FUNCTIONS                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  VOICE SERVICES                                      │  │
│  │  - voice-transcription (Transcribe integration)     │  │
│  │  - voice-synthesis (Polly integration)              │  │
│  │  - voice-conversation-manager                       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PROFILE SERVICES                                    │  │
│  │  - dynamic-profile-collector                        │  │
│  │  - profile-validator                                │  │
│  │  - profile-enrichment                               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ELIGIBILITY SERVICES                                │  │
│  │  - eligibility-engine-v2 (enhanced rules)           │  │
│  │  - scheme-matcher                                   │  │
│  │  - timeline-predictor                               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  DOCUMENT SERVICES                                   │  │
│  │  - document-ocr (Textract integration)              │  │
│  │  - document-validator                               │  │
│  │  - document-extractor                               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AI SERVICES                                         │  │
│  │  - ai-explanation-v2 (Bedrock Claude)               │  │
│  │  - chat-assistant-v2 (RAG enhanced)                 │  │
│  │  - form-guidance-assistant                          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  APPLICATION SERVICES                                │  │
│  │  - guided-application-manager                       │  │
│  │  - application-tracker                              │  │
│  │  - rejection-explainer                              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NOTIFICATION SERVICES                               │  │
│  │  - scheme-alert-engine                              │  │
│  │  - sms-notifier (SNS)                               │  │
│  │  - email-notifier (SES)                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  DynamoDB    │  │  Amazon S3   │  │ ElastiCache  │    │
│  │  Tables (8)  │  │  Buckets (3) │  │   Redis      │    │
│  │              │  │              │  │              │    │
│  │ - Citizens   │  │ - Documents  │  │ - Sessions   │    │
│  │ - Schemes    │  │ - Knowledge  │  │ - Cache      │    │
│  │ - Results    │  │ - Uploads    │  │              │    │
│  │ - Sessions   │  │              │  │              │    │
│  │ - Documents  │  │              │  │              │    │
│  │ - Apps       │  │              │  │              │    │
│  │ - Alerts     │  │              │  │              │    │
│  │ - CSC-Ops    │  │              │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI & ML SERVICES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Bedrock    │  │  Transcribe  │  │    Polly     │    │
│  │  Claude 3    │  │  Speech-to-  │  │  Text-to-    │    │
│  │   Haiku      │  │    Text      │  │   Speech     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Textract    │  │  Comprehend  │  │  Translate   │    │
│  │  Document    │  │  Language    │  │  Multi-lang  │    │
│  │    OCR       │  │  Detection   │  │  Support     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              MONITORING & SECURITY                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  CloudWatch  │  │   Cognito    │  │     WAF      │    │
│  │  Logs/Metrics│  │  Auth/Users  │  │  Firewall    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 New DynamoDB Tables


**1. Citizens Table** (Enhanced)
```
PK: userId (String)
SK: PROFILE#timestamp
Attributes:
  - personalInfo: { age, gender, name, phone }
  - location: { state, district, pincode, village }
  - occupation: { type, subtype, landSize, businessType }
  - economic: { annualIncome, incomeSource, bplCard }
  - family: { size, dependents, children, elderly }
  - education: { level, institution, course }
  - documents: { aadhaar, pan, ration, income, land }
  - preferences: { language, voiceEnabled, notifications }
  - category: { social, disability, minority }
  - createdAt, updatedAt, lastActive
  - cscOperatorId (if assisted)
```

**2. Schemes Table** (Enhanced)
```
PK: schemeId (String)
SK: VERSION#v1
Attributes:
  - basicInfo: { name, description, ministry, state }
  - benefits: { type, amount, duration, frequency }
  - eligibility: { rules in JSON format }
  - documents: { required[], optional[] }
  - applicationProcess: { steps[], timeline, mode }
  - s3Paths: { policy, faq, guidelines, forms }
  - metadata: { category, tags, popularity }
  - status: active | inactive | archived
  - lastUpdated, version
```

**3. VoiceConversations Table** (New)
```
PK: sessionId (String)
SK: TURN#timestamp
Attributes:
  - userId
  - turnNumber
  - userInput: { text, audioS3Path, language }
  - systemResponse: { text, audioS3Path }
  - intent: profile_collection | eligibility_check | chat
  - extractedData: { field, value, confidence }
  - context: { currentStep, completedFields }
  - timestamp
```

**4. Documents Table** (New)
```
PK: userId (String)
SK: DOC#docType#timestamp
Attributes:
  - documentType: aadhaar | pan | income | land | ration
  - s3Path: original image path
  - extractedData: { fields extracted via Textract }
  - validationStatus: pending | verified | rejected
  - validationErrors: []
  - uploadedAt, verifiedAt
  - verifiedBy: system | csc_operator | manual
```

**5. Applications Table** (New)
```
PK: applicationId (String)
SK: userId
Attributes:
  - schemeId
  - status: draft | submitted | under_review | approved | rejected
  - formData: { all filled fields }
  - documents: { attached document IDs }
  - timeline: { submitted, reviewed, decided }
  - rejectionReason: (if rejected)
  - guidanceHistory: [ { step, aiSuggestion, userAction } ]
  - submittedVia: web | mobile | csc | voice
```


**6. SchemeAlerts Table** (New)
```
PK: userId (String)
SK: ALERT#timestamp
Attributes:
  - alertType: new_scheme | eligibility_change | deadline | document_expiry
  - schemeId
  - message
  - priority: high | medium | low
  - status: pending | sent | read
  - channels: [ sms, email, push, voice ]
  - sentAt, readAt
```

**7. CSCOperators Table** (New)
```
PK: operatorId (String)
SK: CSC#cscId
Attributes:
  - name, phone, email
  - cscLocation: { state, district, village }
  - certifications: []
  - stats: { citizensAssisted, applicationsSubmitted, successRate }
  - activeUsers: [ userIds currently being assisted ]
  - rating, reviews
  - status: active | suspended
```

**8. EligibilityTimeline Table** (New)
```
PK: userId (String)
SK: TIMELINE#schemeId
Attributes:
  - schemeId
  - currentStatus: not_eligible | potentially_eligible | eligible
  - blockers: [ { criterion, currentValue, requiredValue, estimatedDate } ]
  - predictions: [ { date, event, probability } ]
  - recommendations: []
  - lastCalculated
```

---

## 2. VOICE-FIRST INTERACTION SYSTEM

### 2.1 Voice Architecture

**Components:**
1. **Amazon Transcribe** - Speech to Text
   - Real-time streaming transcription
   - Support for Hindi, English, and 10+ Indian languages
   - Custom vocabulary for government scheme terms
   - Accent adaptation for regional variations

2. **Amazon Polly** - Text to Speech
   - Neural voices for natural speech
   - Hindi: Aditi (female), Raveena (female)
   - English: Kajal (Indian English female)
   - SSML support for emphasis and pauses

3. **Voice Conversation Manager Lambda**
   - Manages multi-turn conversations
   - Context tracking across turns
   - Intent recognition
   - Slot filling for profile data


### 2.2 Voice Interaction Flow

```
User: [Presses voice button]
System: "Namaste. Main NEXIS hoon. Aapka naam kya hai?"
         (Hello. I am NEXIS. What is your name?)

User: "Mera naam Ramesh hai"
       (My name is Ramesh)

System: "Dhanyavaad Ramesh ji. Aap kya kaam karte hain?"
         (Thank you Ramesh ji. What work do you do?)

User: "Main kisan hoon"
       (I am a farmer)

System: "Accha. Aapke paas kitni zameen hai?"
         (Good. How much land do you have?)

User: "Do acre"
       (Two acres)

System: "Samajh gaya. Aapki saalana aamdani kitni hai?"
         (Understood. What is your annual income?)

User: "Lagbhag ek lakh rupaye"
       (About one lakh rupees)

System: "Bahut accha. Aapki umar kitni hai?"
         (Very good. What is your age?)

User: "Pachaas saal"
       (Fifty years)

System: "Dhanyavaad. Main aapke liye yojanaon ki jaanch kar raha hoon..."
         (Thank you. I am checking schemes for you...)
         
         [Processing...]
         
         "Ramesh ji, aap 3 yojanaon ke liye paatra hain:
          1. PM-KISAN - Har saal 6000 rupaye
          2. Kisan Credit Card
          3. Fasal Bima Yojana
          
          Kya aap in yojanaon ke baare mein aur jaanna chahenge?"
          
         (Ramesh ji, you are eligible for 3 schemes:
          1. PM-KISAN - 6000 rupees every year
          2. Kisan Credit Card
          3. Crop Insurance Scheme
          
          Would you like to know more about these schemes?)
```

### 2.3 Voice Lambda Implementation

**New Lambda: voice-transcription**
```typescript
// backend/src/lambda/voice-transcription/index.ts
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from '@aws-sdk/client-transcribe-streaming';

export async function handler(event: any) {
  const { audioStream, language = 'hi-IN' } = event;
  
  const client = new TranscribeStreamingClient({ region: 'us-east-1' });
  
  const command = new StartStreamTranscriptionCommand({
    LanguageCode: language,
    MediaEncoding: 'pcm',
    MediaSampleRateHertz: 16000,
    AudioStream: audioStream
  });
  
  const response = await client.send(command);
  
  // Extract transcribed text
  const transcribedText = extractTranscript(response);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      text: transcribedText,
      language,
      confidence: response.confidence
    })
  };
}
```


**New Lambda: voice-synthesis**
```typescript
// backend/src/lambda/voice-synthesis/index.ts
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function handler(event: any) {
  const { text, language = 'hi-IN', voiceId = 'Aditi' } = event;
  
  const pollyClient = new PollyClient({ region: 'us-east-1' });
  
  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: voiceId,
    Engine: 'neural',
    LanguageCode: language
  });
  
  const response = await pollyClient.send(command);
  
  // Save to S3 for caching
  const audioKey = `voice-output/${Date.now()}.mp3`;
  await saveToS3(response.AudioStream, audioKey);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      audioUrl: `https://s3.amazonaws.com/nexis-voice/${audioKey}`,
      text,
      language
    })
  };
}
```

**New Lambda: voice-conversation-manager**
```typescript
// backend/src/lambda/voice-conversation-manager/index.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { invokeClaudeModel } from '../../services/bedrock';

interface ConversationContext {
  sessionId: string;
  userId?: string;
  currentIntent: 'profile_collection' | 'eligibility_check' | 'chat';
  collectedData: Partial<UserProfile>;
  nextQuestion: string;
  completedFields: string[];
}

export async function handler(event: any) {
  const { sessionId, userInput, language = 'hi' } = event;
  
  // Load conversation context
  const context = await loadContext(sessionId);
  
  // Extract information from user input using AI
  const extractedData = await extractDataFromInput(userInput, context, language);
  
  // Update context with extracted data
  context.collectedData = { ...context.collectedData, ...extractedData };
  context.completedFields.push(...Object.keys(extractedData));
  
  // Determine next question
  const nextQuestion = determineNextQuestion(context, language);
  
  // Save context
  await saveContext(context);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      response: nextQuestion,
      extractedData,
      progress: calculateProgress(context),
      isComplete: isProfileComplete(context)
    })
  };
}

async function extractDataFromInput(
  input: string, 
  context: ConversationContext,
  language: string
): Promise<Partial<UserProfile>> {
  const prompt = `
Extract structured data from this user input in ${language}:
"${input}"

Context: We are collecting ${context.currentIntent} data.
Already collected: ${JSON.stringify(context.collectedData)}

Extract any of these fields if present:
- age (number)
- occupation (string)
- annualIncome (number)
- state (2-letter code)
- landSize (number, if farmer)
- hasDisability (boolean)

Return JSON only.`;

  const response = await invokeClaudeModel(prompt);
  return JSON.parse(response);
}
```

---

## 3. DYNAMIC PROFILE COLLECTION

### 3.1 Conversational Profile Builder

Instead of forms, collect data through natural conversation:

**Profile Collection Flow:**

```
Step 1: Basic Information
  - Name (optional for privacy)
  - Age
  - Gender
  - State/District

Step 2: Occupation Detection
  - "What work do you do?"
  - Based on answer, trigger category-specific questions

Step 3: Category-Specific Questions

IF Farmer:
  - Do you own land? (Yes/No)
  - How much land? (acres)
  - What crops do you grow?
  - Do you have irrigation?
  - Kisan Credit Card? (Yes/No)

IF Student:
  - What level of education? (10th/12th/Graduate/Postgraduate)
  - Government or private institution?
  - Course/stream?
  - Family income?
  - Scholarship currently receiving?

IF Woman:
  - Married/Unmarried/Widow?
  - Children? How many?
  - Working or homemaker?
  - BPL card holder?

IF Senior Citizen (Age > 60):
  - Pension currently receiving?
  - Living with family or alone?
  - Health conditions?
  - Bank account?

IF Worker/Labour:
  - Type of work? (Construction/Factory/Domestic)
  - Registered with labour department?
  - ESIC/EPF member?
  - Daily wage or monthly salary?

IF Disabled:
  - Type of disability?
  - Disability certificate?
  - Percentage of disability?
  - Currently employed?

Step 4: Economic Information
  - Annual household income
  - Income source
  - BPL/APL card
  - Bank account

Step 5: Family Information
  - Family size
  - Dependents
  - Children (age, education)
  - Elderly members

Step 6: Documents Available
  - Aadhaar
  - PAN
  - Ration Card
  - Income Certificate
  - Caste Certificate
  - Disability Certificate
  - Land Records
```

### 3.2 Enhanced UserProfile Model


```typescript
// backend/src/models/UserProfileV2.ts

export interface UserProfileV2 {
  // Basic Information
  userId: string;
  name?: string; // Optional for privacy
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone?: string;
  email?: string;
  
  // Location
  state: string;
  district?: string;
  pincode?: string;
  village?: string;
  isRural: boolean;
  
  // Occupation & Category
  primaryOccupation: OccupationType;
  occupationDetails: FarmerDetails | StudentDetails | WorkerDetails | BusinessDetails;
  
  // Economic Status
  annualIncome: number;
  incomeSource: string[];
  bplCardHolder: boolean;
  aplCardHolder: boolean;
  
  // Family Information
  familySize: number;
  dependents: number;
  children: Array<{ age: number; education: string; gender: string }>;
  elderlyMembers: number;
  maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced';
  
  // Social Category
  socialCategory: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  minority: boolean;
  minorityType?: 'Muslim' | 'Christian' | 'Sikh' | 'Buddhist' | 'Jain' | 'Parsi';
  
  // Disability
  hasDisability: boolean;
  disabilityType?: string;
  disabilityPercentage?: number;
  disabilityCertificate?: boolean;
  
  // Education
  educationLevel: 'Illiterate' | 'Primary' | 'Secondary' | 'Higher Secondary' | 'Graduate' | 'Postgraduate';
  currentlyStudying: boolean;
  institution?: string;
  course?: string;
  
  // Documents
  documents: {
    aadhaar: { available: boolean; number?: string; verified: boolean };
    pan: { available: boolean; number?: string; verified: boolean };
    rationCard: { available: boolean; type?: 'BPL' | 'APL'; verified: boolean };
    incomeCertificate: { available: boolean; amount?: number; verified: boolean };
    casteCertificate: { available: boolean; verified: boolean };
    disabilityCertificate: { available: boolean; verified: boolean };
    landRecords: { available: boolean; area?: number; verified: boolean };
    bankAccount: { available: boolean; ifsc?: string; verified: boolean };
  };
  
  // Preferences
  language: 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'as';
  voiceEnabled: boolean;
  notificationPreferences: {
    sms: boolean;
    email: boolean;
    push: boolean;
    voice: boolean;
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  profileCompleteness: number; // 0-100
  verificationStatus: 'unverified' | 'partial' | 'verified';
  cscOperatorId?: string; // If assisted by CSC
  collectionMethod: 'web' | 'mobile' | 'voice' | 'csc' | 'ussd';
}

export interface FarmerDetails {
  ownsLand: boolean;
  landSize?: number; // in acres
  irrigatedLand?: number;
  crops: string[];
  hasKisanCreditCard: boolean;
  hasSoilHealthCard: boolean;
  registeredFarmer: boolean;
}

export interface StudentDetails {
  level: 'School' | 'College' | 'University';
  institutionType: 'Government' | 'Private' | 'Aided';
  course: string;
  year: number;
  currentScholarships: string[];
  hostelResident: boolean;
}

export interface WorkerDetails {
  workerType: 'Construction' | 'Factory' | 'Domestic' | 'Agricultural' | 'Other';
  registeredWorker: boolean;
  esicMember: boolean;
  epfMember: boolean;
  wageType: 'Daily' | 'Weekly' | 'Monthly';
  averageDailyWage?: number;
}

export interface BusinessDetails {
  businessType: string;
  registered: boolean;
  gstNumber?: string;
  msmeRegistered: boolean;
  annualTurnover?: number;
  employees?: number;
}
```

---

## 4. ENHANCED ELIGIBILITY ENGINE V2

### 4.1 Advanced Rule Engine


**Enhanced Scheme Eligibility Criteria Format:**

```typescript
// backend/src/models/SchemeV2.ts

export interface SchemeV2 {
  schemeId: string;
  schemeName: string;
  nameTranslations: Record<string, string>; // Multi-language
  description: string;
  ministry: string;
  state?: string; // null for central schemes
  category: SchemeCategory;
  
  // Benefits
  benefits: {
    type: 'Financial' | 'Subsidy' | 'Pension' | 'Insurance' | 'Training' | 'Other';
    amount?: number;
    frequency?: 'One-time' | 'Monthly' | 'Quarterly' | 'Yearly';
    duration?: string;
    description: string;
  };
  
  // Complex Eligibility Rules
  eligibilityRules: {
    // Basic Rules
    ageMin?: number;
    ageMax?: number;
    incomeMax?: number;
    incomeMin?: number;
    
    // Location Rules
    states?: string[];
    districts?: string[];
    ruralOnly?: boolean;
    urbanOnly?: boolean;
    
    // Occupation Rules
    occupations?: string[];
    excludedOccupations?: string[];
    
    // Category Rules
    gender?: ('Male' | 'Female' | 'Other')[];
    socialCategories?: ('General' | 'OBC' | 'SC' | 'ST' | 'EWS')[];
    minority?: boolean;
    minorityTypes?: string[];
    
    // Disability Rules
    requiresDisability?: boolean;
    disabilityTypes?: string[];
    minDisabilityPercentage?: number;
    
    // Family Rules
    maxFamilyIncome?: number;
    maxFamilySize?: number;
    requiresChildren?: boolean;
    childrenAgeMax?: number;
    
    // Education Rules
    minEducation?: string;
    maxEducation?: string;
    currentlyStudying?: boolean;
    
    // Document Rules
    requiredDocuments: string[];
    optionalDocuments: string[];
    
    // Special Conditions (Complex Rules)
    customRules?: Array<{
      ruleId: string;
      description: string;
      condition: string; // JavaScript expression
      errorMessage: string;
    }>;
    
    // Exclusion Rules
    excludeIf?: Array<{
      condition: string;
      reason: string;
    }>;
  };
  
  // Application Process
  applicationProcess: {
    mode: 'Online' | 'Offline' | 'Both';
    steps: string[];
    estimatedTime: string;
    applicationUrl?: string;
    helplineNumber?: string;
  };
  
  // Metadata
  popularity: number; // 0-100
  successRate: number; // 0-100
  averageProcessingTime: number; // days
  lastUpdated: string;
  status: 'Active' | 'Inactive' | 'Archived';
  tags: string[];
}

export type SchemeCategory = 
  | 'Agriculture'
  | 'Education'
  | 'Health'
  | 'Housing'
  | 'Employment'
  | 'Social Welfare'
  | 'Women & Child'
  | 'Senior Citizen'
  | 'Disability'
  | 'Financial Inclusion'
  | 'Skill Development'
  | 'Other';
```

### 4.2 Eligibility Evaluation Engine V2


```typescript
// backend/src/services/eligibility-v2.ts

export interface EligibilityResultV2 {
  schemeId: string;
  schemeName: string;
  status: 'Eligible' | 'Not Eligible' | 'Potentially Eligible' | 'Insufficient Data';
  matchScore: number; // 0-100
  confidence: 'High' | 'Medium' | 'Low';
  
  satisfiedCriteria: Array<{
    criterion: string;
    value: any;
    requirement: any;
    message: string;
  }>;
  
  unsatisfiedCriteria: Array<{
    criterion: string;
    currentValue: any;
    requiredValue: any;
    gap: string;
    message: string;
    fixable: boolean;
    howToFix?: string;
  }>;
  
  missingData: Array<{
    field: string;
    importance: 'Critical' | 'Important' | 'Optional';
    message: string;
  }>;
  
  recommendations: string[];
  alternativeSchemes: string[];
  estimatedEligibilityDate?: string; // If potentially eligible
}

export async function evaluateEligibilityV2(
  profile: UserProfileV2,
  scheme: SchemeV2
): Promise<EligibilityResultV2> {
  const rules = scheme.eligibilityRules;
  const satisfied: any[] = [];
  const unsatisfied: any[] = [];
  const missing: any[] = [];
  
  // Age Check
  if (rules.ageMin !== undefined || rules.ageMax !== undefined) {
    const ageResult = evaluateAge(profile.age, rules.ageMin, rules.ageMax);
    if (ageResult.satisfied) {
      satisfied.push(ageResult);
    } else {
      unsatisfied.push(ageResult);
    }
  }
  
  // Income Check
  if (rules.incomeMax !== undefined) {
    const incomeResult = evaluateIncome(profile.annualIncome, rules.incomeMax);
    if (incomeResult.satisfied) {
      satisfied.push(incomeResult);
    } else {
      unsatisfied.push(incomeResult);
    }
  }
  
  // Location Check
  if (rules.states && rules.states.length > 0) {
    const locationResult = evaluateLocation(profile.state, rules.states);
    if (locationResult.satisfied) {
      satisfied.push(locationResult);
    } else {
      unsatisfied.push(locationResult);
    }
  }
  
  // Rural/Urban Check
  if (rules.ruralOnly !== undefined) {
    const ruralResult = evaluateRuralUrban(profile.isRural, rules.ruralOnly);
    if (ruralResult.satisfied) {
      satisfied.push(ruralResult);
    } else {
      unsatisfied.push(ruralResult);
    }
  }
  
  // Occupation Check
  if (rules.occupations && rules.occupations.length > 0) {
    const occupationResult = evaluateOccupation(
      profile.primaryOccupation,
      rules.occupations
    );
    if (occupationResult.satisfied) {
      satisfied.push(occupationResult);
    } else {
      unsatisfied.push(occupationResult);
    }
  }
  
  // Gender Check
  if (rules.gender && rules.gender.length > 0) {
    const genderResult = evaluateGender(profile.gender, rules.gender);
    if (genderResult.satisfied) {
      satisfied.push(genderResult);
    } else {
      unsatisfied.push(genderResult);
    }
  }
  
  // Social Category Check
  if (rules.socialCategories && rules.socialCategories.length > 0) {
    const categoryResult = evaluateSocialCategory(
      profile.socialCategory,
      rules.socialCategories
    );
    if (categoryResult.satisfied) {
      satisfied.push(categoryResult);
    } else {
      unsatisfied.push(categoryResult);
    }
  }
  
  // Disability Check
  if (rules.requiresDisability !== undefined) {
    const disabilityResult = evaluateDisability(
      profile.hasDisability,
      profile.disabilityPercentage,
      rules.requiresDisability,
      rules.minDisabilityPercentage
    );
    if (disabilityResult.satisfied) {
      satisfied.push(disabilityResult);
    } else {
      unsatisfied.push(disabilityResult);
    }
  }
  
  // Document Check
  const documentResult = evaluateDocuments(
    profile.documents,
    rules.requiredDocuments
  );
  satisfied.push(...documentResult.satisfied);
  unsatisfied.push(...documentResult.unsatisfied);
  missing.push(...documentResult.missing);
  
  // Custom Rules Evaluation
  if (rules.customRules) {
    for (const rule of rules.customRules) {
      const customResult = evaluateCustomRule(profile, rule);
      if (customResult.satisfied) {
        satisfied.push(customResult);
      } else {
        unsatisfied.push(customResult);
      }
    }
  }
  
  // Calculate match score
  const totalCriteria = satisfied.length + unsatisfied.length;
  const matchScore = totalCriteria > 0 
    ? Math.round((satisfied.length / totalCriteria) * 100)
    : 0;
  
  // Determine status
  let status: EligibilityResultV2['status'];
  if (unsatisfied.length === 0 && missing.length === 0) {
    status = 'Eligible';
  } else if (unsatisfied.length === 0 && missing.length > 0) {
    status = 'Potentially Eligible';
  } else if (unsatisfied.some(u => !u.fixable)) {
    status = 'Not Eligible';
  } else {
    status = 'Potentially Eligible';
  }
  
  // Determine confidence
  const confidence = missing.length === 0 ? 'High' 
    : missing.length <= 2 ? 'Medium' 
    : 'Low';
  
  return {
    schemeId: scheme.schemeId,
    schemeName: scheme.schemeName,
    status,
    matchScore,
    confidence,
    satisfiedCriteria: satisfied,
    unsatisfiedCriteria: unsatisfied,
    missingData: missing,
    recommendations: generateRecommendations(unsatisfied, missing),
    alternativeSchemes: [] // To be populated by scheme matcher
  };
}
```

---

## 5. DOCUMENT INTELLIGENCE SYSTEM

### 5.1 Document OCR & Extraction


**New Lambda: document-ocr**

```typescript
// backend/src/lambda/document-ocr/index.ts
import { TextractClient, AnalyzeDocumentCommand } from '@aws-sdk/client-textract';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export async function handler(event: any) {
  const { userId, documentType, s3Key } = event;
  
  const textractClient = new TextractClient({ region: 'us-east-1' });
  
  // Analyze document using Textract
  const command = new AnalyzeDocumentCommand({
    Document: {
      S3Object: {
        Bucket: process.env.DOCUMENTS_BUCKET,
        Name: s3Key
      }
    },
    FeatureTypes: ['FORMS', 'TABLES']
  });
  
  const response = await textractClient.send(command);
  
  // Extract structured data based on document type
  let extractedData;
  switch (documentType) {
    case 'aadhaar':
      extractedData = extractAadhaarData(response);
      break;
    case 'pan':
      extractedData = extractPANData(response);
      break;
    case 'income':
      extractedData = extractIncomeCertificateData(response);
      break;
    case 'land':
      extractedData = extractLandRecordData(response);
      break;
    case 'ration':
      extractedData = extractRationCardData(response);
      break;
    default:
      extractedData = extractGenericData(response);
  }
  
  // Validate extracted data
  const validation = validateExtractedData(documentType, extractedData);
  
  // Save to DynamoDB
  await saveDocumentData(userId, documentType, extractedData, validation);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      documentType,
      extractedData,
      validation,
      confidence: calculateConfidence(response)
    })
  };
}

function extractAadhaarData(textractResponse: any): AadhaarData {
  // Extract Aadhaar-specific fields
  return {
    aadhaarNumber: extractField(textractResponse, 'aadhaar_number'),
    name: extractField(textractResponse, 'name'),
    dob: extractField(textractResponse, 'dob'),
    gender: extractField(textractResponse, 'gender'),
    address: extractField(textractResponse, 'address'),
    photo: extractField(textractResponse, 'photo')
  };
}

function extractPANData(textractResponse: any): PANData {
  return {
    panNumber: extractField(textractResponse, 'pan_number'),
    name: extractField(textractResponse, 'name'),
    fatherName: extractField(textractResponse, 'father_name'),
    dob: extractField(textractResponse, 'dob')
  };
}

function extractIncomeCertificateData(textractResponse: any): IncomeCertificateData {
  return {
    certificateNumber: extractField(textractResponse, 'certificate_number'),
    name: extractField(textractResponse, 'name'),
    annualIncome: parseFloat(extractField(textractResponse, 'annual_income')),
    issueDate: extractField(textractResponse, 'issue_date'),
    issuingAuthority: extractField(textractResponse, 'issuing_authority'),
    validUntil: extractField(textractResponse, 'valid_until')
  };
}
```

### 5.2 Document Validation

**New Lambda: document-validator**

```typescript
// backend/src/lambda/document-validator/index.ts

export async function handler(event: any) {
  const { userId, documentType, extractedData } = event;
  
  const validationResults = [];
  
  // Validate Aadhaar
  if (documentType === 'aadhaar') {
    // Check Aadhaar number format (12 digits)
    if (!/^\d{12}$/.test(extractedData.aadhaarNumber)) {
      validationResults.push({
        field: 'aadhaarNumber',
        status: 'invalid',
        message: 'Aadhaar number must be 12 digits'
      });
    }
    
    // Verify with UIDAI (if API available)
    // const uidaiVerification = await verifyWithUIDAI(extractedData.aadhaarNumber);
    
    // Check if name matches profile
    const profile = await getUserProfile(userId);
    if (profile.name && !namesMatch(profile.name, extractedData.name)) {
      validationResults.push({
        field: 'name',
        status: 'mismatch',
        message: 'Name on Aadhaar does not match profile name'
      });
    }
  }
  
  // Validate Income Certificate
  if (documentType === 'income') {
    // Check if certificate is expired
    const validUntil = new Date(extractedData.validUntil);
    if (validUntil < new Date()) {
      validationResults.push({
        field: 'validUntil',
        status: 'expired',
        message: 'Income certificate has expired'
      });
    }
    
    // Check if income matches profile
    const profile = await getUserProfile(userId);
    const incomeDifference = Math.abs(profile.annualIncome - extractedData.annualIncome);
    if (incomeDifference > 50000) {
      validationResults.push({
        field: 'annualIncome',
        status: 'mismatch',
        message: `Income on certificate (₹${extractedData.annualIncome}) differs significantly from profile (₹${profile.annualIncome})`
      });
    }
  }
  
  // Overall validation status
  const overallStatus = validationResults.some(r => r.status === 'invalid' || r.status === 'expired')
    ? 'rejected'
    : validationResults.some(r => r.status === 'mismatch')
    ? 'needs_review'
    : 'verified';
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      documentType,
      validationStatus: overallStatus,
      validationResults,
      timestamp: new Date().toISOString()
    })
  };
}
```

---

## 6. GUIDED APPLICATION MODE

### 6.1 Step-by-Step Application Guidance


**New Lambda: guided-application-manager**

```typescript
// backend/src/lambda/guided-application-manager/index.ts

interface ApplicationStep {
  stepId: string;
  stepNumber: number;
  title: string;
  description: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'file' | 'checkbox';
  fieldName: string;
  required: boolean;
  validation: ValidationRule[];
  helpText: string;
  aiGuidance?: string;
}

export async function handler(event: any) {
  const { applicationId, userId, schemeId, action } = event;
  
  if (action === 'start') {
    // Initialize new application
    const scheme = await getScheme(schemeId);
    const profile = await getUserProfile(userId);
    
    // Generate application steps based on scheme requirements
    const steps = generateApplicationSteps(scheme, profile);
    
    // Pre-fill data from profile
    const prefilledData = prefillFromProfile(steps, profile);
    
    const application = {
      applicationId: generateId(),
      userId,
      schemeId,
      status: 'draft',
      currentStep: 0,
      totalSteps: steps.length,
      steps,
      formData: prefilledData,
      createdAt: new Date().toISOString()
    };
    
    await saveApplication(application);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        applicationId: application.applicationId,
        currentStep: steps[0],
        progress: 0,
        prefilledFields: Object.keys(prefilledData)
      })
    };
  }
  
  if (action === 'next_step') {
    const { fieldValue } = event;
    const application = await getApplication(applicationId);
    
    // Validate current step
    const currentStep = application.steps[application.currentStep];
    const validation = validateField(currentStep, fieldValue);
    
    if (!validation.valid) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Validation failed',
          errors: validation.errors,
          aiSuggestion: await getAISuggestion(currentStep, fieldValue, validation.errors)
        })
      };
    }
    
    // Save field value
    application.formData[currentStep.fieldName] = fieldValue;
    application.currentStep += 1;
    
    await saveApplication(application);
    
    // Check if application is complete
    if (application.currentStep >= application.totalSteps) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'complete',
          message: 'Application ready for submission',
          summary: generateApplicationSummary(application)
        })
      };
    }
    
    // Return next step
    const nextStep = application.steps[application.currentStep];
    const aiGuidance = await generateStepGuidance(nextStep, application.formData);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        currentStep: { ...nextStep, aiGuidance },
        progress: Math.round((application.currentStep / application.totalSteps) * 100),
        canGoBack: application.currentStep > 0
      })
    };
  }
  
  if (action === 'submit') {
    const application = await getApplication(applicationId);
    
    // Final validation
    const finalValidation = validateCompleteApplication(application);
    if (!finalValidation.valid) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Application incomplete',
          missingFields: finalValidation.missingFields
        })
      };
    }
    
    // Submit application
    application.status = 'submitted';
    application.submittedAt = new Date().toISOString();
    
    await saveApplication(application);
    
    // Send confirmation
    await sendApplicationConfirmation(userId, application);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'submitted',
        applicationId: application.applicationId,
        message: 'Application submitted successfully',
        trackingNumber: generateTrackingNumber(application),
        estimatedProcessingTime: getEstimatedProcessingTime(application.schemeId)
      })
    };
  }
}

async function getAISuggestion(
  step: ApplicationStep,
  userInput: any,
  errors: string[]
): Promise<string> {
  const prompt = `
User is filling an application form for a government scheme.

Current field: ${step.title}
Description: ${step.description}
User input: ${userInput}
Validation errors: ${errors.join(', ')}

Provide a helpful suggestion in simple language (max 50 words) to help the user correct their input.`;

  return await invokeClaudeModel(prompt);
}
```

### 6.2 Real-time Form Validation

**Frontend Component: GuidedApplicationForm.tsx**

```typescript
// frontend/src/components/GuidedApplicationForm.tsx

export function GuidedApplicationForm({ schemeId }: { schemeId: string }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [currentStep, setCurrentStep] = useState<ApplicationStep | null>(null);
  const [fieldValue, setFieldValue] = useState<any>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [aiGuidance, setAiGuidance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    startApplication();
  }, [schemeId]);
  
  const startApplication = async () => {
    const response = await fetch('/api/applications/start', {
      method: 'POST',
      body: JSON.stringify({ schemeId })
    });
    const data = await response.json();
    setApplication(data);
    setCurrentStep(data.currentStep);
    setFieldValue(data.prefilledFields[data.currentStep.fieldName] || '');
  };
  
  const handleNext = async () => {
    setLoading(true);
    setErrors([]);
    
    try {
      const response = await fetch('/api/applications/next', {
        method: 'POST',
        body: JSON.stringify({
          applicationId: application.applicationId,
          fieldValue
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCurrentStep(data.currentStep);
        setAiGuidance(data.currentStep.aiGuidance);
        setFieldValue('');
      } else {
        setErrors(data.errors);
        setAiGuidance(data.aiSuggestion);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">
            Step {currentStep?.stepNumber} of {application?.totalSteps}
          </h2>
          <span className="text-sm text-gray-600">
            {application?.progress}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${application?.progress}%` }}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">{currentStep?.title}</h3>
        <p className="text-gray-600 mb-4">{currentStep?.description}</p>
        
        {aiGuidance && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>AI Guidance:</strong> {aiGuidance}
            </p>
          </div>
        )}
        
        <FormField
          type={currentStep?.fieldType}
          value={fieldValue}
          onChange={setFieldValue}
          required={currentStep?.required}
          helpText={currentStep?.helpText}
        />
        
        {errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            {errors.map((error, i) => (
              <p key={i} className="text-sm text-red-800">{error}</p>
            ))}
          </div>
        )}
        
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => handleBack()}
            disabled={application?.currentStep === 0}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Processing...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. CSC OPERATOR DASHBOARD

### 7.1 Operator Interface


**CSC Operator Dashboard Features:**

1. **Multi-User Management**
   - Create and manage citizen profiles
   - Switch between active users
   - Track assistance history

2. **Quick Profile Creation**
   - Voice-assisted data entry
   - Document scanning and upload
   - Bulk profile creation

3. **Application Assistance**
   - Guide citizens through applications
   - Real-time validation
   - Document verification

4. **Performance Tracking**
   - Citizens assisted today/week/month
   - Applications submitted
   - Success rate
   - Earnings/commissions

5. **Scheme Discovery**
   - Search schemes by category
   - Filter by eligibility
   - Popular schemes in area

**Frontend: CSCOperatorDashboard.tsx**

```typescript
// frontend/src/pages/CSCOperatorDashboard.tsx

export function CSCOperatorDashboard() {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [stats, setStats] = useState<OperatorStats | null>(null);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">CSC Operator Dashboard</h1>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Citizens Assisted Today" value={stats?.todayCount} />
          <StatCard title="Applications Submitted" value={stats?.applicationsCount} />
          <StatCard title="Success Rate" value={`${stats?.successRate}%`} />
          <StatCard title="Earnings This Month" value={`₹${stats?.earnings}`} />
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <ActiveUsersList 
              users={activeUsers}
              onSelect={setSelectedUser}
            />
            <button 
              onClick={() => createNewProfile()}
              className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded"
            >
              + New Citizen Profile
            </button>
          </div>
          
          <div className="col-span-2">
            {selectedUser ? (
              <UserProfilePanel user={selectedUser} />
            ) : (
              <EmptyState message="Select a citizen to assist" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 8. PROACTIVE SCHEME ALERTS & TIMELINE

### 8.1 Scheme Alert Engine

**New Lambda: scheme-alert-engine**

```typescript
// backend/src/lambda/scheme-alert-engine/index.ts

export async function handler(event: any) {
  // Run daily to check for new eligibility
  const users = await getAllActiveUsers();
  
  for (const user of users) {
    const alerts = [];
    
    // Check for new schemes
    const newSchemes = await getNewSchemes(user.lastChecked);
    for (const scheme of newSchemes) {
      const eligibility = await evaluateEligibilityV2(user.profile, scheme);
      if (eligibility.status === 'Eligible') {
        alerts.push({
          type: 'new_scheme',
          schemeId: scheme.schemeId,
          message: `New scheme available: ${scheme.schemeName}`,
          priority: 'high'
        });
      }
    }
    
    // Check for eligibility changes (age, income updates)
    const timeline = await getEligibilityTimeline(user.userId);
    for (const prediction of timeline.predictions) {
      if (isWithinDays(prediction.date, 30)) {
        alerts.push({
          type: 'eligibility_change',
          schemeId: prediction.schemeId,
          message: `You will become eligible for ${prediction.schemeName} on ${prediction.date}`,
          priority: 'medium'
        });
      }
    }
    
    // Check for document expiry
    const expiringDocs = checkDocumentExpiry(user.documents);
    for (const doc of expiringDocs) {
      alerts.push({
        type: 'document_expiry',
        message: `Your ${doc.type} will expire on ${doc.expiryDate}`,
        priority: 'high'
      });
    }
    
    // Send alerts
    if (alerts.length > 0) {
      await sendAlerts(user, alerts);
    }
  }
}
```

### 8.2 Timeline Prediction

**New Lambda: timeline-predictor**

```typescript
// backend/src/lambda/timeline-predictor/index.ts

export async function handler(event: any) {
  const { userId } = event;
  const profile = await getUserProfile(userId);
  const allSchemes = await getAllSchemes();
  
  const timeline = [];
  
  for (const scheme of allSchemes) {
    const eligibility = await evaluateEligibilityV2(profile, scheme);
    
    if (eligibility.status === 'Not Eligible') {
      // Check if user can become eligible in future
      const predictions = predictFutureEligibility(profile, scheme, eligibility);
      timeline.push(...predictions);
    }
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      timeline: timeline.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    })
  };
}

function predictFutureEligibility(
  profile: UserProfileV2,
  scheme: SchemeV2,
  currentEligibility: EligibilityResultV2
): TimelinePrediction[] {
  const predictions: TimelinePrediction[] = [];
  
  // Age-based predictions
  const ageBlockers = currentEligibility.unsatisfiedCriteria.filter(
    c => c.criterion === 'age'
  );
  for (const blocker of ageBlockers) {
    if (blocker.requiredValue.min && profile.age < blocker.requiredValue.min) {
      const yearsUntilEligible = blocker.requiredValue.min - profile.age;
      const eligibilityDate = addYears(new Date(), yearsUntilEligible);
      predictions.push({
        schemeId: scheme.schemeId,
        schemeName: scheme.schemeName,
        date: eligibilityDate.toISOString(),
        event: `You will turn ${blocker.requiredValue.min} years old`,
        probability: 100,
        action: 'Wait until eligible age'
      });
    }
  }
  
  // Income-based predictions (if income is decreasing trend)
  // Education-based predictions (if currently studying)
  // etc.
  
  return predictions;
}
```

---

## 9. FRONTEND UPGRADE

### 9.1 New Pages & Components

**Required New Pages:**
1. `VoiceOnboardingPage.tsx` - Voice-first profile collection
2. `DocumentUploadPage.tsx` - Camera/upload with OCR
3. `GuidedApplicationPage.tsx` - Step-by-step application
4. `TimelinePage.tsx` - Future eligibility predictions
5. `CSCOperatorDashboard.tsx` - Operator interface
6. `SchemeComparePage.tsx` - Compare multiple schemes
7. `ApplicationTrackerPage.tsx` - Track application status

**Required New Components:**
1. `VoiceRecorder.tsx` - Voice input component
2. `DocumentScanner.tsx` - Camera capture with preview
3. `ProgressStepper.tsx` - Multi-step form progress
4. `SchemeCard.tsx` - Enhanced scheme display
5. `EligibilityBadge.tsx` - Visual eligibility status
6. `AIExplanationPanel.tsx` - Collapsible AI explanations
7. `NotificationBell.tsx` - Scheme alerts
8. `LanguageSwitcher.tsx` - Multi-language support

### 9.2 Voice Recorder Component

```typescript
// frontend/src/components/VoiceRecorder.tsx

export function VoiceRecorder({ onTranscript, language = 'hi-IN' }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioBlob(blob);
      
      // Send to backend for transcription
      const formData = new FormData();
      formData.append('audio', blob);
      formData.append('language', language);
      
      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      onTranscript(data.text);
    };
    
    mediaRecorder.start();
    setIsRecording(true);
  };
  
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };
  
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full flex items-center justify-center ${
          isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-600'
        }`}
      >
        {isRecording ? <StopIcon /> : <MicrophoneIcon />}
      </button>
      <p className="mt-2 text-sm text-gray-600">
        {isRecording ? 'Recording... Tap to stop' : 'Tap to speak'}
      </p>
    </div>
  );
}
```

---

## 10. DEPLOYMENT & SCALABILITY

### 10.1 Infrastructure as Code Updates

**New CloudFormation Stacks:**

1. **voice-services-stack.yaml**
   - Transcribe configuration
   - Polly configuration
   - Voice conversation Lambda functions

2. **document-services-stack.yaml**
   - Textract configuration
   - Document storage S3 bucket
   - OCR Lambda functions

3. **notification-stack.yaml**
   - SNS topics for SMS
   - SES configuration for email
   - Alert engine Lambda

4. **csc-operator-stack.yaml**
   - Cognito user pool for operators
   - Operator dashboard API
   - Operator management Lambda

### 10.2 Scalability Targets

**Performance Requirements:**
- Support 10M+ concurrent users
- < 2 second API response time
- 99.9% uptime
- Handle 100K+ voice requests/hour
- Process 50K+ documents/day

**Cost Optimization:**
- Use Lambda reserved concurrency
- Enable DynamoDB auto-scaling
- S3 Intelligent-Tiering
- CloudFront caching
- ElastiCache for session data

---

## 11. IMPLEMENTATION ROADMAP

### Phase 1: Voice & Profile Enhancement (Weeks 1-3)
- [ ] Implement voice transcription/synthesis
- [ ] Build voice conversation manager
- [ ] Create dynamic profile collector
- [ ] Enhance UserProfile model
- [ ] Build VoiceOnboardingPage

### Phase 2: Document Intelligence (Weeks 4-5)
- [ ] Integrate Textract for OCR
- [ ] Build document validator
- [ ] Create DocumentUploadPage
- [ ] Implement document verification workflow

### Phase 3: Enhanced Eligibility Engine (Weeks 6-7)
- [ ] Upgrade eligibility rules engine
- [ ] Implement timeline predictor
- [ ] Build scheme alert system
- [ ] Create TimelinePage

### Phase 4: Guided Applications (Weeks 8-9)
- [ ] Build guided application manager
- [ ] Implement real-time validation
- [ ] Create GuidedApplicationPage
- [ ] Add AI form guidance

### Phase 5: CSC Operator Features (Weeks 10-11)
- [ ] Build operator authentication
- [ ] Create CSC dashboard
- [ ] Implement multi-user management
- [ ] Add operator analytics

### Phase 6: Testing & Optimization (Weeks 12-13)
- [ ] Load testing (100K+ users)
- [ ] Voice accuracy testing
- [ ] OCR accuracy testing
- [ ] Security audit
- [ ] Performance optimization

### Phase 7: Deployment & Launch (Week 14)
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] User training materials
- [ ] Launch in pilot states

---

## 12. SUCCESS METRICS

**User Metrics:**
- 10M+ registered citizens in Year 1
- 70%+ profile completion rate
- 80%+ voice interaction success rate
- 90%+ document verification accuracy

**Business Metrics:**
- 50% increase in scheme applications
- 40% reduction in application rejections
- 60% reduction in CSC operator time per citizen
- 5M+ schemes discovered through platform

**Technical Metrics:**
- 99.9% uptime
- < 2s average API response time
- < 5s voice transcription time
- 95%+ OCR accuracy

---

## CONCLUSION

This comprehensive upgrade transforms NEXIS into a production-grade, voice-first welfare discovery platform that serves India's diverse population. The system combines AWS serverless architecture, AI-powered assistance, and human-centered design to make government schemes accessible to all citizens, especially those in rural areas with low digital literacy.

The platform is designed to scale to 100M+ users while maintaining performance, security, and cost-effectiveness. With voice interaction, document intelligence, and proactive alerts, NEXIS becomes a true digital public infrastructure for welfare access in India.

