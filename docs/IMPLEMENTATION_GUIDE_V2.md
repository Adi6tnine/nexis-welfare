# NEXIS V2 Implementation Guide
## Step-by-Step Development Roadmap

---

## Phase 1: Voice Services Foundation (Weeks 1-3)

### Week 1: AWS Service Setup

**Day 1-2: Amazon Transcribe Configuration**

1. Enable Amazon Transcribe in AWS Console
2. Create custom vocabulary for government schemes
3. Configure language models for Hindi and English

```bash
# Create custom vocabulary
aws transcribe create-vocabulary \
  --vocabulary-name nexis-schemes-vocab \
  --language-code hi-IN \
  --vocabulary-file-uri s3://nexis-config/vocabulary.txt
```

**Day 3-4: Amazon Polly Configuration**

1. Test neural voices (Aditi, Kajal)
2. Create SSML templates for common responses
3. Set up S3 bucket for voice output caching

**Day 5: Lambda Functions**

Create three new Lambda functions:

```typescript
// 1. voice-transcription
backend/src/lambda/voice-transcription/
  ├── index.ts
  ├── handler.ts
  └── package.json

// 2. voice-synthesis
backend/src/lambda/voice-synthesis/
  ├── index.ts
  ├── handler.ts
  └── package.json

// 3. voice-conversation-manager
backend/src/lambda/voice-conversation-manager/
  ├── index.ts
  ├── handler.ts
  ├── context-manager.ts
  └── data-extractor.ts
```

### Week 2: Voice Conversation Logic

**Implement Conversation Manager:**

```typescript
// backend/src/lambda/voice-conversation-manager/index.ts

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { invokeClaudeModel } from '../../services/bedrock';

export async function handler(event: any) {
  const { sessionId, userInput, language } = event;
  
  // 1. Load conversation context
  const context = await loadContext(sessionId);
  
  // 2. Extract data using AI
  const extractedData = await extractDataFromInput(
    userInput, 
    context, 
    language
  );
  
  // 3. Update context
  context.collectedData = { ...context.collectedData, ...extractedData };
  
  // 4. Determine next question
  const nextQuestion = determineNextQuestion(context, language);
  
  // 5. Save context
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
```

**Create Question Templates:**

```typescript
// backend/src/services/voice-questions.ts

export const QUESTIONS = {
  hi: {
    name: "Aapka naam kya hai?",
    age: "Aapki umar kitni hai?",
    occupation: "Aap kya kaam karte hain?",
    farmer_land: "Aapke paas kitni zameen hai?",
    income: "Aapki saalana aamdani kitni hai?",
    state: "Aap kis rajya mein rehte hain?",
    documents: "Kya aapke paas Aadhaar card hai?"
  },
  en: {
    name: "What is your name?",
    age: "What is your age?",
    occupation: "What is your occupation?",
    farmer_land: "How much land do you own?",
    income: "What is your annual income?",
    state: "Which state do you live in?",
    documents: "Do you have an Aadhaar card?"
  }
};
```

### Week 3: Frontend Voice Components

**Create Voice Recorder Component:**

```typescript
// frontend/src/components/VoiceRecorder.tsx

import { useState, useRef } from 'react';

export function VoiceRecorder({ onTranscript, language = 'hi-IN' }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      
      // Send to backend
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
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`w-20 h-20 rounded-full ${
        isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-600'
      }`}
    >
      {isRecording ? '⏹' : '🎤'}
    </button>
  );
}
```

**Create Voice Onboarding Page:**

```typescript
// frontend/src/pages/VoiceOnboardingPage.tsx

export function VoiceOnboardingPage() {
  const [sessionId] = useState(() => generateSessionId());
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleTranscript = async (text: string) => {
    setIsProcessing(true);
    
    // Add user message
    setConversation(prev => [...prev, { role: 'user', text }]);
    
    // Send to backend
    const response = await fetch('/api/voice/conversation', {
      method: 'POST',
      body: JSON.stringify({ sessionId, userInput: text, language: 'hi' })
    });
    
    const data = await response.json();
    
    // Add system response
    setConversation(prev => [...prev, { 
      role: 'system', 
      text: data.response,
      audioUrl: data.audioUrl 
    }]);
    
    // Play audio response
    if (data.audioUrl) {
      const audio = new Audio(data.audioUrl);
      audio.play();
    }
    
    setIsProcessing(false);
    
    // Check if complete
    if (data.isComplete) {
      navigate('/results');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Voice Profile Creation</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <ConversationHistory messages={conversation} />
        </div>
        
        <div className="flex justify-center">
          <VoiceRecorder 
            onTranscript={handleTranscript}
            language="hi-IN"
            disabled={isProcessing}
          />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {isProcessing ? 'Processing...' : 'Tap to speak'}
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 2: Document Intelligence (Weeks 4-5)

### Week 4: AWS Textract Integration

**Day 1-2: Setup Textract**

```typescript
// backend/src/lambda/document-ocr/index.ts

import { TextractClient, AnalyzeDocumentCommand } from '@aws-sdk/client-textract';

export async function handler(event: any) {
  const { userId, documentType, s3Key } = event;
  
  const textractClient = new TextractClient({ region: 'us-east-1' });
  
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
  
  // Extract based on document type
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
    default:
      extractedData = extractGenericData(response);
  }
  
  // Save to DynamoDB
  await saveDocumentData(userId, documentType, extractedData);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      documentType,
      extractedData,
      confidence: calculateConfidence(response)
    })
  };
}
```

**Day 3-4: Document Extractors**

```typescript
// backend/src/services/document-extractors.ts

export function extractAadhaarData(textractResponse: any): AadhaarData {
  const blocks = textractResponse.Blocks;
  
  return {
    aadhaarNumber: findField(blocks, 'aadhaar', /\d{4}\s?\d{4}\s?\d{4}/),
    name: findField(blocks, 'name'),
    dob: findField(blocks, 'dob', /\d{2}\/\d{2}\/\d{4}/),
    gender: findField(blocks, 'gender', /(Male|Female)/i),
    address: findField(blocks, 'address')
  };
}

export function extractPANData(textractResponse: any): PANData {
  const blocks = textractResponse.Blocks;
  
  return {
    panNumber: findField(blocks, 'pan', /[A-Z]{5}\d{4}[A-Z]/),
    name: findField(blocks, 'name'),
    fatherName: findField(blocks, 'father'),
    dob: findField(blocks, 'dob', /\d{2}\/\d{2}\/\d{4}/)
  };
}

function findField(blocks: any[], fieldName: string, pattern?: RegExp): string {
  // Search through Textract blocks to find field
  for (const block of blocks) {
    if (block.BlockType === 'LINE') {
      const text = block.Text;
      if (pattern && pattern.test(text)) {
        return text.match(pattern)[0];
      }
      if (text.toLowerCase().includes(fieldName)) {
        // Return next block's text
        return getNextBlockText(blocks, block.Id);
      }
    }
  }
  return '';
}
```

### Week 5: Document Validation & Frontend

**Document Validator:**

```typescript
// backend/src/lambda/document-validator/index.ts

export async function handler(event: any) {
  const { userId, documentId, documentType, extractedData } = event;
  
  const validationResults = [];
  const profile = await getUserProfile(userId);
  
  // Validate based on document type
  if (documentType === 'aadhaar') {
    // Check format
    if (!/^\d{12}$/.test(extractedData.aadhaarNumber.replace(/\s/g, ''))) {
      validationResults.push({
        field: 'aadhaarNumber',
        status: 'invalid',
        message: 'Invalid Aadhaar format'
      });
    }
    
    // Check name match
    if (profile.name && !namesMatch(profile.name, extractedData.name)) {
      validationResults.push({
        field: 'name',
        status: 'mismatch',
        message: 'Name does not match profile'
      });
    }
  }
  
  const overallStatus = determineOverallStatus(validationResults);
  
  // Update document status
  await updateDocumentStatus(documentId, overallStatus, validationResults);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      validationStatus: overallStatus,
      validationResults
    })
  };
}
```

**Frontend Document Upload:**

```typescript
// frontend/src/pages/DocumentUploadPage.tsx

export function DocumentUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleUpload = async () => {
    if (!selectedFile || !documentType) return;
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('documentType', documentType);
    formData.append('userId', userId);
    
    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    // Poll for OCR results
    const ocrResult = await pollForOCR(data.documentId);
    setResult(ocrResult);
    setUploading(false);
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Documents</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full mb-4 p-3 border rounded"
        >
          <option value="">Select Document Type</option>
          <option value="aadhaar">Aadhaar Card</option>
          <option value="pan">PAN Card</option>
          <option value="income">Income Certificate</option>
          <option value="ration">Ration Card</option>
        </select>
        
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="w-full mb-4"
        />
        
        {selectedFile && (
          <img 
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="w-full mb-4 rounded"
          />
        )}
        
        <button
          onClick={handleUpload}
          disabled={!selectedFile || !documentType || uploading}
          className="w-full py-3 bg-blue-600 text-white rounded"
        >
          {uploading ? 'Processing...' : 'Upload & Extract'}
        </button>
        
        {result && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Extracted Data:</h3>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(result.extractedData, null, 2)}
            </pre>
            
            {result.validationStatus === 'verified' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                ✓ Document verified successfully
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Phase 3: Enhanced Eligibility Engine (Weeks 6-7)

### Week 6: Upgrade Eligibility Models

**Enhanced UserProfile Model:**

```typescript
// backend/src/models/UserProfileV2.ts

export interface UserProfileV2 {
  userId: string;
  personalInfo: {
    name?: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone?: string;
    email?: string;
  };
  location: {
    state: string;
    district?: string;
    pincode?: string;
    village?: string;
    isRural: boolean;
  };
  occupation: {
    primary: OccupationType;
    details: FarmerDetails | StudentDetails | WorkerDetails | BusinessDetails;
  };
  economic: {
    annualIncome: number;
    incomeSource: string[];
    bplCard: boolean;
    aplCard: boolean;
  };
  family: {
    size: number;
    dependents: number;
    children: Array<{ age: number; education: string; gender: string }>;
    elderlyMembers: number;
    maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced';
  };
  socialCategory: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  hasDisability: boolean;
  disabilityDetails?: {
    type: string;
    percentage: number;
    certificate: boolean;
  };
  documents: DocumentStatus;
  preferences: UserPreferences;
  metadata: ProfileMetadata;
}
```

**Enhanced Scheme Model:**

```typescript
// backend/src/models/SchemeV2.ts

export interface SchemeV2 {
  schemeId: string;
  schemeName: string;
  nameTranslations: Record<string, string>;
  description: string;
  ministry: string;
  state?: string;
  category: SchemeCategory;
  benefits: SchemeBenefits;
  eligibilityRules: {
    ageMin?: number;
    ageMax?: number;
    incomeMax?: number;
    states?: string[];
    ruralOnly?: boolean;
    occupations?: string[];
    gender?: string[];
    socialCategories?: string[];
    requiresDisability?: boolean;
    requiredDocuments: string[];
    customRules?: CustomRule[];
  };
  applicationProcess: ApplicationProcess;
  metadata: SchemeMetadata;
}
```

### Week 7: Timeline Predictor

```typescript
// backend/src/lambda/timeline-predictor/index.ts

export async function handler(event: any) {
  const { userId } = event;
  const profile = await getUserProfile(userId);
  const allSchemes = await getAllSchemes();
  
  const timeline: TimelinePrediction[] = [];
  
  for (const scheme of allSchemes) {
    const eligibility = await evaluateEligibilityV2(profile, scheme);
    
    if (eligibility.status === 'Not Eligible') {
      const predictions = predictFutureEligibility(profile, scheme, eligibility);
      timeline.push(...predictions);
    }
  }
  
  // Sort by date
  timeline.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return {
    statusCode: 200,
    body: JSON.stringify({ timeline })
  };
}

function predictFutureEligibility(
  profile: UserProfileV2,
  scheme: SchemeV2,
  currentEligibility: EligibilityResultV2
): TimelinePrediction[] {
  const predictions: TimelinePrediction[] = [];
  
  // Age-based predictions
  for (const blocker of currentEligibility.unsatisfiedCriteria) {
    if (blocker.criterion === 'age' && blocker.requiredValue.min) {
      if (profile.personalInfo.age < blocker.requiredValue.min) {
        const yearsUntil = blocker.requiredValue.min - profile.personalInfo.age;
        const eligibilityDate = addYears(new Date(), yearsUntil);
        
        predictions.push({
          schemeId: scheme.schemeId,
          schemeName: scheme.schemeName,
          date: eligibilityDate.toISOString(),
          event: `You will turn ${blocker.requiredValue.min} years old`,
          probability: 100,
          action: 'Apply when eligible'
        });
      }
    }
  }
  
  return predictions;
}
```

---

## Phase 4-7: Continue Implementation

Due to length constraints, the remaining phases follow similar patterns:

**Phase 4:** Guided Applications (Weeks 8-9)
- Build step-by-step application manager
- Implement AI form guidance
- Create application tracking

**Phase 5:** CSC Operator Features (Weeks 10-11)
- Build operator dashboard
- Implement multi-user management
- Add performance analytics

**Phase 6:** Testing & Optimization (Weeks 12-13)
- Load testing
- Voice accuracy testing
- Security audit

**Phase 7:** Deployment (Week 14)
- Production deployment
- Monitoring setup
- Launch

---

## Quick Start Commands

```bash
# 1. Install dependencies
cd backend && npm install
cd frontend && npm install

# 2. Deploy infrastructure
cd backend/cloudformation
./deploy-all-stacks.sh dev

# 3. Run tests
cd backend && npm test
cd frontend && npm test

# 4. Start development
cd frontend && npm run dev
```

