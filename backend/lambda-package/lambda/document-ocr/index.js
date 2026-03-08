"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const client_textract_1 = require("@aws-sdk/client-textract");
const client_s3_1 = require("@aws-sdk/client-s3");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const textractClient = new client_textract_1.TextractClient({ region: process.env.AWS_REGION || 'us-east-1' });
const s3Client = new client_s3_1.S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamoClient = new client_dynamodb_1.DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const DOCUMENTS_BUCKET = process.env.DOCUMENTS_BUCKET || 'nexis-documents-dev';
const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE || 'nexis-documents-dev';
async function handler(event) {
    console.log('Document OCR Request:', JSON.stringify(event, null, 2));
    try {
        const { userId, documentType, imageData } = JSON.parse(event.body || '{}');
        if (!userId || !documentType || !imageData) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: { message: 'User ID, document type, and image data are required' }
                })
            };
        }
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(imageData, 'base64');
        // Save image to S3
        const s3Key = `documents/${userId}/${documentType}-${Date.now()}.jpg`;
        await s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: DOCUMENTS_BUCKET,
            Key: s3Key,
            Body: imageBuffer,
            ContentType: 'image/jpeg'
        }));
        // For prototype: Use mock OCR if Textract not available
        const useMock = process.env.MOCK_TEXTRACT === 'true';
        let extractedData;
        let confidence;
        if (useMock) {
            // Mock OCR data
            extractedData = mockExtractData(documentType);
            confidence = 0.88;
            console.log('Using mock OCR');
        }
        else {
            // Real Textract OCR
            const result = await performOCR(DOCUMENTS_BUCKET, s3Key, documentType);
            extractedData = result.data;
            confidence = result.confidence;
        }
        // Validate extracted data
        const validation = validateExtractedData(documentType, extractedData);
        // Save to DynamoDB
        const documentId = `doc-${Date.now()}`;
        await saveDocumentData(userId, documentId, documentType, s3Key, extractedData, validation);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                data: {
                    documentId,
                    documentType,
                    s3Path: s3Key,
                    extractedData,
                    confidence,
                    validationStatus: validation.status,
                    validationResults: validation.results
                }
            })
        };
    }
    catch (error) {
        console.error('OCR error:', error);
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
async function performOCR(bucket, key, documentType) {
    try {
        const command = new client_textract_1.AnalyzeDocumentCommand({
            Document: {
                S3Object: {
                    Bucket: bucket,
                    Name: key
                }
            },
            FeatureTypes: ['FORMS', 'TABLES']
        });
        const response = await textractClient.send(command);
        // Extract data based on document type
        let extractedData;
        switch (documentType) {
            case 'aadhaar':
                extractedData = extractAadhaarData(response.Blocks || []);
                break;
            case 'pan':
                extractedData = extractPANData(response.Blocks || []);
                break;
            case 'income':
                extractedData = extractIncomeCertificateData(response.Blocks || []);
                break;
            default:
                extractedData = extractGenericData(response.Blocks || []);
        }
        const confidence = calculateConfidence(response.Blocks || []);
        return { data: extractedData, confidence };
    }
    catch (error) {
        console.error('Textract error:', error);
        throw error;
    }
}
function extractAadhaarData(blocks) {
    return {
        aadhaarNumber: findField(blocks, /\d{4}\s?\d{4}\s?\d{4}/),
        name: findField(blocks, /name/i, 1),
        dob: findField(blocks, /\d{2}\/\d{2}\/\d{4}/),
        gender: findField(blocks, /(male|female)/i),
        address: findField(blocks, /address/i, 1)
    };
}
function extractPANData(blocks) {
    return {
        panNumber: findField(blocks, /[A-Z]{5}\d{4}[A-Z]/),
        name: findField(blocks, /name/i, 1),
        fatherName: findField(blocks, /father/i, 1),
        dob: findField(blocks, /\d{2}\/\d{2}\/\d{4}/)
    };
}
function extractIncomeCertificateData(blocks) {
    return {
        certificateNumber: findField(blocks, /certificate.*no/i, 1),
        name: findField(blocks, /name/i, 1),
        annualIncome: parseFloat(findField(blocks, /income.*(\d+)/i, 1) || '0'),
        issueDate: findField(blocks, /date/i, 1),
        issuingAuthority: findField(blocks, /authority/i, 1)
    };
}
function extractGenericData(blocks) {
    const data = {};
    blocks.forEach(block => {
        if (block.BlockType === 'LINE' && block.Text) {
            data[`line_${block.Id}`] = block.Text;
        }
    });
    return data;
}
function findField(blocks, pattern, offset = 0) {
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block.BlockType === 'LINE' && block.Text) {
            const match = block.Text.match(pattern);
            if (match) {
                if (offset > 0 && i + offset < blocks.length) {
                    return blocks[i + offset].Text || '';
                }
                return match[0];
            }
        }
    }
    return '';
}
function calculateConfidence(blocks) {
    const confidences = blocks
        .filter(b => b.Confidence !== undefined)
        .map(b => b.Confidence);
    if (confidences.length === 0)
        return 0;
    return confidences.reduce((a, b) => a + b, 0) / confidences.length / 100;
}
function validateExtractedData(documentType, data) {
    const results = [];
    if (documentType === 'aadhaar') {
        // Validate Aadhaar number format
        const aadhaarClean = (data.aadhaarNumber || '').replace(/\s/g, '');
        if (!/^\d{12}$/.test(aadhaarClean)) {
            results.push({
                field: 'aadhaarNumber',
                status: 'invalid',
                message: 'Invalid Aadhaar format (must be 12 digits)'
            });
        }
        else {
            results.push({
                field: 'aadhaarNumber',
                status: 'valid',
                message: 'Valid Aadhaar format'
            });
        }
    }
    if (documentType === 'pan') {
        // Validate PAN format
        if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(data.panNumber || '')) {
            results.push({
                field: 'panNumber',
                status: 'invalid',
                message: 'Invalid PAN format'
            });
        }
        else {
            results.push({
                field: 'panNumber',
                status: 'valid',
                message: 'Valid PAN format'
            });
        }
    }
    const status = results.some(r => r.status === 'invalid') ? 'needs_review' : 'verified';
    return { status, results };
}
function mockExtractData(documentType) {
    const mockData = {
        aadhaar: {
            aadhaarNumber: '1234 5678 9012',
            name: 'Ramesh Kumar',
            dob: '15/05/1980',
            gender: 'Male',
            address: 'Kothrud, Pune, Maharashtra'
        },
        pan: {
            panNumber: 'ABCDE1234F',
            name: 'Ramesh Kumar',
            fatherName: 'Suresh Kumar',
            dob: '15/05/1980'
        },
        income: {
            certificateNumber: 'IC/2026/12345',
            name: 'Ramesh Kumar',
            annualIncome: 150000,
            issueDate: '01/01/2026',
            issuingAuthority: 'Tehsildar, Pune'
        }
    };
    return mockData[documentType] || {};
}
async function saveDocumentData(userId, documentId, documentType, s3Path, extractedData, validation) {
    await dynamoClient.send(new client_dynamodb_1.PutItemCommand({
        TableName: DOCUMENTS_TABLE,
        Item: (0, util_dynamodb_1.marshall)({
            userId,
            sk: `DOC#${documentType}#${Date.now()}`,
            documentId,
            documentType,
            s3Path,
            extractedData,
            validationStatus: validation.status,
            validationResults: validation.results,
            uploadedAt: new Date().toISOString()
        })
    }));
}
