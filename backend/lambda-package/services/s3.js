"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSchemeDocument = fetchSchemeDocument;
exports.fetchAllSchemes = fetchAllSchemes;
exports.fetchPolicyDocument = fetchPolicyDocument;
exports.fetchFaqDocument = fetchFaqDocument;
exports.uploadSchemeMetadata = uploadSchemeMetadata;
exports.uploadPolicyDocument = uploadPolicyDocument;
exports.uploadFaqDocument = uploadFaqDocument;
exports.clearSchemeCache = clearSchemeCache;
const client_s3_1 = require("@aws-sdk/client-s3");
// S3 Client Configuration
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    ...(process.env.AWS_ENDPOINT_URL && {
        endpoint: process.env.AWS_ENDPOINT_URL,
        forcePathStyle: true
    })
});
// Bucket name from environment variable
const KNOWLEDGE_BASE_BUCKET = process.env.KNOWLEDGE_BASE_BUCKET || 'nexis-knowledge-base-dev';
// In-memory cache for scheme documents
let schemeCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
/**
 * Fetch a single scheme document from S3
 */
async function fetchSchemeDocument(schemeId) {
    try {
        const key = `schemes/${schemeId}/metadata.json`;
        const command = new client_s3_1.GetObjectCommand({
            Bucket: KNOWLEDGE_BASE_BUCKET,
            Key: key
        });
        const response = await s3Client.send(command);
        if (!response.Body) {
            return null;
        }
        const bodyContents = await streamToString(response.Body);
        const scheme = JSON.parse(bodyContents);
        return scheme;
    }
    catch (error) {
        if (error.name === 'NoSuchKey') {
            console.warn(`Scheme document not found: ${schemeId}`);
            return null;
        }
        console.error(`Error fetching scheme document ${schemeId}:`, error);
        throw error;
    }
}
/**
 * Fetch all scheme documents from S3 with caching
 */
async function fetchAllSchemes() {
    // Check cache
    const now = Date.now();
    if (schemeCache && (now - cacheTimestamp) < CACHE_TTL) {
        console.log('Returning cached schemes');
        return schemeCache;
    }
    try {
        // List all scheme metadata files
        const listCommand = new client_s3_1.ListObjectsV2Command({
            Bucket: KNOWLEDGE_BASE_BUCKET,
            Prefix: 'schemes/',
            Delimiter: '/'
        });
        const listResponse = await s3Client.send(listCommand);
        if (!listResponse.CommonPrefixes || listResponse.CommonPrefixes.length === 0) {
            console.warn('No schemes found in S3 bucket');
            return [];
        }
        // Extract scheme IDs from prefixes
        const schemeIds = listResponse.CommonPrefixes
            .map(prefix => prefix.Prefix?.split('/')[1])
            .filter(Boolean);
        console.log(`Found ${schemeIds.length} schemes in S3`);
        // Fetch all scheme documents in parallel
        const schemePromises = schemeIds.map(schemeId => fetchSchemeDocument(schemeId));
        const schemes = await Promise.all(schemePromises);
        // Filter out null values (missing documents)
        const validSchemes = schemes.filter(Boolean);
        // Update cache
        schemeCache = validSchemes;
        cacheTimestamp = now;
        console.log(`Cached ${validSchemes.length} valid schemes`);
        return validSchemes;
    }
    catch (error) {
        console.error('Error fetching all schemes:', error);
        throw error;
    }
}
/**
 * Fetch policy document text for a scheme
 */
async function fetchPolicyDocument(schemeId) {
    try {
        const key = `schemes/${schemeId}/policy.txt`;
        const command = new client_s3_1.GetObjectCommand({
            Bucket: KNOWLEDGE_BASE_BUCKET,
            Key: key
        });
        const response = await s3Client.send(command);
        if (!response.Body) {
            return null;
        }
        return await streamToString(response.Body);
    }
    catch (error) {
        if (error.name === 'NoSuchKey') {
            console.warn(`Policy document not found: ${schemeId}`);
            return null;
        }
        console.error(`Error fetching policy document ${schemeId}:`, error);
        throw error;
    }
}
/**
 * Fetch FAQ document text for a scheme
 */
async function fetchFaqDocument(schemeId) {
    try {
        const key = `schemes/${schemeId}/faq.txt`;
        const command = new client_s3_1.GetObjectCommand({
            Bucket: KNOWLEDGE_BASE_BUCKET,
            Key: key
        });
        const response = await s3Client.send(command);
        if (!response.Body) {
            return null;
        }
        return await streamToString(response.Body);
    }
    catch (error) {
        if (error.name === 'NoSuchKey') {
            console.warn(`FAQ document not found: ${schemeId}`);
            return null;
        }
        console.error(`Error fetching FAQ document ${schemeId}:`, error);
        throw error;
    }
}
/**
 * Upload scheme metadata to S3
 */
async function uploadSchemeMetadata(schemeId, scheme) {
    const key = `schemes/${schemeId}/metadata.json`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: KNOWLEDGE_BASE_BUCKET,
        Key: key,
        Body: JSON.stringify(scheme, null, 2),
        ContentType: 'application/json'
    });
    await s3Client.send(command);
    // Invalidate cache
    schemeCache = null;
    console.log(`Uploaded scheme metadata: ${schemeId}`);
}
/**
 * Upload policy document to S3
 */
async function uploadPolicyDocument(schemeId, content) {
    const key = `schemes/${schemeId}/policy.txt`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: KNOWLEDGE_BASE_BUCKET,
        Key: key,
        Body: content,
        ContentType: 'text/plain'
    });
    await s3Client.send(command);
    console.log(`Uploaded policy document: ${schemeId}`);
}
/**
 * Upload FAQ document to S3
 */
async function uploadFaqDocument(schemeId, content) {
    const key = `schemes/${schemeId}/faq.txt`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: KNOWLEDGE_BASE_BUCKET,
        Key: key,
        Body: content,
        ContentType: 'text/plain'
    });
    await s3Client.send(command);
    console.log(`Uploaded FAQ document: ${schemeId}`);
}
/**
 * Clear scheme cache (for testing)
 */
function clearSchemeCache() {
    schemeCache = null;
    cacheTimestamp = 0;
}
/**
 * Helper function to convert stream to string
 */
async function streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    let content = buffer.toString('utf-8');
    // Remove BOM (Byte Order Mark) if present
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    return content;
}
