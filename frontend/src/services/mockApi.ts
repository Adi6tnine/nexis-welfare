/**
 * Mock API Service
 * Provides mock responses for all API endpoints when backend is not available
 */

import { ALL_SCHEMES_COMBINED as ALL_SCHEMES, type Scheme } from '../data/schemes';

// Check if we should use mock mode
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Mock delay to simulate network latency
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Voice Services
export const mockVoiceApi = {
  async transcribe(audioData: string, language: string, sessionId: string, userId: string) {
    await mockDelay(800);
    
    const mockTranscripts: { [key: string]: string } = {
      'hi-IN': 'Mera naam Ramesh Kumar hai. Main kisan hoon. Meri umar 45 saal hai.',
      'en-IN': 'My name is Ramesh Kumar. I am a farmer. I am 45 years old.'
    };

    return {
      success: true,
      data: {
        text: mockTranscripts[language] || mockTranscripts['en-IN'],
        transcript: mockTranscripts[language] || mockTranscripts['en-IN'],
        confidence: 0.95,
        language,
        duration: 3.5
      }
    };
  },

  async synthesize(text: string, language: string, sessionId: string) {
    await mockDelay(300);
    
    // Generate a valid silent audio data URL (1 second of silence in WAV format)
    const silentAudio = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    
    return {
      success: true,
      data: {
        audioUrl: silentAudio,
        duration: 2.5,
        language
      }
    };
  },

  async conversation(sessionId: string, userInput: string, language: string) {
    await mockDelay(1000);
    
    // Simple conversation flow
    const responses: { [key: string]: any } = {
      'default': {
        response: language === 'hi' 
          ? 'Dhanyavaad! Aapki umar kya hai?'
          : 'Thank you! What is your age?',
        extractedData: { name: userInput },
        progress: 20,
        isComplete: false,
        collectedData: { name: userInput }
      },
      'age': {
        response: language === 'hi'
          ? 'Samjha. Aap kahan rehte hain? Kaun sa rajya?'
          : 'I understand. Where do you live? Which state?',
        extractedData: { age: parseInt(userInput) || 45 },
        progress: 40,
        isComplete: false,
        collectedData: { age: parseInt(userInput) || 45 }
      },
      'complete': {
        response: language === 'hi'
          ? 'Bahut achha! Aapki profile tayyar hai. Ab hum aapke liye yojanaon ki jaanch karenge.'
          : 'Great! Your profile is ready. Now we will check schemes for you.',
        extractedData: {},
        progress: 100,
        isComplete: true,
        collectedData: {
          name: 'Ramesh Kumar',
          age: 45,
          state: 'Maharashtra',
          occupation: 'Farmer'
        }
      }
    };

    // Determine response based on input
    let responseKey = 'default';
    if (userInput.match(/\d+/)) responseKey = 'age';
    if (userInput.toLowerCase().includes('maharashtra') || userInput.toLowerCase().includes('state')) {
      responseKey = 'complete';
    }

    return {
      success: true,
      data: responses[responseKey]
    };
  }
};

// Mock Document Services
export const mockDocumentApi = {
  async ocr(userId: string, documentType: string, imageData: string) {
    await mockDelay(1500);

    const mockData: { [key: string]: any } = {
      'aadhaar': {
        documentId: `doc-${Date.now()}`,
        documentType: 'aadhaar',
        extractedData: {
          name: 'RAMESH KUMAR',
          aadhaarNumber: '1234 5678 9012',
          dateOfBirth: '15/08/1978',
          gender: 'Male',
          address: 'Village Rampur, District Pune, Maharashtra - 411001'
        },
        confidence: 0.94,
        validationStatus: 'valid',
        validationResults: [
          { field: 'aadhaarNumber', status: 'valid', message: 'Valid Aadhaar format' },
          { field: 'dateOfBirth', status: 'valid', message: 'Valid date format' }
        ]
      },
      'pan': {
        documentId: `doc-${Date.now()}`,
        documentType: 'pan',
        extractedData: {
          name: 'RAMESH KUMAR',
          panNumber: 'ABCDE1234F',
          dateOfBirth: '15/08/1978',
          fatherName: 'SURESH KUMAR'
        },
        confidence: 0.92,
        validationStatus: 'valid',
        validationResults: [
          { field: 'panNumber', status: 'valid', message: 'Valid PAN format' }
        ]
      },
      'income': {
        documentId: `doc-${Date.now()}`,
        documentType: 'income',
        extractedData: {
          name: 'Ramesh Kumar',
          annualIncome: '₹2,50,000',
          financialYear: '2025-26',
          issuedBy: 'Tehsildar, Pune',
          issueDate: '01/01/2026'
        },
        confidence: 0.89,
        validationStatus: 'valid',
        validationResults: [
          { field: 'annualIncome', status: 'valid', message: 'Income within eligible range' }
        ]
      }
    };

    return {
      success: true,
      data: mockData[documentType] || mockData['aadhaar']
    };
  }
};

// Mock Application Services
export const mockApplicationApi = {
  async start(userId: string, schemeId: string) {
    await mockDelay(600);

    return {
      success: true,
      data: {
        applicationId: `app-${Date.now()}`,
        currentStep: {
          stepId: 'step-1',
          stepNumber: 1,
          title: 'Full Name',
          description: 'Enter your full name as per Aadhaar card',
          fieldType: 'text',
          fieldName: 'fullName',
          required: true,
          helpText: 'Name should match your Aadhaar card exactly',
          aiGuidance: 'Enter your complete legal name as it appears on your Aadhaar card. Include middle name if present. This ensures smooth verification.',
          prefilledValue: 'Ramesh Kumar'
        },
        progress: 10,
        prefilledFields: ['fullName']
      }
    };
  },

  async nextStep(applicationId: string, fieldValue: any) {
    await mockDelay(500);

    const steps = [
      {
        stepId: 'step-2',
        stepNumber: 2,
        title: 'Mobile Number',
        description: 'Enter your 10-digit mobile number',
        fieldType: 'text',
        fieldName: 'mobile',
        required: true,
        helpText: 'This number will be used for OTP verification',
        aiGuidance: 'Provide an active mobile number that you have access to. You will receive an OTP for verification shortly.'
      },
      {
        stepId: 'step-3',
        stepNumber: 3,
        title: 'Bank Account Number',
        description: 'Enter your bank account number',
        fieldType: 'text',
        fieldName: 'accountNumber',
        required: true,
        helpText: 'Benefits will be transferred to this account',
        aiGuidance: 'Double-check your account number carefully. Benefits will be directly transferred here. Ensure the account is active and in your name.'
      },
      {
        stepId: 'step-4',
        stepNumber: 4,
        title: 'IFSC Code',
        description: 'Enter your bank IFSC code',
        fieldType: 'text',
        fieldName: 'ifscCode',
        required: true,
        helpText: 'Find IFSC code on your cheque or passbook',
        aiGuidance: 'IFSC code is an 11-character code (e.g., SBIN0001234). You can find it on your cheque book, passbook, or bank statement.'
      }
    ];

    const randomStep = steps[Math.floor(Math.random() * steps.length)];
    const isComplete = Math.random() > 0.6; // 40% chance to complete

    if (isComplete) {
      return {
        success: true,
        data: {
          status: 'complete',
          progress: 100
        }
      };
    }

    return {
      success: true,
      data: {
        currentStep: randomStep,
        progress: 30 + (randomStep.stepNumber * 20)
      }
    };
  },

  async submit(applicationId: string) {
    await mockDelay(1000);

    return {
      success: true,
      data: {
        trackingNumber: `TRK${Date.now()}`,
        status: 'submitted',
        message: 'Application submitted successfully'
      }
    };
  }
};

// Mock CSC Services
export const mockCSCApi = {
  async login(email: string, password: string, cscId?: string) {
    await mockDelay(800);

    return {
      success: true,
      data: {
        sessionId: `sess-${Date.now()}`,
        operator: {
          operatorId: `op-${Date.now()}`,
          cscId: cscId || 'CSC-MH-001',
          name: 'Mock Operator',
          email,
          phone: '+91-9876543210',
          state: 'Maharashtra',
          district: 'Mumbai',
          permissions: ['create_profile', 'view_schemes', 'submit_application', 'track_application'],
          stats: {
            totalApplications: 45,
            totalUsers: 32,
            successRate: 87.5
          }
        },
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
      }
    };
  },

  async verify(sessionId: string) {
    await mockDelay(300);

    return {
      success: true,
      data: {
        valid: true,
        operator: {
          operatorId: 'op-mock-123',
          cscId: 'CSC-MH-001',
          name: 'Mock Operator',
          email: 'operator@csc.gov.in',
          permissions: ['create_profile', 'view_schemes', 'submit_application', 'track_application'],
          stats: {
            totalApplications: 45,
            totalUsers: 32,
            successRate: 87.5
          }
        }
      }
    };
  }
};

// Mock Alert Services
export const mockAlertApi = {
  async getUserAlerts(userId: string, unreadOnly: boolean = false) {
    await mockDelay(400);

    const allAlerts = [
      {
        alertId: 'alert-1',
        userId,
        type: 'new_scheme',
        priority: 'high',
        title: 'New Scheme: PM Kisan Samman Nidhi',
        message: 'A new scheme "PM Kisan Samman Nidhi" has been launched and you are eligible!',
        schemeId: 'pm-kisan',
        schemeName: 'PM Kisan Samman Nidhi',
        actionUrl: '/schemes/pm-kisan',
        actionText: 'View Details',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false
      },
      {
        alertId: 'alert-2',
        userId,
        type: 'deadline_reminder',
        priority: 'high',
        title: 'Application Deadline Approaching',
        message: 'Your application for "Pradhan Mantri Awas Yojana" is due in 3 days!',
        schemeId: 'pmay',
        schemeName: 'Pradhan Mantri Awas Yojana',
        actionUrl: '/applications/app-123',
        actionText: 'Complete Application',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: false
      },
      {
        alertId: 'alert-3',
        userId,
        type: 'status_update',
        priority: 'medium',
        title: 'Application Status Updated',
        message: 'Your application for "Ayushman Bharat" has been approved!',
        schemeId: 'ayushman-bharat',
        schemeName: 'Ayushman Bharat',
        actionUrl: '/applications/app-456',
        actionText: 'View Status',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        read: true
      }
    ];

    const filteredAlerts = unreadOnly ? allAlerts.filter(a => !a.read) : allAlerts;

    return {
      success: true,
      data: {
        alerts: filteredAlerts,
        unreadCount: allAlerts.filter(a => !a.read).length,
        totalCount: allAlerts.length
      }
    };
  },

  async markRead(alertId: string, userId: string) {
    await mockDelay(200);

    return {
      success: true,
      data: { message: 'Alert marked as read' }
    };
  },

  async dismiss(alertId: string) {
    await mockDelay(200);

    return {
      success: true,
      data: { message: 'Alert dismissed' }
    };
  }
};

// Mock Eligibility with enhanced data using V2 engine format
export const mockEligibilityApi = {
  async check(profile: any) {
    await mockDelay(1200);

    const eligible: any[] = [];
    const potential: any[] = [];
    const ineligible: any[] = [];
    const timeline: any[] = [];

    // Check each scheme against profile
    ALL_SCHEMES.forEach(scheme => {
      const result = evaluateSchemeEligibility(scheme, profile);
      
      if (result.status === 'Eligible') {
        eligible.push(result);
      } else if (result.status === 'Potentially Eligible') {
        potential.push(result);
      } else {
        ineligible.push(result);
        
        // Add to timeline if will become eligible in future
        if (result.futureEligibility) {
          timeline.push(result.futureEligibility);
        }
      }
    });

    // Sort by match score
    eligible.sort((a, b) => b.matchScore - a.matchScore);
    potential.sort((a, b) => b.matchScore - a.matchScore);

    return {
      success: true,
      data: {
        eligible,
        potential,
        ineligible,
        timeline,
        summary: {
          totalSchemes: ALL_SCHEMES.length,
          eligibleCount: eligible.length,
          potentialCount: potential.length,
          ineligibleCount: ineligible.length
        }
      }
    };
  }
};

// Helper function to evaluate scheme eligibility
function evaluateSchemeEligibility(scheme: Scheme, profile: any) {
  const satisfiedCriteria: any[] = [];
  const unsatisfiedCriteria: any[] = [];
  const missingData: any[] = [];
  let matchScore = 100;
  let futureEligibility = null;

  const rules = scheme.eligibilityRules;
  
  // Check age
  if (rules.ageMin !== undefined || rules.ageMax !== undefined) {
    if (!profile.age) {
      missingData.push({
        field: 'age',
        importance: 'Critical',
        message: 'Age information is required'
      });
      matchScore -= 20;
    } else {
      if (rules.ageMin && profile.age < rules.ageMin) {
        const gap = rules.ageMin - profile.age;
        unsatisfiedCriteria.push({
          criterion: 'age',
          currentValue: profile.age,
          requiredValue: { min: rules.ageMin },
          gap: `${gap} years`,
          message: `Age must be at least ${rules.ageMin} years (current: ${profile.age})`,
          fixable: true,
          howToFix: `Wait ${gap} years to become eligible`
        });
        matchScore -= 30;
        
        // Add to future timeline
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + gap);
        futureEligibility = {
          schemeId: scheme.schemeId,
          schemeName: scheme.schemeName,
          date: futureDate.toISOString(),
          event: `You will turn ${rules.ageMin} years old`,
          probability: 100,
          action: 'Apply when eligible'
        };
      } else if (rules.ageMax && profile.age > rules.ageMax) {
        unsatisfiedCriteria.push({
          criterion: 'age',
          currentValue: profile.age,
          requiredValue: { max: rules.ageMax },
          gap: `${profile.age - rules.ageMax} years over`,
          message: `Age must be at most ${rules.ageMax} years (current: ${profile.age})`,
          fixable: false
        });
        matchScore -= 40;
      } else {
        satisfiedCriteria.push({
          criterion: 'age',
          value: profile.age,
          requirement: { min: rules.ageMin, max: rules.ageMax },
          message: 'Age is within required range'
        });
      }
    }
  }

  // Check income
  if (rules.incomeMax !== undefined) {
    if (!profile.annualIncome) {
      missingData.push({
        field: 'annualIncome',
        importance: 'Critical',
        message: 'Annual income information is required'
      });
      matchScore -= 20;
    } else {
      if (profile.annualIncome > rules.incomeMax) {
        unsatisfiedCriteria.push({
          criterion: 'income',
          currentValue: profile.annualIncome,
          requiredValue: rules.incomeMax,
          gap: `₹${(profile.annualIncome - rules.incomeMax).toLocaleString('en-IN')} over`,
          message: `Annual income must be at most ₹${rules.incomeMax.toLocaleString('en-IN')} (current: ₹${profile.annualIncome.toLocaleString('en-IN')})`,
          fixable: false
        });
        matchScore -= 35;
      } else {
        satisfiedCriteria.push({
          criterion: 'income',
          value: profile.annualIncome,
          requirement: rules.incomeMax,
          message: `Annual income ₹${profile.annualIncome.toLocaleString('en-IN')} is within limit (₹${rules.incomeMax.toLocaleString('en-IN')})`
        });
      }
    }
  }

  // Check occupation
  if (rules.occupations && rules.occupations.length > 0) {
    if (!profile.occupation) {
      missingData.push({
        field: 'occupation',
        importance: 'Critical',
        message: 'Occupation information is required'
      });
      matchScore -= 15;
    } else if (!rules.occupations.includes(profile.occupation)) {
      unsatisfiedCriteria.push({
        criterion: 'occupation',
        currentValue: profile.occupation,
        requiredValue: rules.occupations,
        gap: 'Not matching',
        message: `Occupation must be one of: ${rules.occupations.join(', ')} (current: ${profile.occupation})`,
        fixable: false
      });
      matchScore -= 40;
    } else {
      satisfiedCriteria.push({
        criterion: 'occupation',
        value: profile.occupation,
        requirement: rules.occupations,
        message: 'Occupation matches requirement'
      });
    }
  }

  // Check gender
  if (rules.gender && rules.gender.length > 0) {
    if (!profile.gender) {
      missingData.push({
        field: 'gender',
        importance: 'Important',
        message: 'Gender information is required'
      });
      matchScore -= 10;
    } else if (!rules.gender.includes(profile.gender)) {
      unsatisfiedCriteria.push({
        criterion: 'gender',
        currentValue: profile.gender,
        requiredValue: rules.gender,
        gap: 'Not matching',
        message: `This scheme is only for: ${rules.gender.join(', ')}`,
        fixable: false
      });
      matchScore -= 50;
    } else {
      satisfiedCriteria.push({
        criterion: 'gender',
        value: profile.gender,
        requirement: rules.gender,
        message: 'Gender requirement satisfied'
      });
    }
  }

  // Check social category
  if (rules.socialCategories && rules.socialCategories.length > 0) {
    if (!profile.socialCategory) {
      missingData.push({
        field: 'socialCategory',
        importance: 'Important',
        message: 'Social category information is required'
      });
      matchScore -= 15;
    } else if (!rules.socialCategories.includes(profile.socialCategory)) {
      unsatisfiedCriteria.push({
        criterion: 'socialCategory',
        currentValue: profile.socialCategory,
        requiredValue: rules.socialCategories,
        gap: 'Not matching',
        message: `Available for: ${rules.socialCategories.join(', ')} (current: ${profile.socialCategory})`,
        fixable: false
      });
      matchScore -= 30;
    } else {
      satisfiedCriteria.push({
        criterion: 'socialCategory',
        value: profile.socialCategory,
        requirement: rules.socialCategories,
        message: `Available for your social category (${profile.socialCategory})`
      });
    }
  }

  // Check rural/urban
  if (rules.ruralOnly !== undefined) {
    if (profile.residenceType === undefined) {
      missingData.push({
        field: 'residenceType',
        importance: 'Important',
        message: 'Residence type (Rural/Urban) is required'
      });
      matchScore -= 10;
    } else {
      const isRural = profile.residenceType === 'Rural';
      if (rules.ruralOnly && !isRural) {
        unsatisfiedCriteria.push({
          criterion: 'residenceType',
          currentValue: profile.residenceType,
          requiredValue: 'Rural',
          gap: 'Not matching',
          message: 'This scheme is only for rural residents',
          fixable: false
        });
        matchScore -= 40;
      } else if (!rules.ruralOnly && isRural) {
        // Some schemes might be urban only
        satisfiedCriteria.push({
          criterion: 'residenceType',
          value: profile.residenceType,
          requirement: 'Any',
          message: 'Residence type matches'
        });
      } else {
        satisfiedCriteria.push({
          criterion: 'residenceType',
          value: profile.residenceType,
          requirement: rules.ruralOnly ? 'Rural' : 'Any',
          message: 'Residence type matches requirement'
        });
      }
    }
  }

  // Check documents
  rules.requiredDocuments.forEach(doc => {
    const hasDoc = profile.documents && profile.documents.includes(doc);
    if (!hasDoc) {
      missingData.push({
        field: doc,
        importance: 'Critical',
        message: `${doc.replace(/_/g, ' ')} document is required`
      });
      matchScore -= 5;
    } else {
      satisfiedCriteria.push({
        criterion: `document_${doc}`,
        value: true,
        requirement: true,
        message: `${doc.replace(/_/g, ' ')} document verified`
      });
    }
  });

  // Determine status
  let status: 'Eligible' | 'Potentially Eligible' | 'Not Eligible';
  let confidence: 'High' | 'Medium' | 'Low';

  if (unsatisfiedCriteria.length === 0 && missingData.length === 0) {
    status = 'Eligible';
    confidence = 'High';
  } else if (unsatisfiedCriteria.length === 0 && missingData.length > 0) {
    status = 'Potentially Eligible';
    confidence = missingData.length <= 2 ? 'Medium' : 'Low';
    matchScore = Math.max(matchScore, 60);
  } else if (unsatisfiedCriteria.filter(c => !c.fixable).length === 0) {
    status = 'Potentially Eligible';
    confidence = 'Low';
    matchScore = Math.max(matchScore, 40);
  } else {
    status = 'Not Eligible';
    confidence = 'High';
    matchScore = Math.max(matchScore, 0);
  }

  const recommendations: string[] = [];
  if (missingData.length > 0) {
    missingData.forEach(item => {
      recommendations.push(`Upload ${item.field.replace(/_/g, ' ')} to complete your profile`);
    });
  }
  if (unsatisfiedCriteria.filter(c => c.fixable).length > 0) {
    unsatisfiedCriteria.filter(c => c.fixable).forEach(item => {
      if (item.howToFix) {
        recommendations.push(item.howToFix);
      }
    });
  }

  return {
    schemeId: scheme.schemeId,
    schemeName: scheme.schemeName,
    status,
    matchScore: Math.round(matchScore),
    confidence,
    satisfiedCriteria,
    unsatisfiedCriteria,
    missingData,
    recommendations,
    alternativeSchemes: [],
    futureEligibility
  };
}

// Export mock fetch wrapper
export async function mockFetch(url: string, options: any = {}) {
  if (!USE_MOCK) {
    return fetch(url, options);
  }

  console.log('[MOCK API]', options.method || 'GET', url);

  const body = options.body ? JSON.parse(options.body) : {};
  const { action } = body;

  // Voice endpoints
  if (url.includes('/voice/transcribe')) {
    return { 
      ok: true,
      json: async () => mockVoiceApi.transcribe(body.audioData, body.language, body.sessionId, body.userId) 
    };
  }
  if (url.includes('/voice/synthesize')) {
    return { 
      ok: true,
      json: async () => mockVoiceApi.synthesize(body.text, body.language, body.sessionId) 
    };
  }
  if (url.includes('/voice/conversation')) {
    return { json: async () => mockVoiceApi.conversation(body.sessionId, body.userInput, body.language) };
  }

  // Document endpoints
  if (url.includes('/documents/ocr')) {
    return { json: async () => mockDocumentApi.ocr(body.userId, body.documentType, body.imageData) };
  }

  // Application endpoints
  if (url.includes('/applications/start') || action === 'start') {
    return { json: async () => mockApplicationApi.start(body.userId, body.schemeId) };
  }
  if (url.includes('/applications/next') || action === 'next_step') {
    return { json: async () => mockApplicationApi.nextStep(body.applicationId, body.fieldValue) };
  }
  if (url.includes('/applications/submit') || action === 'submit') {
    return { json: async () => mockApplicationApi.submit(body.applicationId) };
  }

  // CSC endpoints
  if (url.includes('/csc/login') || (url.includes('/csc') && action === 'login')) {
    return { json: async () => mockCSCApi.login(body.email, body.password, body.cscId) };
  }
  if (url.includes('/csc/verify') || action === 'verify_session') {
    return { json: async () => mockCSCApi.verify(body.sessionId) };
  }

  // Alert endpoints
  if (url.includes('/alerts/user') || action === 'get_user_alerts') {
    return { json: async () => mockAlertApi.getUserAlerts(body.userId, body.unreadOnly) };
  }
  if (url.includes('/alerts/mark-read') || action === 'mark_read') {
    return { json: async () => mockAlertApi.markRead(body.alertId, body.userId) };
  }
  if (url.includes('/alerts/dismiss') || action === 'dismiss_alert') {
    return { json: async () => mockAlertApi.dismiss(body.alertId) };
  }

  // Eligibility endpoints
  if (url.includes('/eligibility/check') || url.includes('/eligibility') && body.profile) {
    return { json: async () => mockEligibilityApi.check(body.profile) };
  }
  if (url.includes('/eligibility') && url.includes('/timeline')) {
    return { json: async () => mockEligibilityApi.check(body) };
  }

  // Default fallback
  return {
    json: async () => ({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Mock endpoint not implemented' }
    })
  };
}

export default {
  USE_MOCK,
  mockVoiceApi,
  mockDocumentApi,
  mockApplicationApi,
  mockCSCApi,
  mockAlertApi,
  mockEligibilityApi,
  mockFetch
};
