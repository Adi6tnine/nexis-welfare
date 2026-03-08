// @ts-nocheck
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { evaluateEligibilityV2, predictTimeline } from '../../services/eligibility-v2';
import { UserProfileV2 } from '../../models/UserProfileV2';
import { SchemeV2, EligibilityResultV2 } from '../../models/SchemeV2';

const dynamodb = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const SCHEMES_TABLE = process.env.SCHEMES_TABLE || 'nexis-schemes';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || '{}');
    const { profile } = body;

    if (!profile) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: { code: 'MISSING_PROFILE', message: 'User profile is required' }
        })
      };
    }

    // Get all schemes from DynamoDB
    const schemes = await getAllSchemes();

    // Evaluate eligibility for each scheme
    const results: EligibilityResultV2[] = [];
    for (const scheme of schemes) {
      const result = await evaluateEligibilityV2(profile, scheme);
      results.push(result);
    }

    // Sort by match score (highest first)
    results.sort((a, b) => b.matchScore - a.matchScore);

    // Categorize results
    const eligible = results.filter(r => r.status === 'Eligible');
    const potential = results.filter(r => r.status === 'Potentially Eligible');
    const ineligible = results.filter(r => r.status === 'Not Eligible');

    // Generate timeline predictions for top schemes
    const timeline = [];
    for (const result of results.slice(0, 5)) {
      const scheme = schemes.find(s => s.schemeId === result.schemeId);
      if (scheme) {
        const predictions = await predictTimeline(profile, scheme, result);
        timeline.push(...predictions);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: {
          eligible,
          potential,
          ineligible,
          timeline,
          summary: {
            totalSchemes: results.length,
            eligibleCount: eligible.length,
            potentialCount: potential.length,
            ineligibleCount: ineligible.length
          }
        }
      })
    };
  } catch (error: any) {
    console.error('Eligibility check error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      })
    };
  }
}

async function getAllSchemes(): Promise<SchemeV2[]> {
  try {
    const command = new ScanCommand({
      TableName: SCHEMES_TABLE
    });

    const response = await dynamodb.send(command);
    
    if (!response.Items) {
      return getMockSchemes();
    }

    return response.Items.map(item => unmarshall(item) as SchemeV2);
  } catch (error) {
    console.error('Error fetching schemes from DynamoDB:', error);
    // Fallback to mock schemes for development
    return getMockSchemes();
  }
}

function getMockSchemes(): SchemeV2[] {
  return [
    {
      schemeId: 'pm-kisan',
      schemeName: 'PM-KISAN Samman Nidhi',
      description: 'Income support to all farmer families',
      benefits: '₹6,000 per year in three equal installments',
      category: 'Agriculture',
      state: 'All India',
      eligibilityRules: {
        ageMin: 18,
        ageMax: undefined,
        incomeMax: undefined,
        states: [],
        occupations: ['Farmer'],
        gender: [],
        socialCategories: [],
        ruralOnly: false,
        requiresDisability: false,
        requiredDocuments: ['aadhaar', 'land_records', 'bank_account']
      },
      applicationProcess: {
        steps: ['Register', 'Verify Aadhaar', 'Submit land records', 'Bank verification'],
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
      schemeId: 'pmay',
      schemeName: 'Pradhan Mantri Awas Yojana',
      description: 'Housing for All - Urban',
      benefits: 'Interest subsidy up to ₹2.67 lakh on home loans',
      category: 'Housing',
      state: 'All India',
      eligibilityRules: {
        ageMin: 21,
        ageMax: undefined,
        incomeMax: 1800000,
        states: [],
        occupations: [],
        gender: [],
        socialCategories: [],
        ruralOnly: false,
        requiresDisability: false,
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
      schemeId: 'ayushman-bharat',
      schemeName: 'Ayushman Bharat PM-JAY',
      description: 'Health insurance for economically vulnerable families',
      benefits: 'Health cover of ₹5 lakh per family per year',
      category: 'Healthcare',
      state: 'All India',
      eligibilityRules: {
        ageMin: undefined,
        ageMax: undefined,
        incomeMax: 100000,
        states: [],
        occupations: [],
        gender: [],
        socialCategories: ['SC', 'ST', 'OBC'],
        ruralOnly: false,
        requiresDisability: false,
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
      schemeId: 'nsap-old-age',
      schemeName: 'National Social Assistance Programme - Old Age Pension',
      description: 'Monthly pension for senior citizens below poverty line',
      benefits: '₹200-500 per month (varies by state)',
      category: 'Social Security',
      state: 'All India',
      eligibilityRules: {
        ageMin: 60,
        ageMax: undefined,
        incomeMax: 100000,
        states: [],
        occupations: [],
        gender: [],
        socialCategories: [],
        ruralOnly: false,
        requiresDisability: false,
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
      schemeId: 'scholarship-sc-st',
      schemeName: 'Post Matric Scholarship for SC/ST Students',
      description: 'Financial assistance for SC/ST students pursuing higher education',
      benefits: 'Tuition fees + maintenance allowance',
      category: 'Education',
      state: 'All India',
      eligibilityRules: {
        ageMin: 16,
        ageMax: 35,
        incomeMax: 250000,
        states: [],
        occupations: ['Student'],
        gender: [],
        socialCategories: ['SC', 'ST'],
        ruralOnly: false,
        requiresDisability: false,
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
    }
  ];
}
