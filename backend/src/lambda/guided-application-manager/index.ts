import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { invokeClaudeModel } from '../../services/bedrock';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const APPLICATIONS_TABLE = process.env.APPLICATIONS_TABLE || 'nexis-applications-dev';

interface ApplicationStep {
  stepId: string;
  stepNumber: number;
  title: string;
  description: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'file' | 'checkbox';
  fieldName: string;
  required: boolean;
  validation: any[];
  helpText: string;
  aiGuidance?: string;
  options?: string[];
}

export async function handler(event: any) {
  console.log('Guided Application Request:', JSON.stringify(event, null, 2));
  
  const { action } = JSON.parse(event.body || '{}');
  
  try {
    if (action === 'start') {
      return await handleStart(event);
    } else if (action === 'next_step') {
      return await handleNextStep(event);
    } else if (action === 'submit') {
      return await handleSubmit(event);
    } else {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: { message: 'Invalid action' }
        })
      };
    }
  } catch (error: any) {
    console.error('Application error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: { message: error.message }
      })
    };
  }
}

async function handleStart(event: any) {
  const { userId, schemeId } = JSON.parse(event.body);
  
  // Generate application steps based on scheme
  const steps = generateApplicationSteps(schemeId);
  
  // Pre-fill data from user profile (if available)
  const prefilledData = await prefillFromProfile(userId, steps);
  
  const applicationId = `app-${Date.now()}`;
  
  const application = {
    applicationId,
    userId,
    schemeId,
    status: 'draft',
    currentStep: 0,
    totalSteps: steps.length,
    steps,
    formData: prefilledData,
    createdAt: new Date().toISOString()
  };
  
  // Save application
  await dynamoClient.send(new PutItemCommand({
    TableName: APPLICATIONS_TABLE,
    Item: marshall(application)
  }));
  
  // Generate AI guidance for first step
  const firstStep = steps[0];
  firstStep.aiGuidance = await generateStepGuidance(firstStep, prefilledData);
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      data: {
        applicationId,
        currentStep: firstStep,
        progress: 0,
        prefilledFields: Object.keys(prefilledData)
      }
    })
  };
}

async function handleNextStep(event: any) {
  const { applicationId, fieldValue } = JSON.parse(event.body);
  
  // Load application
  const application = await loadApplication(applicationId);
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  const currentStep = application.steps[application.currentStep];
  
  // Validate field value
  const validation = validateField(currentStep, fieldValue);
  
  if (!validation.valid) {
    // Generate AI suggestion for error
    const aiSuggestion = await getAISuggestion(currentStep, fieldValue, validation.errors);
    
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: {
          message: 'Validation failed',
          errors: validation.errors,
          aiSuggestion
        }
      })
    };
  }
  
  // Save field value
  application.formData[currentStep.fieldName] = fieldValue;
  application.currentStep += 1;
  
  // Update application
  await updateApplication(application);
  
  // Check if complete
  if (application.currentStep >= application.totalSteps) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: {
          status: 'complete',
          message: 'Application ready for submission',
          summary: generateApplicationSummary(application)
        }
      })
    };
  }
  
  // Get next step
  const nextStep = application.steps[application.currentStep];
  nextStep.aiGuidance = await generateStepGuidance(nextStep, application.formData);
  
  const progress = Math.round((application.currentStep / application.totalSteps) * 100);
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      data: {
        currentStep: nextStep,
        progress,
        canGoBack: application.currentStep > 0
      }
    })
  };
}

async function handleSubmit(event: any) {
  const { applicationId } = JSON.parse(event.body);
  
  const application = await loadApplication(applicationId);
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  // Final validation
  const finalValidation = validateCompleteApplication(application);
  
  if (!finalValidation.valid) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: {
          message: 'Application incomplete',
          missingFields: finalValidation.missingFields
        }
      })
    };
  }
  
  // Submit application
  application.status = 'submitted';
  application.submittedAt = new Date().toISOString();
  application.trackingNumber = generateTrackingNumber(application);
  
  await updateApplication(application);
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      data: {
        status: 'submitted',
        applicationId: application.applicationId,
        trackingNumber: application.trackingNumber,
        message: 'Application submitted successfully',
        estimatedProcessingTime: 30
      }
    })
  };
}

function generateApplicationSteps(schemeId: string): ApplicationStep[] {
  // Default steps for PM-KISAN scheme
  return [
    {
      stepId: 'step-1',
      stepNumber: 1,
      title: 'Applicant Name',
      description: 'Enter your full name as per Aadhaar',
      fieldType: 'text',
      fieldName: 'applicantName',
      required: true,
      validation: [{ type: 'minLength', value: 3 }],
      helpText: 'Name should match your Aadhaar card'
    },
    {
      stepId: 'step-2',
      stepNumber: 2,
      title: 'Aadhaar Number',
      description: 'Enter your 12-digit Aadhaar number',
      fieldType: 'text',
      fieldName: 'aadhaarNumber',
      required: true,
      validation: [{ type: 'pattern', value: '^\\d{12}$' }],
      helpText: 'Enter without spaces or dashes'
    },
    {
      stepId: 'step-3',
      stepNumber: 3,
      title: 'Land Size',
      description: 'Enter your total agricultural land in acres',
      fieldType: 'number',
      fieldName: 'landSize',
      required: true,
      validation: [{ type: 'min', value: 0.1 }],
      helpText: 'Enter land size in acres'
    },
    {
      stepId: 'step-4',
      stepNumber: 4,
      title: 'Bank Account Number',
      description: 'Enter your bank account number',
      fieldType: 'text',
      fieldName: 'bankAccount',
      required: true,
      validation: [{ type: 'minLength', value: 9 }],
      helpText: 'Benefits will be transferred to this account'
    },
    {
      stepId: 'step-5',
      stepNumber: 5,
      title: 'IFSC Code',
      description: 'Enter your bank IFSC code',
      fieldType: 'text',
      fieldName: 'ifscCode',
      required: true,
      validation: [{ type: 'pattern', value: '^[A-Z]{4}0[A-Z0-9]{6}$' }],
      helpText: 'Find IFSC code on your cheque or passbook'
    }
  ];
}

async function prefillFromProfile(userId: string, steps: ApplicationStep[]): Promise<any> {
  // In real implementation, fetch user profile from DynamoDB
  // For prototype, return empty object
  return {};
}

async function generateStepGuidance(step: ApplicationStep, formData: any): Promise<string> {
  const prompt = `
Generate a helpful guidance message for this application step:

Step: ${step.title}
Description: ${step.description}
Field Type: ${step.fieldType}
Help Text: ${step.helpText}

Already filled data: ${JSON.stringify(formData)}

Provide a short, friendly guidance message (max 50 words) to help the user fill this field correctly.`;

  try {
    const guidance = await invokeClaudeModel(prompt, undefined, 200);
    return guidance.trim();
  } catch (error) {
    return step.helpText;
  }
}

function validateField(step: ApplicationStep, value: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (step.required && !value) {
    errors.push('This field is required');
    return { valid: false, errors };
  }
  
  for (const rule of step.validation) {
    if (rule.type === 'minLength' && value.length < rule.value) {
      errors.push(`Minimum length is ${rule.value} characters`);
    }
    if (rule.type === 'pattern' && !new RegExp(rule.value).test(value)) {
      errors.push('Invalid format');
    }
    if (rule.type === 'min' && parseFloat(value) < rule.value) {
      errors.push(`Minimum value is ${rule.value}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

async function getAISuggestion(step: ApplicationStep, userInput: any, errors: string[]): Promise<string> {
  const prompt = `
User is filling an application form.

Field: ${step.title}
User input: ${userInput}
Validation errors: ${errors.join(', ')}

Provide a helpful suggestion in simple language (max 50 words) to help the user correct their input.`;

  try {
    return await invokeClaudeModel(prompt, undefined, 200);
  } catch (error) {
    return 'Please check your input and try again.';
  }
}

function validateCompleteApplication(application: any): { valid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  for (const step of application.steps) {
    if (step.required && !application.formData[step.fieldName]) {
      missingFields.push(step.fieldName);
    }
  }
  
  return { valid: missingFields.length === 0, missingFields };
}

function generateApplicationSummary(application: any): any {
  return {
    schemeId: application.schemeId,
    totalFields: application.steps.length,
    filledFields: Object.keys(application.formData).length,
    formData: application.formData
  };
}

function generateTrackingNumber(application: any): string {
  const scheme = application.schemeId.toUpperCase().replace(/-/g, '');
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${scheme}${date}${random}`;
}

async function loadApplication(applicationId: string): Promise<any> {
  const response = await dynamoClient.send(new GetItemCommand({
    TableName: APPLICATIONS_TABLE,
    Key: marshall({ applicationId })
  }));
  
  return response.Item ? unmarshall(response.Item) : null;
}

async function updateApplication(application: any): Promise<void> {
  await dynamoClient.send(new PutItemCommand({
    TableName: APPLICATIONS_TABLE,
    Item: marshall({
      ...application,
      updatedAt: new Date().toISOString()
    })
  }));
}
