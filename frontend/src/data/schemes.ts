/**
 * Comprehensive Government Schemes Database
 * Contains all major central and state government schemes
 */

export interface Scheme {
  schemeId: string;
  schemeName: string;
  description: string;
  benefits: string;
  category: string;
  state: string;
  eligibilityRules: {
    ageMin?: number;
    ageMax?: number;
    incomeMax?: number;
    states?: string[];
    occupations?: string[];
    gender?: string[];
    socialCategories?: string[];
    ruralOnly?: boolean;
    requiresDisability?: boolean;
    requiredDocuments: string[];
  };
  applicationProcess: {
    steps: string[];
    estimatedTime: string;
    documentsRequired: string[];
  };
  contactInfo: {
    website: string;
    helpline: string;
    email: string;
  };
}

export const ALL_SCHEMES: Scheme[] = [
  // Agriculture & Farmers
  {
    schemeId: 'pm-kisan',
    schemeName: 'PM-KISAN Samman Nidhi',
    description: 'Income support to all farmer families across the country',
    benefits: '₹6,000 per year in three equal installments of ₹2,000 each',
    category: 'Agriculture',
    state: 'All India',
    eligibilityRules: {
      ageMin: 18,
      occupations: ['Farmer'],
      requiredDocuments: ['aadhaar', 'land_records', 'bank_account']
    },
    applicationProcess: {
      steps: ['Register on portal', 'Verify Aadhaar', 'Submit land records', 'Bank verification'],
      estimatedTime: '7-14 days',
      documentsRequired: ['Aadhaar', 'Land ownership proof', 'Bank account details']
    },
    contactInfo: {
      website: 'https://pmkisan.gov.in',
      helpline: '155261',
      email: 'pmkisan-ict@gov.in'
    }
  },
  {
    schemeId: 'pm-fasal-bima',
    schemeName: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme providing financial support to farmers in case of crop failure',
    benefits: 'Insurance coverage for crop loss due to natural calamities, pests & diseases',
    category: 'Agriculture',
    state: 'All India',
    eligibilityRules: {
      ageMin: 18,
      occupations: ['Farmer'],
      requiredDocuments: ['aadhaar', 'land_records', 'bank_account', 'sowing_certificate']
    },
    applicationProcess: {
      steps: ['Register with bank/CSC', 'Pay premium', 'Get insurance certificate', 'Claim in case of loss'],
      estimatedTime: '5-7 days',
      documentsRequired: ['Aadhaar', 'Land records', 'Bank account', 'Sowing certificate']
    },
    contactInfo: {
      website: 'https://pmfby.gov.in',
      helpline: '1800-180-1551',
      email: 'pmfby@gov.in'
    }
  },
  {
    schemeId: 'kisan-credit-card',
    schemeName: 'Kisan Credit Card (KCC)',
    description: 'Credit facility for farmers to meet agricultural expenses',
    benefits: 'Credit up to ₹3 lakh at 4% interest rate with timely repayment',
    category: 'Agriculture',
    state: 'All India',
    eligibilityRules: {
      ageMin: 18,
      ageMax: 75,
      occupations: ['Farmer'],
      requiredDocuments: ['aadhaar', 'land_records', 'bank_account']
    },
    applicationProcess: {
      steps: ['Apply at bank', 'Document verification', 'Credit assessment', 'Card issuance'],
      estimatedTime: '15-30 days',
      documentsRequired: ['Aadhaar', 'Land documents', 'Bank account']
    },
    contactInfo: {
      website: 'https://www.nabard.org/kcc',
      helpline: '1800-180-1111',
      email: 'kcc@nabard.org'
    }
  },

  // Housing
  {
    schemeId: 'pmay-urban',
    schemeName: 'Pradhan Mantri Awas Yojana - Urban',
    description: 'Housing for All - Urban areas',
    benefits: 'Interest subsidy up to ₹2.67 lakh on home loans',
    category: 'Housing',
    state: 'All India',
    eligibilityRules: {
      ageMin: 21,
      incomeMax: 1800000,
      ruralOnly: false,
      requiredDocuments: ['aadhaar', 'income_certificate', 'property_documents']
    },
    applicationProcess: {
      steps: ['Online application', 'Document verification', 'Loan sanction', 'Subsidy credit'],
      estimatedTime: '30-45 days',
      documentsRequired: ['Aadhaar', 'Income certificate', 'Property documents']
    },
    contactInfo: {
      website: 'https://pmaymis.gov.in',
      helpline: '1800-11-6163',
      email: 'pmay-urban@gov.in'
    }
  },
  {
    schemeId: 'pmay-gramin',
    schemeName: 'Pradhan Mantri Awas Yojana - Gramin',
    description: 'Housing for All - Rural areas',
    benefits: '₹1.2 lakh assistance for plain areas, ₹1.3 lakh for hilly areas',
    category: 'Housing',
    state: 'All India',
    eligibilityRules: {
      ageMin: 18,
      ruralOnly: true,
      requiredDocuments: ['aadhaar', 'bank_account', 'job_card']
    },
    applicationProcess: {
      steps: ['Apply through Gram Panchayat', 'Verification', 'Approval', 'Installment release'],
      estimatedTime: '30-60 days',
      documentsRequired: ['Aadhaar', 'Bank account', 'MGNREGA job card']
    },
    contactInfo: {
      website: 'https://pmayg.nic.in',
      helpline: '1800-11-6446',
      email: 'pmayg@gov.in'
    }
  },

  // Healthcare
  {
    schemeId: 'ayushman-bharat',
    schemeName: 'Ayushman Bharat PM-JAY',
    description: 'Health insurance for economically vulnerable families',
    benefits: 'Health cover of ₹5 lakh per family per year',
    category: 'Healthcare',
    state: 'All India',
    eligibilityRules: {
      incomeMax: 100000,
      socialCategories: ['SC', 'ST', 'OBC', 'General'],
      requiredDocuments: ['aadhaar', 'ration_card']
    },
    applicationProcess: {
      steps: ['Check eligibility', 'Get Ayushman card', 'Visit empanelled hospital'],
      estimatedTime: '1-2 days',
      documentsRequired: ['Aadhaar', 'Ration card']
    },
    contactInfo: {
      website: 'https://pmjay.gov.in',
      helpline: '14555',
      email: 'pmjay@nha.gov.in'
    }
  },
  {
    schemeId: 'janani-suraksha-yojana',
    schemeName: 'Janani Suraksha Yojana (JSY)',
    description: 'Safe motherhood intervention to reduce maternal and neonatal mortality',
    benefits: '₹1,400 for rural areas, ₹1,000 for urban areas for institutional delivery',
    category: 'Healthcare',
    state: 'All India',
    eligibilityRules: {
      gender: ['Female'],
      incomeMax: 120000,
      requiredDocuments: ['aadhaar', 'pregnancy_certificate', 'bank_account']
    },
    applicationProcess: {
      steps: ['Register at health center', 'Antenatal checkups', 'Institutional delivery', 'Cash benefit'],
      estimatedTime: 'During pregnancy',
      documentsRequired: ['Aadhaar', 'Pregnancy certificate', 'Bank account']
    },
    contactInfo: {
      website: 'https://nhm.gov.in/jsy',
      helpline: '104',
      email: 'jsy@nhm.gov.in'
    }
  },

  // Education
  {
    schemeId: 'scholarship-sc-st',
    schemeName: 'Post Matric Scholarship for SC/ST Students',
    description: 'Financial assistance for SC/ST students pursuing higher education',
    benefits: 'Tuition fees + maintenance allowance (₹380-₹1,200/month)',
    category: 'Education',
    state: 'All India',
    eligibilityRules: {
      ageMin: 16,
      ageMax: 35,
      incomeMax: 250000,
      occupations: ['Student'],
      socialCategories: ['SC', 'ST'],
      requiredDocuments: ['aadhaar', 'caste_certificate', 'income_certificate', 'admission_proof']
    },
    applicationProcess: {
      steps: ['Online application', 'Upload documents', 'Institute verification', 'Scholarship credit'],
      estimatedTime: '60-90 days',
      documentsRequired: ['Aadhaar', 'Caste certificate', 'Income certificate', 'Admission proof']
    },
    contactInfo: {
      website: 'https://scholarships.gov.in',
      helpline: '0120-6619540',
      email: 'helpdesk@nsp.gov.in'
    }
  },
  {
    schemeId: 'scholarship-obc',
    schemeName: 'Post Matric Scholarship for OBC Students',
    description: 'Financial assistance for OBC students pursuing higher education',
    benefits: 'Tuition fees + maintenance allowance',
    category: 'Education',
    state: 'All India',
    eligibilityRules: {
      ageMin: 16,
      ageMax: 35,
      incomeMax: 100000,
      occupations: ['Student'],
      socialCategories: ['OBC'],
      requiredDocuments: ['aadhaar', 'caste_certificate', 'income_certificate', 'admission_proof']
    },
    applicationProcess: {
      steps: ['Online application', 'Upload documents', 'Institute verification', 'Scholarship credit'],
      estimatedTime: '60-90 days',
      documentsRequired: ['Aadhaar', 'Caste certificate', 'Income certificate', 'Admission proof']
    },
    contactInfo: {
      website: 'https://scholarships.gov.in',
      helpline: '0120-6619540',
      email: 'helpdesk@nsp.gov.in'
    }
  },
  {
    schemeId: 'mid-day-meal',
    schemeName: 'PM POSHAN (Mid-Day Meal Scheme)',
    description: 'Nutritious meals for school children',
    benefits: 'Free nutritious meal to children in government schools',
    category: 'Education',
    state: 'All India',
    eligibilityRules: {
      ageMin: 6,
      ageMax: 14,
      occupations: ['Student'],
      requiredDocuments: ['school_enrollment']
    },
    applicationProcess: {
      steps: ['Enroll in government school', 'Automatic enrollment in scheme'],
      estimatedTime: 'Immediate',
      documentsRequired: ['School enrollment proof']
    },
    contactInfo: {
      website: 'https://pmposhan.education.gov.in',
      helpline: '1800-11-8004',
      email: 'pmposhan@education.gov.in'
    }
  },

  // Social Security & Pension
  {
    schemeId: 'nsap-old-age',
    schemeName: 'National Social Assistance Programme - Old Age Pension',
    description: 'Monthly pension for senior citizens below poverty line',
    benefits: '₹200-500 per month (varies by state)',
    category: 'Social Security',
    state: 'All India',
    eligibilityRules: {
      ageMin: 60,
      incomeMax: 100000,
      requiredDocuments: ['aadhaar', 'age_proof', 'income_certificate']
    },
    applicationProcess: {
      steps: ['Apply at local office', 'Document verification', 'Approval', 'Pension credit'],
      estimatedTime: '15-30 days',
      documentsRequired: ['Aadhaar', 'Age proof', 'Income certificate']
    },
    contactInfo: {
      website: 'https://nsap.nic.in',
      helpline: '1800-180-1551',
      email: 'nsap@nic.in'
    }
  },
  {
    schemeId: 'nsap-widow',
    schemeName: 'National Social Assistance Programme - Widow Pension',
    description: 'Monthly pension for widows below poverty line',
    benefits: '₹300-500 per month (varies by state)',
    category: 'Social Security',
    state: 'All India',
    eligibilityRules: {
      ageMin: 40,
      gender: ['Female'],
      incomeMax: 100000,
      requiredDocuments: ['aadhaar', 'husband_death_certificate', 'income_certificate']
    },
    applicationProcess: {
      steps: ['Apply at local office', 'Document verification', 'Approval', 'Pension credit'],
      estimatedTime: '15-30 days',
      documentsRequired: ['Aadhaar', 'Husband death certificate', 'Income certificate']
    },
    contactInfo: {
      website: 'https://nsap.nic.in',
      helpline: '1800-180-1551',
      email: 'nsap@nic.in'
    }
  },
  {
    schemeId: 'nsap-disability',
    schemeName: 'National Social Assistance Programme - Disability Pension',
    description: 'Monthly pension for persons with disabilities below poverty line',
    benefits: '₹300-500 per month (varies by state)',
    category: 'Social Security',
    state: 'All India',
    eligibilityRules: {
      ageMin: 18,
      incomeMax: 100000,
      requiresDisability: true,
      requiredDocuments: ['aadhaar', 'disability_certificate', 'income_certificate']
    },
    applicationProcess: {
      steps: ['Apply at local office', 'Document verification', 'Approval', 'Pension credit'],
      estimatedTime: '15-30 days',
      documentsRequired: ['Aadhaar', 'Disability certificate (40%+)', 'Income certificate']
    },
    contactInfo: {
      website: 'https://nsap.nic.in',
      helpline: '1800-180-1551',
      email: 'nsap@nic.in'
    }
  },
  {
    schemeId: 'atal-pension-yojana',
    schemeName: 'Atal Pension Yojana (APY)',
    description: 'Pension scheme for unorganized sector workers',
    benefits: 'Guaranteed pension of ₹1,000 to ₹5,000 per month after 60 years',
    category: 'Social Security',
    state: 'All India',
    eligibilityRules: {
      ageMin: 18,
      ageMax: 40,
      requiredDocuments: ['aadhaar', 'bank_account']
    },
    applicationProcess: {
      steps: ['Open savings account', 'Fill APY form', 'Choose pension amount', 'Auto-debit setup'],
      estimatedTime: '1-2 days',
      documentsRequired: ['Aadhaar', 'Bank account']
    },
    contactInfo: {
      website: 'https://www.npscra.nsdl.co.in/apy',
      helpline: '1800-110-069',
      email: 'apy@npscra.nsdl.co.in'
    }
  },

  // Women & Child Development
  {
    schemeId: 'beti-bachao-beti-padhao',
    schemeName: 'Beti Bachao Beti Padhao',
    description: 'Campaign to address declining child sex ratio and empower girl children',
    benefits: 'Financial incentives for girl child education and welfare',
    category: 'Women & Child',
    state: 'All India',
    eligibilityRules: {
      ageMin: 0,
      ageMax: 21,
      gender: ['Female'],
      requiredDocuments: ['birth_certificate', 'aadhaar', 'bank_account']
    },
    applicationProcess: {
      steps: ['Open Sukanya Samriddhi Account', 'Regular deposits', 'Benefits at maturity'],
      estimatedTime: '1-2 days',
      documentsRequired: ['Birth certificate', 'Aadhaar', 'Bank account']
    },
    contactInfo: {
      website: 'https://wcd.nic.in/bbbp-scheme',
      helpline: '011-23388612',
      email: 'bbbp@wcd.nic.in'
    }
  },
  {
    schemeId: 'sukanya-samriddhi',
    schemeName: 'Sukanya Samriddhi Yojana',
    description: 'Small deposit scheme for girl child',
    benefits: 'High interest rate (7.6%) with tax benefits',
    category: 'Women & Child',
    state: 'All India',
    eligibilityRules: {
      ageMin: 0,
      ageMax: 10,
      gender: ['Female'],
      requiredDocuments: ['birth_certificate', 'aadhaar', 'parent_id']
    },
    applicationProcess: {
      steps: ['Visit post office/bank', 'Open account', 'Deposit minimum ₹250', 'Continue till 21 years'],
      estimatedTime: '1 day',
      documentsRequired: ['Birth certificate', 'Aadhaar', 'Parent ID proof']
    },
    contactInfo: {
      website: 'https://www.indiapost.gov.in/SSY',
      helpline: '1800-180-1111',
      email: 'ssy@indiapost.gov.in'
    }
  },
  {
    schemeId: 'pradhan-mantri-matru-vandana',
    schemeName: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    description: 'Maternity benefit programme for pregnant and lactating mothers',
    benefits: '₹5,000 in three installments for first living child',
    category: 'Women & Child',
    state: 'All India',
    eligibilityRules: {
      gender: ['Female'],
      incomeMax: 800000,
      requiredDocuments: ['aadhaar', 'bank_account', 'pregnancy_certificate']
    },
    applicationProcess: {
      steps: ['Register at Anganwadi', 'Submit forms', 'Receive installments'],
      estimatedTime: 'During pregnancy',
      documentsRequired: ['Aadhaar', 'Bank account', 'MCP card']
    },
    contactInfo: {
      website: 'https://pmmvy.wcd.gov.in',
      helpline: '011-23382393',
      email: 'pmmvy@wcd.nic.in'
    }
  },

  // Employment & Skill Development
  {
    schemeId: 'mgnrega',
    schemeName: 'Mahatma Gandhi National Rural Employment Guarantee Act',
    description: 'Guaranteed 100 days of wage employment in rural areas',
    benefits: '₹209-₹309 per day (varies by state)',
    category: 'Employment',
    state: 'All India',
    eligibilityRules: {
      ageMin: 18,
      ruralOnly: true,
      requiredDocuments: ['aadhaar', 'bank_account', 'address_proof']
    },
    applicationProcess: {
      steps: ['Apply for job card', 'Request work', 'Work allocation', 'Wage payment'],
      estimatedTime: '15 days for work allocation',
      documentsRequired: ['Aadhaar', 'Bank account', 'Address proof']
    },
    contactInfo: {
      website: 'https://nrega.nic.in',
      helpline: '1800-345-22-44',
      email: 'nrega@nic.in'
    }
  },
  {
    schemeId: 'pmkvy',
    schemeName: 'Pradhan Mantri Kaushal Vikas Yojana',
    description: 'Skill development training for youth',
    benefits: 'Free skill training + ₹8,000 average monetary reward',
    category: 'Skill Development',
    state: 'All India',
    eligibilityRules: {
      ageMin: 15,
      ageMax: 45,
      requiredDocuments: ['aadhaar', 'bank_account']
    },
    applicationProcess: {
      steps: ['Register online', 'Choose training center', 'Complete training', 'Get certified'],
      estimatedTime: '3-6 months',
      documentsRequired: ['Aadhaar', 'Bank account', 'Educational certificates']
    },
    contactInfo: {
      website: 'https://www.pmkvyofficial.org',
      helpline: '08800-055-555',
      email: 'pmkvy@nsdcindia.org'
    }
  },
  {
    schemeId: 'stand-up-india',
    schemeName: 'Stand-Up India Scheme',
    description: 'Loans for SC/ST and women entrepreneurs',
    benefits: 'Loans between ₹10 lakh to ₹1 crore',
    category: 'Employment',
    state: 'All India',
    eligibilityRules: {
      ageMin: 18,
      socialCategories: ['SC', 'ST'],
      requiredDocuments: ['aadhaar', 'business_plan', 'caste_certificate']
    },
    applicationProcess: {
      steps: ['Prepare business plan', 'Apply at bank', 'Verification', 'Loan sanction'],
      estimatedTime: '30-60 days',
      documentsRequired: ['Aadhaar', 'Business plan', 'Caste certificate', 'Address proof']
    },
    contactInfo: {
      website: 'https://www.standupmitra.in',
      helpline: '1800-180-1111',
      email: 'helpdesk@standupmitra.in'
    }
  },

  // Financial Inclusion
  {
    schemeId: 'pmjdy',
    schemeName: 'Pradhan Mantri Jan Dhan Yojana',
    description: 'Financial inclusion programme for banking services',
    benefits: 'Zero balance account + RuPay debit card + ₹10,000 overdraft',
    category: 'Financial Inclusion',
    state: 'All India',
    eligibilityRules: {
      ageMin: 10,
      requiredDocuments: ['aadhaar', 'address_proof']
    },
    applicationProcess: {
      steps: ['Visit bank', 'Fill form', 'Submit documents', 'Get account'],
      estimatedTime: '1 day',
      documentsRequired: ['Aadhaar', 'Address proof']
    },
    contactInfo: {
      website: 'https://pmjdy.gov.in',
      helpline: '1800-11-0001',
      email: 'pmjdy@dfs.gov.in'
    }
  },
  {
    schemeId: 'pmjjby',
    schemeName: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
    description: 'Life insurance scheme',
    benefits: '₹2 lakh life cover for ₹436/year premium',
    category: 'Financial Inclusion',
    state: 'All India',
    eligibilityRules: {
      ageMin: 18,
      ageMax: 50,
      requiredDocuments: ['aadhaar', 'bank_account']
    },
    applicationProcess: {
      steps: ['Visit bank', 'Fill form', 'Auto-debit consent', 'Coverage starts'],
      estimatedTime: '1 day',
      documentsRequired: ['Aadhaar', 'Bank account']
    },
    contactInfo: {
      website: 'https://www.jansuraksha.gov.in',
      helpline: '1800-180-1111',
      email: 'pmjjby@dfs.gov.in'
    }
  },
  {
    schemeId: 'pmsby',
    schemeName: 'Pradhan Mantri Suraksha Bima Yojana',
    description: 'Accident insurance scheme',
    benefits: '₹2 lakh accident cover for ₹20/year premium',
    category: 'Financial Inclusion',
    state: 'All India',
    eligibilityRules: {
      ageMin: 18,
      ageMax: 70,
      requiredDocuments: ['aadhaar', 'bank_account']
    },
    applicationProcess: {
      steps: ['Visit bank', 'Fill form', 'Auto-debit consent', 'Coverage starts'],
      estimatedTime: '1 day',
      documentsRequired: ['Aadhaar', 'Bank account']
    },
    contactInfo: {
      website: 'https://www.jansuraksha.gov.in',
      helpline: '1800-180-1111',
      email: 'pmsby@dfs.gov.in'
    }
  },

  // Gas & Fuel
  {
    schemeId: 'ujjwala',
    schemeName: 'Pradhan Mantri Ujjwala Yojana',
    description: 'Free LPG connections to BPL households',
    benefits: 'Free LPG connection + ₹1,600 assistance',
    category: 'Energy',
    state: 'All India',
    eligibilityRules: {
      gender: ['Female'],
      incomeMax: 100000,
      requiredDocuments: ['aadhaar', 'bpl_card', 'address_proof']
    },
    applicationProcess: {
      steps: ['Apply at LPG distributor', 'Document verification', 'Connection installation'],
      estimatedTime: '7-15 days',
      documentsRequired: ['Aadhaar', 'BPL card', 'Address proof']
    },
    contactInfo: {
      website: 'https://www.pmujjwalayojana.com',
      helpline: '1906',
      email: 'ujjwala@petroleum.gov.in'
    }
  },

  // Sanitation
  {
    schemeId: 'swachh-bharat-toilet',
    schemeName: 'Swachh Bharat Mission - Toilet Construction',
    description: 'Financial assistance for household toilet construction',
    benefits: '₹12,000 for toilet construction',
    category: 'Sanitation',
    state: 'All India',
    eligibilityRules: {
      ruralOnly: true,
      requiredDocuments: ['aadhaar', 'bank_account']
    },
    applicationProcess: {
      steps: ['Apply through Gram Panchayat', 'Verification', 'Construct toilet', 'Get incentive'],
      estimatedTime: '30-45 days',
      documentsRequired: ['Aadhaar', 'Bank account', 'Photo proof of construction']
    },
    contactInfo: {
      website: 'https://swachhbharatmission.gov.in',
      helpline: '1800-11-0007',
      email: 'sbm@nic.in'
    }
  }
];

export default ALL_SCHEMES;


// Import expanded schemes
import { EXPANDED_SCHEMES } from './schemes-expanded';

// Combine original detailed schemes with expanded schemes
export const ALL_SCHEMES_COMBINED = [...ALL_SCHEMES, ...EXPANDED_SCHEMES];

// Export combined as default
export { ALL_SCHEMES_COMBINED as ALL_SCHEMES_FULL };

// Utility functions
export const getTotalSchemeCount = () => ALL_SCHEMES_COMBINED.length;

export const getSchemesByCategory = (category: string) => 
  ALL_SCHEMES_COMBINED.filter(s => s.category === category);

export const getSchemesByState = (state: string) => 
  ALL_SCHEMES_COMBINED.filter(s => s.state === state || s.state === 'All India');

export const getAllCategories = () => 
  Array.from(new Set(ALL_SCHEMES_COMBINED.map(s => s.category)));

export const getAllStates = () => 
  Array.from(new Set(ALL_SCHEMES_COMBINED.map(s => s.state)));

export const searchSchemes = (query: string) => 
  ALL_SCHEMES_COMBINED.filter(s => 
    s.schemeName.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );
