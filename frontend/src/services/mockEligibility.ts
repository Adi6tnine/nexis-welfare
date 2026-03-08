// Mock Eligibility Service with Correct Logic
export interface UserProfile {
  age: number;
  state: string;
  occupation: string;
  annualIncome: number;
  gender: string;
  socialCategory: string;
  hasDisability: boolean;
}

export interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  description: string;
  benefits: string;
  status: 'Eligible' | 'Potentially Eligible' | 'Not Eligible';
  matchScore: number;
  satisfiedCriteria: string[];
  unsatisfiedCriteria: Array<{ criterion: string; message: string }>;
}

const SCHEMES = [
  // Agriculture & Farmers
  {
    schemeId: 'pm-kisan',
    schemeName: 'PM-KISAN Samman Nidhi',
    description: 'Income support to farmer families',
    benefits: '₹6,000 per year in three equal installments',
    ageMin: 18,
    occupations: ['Farmer', 'Agricultural Worker'],
  },
  {
    schemeId: 'pm-fasal-bima',
    schemeName: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme for farmers',
    benefits: 'Insurance coverage for crop loss',
    ageMin: 18,
    occupations: ['Farmer', 'Agricultural Worker'],
  },
  {
    schemeId: 'kisan-credit-card',
    schemeName: 'Kisan Credit Card',
    description: 'Credit facility for farmers',
    benefits: 'Short-term credit up to ₹3 lakh at 4% interest',
    ageMin: 18,
    occupations: ['Farmer', 'Agricultural Worker'],
  },
  {
    schemeId: 'soil-health-card',
    schemeName: 'Soil Health Card Scheme',
    description: 'Soil testing and health card for farmers',
    benefits: 'Free soil testing and recommendations',
    ageMin: 18,
    occupations: ['Farmer', 'Agricultural Worker'],
  },
  
  // Healthcare
  {
    schemeId: 'ayushman-bharat',
    schemeName: 'Ayushman Bharat PM-JAY',
    description: 'Health insurance for economically vulnerable families',
    benefits: 'Health cover of ₹5 lakh per family per year',
    incomeMax: 300000,
    socialCategories: ['SC', 'ST', 'OBC'],
  },
  {
    schemeId: 'janani-suraksha',
    schemeName: 'Janani Suraksha Yojana',
    description: 'Safe motherhood intervention scheme',
    benefits: 'Cash assistance for institutional delivery',
    gender: ['Female'],
    incomeMax: 200000,
  },
  {
    schemeId: 'rashtriya-bal-swasthya',
    schemeName: 'Rashtriya Bal Swasthya Karyakram',
    description: 'Child health screening and early intervention',
    benefits: 'Free health screening for children',
    ageMax: 18,
  },
  {
    schemeId: 'pradhan-mantri-suraksha-bima',
    schemeName: 'Pradhan Mantri Suraksha Bima Yojana',
    description: 'Accident insurance scheme',
    benefits: '₹2 lakh accident insurance at ₹12/year',
    ageMin: 18,
    ageMax: 70,
  },
  {
    schemeId: 'pradhan-mantri-jeevan-jyoti',
    schemeName: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
    description: 'Life insurance scheme',
    benefits: '₹2 lakh life cover at ₹330/year',
    ageMin: 18,
    ageMax: 50,
  },
  
  // Housing
  {
    schemeId: 'pmay-urban',
    schemeName: 'Pradhan Mantri Awas Yojana - Urban',
    description: 'Housing for All mission',
    benefits: 'Interest subsidy up to ₹2.67 lakh on home loans',
    ageMin: 21,
    incomeMax: 1800000,
  },
  {
    schemeId: 'pmay-gramin',
    schemeName: 'Pradhan Mantri Awas Yojana - Gramin',
    description: 'Rural housing scheme',
    benefits: '₹1.2-1.3 lakh assistance for house construction',
    incomeMax: 100000,
  },
  {
    schemeId: 'credit-linked-subsidy',
    schemeName: 'Credit Linked Subsidy Scheme',
    description: 'Interest subsidy on home loans',
    benefits: 'Interest subsidy up to ₹2.67 lakh',
    ageMin: 21,
    incomeMax: 1800000,
  },
  
  // Education & Scholarships
  {
    schemeId: 'post-matric-sc-st',
    schemeName: 'Post Matric Scholarship for SC/ST',
    description: 'Financial assistance for SC/ST students',
    benefits: 'Tuition fees + maintenance allowance',
    ageMin: 16,
    ageMax: 35,
    occupations: ['Student'],
    socialCategories: ['SC', 'ST'],
    incomeMax: 250000,
  },
  {
    schemeId: 'pre-matric-sc-st',
    schemeName: 'Pre-Matric Scholarship for SC/ST',
    description: 'Scholarship for SC/ST students in classes 9-10',
    benefits: 'Day scholar: ₹225/month, Hosteller: ₹525/month',
    ageMin: 13,
    ageMax: 18,
    occupations: ['Student'],
    socialCategories: ['SC', 'ST'],
    incomeMax: 250000,
  },
  {
    schemeId: 'post-matric-obc',
    schemeName: 'Post Matric Scholarship for OBC',
    description: 'Financial assistance for OBC students',
    benefits: 'Tuition fees + maintenance allowance',
    ageMin: 16,
    ageMax: 35,
    occupations: ['Student'],
    socialCategories: ['OBC'],
    incomeMax: 100000,
  },
  {
    schemeId: 'national-means-scholarship',
    schemeName: 'National Means cum Merit Scholarship',
    description: 'Scholarship for meritorious students',
    benefits: '₹12,000 per year',
    ageMin: 13,
    ageMax: 18,
    occupations: ['Student'],
    incomeMax: 150000,
  },
  {
    schemeId: 'begum-hazrat-mahal',
    schemeName: 'Begum Hazrat Mahal National Scholarship',
    description: 'Scholarship for minority girl students',
    benefits: '₹5,000-12,000 per year',
    ageMin: 13,
    ageMax: 25,
    gender: ['Female'],
    occupations: ['Student'],
    incomeMax: 200000,
  },
  {
    schemeId: 'merit-scholarship-minorities',
    schemeName: 'Merit-cum-Means Scholarship for Minorities',
    description: 'Scholarship for minority community students',
    benefits: '₹20,000-30,000 per year',
    ageMin: 16,
    ageMax: 30,
    occupations: ['Student'],
    incomeMax: 250000,
  },
  
  // Women & Child Development
  {
    schemeId: 'sukanya-samriddhi',
    schemeName: 'Sukanya Samriddhi Yojana',
    description: 'Small deposit scheme for girl child',
    benefits: 'High interest rate, tax benefits',
    ageMax: 10,
    gender: ['Female'],
  },
  {
    schemeId: 'beti-bachao-beti-padhao',
    schemeName: 'Beti Bachao Beti Padhao',
    description: 'Save and educate girl child',
    benefits: 'Financial incentives and awareness',
    ageMax: 21,
    gender: ['Female'],
  },
  {
    schemeId: 'pradhan-mantri-matru-vandana',
    schemeName: 'Pradhan Mantri Matru Vandana Yojana',
    description: 'Maternity benefit programme',
    benefits: '₹5,000 cash incentive for first living child',
    ageMin: 19,
    gender: ['Female'],
    incomeMax: 300000,
  },
  {
    schemeId: 'mahila-shakti-kendra',
    schemeName: 'Mahila Shakti Kendra',
    description: 'Women empowerment scheme',
    benefits: 'Skill development and employment opportunities',
    ageMin: 18,
    gender: ['Female'],
  },
  {
    schemeId: 'working-women-hostel',
    schemeName: 'Working Women Hostel',
    description: 'Hostel facilities for working women',
    benefits: 'Safe accommodation at subsidized rates',
    ageMin: 18,
    gender: ['Female'],
    incomeMax: 50000,
  },
  
  // Employment & Skill Development
  {
    schemeId: 'mudra-yojana',
    schemeName: 'Pradhan Mantri MUDRA Yojana',
    description: 'Loans for micro-enterprises',
    benefits: 'Loans up to ₹10 lakh',
    ageMin: 18,
    occupations: ['Self Employed', 'Business Owner', 'Entrepreneur'],
  },
  {
    schemeId: 'pmegp',
    schemeName: "Prime Minister's Employment Generation Programme",
    description: 'Credit-linked subsidy for micro-enterprises',
    benefits: 'Subsidy of 15-35% on project cost',
    ageMin: 18,
    occupations: ['Self Employed', 'Business Owner', 'Entrepreneur'],
  },
  {
    schemeId: 'stand-up-india',
    schemeName: 'Stand Up India',
    description: 'Loans for SC/ST and women entrepreneurs',
    benefits: 'Loans between ₹10 lakh to ₹1 crore',
    ageMin: 18,
    occupations: ['Self Employed', 'Business Owner', 'Entrepreneur'],
  },
  {
    schemeId: 'pradhan-mantri-kaushal-vikas',
    schemeName: 'Pradhan Mantri Kaushal Vikas Yojana',
    description: 'Skill development training',
    benefits: 'Free skill training and certification',
    ageMin: 15,
    ageMax: 45,
  },
  {
    schemeId: 'deen-dayal-upadhyaya',
    schemeName: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana',
    description: 'Rural youth skill development',
    benefits: 'Free training and placement assistance',
    ageMin: 15,
    ageMax: 35,
    incomeMax: 100000,
  },
  {
    schemeId: 'national-apprenticeship',
    schemeName: 'National Apprenticeship Promotion Scheme',
    description: 'Apprenticeship training for youth',
    benefits: 'Stipend and on-job training',
    ageMin: 14,
    ageMax: 35,
  },
  
  // Social Security & Pension
  {
    schemeId: 'atal-pension',
    schemeName: 'Atal Pension Yojana',
    description: 'Pension scheme for unorganized sector workers',
    benefits: 'Guaranteed monthly pension from ₹1,000 to ₹5,000',
    ageMin: 18,
    ageMax: 40,
  },
  {
    schemeId: 'nsap-old-age',
    schemeName: 'National Old Age Pension Scheme',
    description: 'Monthly pension for senior citizens',
    benefits: '₹200-500 per month',
    ageMin: 60,
    incomeMax: 100000,
  },
  {
    schemeId: 'nsap-widow',
    schemeName: 'National Widow Pension Scheme',
    description: 'Pension for widows',
    benefits: '₹300-500 per month',
    ageMin: 40,
    gender: ['Female'],
    incomeMax: 100000,
  },
  {
    schemeId: 'nsap-disability',
    schemeName: 'National Disability Pension Scheme',
    description: 'Pension for persons with disabilities',
    benefits: '₹300-500 per month',
    ageMin: 18,
    hasDisability: true,
    incomeMax: 100000,
  },
  {
    schemeId: 'employees-provident-fund',
    schemeName: "Employees' Provident Fund",
    description: 'Retirement savings scheme for employees',
    benefits: 'Retirement corpus with employer contribution',
    ageMin: 18,
    occupations: ['Private Sector', 'Government Employee'],
  },
  
  // Financial Inclusion
  {
    schemeId: 'pmjdy',
    schemeName: 'Pradhan Mantri Jan Dhan Yojana',
    description: 'Financial inclusion programme',
    benefits: 'Zero balance account, RuPay debit card, insurance',
    ageMin: 18,
  },
  {
    schemeId: 'pradhan-mantri-vaya-vandana',
    schemeName: 'Pradhan Mantri Vaya Vandana Yojana',
    description: 'Pension scheme for senior citizens',
    benefits: '8% assured return, monthly pension',
    ageMin: 60,
  },
  {
    schemeId: 'senior-citizen-savings',
    schemeName: 'Senior Citizen Savings Scheme',
    description: 'Savings scheme for senior citizens',
    benefits: 'High interest rate, tax benefits',
    ageMin: 60,
  },
  {
    schemeId: 'public-provident-fund',
    schemeName: 'Public Provident Fund',
    description: 'Long-term savings scheme',
    benefits: 'Tax-free returns, 15-year maturity',
    ageMin: 18,
  },
  
  // Rural Development
  {
    schemeId: 'mgnrega',
    schemeName: 'Mahatma Gandhi National Rural Employment Guarantee',
    description: 'Employment guarantee in rural areas',
    benefits: '100 days of guaranteed wage employment',
    ageMin: 18,
    incomeMax: 100000,
  },
  {
    schemeId: 'deen-dayal-antyodaya',
    schemeName: 'Deen Dayal Antyodaya Yojana',
    description: 'Poverty alleviation through skill development',
    benefits: 'Training and financial assistance',
    ageMin: 18,
    incomeMax: 100000,
  },
  {
    schemeId: 'pradhan-mantri-gram-sadak',
    schemeName: 'Pradhan Mantri Gram Sadak Yojana',
    description: 'Rural road connectivity',
    benefits: 'All-weather road connectivity',
    ageMin: 18,
  },
  {
    schemeId: 'shyama-prasad-mukherji',
    schemeName: 'Shyama Prasad Mukherji Rurban Mission',
    description: 'Rural-urban development',
    benefits: 'Infrastructure and livelihood development',
    ageMin: 18,
  },
  
  // Food & Nutrition
  {
    schemeId: 'national-food-security',
    schemeName: 'National Food Security Act',
    description: 'Subsidized food grains',
    benefits: '5 kg food grains per person at ₹1-3/kg',
    incomeMax: 100000,
  },
  {
    schemeId: 'mid-day-meal',
    schemeName: 'Mid-Day Meal Scheme',
    description: 'Free lunch for school children',
    benefits: 'Nutritious cooked meal in schools',
    ageMin: 6,
    ageMax: 14,
    occupations: ['Student'],
  },
  {
    schemeId: 'integrated-child-development',
    schemeName: 'Integrated Child Development Services',
    description: 'Nutrition and health for children',
    benefits: 'Supplementary nutrition, health check-ups',
    ageMax: 6,
  },
  {
    schemeId: 'poshan-abhiyaan',
    schemeName: 'POSHAN Abhiyaan',
    description: 'National nutrition mission',
    benefits: 'Nutrition support for children and mothers',
    ageMax: 6,
  },
  
  // Urban Development
  {
    schemeId: 'smart-cities-mission',
    schemeName: 'Smart Cities Mission',
    description: 'Urban development and smart infrastructure',
    benefits: 'Improved urban services and infrastructure',
    ageMin: 18,
  },
  {
    schemeId: 'swachh-bharat-urban',
    schemeName: 'Swachh Bharat Mission - Urban',
    description: 'Clean India mission for urban areas',
    benefits: 'Toilet construction subsidy',
    ageMin: 18,
    incomeMax: 300000,
  },
  {
    schemeId: 'atal-mission-rejuvenation',
    schemeName: 'Atal Mission for Rejuvenation and Urban Transformation',
    description: 'Urban infrastructure development',
    benefits: 'Water supply and sewerage facilities',
    ageMin: 18,
  },
  
  // Energy & Environment
  {
    schemeId: 'pradhan-mantri-ujjwala',
    schemeName: 'Pradhan Mantri Ujjwala Yojana',
    description: 'Free LPG connections for poor households',
    benefits: 'Free LPG connection and first refill',
    ageMin: 18,
    gender: ['Female'],
    incomeMax: 100000,
  },
  {
    schemeId: 'saubhagya-scheme',
    schemeName: 'Pradhan Mantri Sahaj Bijli Har Ghar Yojana',
    description: 'Electricity for all households',
    benefits: 'Free electricity connection',
    ageMin: 18,
    incomeMax: 100000,
  },
  {
    schemeId: 'solar-rooftop',
    schemeName: 'Solar Rooftop Subsidy Scheme',
    description: 'Subsidy for solar panel installation',
    benefits: '40% subsidy on solar rooftop systems',
    ageMin: 18,
  },
  
  // Digital India
  {
    schemeId: 'digital-india',
    schemeName: 'Digital India Programme',
    description: 'Digital empowerment of citizens',
    benefits: 'Digital literacy and services',
    ageMin: 14,
  },
  {
    schemeId: 'pradhan-mantri-gramin-digital',
    schemeName: 'Pradhan Mantri Gramin Digital Saksharta Abhiyan',
    description: 'Digital literacy in rural areas',
    benefits: 'Free digital literacy training',
    ageMin: 14,
    ageMax: 60,
  },
];

export function checkEligibilityMock(profile: UserProfile) {
  console.log('Mock Eligibility Check - Profile:', profile);
  console.log('Total schemes to evaluate:', SCHEMES.length);
  
  const eligible: EligibilityResult[] = [];
  const ineligible: EligibilityResult[] = [];

  for (const scheme of SCHEMES) {
    const result = evaluateScheme(profile, scheme);
    
    if (result.status === 'Eligible') {
      eligible.push(result);
    } else {
      ineligible.push(result);
    }
  }

  // Sort by match score
  eligible.sort((a, b) => b.matchScore - a.matchScore);

  console.log('Eligible schemes:', eligible.length);
  console.log('Ineligible schemes:', ineligible.length);

  return {
    eligible,
    potential: [],
    ineligible,
    timeline: [],
    summary: {
      totalSchemes: SCHEMES.length,
      eligibleCount: eligible.length,
      potentialCount: 0,
      ineligibleCount: ineligible.length,
    },
  };
}

function evaluateScheme(profile: UserProfile, scheme: any): EligibilityResult {
  const satisfied: string[] = [];
  const unsatisfied: Array<{ criterion: string; message: string }> = [];

  // Age check
  if (scheme.ageMin !== undefined || scheme.ageMax !== undefined) {
    if (scheme.ageMin && profile.age < scheme.ageMin) {
      unsatisfied.push({
        criterion: 'age',
        message: `Minimum age: ${scheme.ageMin} years (You: ${profile.age})`,
      });
    } else if (scheme.ageMax && profile.age > scheme.ageMax) {
      unsatisfied.push({
        criterion: 'age',
        message: `Maximum age: ${scheme.ageMax} years (You: ${profile.age})`,
      });
    } else {
      satisfied.push(`Age requirement met (${profile.age} years)`);
    }
  }

  // Income check
  if (scheme.incomeMax !== undefined) {
    if (profile.annualIncome > scheme.incomeMax) {
      unsatisfied.push({
        criterion: 'income',
        message: `Maximum income: ₹${scheme.incomeMax.toLocaleString()} (You: ₹${profile.annualIncome.toLocaleString()})`,
      });
    } else {
      satisfied.push(`Income within limit (₹${profile.annualIncome.toLocaleString()})`);
    }
  }

  // Occupation check
  if (scheme.occupations && scheme.occupations.length > 0) {
    if (scheme.occupations.includes(profile.occupation)) {
      satisfied.push(`Occupation matches (${profile.occupation})`);
    } else {
      unsatisfied.push({
        criterion: 'occupation',
        message: `Required: ${scheme.occupations.join(', ')} (You: ${profile.occupation})`,
      });
    }
  }

  // Social category check
  if (scheme.socialCategories && scheme.socialCategories.length > 0) {
    if (scheme.socialCategories.includes(profile.socialCategory)) {
      satisfied.push(`Social category matches (${profile.socialCategory})`);
    } else {
      unsatisfied.push({
        criterion: 'socialCategory',
        message: `Required: ${scheme.socialCategories.join(', ')} (You: ${profile.socialCategory})`,
      });
    }
  }

  // Gender check
  if (scheme.gender && scheme.gender.length > 0) {
    if (scheme.gender.includes(profile.gender)) {
      satisfied.push(`Gender requirement met`);
    } else {
      unsatisfied.push({
        criterion: 'gender',
        message: `Only for: ${scheme.gender.join(', ')}`,
      });
    }
  }

  // Disability check
  if (scheme.hasDisability !== undefined) {
    if (scheme.hasDisability && !profile.hasDisability) {
      unsatisfied.push({
        criterion: 'disability',
        message: 'Requires disability certification',
      });
    } else if (scheme.hasDisability && profile.hasDisability) {
      satisfied.push('Disability requirement met');
    }
  }

  // If no criteria were checked, scheme is universally eligible
  if (satisfied.length === 0 && unsatisfied.length === 0) {
    satisfied.push('No specific eligibility criteria');
  }

  const isEligible = unsatisfied.length === 0;
  const totalCriteria = satisfied.length + unsatisfied.length;
  const matchScore = totalCriteria > 0 
    ? Math.round((satisfied.length / totalCriteria) * 100)
    : 100;

  return {
    schemeId: scheme.schemeId,
    schemeName: scheme.schemeName,
    description: scheme.description,
    benefits: scheme.benefits,
    status: isEligible ? 'Eligible' : 'Not Eligible',
    matchScore: isEligible ? matchScore : 0,
    satisfiedCriteria: satisfied,
    unsatisfiedCriteria: unsatisfied,
  };
}
