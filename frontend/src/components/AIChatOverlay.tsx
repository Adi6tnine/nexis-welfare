import { X, Mic, Send, Sparkles, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { getLanguage } from '../services/storage';
import { chatWithAI } from '../services/bedrockAI';
import { getCurrentUser } from '../services/auth';

interface AIChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export function AIChatOverlay({ isOpen, onClose }: AIChatOverlayProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [eligibleSchemes, setEligibleSchemes] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const language = getLanguage();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Load user profile and context
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const user = getCurrentUser();
      setUserProfile({ ...profile, ...user });
      
      // Load eligible schemes from last check
      const results = localStorage.getItem('eligibilityResults');
      if (results) {
        try {
          const parsed = JSON.parse(results);
          setEligibleSchemes(parsed.eligibleSchemes || []);
        } catch (e) {
          console.error('Failed to load results');
        }
      }
      
      // Personalized greeting
      const userName = user?.name || (profile.age ? 'there' : '');
      const greeting = language === 'hi' 
        ? `नमस्ते${userName ? ' ' + userName : ''}! मैं NEXIS AI सहायक हूँ। ${profile.age ? `मैं देख रहा हूँ कि आप ${profile.age} साल के हैं और ${profile.state || 'भारत'} से हैं।` : ''} मैं आपको सरकारी योजनाओं के बारे में जानकारी देने में मदद कर सकता हूँ। आप मुझसे कुछ भी पूछ सकते हैं!`
        : `Namaste${userName ? ' ' + userName : ''}! I'm NEXIS AI Assistant. ${profile.age ? `I see you're ${profile.age} years old from ${profile.state || 'India'}.` : ''} I can help you with information about government schemes. Ask me anything!`;
      
      setMessages([{ role: 'assistant', text: greeting }]);
    }
  }, [isOpen, language, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message
    const userMsg: Message = { role: 'user', text: message };
    setMessages(prev => [...prev, userMsg]);
    const currentMessage = message;
    setMessage('');
    setIsTyping(true);

    try {
      // Call real Bedrock AI via backend
      const context = {
        schemeName: eligibleSchemes.length > 0 ? eligibleSchemes[0].schemeName : 'General Query',
        schemeDescription: eligibleSchemes.length > 0 ? eligibleSchemes[0].description : 'Government schemes information',
        benefits: eligibleSchemes.length > 0 ? eligibleSchemes[0].benefits : 'Various government benefits',
        eligibleSchemes: eligibleSchemes.map(s => s.schemeName).join(', '),
        eligibleCount: eligibleSchemes.length
      };

      const response = await chatWithAI(
        currentMessage,
        context,
        userProfile,
        language,
        sessionId
      );

      setSessionId(response.sessionId);
      const assistantMsg: Message = { role: 'assistant', text: response.response };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error calling AI:', error);
      // Fallback to basic response
      const fallbackMsg: Message = {
        role: 'assistant',
        text: language === 'hi'
          ? 'क्षमा करें, मुझे कुछ तकनीकी समस्या हो रही है। कृपया फिर से प्रयास करें।'
          : 'Sorry, I\'m experiencing some technical issues. Please try again.'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-[2.5rem] h-[80vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center font-bold border-2 border-white/30">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Sahayak</h3>
                  <p className="text-[10px] uppercase font-bold text-emerald-100 tracking-widest">
                    {eligibleSchemes.length > 0 ? `${eligibleSchemes.length} Eligible Schemes` : '100+ Schemes'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl font-medium whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white text-slate-800 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-slate-100 p-4 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-emerald-500"
                placeholder={language === 'hi' ? 'कुछ भी पूछें...' : 'Ask anything...'}
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !message.trim()}
                className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={24} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
