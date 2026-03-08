/**
 * Demo Profiles for Quick Testing
 * One-click profiles for hackathon demonstration
 */

export interface DemoProfile {
  id: string;
  name: string;
  emoji: string;
  description: {
    en: string;
    hi: string;
  };
  profile: {
    age: number;
    state: string;
    occupation: string;
    annualIncome: number;
    gender: string;
    socialCategory: string;
    residenceType?: string;
    hasDisability?: boolean;
    ownsLand?: boolean;
    landSize?: number;
    educationLevel?: string;
    institutionType?: string;
    documents?: string[];
  };
  expectedSchemes: string[];
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'farmer',
    name: 'Ramesh Kumar',
    emoji: '🌾',
    description: {
      en: 'Small farmer from Maharashtra with 2.5 acres of land',
      hi: 'महाराष्ट्र से 2.5 एकड़ जमीन वाले छोटे किसान'
    },
    profile: {
      age: 45,
      state: 'Maharashtra',
      occupation: 'Farmer',
      annualIncome: 150000,
      gender: 'Male',
      socialCategory: 'OBC',
      residenceType: 'Rural',
      ownsLand: true,
      landSize: 2.5,
      documents: ['aadhaar', 'bank_account', 'land_records']
    },
    expectedSchemes: ['pm-kisan', 'pm-fasal-bima', 'kisan-credit-card', 'pmay-gramin']
  },
  {
    id: 'student',
    name: 'Priya Sharma',
    emoji: '📚',
    description: {
      en: 'SC category student pursuing graduation in government college',
      hi: 'सरकारी कॉलेज में स्नातक की पढ़ाई कर रही SC श्रेणी की छात्रा'
    },
    profile: {
      age: 20,
      state: 'Delhi',
      occupation: 'Student',
      annualIncome: 80000,
      gender: 'Female',
      socialCategory: 'SC',
      residenceType: 'Urban',
      educationLevel: 'Graduate',
      institutionType: 'Government',
      documents: ['aadhaar', 'caste_certificate', 'admission_proof']
    },
    expectedSchemes: ['scholarship-sc-st', 'mid-day-meal', 'beti-bachao-beti-padhao']
  },
  {
    id: 'senior',
    name: 'Lakshmi Devi',
    emoji: '👵',
    description: {
      en: 'Senior citizen widow from Tamil Nadu, below poverty line',
      hi: 'तमिलनाडु से गरीबी रेखा से नीचे की वरिष्ठ नागरिक विधवा'
    },
    profile: {
      age: 65,
      state: 'Tamil Nadu',
      occupation: 'Other',
      annualIncome: 50000,
      gender: 'Female',
      socialCategory: 'General',
      residenceType: 'Rural',
      documents: ['aadhaar', 'age_proof', 'income_certificate', 'husband_death_certificate']
    },
    expectedSchemes: ['nsap-old-age', 'nsap-widow', 'ayushman-bharat', 'ujjwala']
  },
  {
    id: 'entrepreneur',
    name: 'Arjun Patel',
    emoji: '💼',
    description: {
      en: 'Young entrepreneur from Gujarat looking to start a business',
      hi: 'गुजरात से व्यवसाय शुरू करने की इच्छा रखने वाले युवा उद्यमी'
    },
    profile: {
      age: 32,
      state: 'Gujarat',
      occupation: 'Self-Employed',
      annualIncome: 400000,
      gender: 'Male',
      socialCategory: 'General',
      residenceType: 'Urban',
      documents: ['aadhaar', 'business_registration', 'bank_account']
    },
    expectedSchemes: ['pmkvy', 'pmjdy', 'pmjjby', 'pmsby']
  },
  {
    id: 'woman-farmer',
    name: 'Savitri Bai',
    emoji: '👩‍🌾',
    description: {
      en: 'Woman farmer from Uttar Pradesh, ST category',
      hi: 'उत्तर प्रदेश से ST श्रेणी की महिला किसान'
    },
    profile: {
      age: 38,
      state: 'Uttar Pradesh',
      occupation: 'Farmer',
      annualIncome: 120000,
      gender: 'Female',
      socialCategory: 'ST',
      residenceType: 'Rural',
      ownsLand: true,
      landSize: 1.5,
      documents: ['aadhaar', 'bank_account', 'caste_certificate']
    },
    expectedSchemes: ['pm-kisan', 'stand-up-india', 'ujjwala', 'pmay-gramin']
  },
  {
    id: 'disabled',
    name: 'Rajesh Singh',
    emoji: '♿',
    description: {
      en: 'Person with 40% disability from Bihar, looking for support',
      hi: 'बिहार से 40% विकलांगता वाले व्यक्ति, सहायता की तलाश में'
    },
    profile: {
      age: 42,
      state: 'Bihar',
      occupation: 'Unemployed',
      annualIncome: 60000,
      gender: 'Male',
      socialCategory: 'OBC',
      residenceType: 'Rural',
      hasDisability: true,
      documents: ['aadhaar', 'disability_certificate', 'income_certificate']
    },
    expectedSchemes: ['nsap-disability', 'ayushman-bharat', 'pmkvy']
  }
];

export function getDemoProfile(id: string): DemoProfile | undefined {
  return DEMO_PROFILES.find(p => p.id === id);
}

export default DEMO_PROFILES;
