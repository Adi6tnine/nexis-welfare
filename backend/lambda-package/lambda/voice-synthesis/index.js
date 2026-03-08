"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
// @ts-nocheck
const client_polly_1 = require("@aws-sdk/client-polly");
const client_s3_1 = require("@aws-sdk/client-s3");
const pollyClient = new client_polly_1.PollyClient({ region: process.env.AWS_REGION || 'us-east-1' });
const s3Client = new client_s3_1.S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const VOICE_BUCKET = process.env.VOICE_BUCKET || 'nexis-voice-dev';
async function handler(event) {
    console.log('Voice Synthesis Request:', JSON.stringify(event, null, 2));
    try {
        const { text, language = 'hi-IN', voiceId, sessionId } = JSON.parse(event.body || '{}');
        if (!text) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: { message: 'Text is required' }
                })
            };
        }
        // Select voice based on language
        const selectedVoice = voiceId || selectVoice(language);
        // For prototype: Use mock synthesis if Polly not available
        const useMock = process.env.MOCK_POLLY === 'true';
        let audioUrl;
        let duration;
        if (useMock) {
            // Mock audio URL
            audioUrl = `https://${VOICE_BUCKET}.s3.amazonaws.com/mock-audio.mp3`;
            duration = text.length * 0.1; // Rough estimate
            console.log('Using mock synthesis');
        }
        else {
            // Real Polly synthesis
            const result = await synthesizeSpeech(text, selectedVoice, language);
            audioUrl = result.audioUrl;
            duration = result.duration;
        }
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                data: {
                    audioUrl,
                    duration,
                    text,
                    language,
                    voiceId: selectedVoice
                }
            })
        };
    }
    catch (error) {
        console.error('Synthesis error:', error);
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
async function synthesizeSpeech(text, voiceId, language) {
    try {
        const command = new client_polly_1.SynthesizeSpeechCommand({
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: voiceId,
            Engine: 'neural',
            LanguageCode: language
        });
        const response = await pollyClient.send(command);
        if (!response.AudioStream) {
            throw new Error('No audio stream received from Polly');
        }
        // Convert stream to buffer
        const audioBuffer = await streamToBuffer(response.AudioStream);
        // Save to S3
        const audioKey = `voice-output/${Date.now()}.mp3`;
        await s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: VOICE_BUCKET,
            Key: audioKey,
            Body: audioBuffer,
            ContentType: 'audio/mpeg'
        }));
        const audioUrl = `https://${VOICE_BUCKET}.s3.amazonaws.com/${audioKey}`;
        const duration = text.length * 0.08; // Rough estimate
        return { audioUrl, duration };
    }
    catch (error) {
        console.error('Polly synthesis error:', error);
        throw error;
    }
}
function selectVoice(language) {
    const voiceMap = {
        'hi-IN': 'Aditi', // Hindi female
        'en-IN': 'Kajal', // Indian English female
        'en-US': 'Joanna', // US English female
        'bn-IN': 'Aditi', // Bengali (use Hindi voice)
        'te-IN': 'Aditi', // Telugu (use Hindi voice)
        'mr-IN': 'Aditi', // Marathi (use Hindi voice)
        'ta-IN': 'Aditi', // Tamil (use Hindi voice)
    };
    return voiceMap[language] || 'Aditi';
}
async function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}
