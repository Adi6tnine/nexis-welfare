"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const bedrock_1 = require("../../services/bedrock");
const dynamoClient = new client_dynamodb_1.DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const CONVERSATIONS_TABLE = process.env.CONVERSATIONS_TABLE || 'nexis-voice-conversations-dev';
async function handler(event) {
    console.log('Voice Conversation Request:', JSON.stringify(event, null, 2));
    try {
        const { sessionId, userInput, language = 'hi' } = JSON.parse(event.body || '{}');
        if (!sessionId || !userInput) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: { message: 'Session ID and user input are required' }
                })
            };
        }
        // Load conversation context
        let context = await loadContext(sessionId);
        // If new session, initialize
        if (!context) {
            context = {
                sessionId,
                currentIntent: 'profile_collection',
                collectedData: {},
                nextQuestion: '',
                completedFields: [],
                language,
                turnNumber: 0
            };
        }
        context.turnNumber++;
        // Extract data from user input using AI
        const extractedData = await extractDataFromInput(userInput, context, language);
        // Update context with extracted data
        context.collectedData = { ...context.collectedData, ...extractedData };
        const newFields = Object.keys(extractedData).filter(k => !context.completedFields.includes(k));
        context.completedFields.push(...newFields);
        // Determine next question
        const nextQuestion = determineNextQuestion(context, language);
        context.nextQuestion = nextQuestion;
        // Calculate progress
        const progress = calculateProgress(context);
        const isComplete = isProfileComplete(context);
        // Save context and conversation turn
        await saveContext(context);
        await saveConversationTurn(sessionId, context.turnNumber, userInput, nextQuestion, extractedData);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                data: {
                    response: nextQuestion,
                    extractedData,
                    progress,
                    isComplete,
                    collectedData: context.collectedData
                }
            })
        };
    }
    catch (error) {
        console.error('Conversation error:', error);
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
async function extractDataFromInput(input, context, language) {
    const prompt = `
Extract structured data from this user input in ${language}:
"${input}"

Context: We are collecting profile data for government scheme eligibility.
Already collected: ${JSON.stringify(context.collectedData)}
Completed fields: ${context.completedFields.join(', ')}

Extract any of these fields if present:
- name (string)
- age (number)
- occupation (string: Farmer, Student, Worker, etc.)
- annualIncome (number in rupees)
- state (2-letter code: MH, UP, etc.)
- landSize (number in acres, if farmer)
- hasDisability (boolean)
- gender (Male/Female/Other)

Return ONLY valid JSON with extracted fields. If nothing can be extracted, return {}.
Example: {"age": 45, "occupation": "Farmer"}`;
    try {
        const response = await (0, bedrock_1.invokeClaudeModel)(prompt, undefined, 500);
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return {};
    }
    catch (error) {
        console.error('Data extraction error:', error);
        return {};
    }
}
function determineNextQuestion(context, language) {
    const questions = getQuestions(language);
    const { collectedData, completedFields } = context;
    // Priority order of questions
    const questionOrder = [
        { field: 'name', question: questions.name },
        { field: 'age', question: questions.age },
        { field: 'occupation', question: questions.occupation },
        { field: 'state', question: questions.state },
        { field: 'annualIncome', question: questions.income },
        { field: 'gender', question: questions.gender },
        { field: 'hasDisability', question: questions.disability }
    ];
    // Check occupation-specific questions
    if (collectedData.occupation === 'Farmer' && !completedFields.includes('landSize')) {
        return questions.farmer_land;
    }
    // Find next unanswered question
    for (const { field, question } of questionOrder) {
        if (!completedFields.includes(field) && !collectedData[field]) {
            return question;
        }
    }
    // All basic questions answered
    return language === 'hi'
        ? 'Dhanyavaad! Main aapke liye yojanaon ki jaanch kar raha hoon...'
        : 'Thank you! I am checking schemes for you...';
}
function getQuestions(language) {
    const questions = {
        hi: {
            name: 'Namaste! Aapka naam kya hai?',
            age: 'Aapki umar kitni hai?',
            occupation: 'Aap kya kaam karte hain?',
            farmer_land: 'Aapke paas kitni zameen hai?',
            income: 'Aapki saalana aamdani kitni hai?',
            state: 'Aap kis rajya mein rehte hain?',
            gender: 'Aap male hain ya female?',
            disability: 'Kya aapko koi disability hai?'
        },
        en: {
            name: 'Hello! What is your name?',
            age: 'What is your age?',
            occupation: 'What is your occupation?',
            farmer_land: 'How much land do you own?',
            income: 'What is your annual income?',
            state: 'Which state do you live in?',
            gender: 'What is your gender?',
            disability: 'Do you have any disability?'
        }
    };
    return questions[language] || questions.en;
}
function calculateProgress(context) {
    const totalFields = 7; // Basic fields to collect
    return Math.round((context.completedFields.length / totalFields) * 100);
}
function isProfileComplete(context) {
    const requiredFields = ['age', 'occupation', 'state', 'annualIncome'];
    return requiredFields.every(field => context.completedFields.includes(field) || context.collectedData[field]);
}
async function loadContext(sessionId) {
    try {
        const response = await dynamoClient.send(new client_dynamodb_1.GetItemCommand({
            TableName: CONVERSATIONS_TABLE,
            Key: (0, util_dynamodb_1.marshall)({ sessionId, sk: 'CONTEXT' })
        }));
        if (response.Item) {
            return (0, util_dynamodb_1.unmarshall)(response.Item);
        }
        return null;
    }
    catch (error) {
        console.error('Error loading context:', error);
        return null;
    }
}
async function saveContext(context) {
    await dynamoClient.send(new client_dynamodb_1.PutItemCommand({
        TableName: CONVERSATIONS_TABLE,
        Item: (0, util_dynamodb_1.marshall)({
            sessionId: context.sessionId,
            sk: 'CONTEXT',
            ...context,
            updatedAt: new Date().toISOString()
        })
    }));
}
async function saveConversationTurn(sessionId, turnNumber, userInput, systemResponse, extractedData) {
    await dynamoClient.send(new client_dynamodb_1.PutItemCommand({
        TableName: CONVERSATIONS_TABLE,
        Item: (0, util_dynamodb_1.marshall)({
            sessionId,
            sk: `TURN#${turnNumber.toString().padStart(5, '0')}`,
            turnNumber,
            userInput,
            systemResponse,
            extractedData,
            timestamp: new Date().toISOString()
        })
    }));
}
