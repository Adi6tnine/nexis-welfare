import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { ConversationHistory } from '../components/ConversationHistory';
import { getLanguage } from '../services/storage';
import { ProgressBar, pageVariants } from '../components/EditorialComponents';
import { Mic, CheckCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'system';
  text: string;
  audioUrl?: string;
  timestamp: string;
}

export default function VoiceOnboardingPage() {
  const navigate = useNavigate();
  const [sessionId] = useState(() => 'session-' + Date.now());
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [collectedData, setCollectedData] = useState<any>({});
  const [language] = useState(getLanguage());

  // Start conversation on mount
  useEffect(() => {
    startConversation();
  }, []);

  const startConversation = async () => {
    const greeting = language === 'hi' 
      ? 'Namaste! Main NEXIS hoon. Main aapki madad karunga sarkari yojanaon ke baare mein jaanne mein. Aapka naam kya hai?'
      : 'Hello! I am NEXIS. I will help you learn about government schemes. What is your name?';

    // Get audio for greeting
    const audioUrl = await synthesizeSpeech(greeting);

    setConversation([{
      role: 'system',
      text: greeting,
      audioUrl,
      timestamp: new Date().toISOString()
    }]);
  };

  const handleTranscript = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Import mock API
      const { mockFetch } = await import('../services/mockApi');
      
      // Send to conversation manager
      const response = await mockFetch('/api/voice/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userInput: text,
          language: language === 'hi' ? 'hi' : 'en'
        })
      });

      const data = await response.json();

      if (data.success) {
        const { response: systemText, extractedData, progress: newProgress, isComplete, collectedData: newData } = data.data;

        // Update progress and collected data
        setProgress(newProgress);
        setCollectedData(newData);

        // Get audio for system response
        const audioUrl = await synthesizeSpeech(systemText);

        // Add system message
        const systemMessage: Message = {
          role: 'system',
          text: systemText,
          audioUrl,
          timestamp: new Date().toISOString()
        };

        setConversation(prev => [...prev, systemMessage]);

        // If profile is complete, navigate to results
        if (isComplete) {
          setTimeout(() => {
            // Save profile and navigate
            localStorage.setItem('userProfile', JSON.stringify(newData));
            navigate('/results');
          }, 3000);
        }
      } else {
        throw new Error(data.error?.message || 'Conversation failed');
      }

    } catch (error: any) {
      console.error('Conversation error:', error);
      
      const errorMessage: Message = {
        role: 'system',
        text: language === 'hi' 
          ? 'Maaf kijiye, kuch galat ho gaya. Kripya phir se koshish karein.'
          : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const synthesizeSpeech = async (text: string): Promise<string | undefined> => {
    try {
      // Import mock API
      const { mockFetch } = await import('../services/mockApi');
      
      const response = await mockFetch('/api/voice/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: language === 'hi' ? 'hi-IN' : 'en-IN',
          sessionId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.audioUrl;
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
    
    return undefined;
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FAF9F6]"
    >
      {/* Header */}
      <header className="bg-[#FAF9F6] border-b-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#059669] border-2 border-stone-900 flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
                <Mic size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900">Voice Profile Creation</h1>
                <p className="text-sm text-stone-600 font-medium">
                  {language === 'hi' ? 'आवाज़ से प्रोफ़ाइल बनाएं' : 'Create profile with voice'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
            >
              Skip to form
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-700">Profile Completion</span>
            <span className="text-2xl font-serif font-bold text-[#059669]">{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {/* Conversation Area */}
        <div className="bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] mb-6">
          <div className="p-6">
            <ConversationHistory messages={conversation} autoPlay={true} />
          </div>
        </div>

        {/* Voice Recorder */}
        <div className="bg-[#FAF9F6] border-2 border-stone-900 shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] p-8">
          <VoiceRecorder
            onTranscript={handleTranscript}
            language={language === 'hi' ? 'hi-IN' : 'en-IN'}
            disabled={isProcessing}
          />
        </div>

        {/* Collected Data Preview */}
        {Object.keys(collectedData).length > 0 && (
          <div className="mt-6 bg-[#ECFDF5] border-2 border-[#059669]/30 p-5 shadow-[2px_2px_0px_0px_rgba(5,150,105,0.2)]">
            <h3 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">Collected Information:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(collectedData).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-[#059669]" strokeWidth={2.5} />
                  <span className="text-stone-700 font-medium">
                    <span className="font-bold capitalize">{key}:</span> {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-stone-600 font-medium">
          <p>
            {language === 'hi' 
              ? 'टिप: स्पष्ट और धीरे बोलें। आप किसी भी समय रुक सकते हैं।'
              : 'Tip: Speak clearly and slowly. You can pause at any time.'
            }
          </p>
        </div>
      </main>
    </motion.div>
  );
}
