/**
 * Universal Question Bank for Adaptive Profiling
 * 20-25 questions total, but users answer only 10-12 based on their responses
 */

export interface Question {
  id: string;
  category: 'basic' | 'socioeconomic' | 'education' | 'employment' | 'agriculture' | 'housing' | 'documents';
  text: {
    en: string;
    hi: string;
  };
  type: 'number' | 'select' | 'boolean' | 'text';
  options?: Array<{ value: string; label: { en: string; hi: string } }>;
  required: boolean;
  conditional?: {
    dependsOn: string;
    values: any[];
  };
  fieldName: string;
  helpText?: {
    en: string;
    hi: string;
  };
}

export const QUESTION_BANK: Question[] = [
  // BASIC IDENTITY (Always asked)
  {
    id: 'q1',
    category: 'basic',
    fieldName: 'age',
    text: {
      en: 'What is your age?',
      hi: 'आपकी उम्र क्या है?'
    },
    type: 'number',
    required: true,
    helpText: {
      en: 'Enter your age in years',
      hi: 'अपनी उम्र वर्षों में दर्ज करें'
    }
  },
  {
    id: 'q2',
    category: 'basic',
    fieldName: 'gender',
    text: {
      en: 'What is your gender?',
      hi: 'आपका लिंग क्या है?'
    },
    type: 'select',
    required: true,
    options: [
      { value: 'Male', label: { en: 'Male', hi: 'पुरुष' } },
      { value: 'Female', label: { en: 'Female', hi: 'महिला' } },
      { value: 'Other', label: { en: 'Other', hi: 'अन्य' } }
    ]
  },
  {
    id: 'q3',
    category: 'basic',
    fieldName: 'state',
    text: {
      en: 'Which state do you live in?',
      hi: 'आप किस राज्य में रहते हैं?'
    },
    type: 'select',
    required: true,
    options: [
      { value: 'Andhra Pradesh', label: { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश' } },
      { value: 'Bihar', label: { en: 'Bihar', hi: 'बिहार' } },
      { value: 'Delhi', label: { en: 'Delhi', hi: 'दिल्ली' } },
      { value: 'Gujarat', label: { en: 'Gujarat', hi: 'गुजरात' } },
      { value: 'Karnataka', label: { en: 'Karnataka', hi: 'कर्नाटक' } },
      { value: 'Kerala', label: { en: 'Kerala', hi: 'केरल' } },
      { value: 'Maharashtra', label: { en: 'Maharashtra', hi: 'महाराष्ट्र' } },
      { value: 'Tamil Nadu', label: { en: 'Tamil Nadu', hi: 'तमिलनाडु' } },
      { value: 'Uttar Pradesh', label: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश' } },
      { value: 'West Bengal', label: { en: 'West Bengal', hi: 'पश्चिम बंगाल' } }
    ]
  },
  {
    id: 'q4',
    category: 'basic',
    fieldName: 'residenceType',
    text: {
      en: 'Do you live in a rural or urban area?',
      hi: 'क्या आप ग्रामीण या शहरी क्षेत्र में रहते हैं?'
    },
    type: 'select',
    required: true,
    options: [
      { value: 'Rural', label: { en: 'Rural', hi: 'ग्रामीण' } },
      { value: 'Urban', label: { en: 'Urban', hi: 'शहरी' } }
    ]
  },

  // SOCIOECONOMIC (Always asked)
  {
    id: 'q5',
    category: 'socioeconomic',
    fieldName: 'annualIncome',
    text: {
      en: 'What is your annual family income?',
      hi: 'आपकी वार्षिक पारिवारिक आय क्या है?'
    },
    type: 'number',
    required: true,
    helpText: {
      en: 'Enter total family income per year in rupees',
      hi: 'रुपये में प्रति वर्ष कुल पारिवारिक आय दर्ज करें'
    }
  },
  {
    id: 'q6',
    category: 'socioeconomic',
    fieldName: 'socialCategory',
    text: {
      en: 'What is your social category?',
      hi: 'आपकी सामाजिक श्रेणी क्या है?'
    },
    type: 'select',
    required: true,
    options: [
      { value: 'General', label: { en: 'General', hi: 'सामान्य' } },
      { value: 'OBC', label: { en: 'OBC', hi: 'ओबीसी' } },
      { value: 'SC', label: { en: 'SC', hi: 'अनुसूचित जाति' } },
      { value: 'ST', label: { en: 'ST', hi: 'अनुसूचित जनजाति' } },
      { value: 'EWS', label: { en: 'EWS', hi: 'ईडब्ल्यूएस' } }
    ]
  },
  {
    id: 'q7',
    category: 'socioeconomic',
    fieldName: 'hasDisability',
    text: {
      en: 'Do you have any disability (40% or more)?',
      hi: 'क्या आपको कोई विकलांगता है (40% या अधिक)?'
    },
    type: 'boolean',
    required: false
  },
  {
    id: 'q8',
    category: 'socioeconomic',
    fieldName: 'hasBPLCard',
    text: {
      en: 'Do you have a BPL (Below Poverty Line) card?',
      hi: 'क्या आपके पास बीपीएल (गरीबी रेखा से नीचे) कार्ड है?'
    },
    type: 'boolean',
    required: false
  },

  // EMPLOYMENT (Always asked)
  {
    id: 'q9',
    category: 'employment',
    fieldName: 'occupation',
    text: {
      en: 'What is your occupation?',
      hi: 'आपका पेशा क्या है?'
    },
    type: 'select',
    required: true,
    options: [
      { value: 'Farmer', label: { en: 'Farmer', hi: 'किसान' } },
      { value: 'Student', label: { en: 'Student', hi: 'छात्र' } },
      { value: 'Worker', label: { en: 'Worker/Laborer', hi: 'मजदूर' } },
      { value: 'Business', label: { en: 'Business Owner', hi: 'व्यवसायी' } },
      { value: 'Salaried', label: { en: 'Salaried Employee', hi: 'वेतनभोगी' } },
      { value: 'Self-Employed', label: { en: 'Self-Employed', hi: 'स्व-रोजगार' } },
      { value: 'Unemployed', label: { en: 'Unemployed', hi: 'बेरोजगार' } },
      { value: 'Retired', label: { en: 'Retired', hi: 'सेवानिवृत्त' } }
    ]
  },

  // AGRICULTURE (Conditional - only if occupation = Farmer)
  {
    id: 'q10',
    category: 'agriculture',
    fieldName: 'ownsLand',
    text: {
      en: 'Do you own agricultural land?',
      hi: 'क्या आपके पास कृषि भूमि है?'
    },
    type: 'boolean',
    required: true,
    conditional: {
      dependsOn: 'occupation',
      values: ['Farmer']
    }
  },
  {
    id: 'q11',
    category: 'agriculture',
    fieldName: 'landSize',
    text: {
      en: 'How much land do you own (in acres)?',
      hi: 'आपके पास कितनी जमीन है (एकड़ में)?'
    },
    type: 'number',
    required: false,
    conditional: {
      dependsOn: 'ownsLand',
      values: [true]
    },
    helpText: {
      en: 'Enter land size in acres (e.g., 2.5)',
      hi: 'एकड़ में भूमि का आकार दर्ज करें (उदाहरण: 2.5)'
    }
  },
  {
    id: 'q12',
    category: 'agriculture',
    fieldName: 'cropType',
    text: {
      en: 'What type of crops do you grow?',
      hi: 'आप किस प्रकार की फसलें उगाते हैं?'
    },
    type: 'select',
    required: false,
    conditional: {
      dependsOn: 'ownsLand',
      values: [true]
    },
    options: [
      { value: 'Paddy', label: { en: 'Paddy/Rice', hi: 'धान/चावल' } },
      { value: 'Wheat', label: { en: 'Wheat', hi: 'गेहूं' } },
      { value: 'Cotton', label: { en: 'Cotton', hi: 'कपास' } },
      { value: 'Sugarcane', label: { en: 'Sugarcane', hi: 'गन्ना' } },
      { value: 'Vegetables', label: { en: 'Vegetables', hi: 'सब्जियां' } },
      { value: 'Mixed', label: { en: 'Mixed Crops', hi: 'मिश्रित फसलें' } }
    ]
  },
  {
    id: 'q13',
    category: 'agriculture',
    fieldName: 'hasIrrigation',
    text: {
      en: 'Do you have irrigation facilities?',
      hi: 'क्या आपके पास सिंचाई की सुविधा है?'
    },
    type: 'boolean',
    required: false,
    conditional: {
      dependsOn: 'ownsLand',
      values: [true]
    }
  },

  // EDUCATION (Conditional - only if occupation = Student)
  {
    id: 'q14',
    category: 'education',
    fieldName: 'educationLevel',
    text: {
      en: 'What is your current education level?',
      hi: 'आपका वर्तमान शिक्षा स्तर क्या है?'
    },
    type: 'select',
    required: true,
    conditional: {
      dependsOn: 'occupation',
      values: ['Student']
    },
    options: [
      { value: '10th', label: { en: 'Class 10th', hi: 'कक्षा 10वीं' } },
      { value: '12th', label: { en: 'Class 12th', hi: 'कक्षा 12वीं' } },
      { value: 'Graduate', label: { en: 'Graduate', hi: 'स्नातक' } },
      { value: 'Postgraduate', label: { en: 'Postgraduate', hi: 'स्नातकोत्तर' } },
      { value: 'Diploma', label: { en: 'Diploma', hi: 'डिप्लोमा' } }
    ]
  },
  {
    id: 'q15',
    category: 'education',
    fieldName: 'institutionType',
    text: {
      en: 'Is your institution government or private?',
      hi: 'क्या आपका संस्थान सरकारी या निजी है?'
    },
    type: 'select',
    required: true,
    conditional: {
      dependsOn: 'occupation',
      values: ['Student']
    },
    options: [
      { value: 'Government', label: { en: 'Government', hi: 'सरकारी' } },
      { value: 'Private', label: { en: 'Private', hi: 'निजी' } }
    ]
  },

  // BUSINESS (Conditional - only if occupation = Business)
  {
    id: 'q16',
    category: 'employment',
    fieldName: 'businessType',
    text: {
      en: 'What type of business do you own?',
      hi: 'आपका व्यवसाय किस प्रकार का है?'
    },
    type: 'select',
    required: false,
    conditional: {
      dependsOn: 'occupation',
      values: ['Business']
    },
    options: [
      { value: 'Retail', label: { en: 'Retail Shop', hi: 'खुदरा दुकान' } },
      { value: 'Manufacturing', label: { en: 'Manufacturing', hi: 'विनिर्माण' } },
      { value: 'Services', label: { en: 'Services', hi: 'सेवाएं' } },
      { value: 'Trading', label: { en: 'Trading', hi: 'व्यापार' } }
    ]
  },

  // HOUSING
  {
    id: 'q17',
    category: 'housing',
    fieldName: 'ownsHouse',
    text: {
      en: 'Do you own a house?',
      hi: 'क्या आपके पास घर है?'
    },
    type: 'boolean',
    required: false
  },
  {
    id: 'q18',
    category: 'housing',
    fieldName: 'houseType',
    text: {
      en: 'What type of house do you live in?',
      hi: 'आप किस प्रकार के घर में रहते हैं?'
    },
    type: 'select',
    required: false,
    options: [
      { value: 'Pucca', label: { en: 'Pucca (Permanent)', hi: 'पक्का (स्थायी)' } },
      { value: 'Semi-Pucca', label: { en: 'Semi-Pucca', hi: 'अर्ध-पक्का' } },
      { value: 'Kutcha', label: { en: 'Kutcha (Temporary)', hi: 'कच्चा (अस्थायी)' } }
    ]
  },

  // DOCUMENTS
  {
    id: 'q19',
    category: 'documents',
    fieldName: 'hasAadhaar',
    text: {
      en: 'Do you have an Aadhaar card?',
      hi: 'क्या आपके पास आधार कार्ड है?'
    },
    type: 'boolean',
    required: true
  },
  {
    id: 'q20',
    category: 'documents',
    fieldName: 'hasBankAccount',
    text: {
      en: 'Do you have a bank account?',
      hi: 'क्या आपके पास बैंक खाता है?'
    },
    type: 'boolean',
    required: true
  },
  {
    id: 'q21',
    category: 'documents',
    fieldName: 'isBankLinked',
    text: {
      en: 'Is your bank account linked with Aadhaar?',
      hi: 'क्या आपका बैंक खाता आधार से जुड़ा है?'
    },
    type: 'boolean',
    required: false,
    conditional: {
      dependsOn: 'hasBankAccount',
      values: [true]
    }
  },
  {
    id: 'q22',
    category: 'documents',
    fieldName: 'hasMobile',
    text: {
      en: 'Do you have a mobile number?',
      hi: 'क्या आपके पास मोबाइल नंबर है?'
    },
    type: 'boolean',
    required: true
  },

  // ADDITIONAL (Conditional based on age/gender)
  {
    id: 'q23',
    category: 'socioeconomic',
    fieldName: 'isWidow',
    text: {
      en: 'Are you a widow?',
      hi: 'क्या आप विधवा हैं?'
    },
    type: 'boolean',
    required: false,
    conditional: {
      dependsOn: 'gender',
      values: ['Female']
    }
  },
  {
    id: 'q24',
    category: 'socioeconomic',
    fieldName: 'isMinority',
    text: {
      en: 'Do you belong to a minority community?',
      hi: 'क्या आप अल्पसंख्यक समुदाय से हैं?'
    },
    type: 'boolean',
    required: false
  },
  {
    id: 'q25',
    category: 'education',
    fieldName: 'highestQualification',
    text: {
      en: 'What is your highest educational qualification?',
      hi: 'आपकी उच्चतम शैक्षिक योग्यता क्या है?'
    },
    type: 'select',
    required: false,
    conditional: {
      dependsOn: 'occupation',
      values: ['Worker', 'Business', 'Salaried', 'Self-Employed', 'Unemployed', 'Retired']
    },
    options: [
      { value: 'Below 10th', label: { en: 'Below 10th', hi: '10वीं से कम' } },
      { value: '10th Pass', label: { en: '10th Pass', hi: '10वीं पास' } },
      { value: '12th Pass', label: { en: '12th Pass', hi: '12वीं पास' } },
      { value: 'Graduate', label: { en: 'Graduate', hi: 'स्नातक' } },
      { value: 'Postgraduate', label: { en: 'Postgraduate', hi: 'स्नातकोत्तर' } }
    ]
  }
];

/**
 * Get questions to ask based on previous answers
 */
export function getNextQuestions(answers: Record<string, any>): Question[] {
  const questionsToAsk: Question[] = [];

  for (const question of QUESTION_BANK) {
    // Check if question has already been answered
    if (answers[question.fieldName] !== undefined) {
      continue;
    }

    // Check if question is conditional
    if (question.conditional) {
      const { dependsOn, values } = question.conditional;
      const dependentValue = answers[dependsOn];
      
      // Skip if dependent question not answered yet
      if (dependentValue === undefined) {
        continue;
      }

      // Skip if dependent value doesn't match required values
      if (!values.includes(dependentValue)) {
        continue;
      }
    }

    questionsToAsk.push(question);
  }

  return questionsToAsk;
}

/**
 * Get all required questions that must be asked
 */
export function getRequiredQuestions(): Question[] {
  return QUESTION_BANK.filter(q => q.required && !q.conditional);
}

/**
 * Check if profile is complete enough for eligibility check
 */
export function isProfileComplete(answers: Record<string, any>): boolean {
  const requiredQuestions = getRequiredQuestions();
  return requiredQuestions.every(q => answers[q.fieldName] !== undefined);
}

/**
 * Get progress percentage
 */
export function getProgress(answers: Record<string, any>): number {
  const totalRequired = getRequiredQuestions().length;
  const answered = getRequiredQuestions().filter(q => answers[q.fieldName] !== undefined).length;
  return Math.round((answered / totalRequired) * 100);
}

export default QUESTION_BANK;
