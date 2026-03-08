"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateEligibility = evaluateEligibility;
exports.evaluateAgeCriterion = evaluateAgeCriterion;
exports.evaluateIncomeCriterion = evaluateIncomeCriterion;
exports.evaluateStateCriterion = evaluateStateCriterion;
exports.evaluateOccupationCriterion = evaluateOccupationCriterion;
exports.evaluateGenderCriterion = evaluateGenderCriterion;
exports.evaluateSocialCategoryCriterion = evaluateSocialCategoryCriterion;
exports.evaluateDisabilityCriterion = evaluateDisabilityCriterion;
exports.getSatisfiedCriteria = getSatisfiedCriteria;
exports.getUnsatisfiedCriteria = getUnsatisfiedCriteria;
/**
 * Evaluate if a user profile satisfies a scheme's eligibility criteria
 */
function evaluateEligibility(profile, scheme) {
    const criteria = scheme.eligibilityCriteria;
    const results = [];
    // Evaluate each criterion
    const ageResult = evaluateAgeCriterion(profile, criteria);
    if (ageResult)
        results.push(ageResult);
    const incomeResult = evaluateIncomeCriterion(profile, criteria);
    if (incomeResult)
        results.push(incomeResult);
    const stateResult = evaluateStateCriterion(profile, criteria);
    if (stateResult)
        results.push(stateResult);
    const occupationResult = evaluateOccupationCriterion(profile, criteria);
    if (occupationResult)
        results.push(occupationResult);
    const genderResult = evaluateGenderCriterion(profile, criteria);
    if (genderResult)
        results.push(genderResult);
    const socialCategoryResult = evaluateSocialCategoryCriterion(profile, criteria);
    if (socialCategoryResult)
        results.push(socialCategoryResult);
    const disabilityResult = evaluateDisabilityCriterion(profile, criteria);
    if (disabilityResult)
        results.push(disabilityResult);
    // Determine overall eligibility (all criteria must be satisfied)
    const isEligible = results.every(r => r.satisfied);
    // Calculate match score (percentage of satisfied criteria)
    const matchScore = results.length > 0
        ? Math.round((results.filter(r => r.satisfied).length / results.length) * 100)
        : 100; // If no criteria, 100% match
    return { isEligible, results, matchScore };
}
/**
 * Evaluate age criterion
 */
function evaluateAgeCriterion(profile, criteria) {
    const { ageMin, ageMax } = criteria;
    // If no age criteria specified, criterion is not applicable
    if (ageMin === undefined && ageMax === undefined) {
        return null;
    }
    const age = profile.age;
    // Check minimum age
    if (ageMin !== undefined && age < ageMin) {
        return {
            criterion: 'age',
            satisfied: false,
            reason: `Age must be at least ${ageMin} years (current: ${age})`
        };
    }
    // Check maximum age
    if (ageMax !== undefined && age > ageMax) {
        return {
            criterion: 'age',
            satisfied: false,
            reason: `Age must be at most ${ageMax} years (current: ${age})`
        };
    }
    // Age is within range
    const rangeText = ageMin !== undefined && ageMax !== undefined
        ? `${ageMin}-${ageMax} years`
        : ageMin !== undefined
            ? `at least ${ageMin} years`
            : `at most ${ageMax} years`;
    return {
        criterion: 'age',
        satisfied: true,
        reason: `Age ${age} is within required range (${rangeText})`
    };
}
/**
 * Evaluate income criterion
 */
function evaluateIncomeCriterion(profile, criteria) {
    const { incomeMax } = criteria;
    // If no income criteria specified, criterion is not applicable
    if (incomeMax === undefined) {
        return null;
    }
    const income = profile.annualIncome;
    if (income > incomeMax) {
        return {
            criterion: 'income',
            satisfied: false,
            reason: `Annual income must be at most ₹${incomeMax.toLocaleString('en-IN')} (current: ₹${income.toLocaleString('en-IN')})`
        };
    }
    return {
        criterion: 'income',
        satisfied: true,
        reason: `Annual income ₹${income.toLocaleString('en-IN')} is within limit (₹${incomeMax.toLocaleString('en-IN')})`
    };
}
/**
 * Evaluate state criterion
 */
function evaluateStateCriterion(profile, criteria) {
    const { states } = criteria;
    // If no state criteria specified, criterion is not applicable
    if (!states || states.length === 0) {
        return null;
    }
    const userState = profile.state;
    if (!states.includes(userState)) {
        return {
            criterion: 'state',
            satisfied: false,
            reason: `Scheme is only available in: ${states.join(', ')} (your state: ${userState})`
        };
    }
    return {
        criterion: 'state',
        satisfied: true,
        reason: `Available in your state (${userState})`
    };
}
/**
 * Evaluate occupation criterion
 */
function evaluateOccupationCriterion(profile, criteria) {
    const { occupations } = criteria;
    // If no occupation criteria specified, criterion is not applicable
    if (!occupations || occupations.length === 0) {
        return null;
    }
    const userOccupation = profile.occupation;
    if (!occupations.includes(userOccupation)) {
        return {
            criterion: 'occupation',
            satisfied: false,
            reason: `Scheme is only for: ${occupations.join(', ')} (your occupation: ${userOccupation})`
        };
    }
    return {
        criterion: 'occupation',
        satisfied: true,
        reason: `Available for your occupation (${userOccupation})`
    };
}
/**
 * Evaluate gender criterion
 */
function evaluateGenderCriterion(profile, criteria) {
    const { gender } = criteria;
    // If no gender criteria specified, criterion is not applicable
    if (!gender || gender.length === 0) {
        return null;
    }
    const userGender = profile.gender;
    if (!gender.includes(userGender)) {
        return {
            criterion: 'gender',
            satisfied: false,
            reason: `Scheme is only for: ${gender.join(', ')} (your gender: ${userGender})`
        };
    }
    return {
        criterion: 'gender',
        satisfied: true,
        reason: `Available for your gender (${userGender})`
    };
}
/**
 * Evaluate social category criterion
 */
function evaluateSocialCategoryCriterion(profile, criteria) {
    const { socialCategories } = criteria;
    // If no social category criteria specified, criterion is not applicable
    if (!socialCategories || socialCategories.length === 0) {
        return null;
    }
    const userCategory = profile.socialCategory;
    if (!socialCategories.includes(userCategory)) {
        return {
            criterion: 'socialCategory',
            satisfied: false,
            reason: `Scheme is only for: ${socialCategories.join(', ')} (your category: ${userCategory})`
        };
    }
    return {
        criterion: 'socialCategory',
        satisfied: true,
        reason: `Available for your social category (${userCategory})`
    };
}
/**
 * Evaluate disability criterion
 */
function evaluateDisabilityCriterion(profile, criteria) {
    const { requiresDisability } = criteria;
    // If no disability criteria specified, criterion is not applicable
    if (requiresDisability === undefined) {
        return null;
    }
    const hasDisability = profile.hasDisability;
    if (requiresDisability && !hasDisability) {
        return {
            criterion: 'disability',
            satisfied: false,
            reason: 'Scheme requires having a disability'
        };
    }
    if (!requiresDisability && hasDisability) {
        // This is unusual but technically possible
        return {
            criterion: 'disability',
            satisfied: false,
            reason: 'Scheme is not available for persons with disabilities'
        };
    }
    return {
        criterion: 'disability',
        satisfied: true,
        reason: requiresDisability
            ? 'You meet the disability requirement'
            : 'No disability requirement'
    };
}
/**
 * Get list of satisfied criteria names
 */
function getSatisfiedCriteria(results) {
    return results
        .filter(r => r.satisfied)
        .map(r => r.reason || r.criterion);
}
/**
 * Get list of unsatisfied criteria with reasons
 */
function getUnsatisfiedCriteria(results) {
    return results
        .filter(r => !r.satisfied)
        .map(r => ({
        criterion: r.criterion,
        reason: r.reason || 'Criterion not satisfied'
    }));
}
