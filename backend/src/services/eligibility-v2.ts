import { UserProfileV2 } from '../models/UserProfileV2';
import { SchemeV2, EligibilityResultV2, CriterionDetail, UnsatisfiedCriterion, MissingDataItem, TimelinePrediction } from '../models/SchemeV2';

export async function evaluateEligibilityV2(
  profile: UserProfileV2,
  scheme: SchemeV2
): Promise<EligibilityResultV2> {
  const rules = scheme.eligibilityRules;
  const satisfied: CriterionDetail[] = [];
  const unsatisfied: UnsatisfiedCriterion[] = [];
  const missing: MissingDataItem[] = [];
  
  // Age Check
  if (rules.ageMin !== undefined || rules.ageMax !== undefined) {
    const ageResult = evaluateAge(profile.personalInfo.age, rules.ageMin, rules.ageMax);
    if (ageResult.satisfied) {
      satisfied.push(ageResult.detail);
    } else {
      unsatisfied.push(ageResult.unsatisfied);
    }
  }
  
  // Income Check
  if (rules.incomeMax !== undefined) {
    const incomeResult = evaluateIncome(profile.economic.annualIncome, rules.incomeMax);
    if (incomeResult.satisfied) {
      satisfied.push(incomeResult.detail);
    } else {
      unsatisfied.push(incomeResult.unsatisfied);
    }
  }
  
  // Location Check
  if (rules.states && rules.states.length > 0) {
    const locationResult = evaluateLocation(profile.location.state, rules.states);
    if (locationResult.satisfied) {
      satisfied.push(locationResult.detail);
    } else {
      unsatisfied.push(locationResult.unsatisfied);
    }
  }
  
  // Rural/Urban Check
  if (rules.ruralOnly !== undefined) {
    const ruralResult = evaluateRuralUrban(profile.location.isRural, rules.ruralOnly);
    if (ruralResult.satisfied) {
      satisfied.push(ruralResult.detail);
    } else {
      unsatisfied.push(ruralResult.unsatisfied);
    }
  }
  
  // Occupation Check
  if (rules.occupations && rules.occupations.length > 0) {
    const occupationResult = evaluateOccupation(profile.occupation.primary, rules.occupations);
    if (occupationResult.satisfied) {
      satisfied.push(occupationResult.detail);
    } else {
      unsatisfied.push(occupationResult.unsatisfied);
    }
  }
  
  // Gender Check
  if (rules.gender && rules.gender.length > 0) {
    const genderResult = evaluateGender(profile.personalInfo.gender, rules.gender);
    if (genderResult.satisfied) {
      satisfied.push(genderResult.detail);
    } else {
      unsatisfied.push(genderResult.unsatisfied);
    }
  }
  
  // Social Category Check
  if (rules.socialCategories && rules.socialCategories.length > 0) {
    const categoryResult = evaluateSocialCategory(profile.socialCategory, rules.socialCategories);
    if (categoryResult.satisfied) {
      satisfied.push(categoryResult.detail);
    } else {
      unsatisfied.push(categoryResult.unsatisfied);
    }
  }
  
  // Disability Check
  if (rules.requiresDisability !== undefined) {
    const disabilityResult = evaluateDisability(
      profile.hasDisability,
      profile.disabilityDetails?.percentage,
      rules.requiresDisability,
      rules.minDisabilityPercentage
    );
    if (disabilityResult.satisfied) {
      satisfied.push(disabilityResult.detail);
    } else {
      unsatisfied.push(disabilityResult.unsatisfied);
    }
  }
  
  // Document Check
  const documentResult = evaluateDocuments(profile.documents, rules.requiredDocuments);
  satisfied.push(...documentResult.satisfied);
  unsatisfied.push(...documentResult.unsatisfied);
  missing.push(...documentResult.missing);
  
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
  
  // Generate recommendations
  const recommendations = generateRecommendations(unsatisfied, missing);
  
  return {
    schemeId: scheme.schemeId,
    schemeName: scheme.schemeName,
    status,
    matchScore,
    confidence,
    satisfiedCriteria: satisfied,
    unsatisfiedCriteria: unsatisfied,
    missingData: missing,
    recommendations,
    alternativeSchemes: []
  };
}

function evaluateAge(age: number, min?: number, max?: number): any {
  if (min !== undefined && age < min) {
    return {
      satisfied: false,
      unsatisfied: {
        criterion: 'age',
        currentValue: age,
        requiredValue: { min },
        gap: `${min - age} years`,
        message: `Age must be at least ${min} years (current: ${age})`,
        fixable: true,
        howToFix: `Wait ${min - age} years to become eligible`
      }
    };
  }
  
  if (max !== undefined && age > max) {
    return {
      satisfied: false,
      unsatisfied: {
        criterion: 'age',
        currentValue: age,
        requiredValue: { max },
        gap: `${age - max} years over`,
        message: `Age must be at most ${max} years (current: ${age})`,
        fixable: false
      }
    };
  }
  
  const rangeText = min !== undefined && max !== undefined
    ? `${min}-${max} years`
    : min !== undefined
    ? `at least ${min} years`
    : `at most ${max} years`;
  
  return {
    satisfied: true,
    detail: {
      criterion: 'age',
      value: age,
      requirement: { min, max },
      message: `Age ${age} is within required range (${rangeText})`
    }
  };
}

function evaluateIncome(income: number, max: number): any {
  if (income > max) {
    return {
      satisfied: false,
      unsatisfied: {
        criterion: 'income',
        currentValue: income,
        requiredValue: max,
        gap: `₹${(income - max).toLocaleString('en-IN')} over`,
        message: `Annual income must be at most ₹${max.toLocaleString('en-IN')} (current: ₹${income.toLocaleString('en-IN')})`,
        fixable: false
      }
    };
  }
  
  return {
    satisfied: true,
    detail: {
      criterion: 'income',
      value: income,
      requirement: max,
      message: `Annual income ₹${income.toLocaleString('en-IN')} is within limit (₹${max.toLocaleString('en-IN')})`
    }
  };
}

function evaluateLocation(state: string, allowedStates: string[]): any {
  if (!allowedStates.includes(state)) {
    return {
      satisfied: false,
      unsatisfied: {
        criterion: 'state',
        currentValue: state,
        requiredValue: allowedStates,
        gap: 'Not in allowed states',
        message: `Scheme is only available in: ${allowedStates.join(', ')} (your state: ${state})`,
        fixable: false
      }
    };
  }
  
  return {
    satisfied: true,
    detail: {
      criterion: 'state',
      value: state,
      requirement: allowedStates,
      message: `Available in your state (${state})`
    }
  };
}

function evaluateRuralUrban(isRural: boolean, ruralOnly: boolean): any {
  if (ruralOnly && !isRural) {
    return {
      satisfied: false,
      unsatisfied: {
        criterion: 'location_type',
        currentValue: 'Urban',
        requiredValue: 'Rural',
        gap: 'Must be rural',
        message: 'This scheme is only for rural areas',
        fixable: false
      }
    };
  }
  
  return {
    satisfied: true,
    detail: {
      criterion: 'location_type',
      value: isRural ? 'Rural' : 'Urban',
      requirement: ruralOnly ? 'Rural' : 'Any',
      message: `Location type matches requirement`
    }
  };
}

function evaluateOccupation(occupation: string, allowedOccupations: string[]): any {
  if (!allowedOccupations.includes(occupation)) {
    return {
      satisfied: false,
      unsatisfied: {
        criterion: 'occupation',
        currentValue: occupation,
        requiredValue: allowedOccupations,
        gap: 'Not in allowed occupations',
        message: `Scheme is only for: ${allowedOccupations.join(', ')} (your occupation: ${occupation})`,
        fixable: false
      }
    };
  }
  
  return {
    satisfied: true,
    detail: {
      criterion: 'occupation',
      value: occupation,
      requirement: allowedOccupations,
      message: `Available for your occupation (${occupation})`
    }
  };
}

function evaluateGender(gender: string, allowedGenders: string[]): any {
  if (!allowedGenders.includes(gender)) {
    return {
      satisfied: false,
      unsatisfied: {
        criterion: 'gender',
        currentValue: gender,
        requiredValue: allowedGenders,
        gap: 'Not in allowed genders',
        message: `Scheme is only for: ${allowedGenders.join(', ')}`,
        fixable: false
      }
    };
  }
  
  return {
    satisfied: true,
    detail: {
      criterion: 'gender',
      value: gender,
      requirement: allowedGenders,
      message: `Available for your gender (${gender})`
    }
  };
}

function evaluateSocialCategory(category: string, allowedCategories: string[]): any {
  if (!allowedCategories.includes(category)) {
    return {
      satisfied: false,
      unsatisfied: {
        criterion: 'socialCategory',
        currentValue: category,
        requiredValue: allowedCategories,
        gap: 'Not in allowed categories',
        message: `Scheme is only for: ${allowedCategories.join(', ')} (your category: ${category})`,
        fixable: false
      }
    };
  }
  
  return {
    satisfied: true,
    detail: {
      criterion: 'socialCategory',
      value: category,
      requirement: allowedCategories,
      message: `Available for your social category (${category})`
    }
  };
}

function evaluateDisability(
  hasDisability: boolean,
  percentage: number | undefined,
  required: boolean,
  minPercentage?: number
): any {
  if (required && !hasDisability) {
    return {
      satisfied: false,
      unsatisfied: {
        criterion: 'disability',
        currentValue: false,
        requiredValue: true,
        gap: 'Disability required',
        message: 'Scheme requires having a disability',
        fixable: false
      }
    };
  }
  
  if (minPercentage && percentage && percentage < minPercentage) {
    return {
      satisfied: false,
      unsatisfied: {
        criterion: 'disability_percentage',
        currentValue: percentage,
        requiredValue: minPercentage,
        gap: `${minPercentage - percentage}% below requirement`,
        message: `Disability percentage must be at least ${minPercentage}% (current: ${percentage}%)`,
        fixable: false
      }
    };
  }
  
  return {
    satisfied: true,
    detail: {
      criterion: 'disability',
      value: hasDisability,
      requirement: required,
      message: required ? 'Disability requirement met' : 'No disability requirement'
    }
  };
}

function evaluateDocuments(documents: any, requiredDocs: string[]): any {
  const satisfied: CriterionDetail[] = [];
  const unsatisfied: UnsatisfiedCriterion[] = [];
  const missing: MissingDataItem[] = [];
  
  for (const docType of requiredDocs) {
    const doc = documents[docType];
    if (!doc || !doc.available) {
      missing.push({
        field: docType,
        importance: 'Critical',
        message: `${docType} document is required`
      });
    } else if (!doc.verified) {
      missing.push({
        field: docType,
        importance: 'Important',
        message: `${docType} document needs verification`
      });
    } else {
      satisfied.push({
        criterion: `document_${docType}`,
        value: true,
        requirement: true,
        message: `${docType} document verified`
      });
    }
  }
  
  return { satisfied, unsatisfied, missing };
}

function generateRecommendations(unsatisfied: UnsatisfiedCriterion[], missing: MissingDataItem[]): string[] {
  const recommendations: string[] = [];
  
  for (const item of unsatisfied) {
    if (item.fixable && item.howToFix) {
      recommendations.push(item.howToFix);
    }
  }
  
  for (const item of missing) {
    if (item.importance === 'Critical') {
      recommendations.push(`Upload ${item.field} to complete your profile`);
    }
  }
  
  return recommendations;
}

export async function predictTimeline(
  profile: UserProfileV2,
  scheme: SchemeV2,
  currentEligibility: EligibilityResultV2
): Promise<TimelinePrediction[]> {
  const predictions: TimelinePrediction[] = [];
  
  // Age-based predictions
  for (const blocker of currentEligibility.unsatisfiedCriteria) {
    if (blocker.criterion === 'age' && blocker.fixable) {
      const yearsUntil = parseInt(blocker.gap);
      if (!isNaN(yearsUntil)) {
        const eligibilityDate = new Date();
        eligibilityDate.setFullYear(eligibilityDate.getFullYear() + yearsUntil);
        
        predictions.push({
          schemeId: scheme.schemeId,
          schemeName: scheme.schemeName,
          date: eligibilityDate.toISOString(),
          event: `You will turn ${blocker.requiredValue} years old`,
          probability: 100,
          action: 'Apply when eligible'
        });
      }
    }
  }
  
  return predictions;
}
