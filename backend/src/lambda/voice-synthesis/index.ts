// @ts-nocheck
import { PollyClient, SynthesizeSpeechCommand, VoiceId, Engine } from '@aws-sdk/client-polly';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const pollyClient = new PollyClient({ region: process.env.AWS_REGION || 'us-east-1' });
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

const VOICE_BUCKET = process.env.VOICE_BUCKET || 'nexis-voice-dev';

export async function handler(event: any) {
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
    
    let audioUrl: string;
    let duration: number;
    
    if (useMock) {
      // Mock audio URL
      audioUrl = `https://${VOICE_BUCKET}.s3.amazonaws.com/mock-audio.mp3`;
      duration = text.length * 0.1; // Rough estimate
      console.log('Using mock synthesis');
    } else {
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
    
  } catch (error: any) {
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

async function synthesizeSpeech(
  text: string, 
  voiceId: string, 
  language: string
): Promise<{ audioUrl: string; duration: number }> {
  try {
    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voiceId as VoiceId,
      Engine: 'neural' as Engine,
      LanguageCode: language
    });
    
    const response = await pollyClient.send(command);
    
    if (!response.AudioStream) {
      throw new Error('No audio stream received from Polly');
    }
    
    // Convert stream to buffer
    const audioBuffer = await streamToBuffer(response.AudioStream as Readable);
    
    // Save to S3
    const audioKey = `voice-output/${Date.now()}.mp3`;
    await s3Client.send(new PutObjectCommand({
      Bucket: VOICE_BUCKET,
      Key: audioKey,
      Body: audioBuffer,
      ContentType: 'audio/mpeg'
    }));
    
    const audioUrl = `https://${VOICE_BUCKET}.s3.amazonaws.com/${audioKey}`;
    const duration = text.length * 0.08; // Rough estimate
    
    return { audioUrl, duration };
    
  } catch (error: any) {
    console.error('Polly synthesis error:', error);
    throw error;
  }
}

function selectVoice(language: string): string {
  const voiceMap: Record<string, string> = {
    'hi-IN': 'Aditi',      // Hindi female
    'en-IN': 'Kajal',      // Indian English female
    'en-US': 'Joanna',     // US English female
    'bn-IN': 'Aditi',      // Bengali (use Hindi voice)
    'te-IN': 'Aditi',      // Telugu (use Hindi voice)
    'mr-IN': 'Aditi',      // Marathi (use Hindi voice)
    'ta-IN': 'Aditi',      // Tamil (use Hindi voice)
  };
  
  return voiceMap[language] || 'Aditi';
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
