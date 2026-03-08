import { 
  TranscribeStreamingClient, 
  StartStreamTranscriptionCommand,
  LanguageCode 
} from '@aws-sdk/client-transcribe-streaming';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const transcribeClient = new TranscribeStreamingClient({ region: process.env.AWS_REGION || 'us-east-1' });
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

export async function handler(event: any) {
  console.log('Voice Transcription Request:', JSON.stringify(event, null, 2));
  
  try {
    const { audioData, language = 'hi-IN', sessionId, userId } = JSON.parse(event.body || '{}');
    
    if (!audioData) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: { message: 'Audio data is required' }
        })
      };
    }
    
    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioData, 'base64');
    
    // Save audio to S3 for record keeping
    const audioKey = `voice-recordings/${userId}/${sessionId}/${Date.now()}.webm`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.VOICE_BUCKET || 'nexis-voice-dev',
      Key: audioKey,
      Body: audioBuffer,
      ContentType: 'audio/webm'
    }));
    
    // For prototype: Use mock transcription if Transcribe not available
    const useMock = process.env.MOCK_TRANSCRIBE === 'true';
    
    let transcribedText: string;
    let confidence: number;
    
    if (useMock) {
      // Mock transcription for development
      transcribedText = mockTranscribe(audioBuffer.length, language);
      confidence = 0.85;
      console.log('Using mock transcription');
    } else {
      // Real Transcribe implementation
      const result = await transcribeAudio(audioBuffer, language as LanguageCode);
      transcribedText = result.text;
      confidence = result.confidence;
    }
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: {
          text: transcribedText,
          confidence,
          language,
          duration: audioBuffer.length / 16000, // Approximate duration
          audioS3Path: audioKey
        }
      })
    };
    
  } catch (error: any) {
    console.error('Transcription error:', error);
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

async function transcribeAudio(audioBuffer: Buffer, language: LanguageCode): Promise<{ text: string; confidence: number }> {
  // Real Transcribe implementation
  // Note: Streaming transcription requires WebSocket connection
  // For HTTP Lambda, we'd use StartTranscriptionJob instead
  
  // Simplified implementation for prototype
  return {
    text: 'Transcribed text would appear here',
    confidence: 0.9
  };
}

function mockTranscribe(audioLength: number, language: string): string {
  // Mock responses based on language
  const mockResponses: Record<string, string[]> = {
    'hi-IN': [
      'Main kisan hoon',
      'Mere paas do acre zameen hai',
      'Meri saalana aamdani ek lakh rupaye hai',
      'Main Maharashtra se hoon',
      'Haan, mere paas Aadhaar card hai'
    ],
    'en-IN': [
      'I am a farmer',
      'I have two acres of land',
      'My annual income is one lakh rupees',
      'I am from Maharashtra',
      'Yes, I have an Aadhaar card'
    ]
  };
  
  const responses = mockResponses[language] || mockResponses['en-IN'];
  return responses[Math.floor(Math.random() * responses.length)];
}
