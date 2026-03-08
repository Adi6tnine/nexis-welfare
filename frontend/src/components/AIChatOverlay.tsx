import { X, Mic, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { getLanguage, getProfile } from '../services/storage';
import { ALL_SCHEMES_COMBINED } from '../data/schemes';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const language = getLanguage();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      const greeting = language === 'hi' 
        ? 'नमस्ते! मैं NEXIS AI सहायक हूँ। मैं आपको सरकारी योजनाओं के बारे में जानकारी देने में मदद कर सकता हूँ। आप मुझसे कुछ भी पूछ सकते हैं!'
        : 'Namaste! I\'m NEXIS AI Assistant. I can help you with information about government schemes. Ask me anything!';
      
      setMessages([{ role: 'assistant', text: greeting }]);
    }
  }, [isOpen, language, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    const profile = getProfile();

    // Scheme search
    if (lowerMsg.includes('scheme') || lowerMsg.includes('योजना')) {
      const matchingSchemes = ALL_SCHEMES_COMBINED.filter(s => 
        s.schemeName.toLowerCase().includes(lowerMsg) ||
        s.category.toLowerCase().includes(lowerMsg) ||
        s.description.toLowerCase().includes(lowerMsg)
      ).slice(0, 3);

      if (matchingSchemes.length > 0) {
        const schemeList = matchingSchemes.map(s => `• ${s.schemeName} - ${s.benefits}`).join('\n');
        return language === 'hi'
          ? `मैंने ${matchingSchemes.length} योजनाएं पाईं:\n\n${schemeList}\n\nअधिक जानकारी के लिए "विवरण देखें" पर क्लिक करें।`
          : `I found ${matchingSchemes.length} schemes:\n\n${schemeList}\n\nClick "View Details" for more information.`;
      }
    }

    // Category queries
    if (lowerMsg.includes('agriculture') || lowerMsg.includes('farmer') || lowerMsg.includes('किसान') || lowerMsg.includes('कृषि')) {
      const count = ALL_SCHEMES_COMBINED.filter(s => s.category === 'Agriculture').length;
      return language === 'hi'
        ? `हमारे पास ${count}+ कृषि योजनाएं हैं जैसे PM-KISAN, फसल बीमा, और कृषि उपकरण सब्सिडी। आप किस बारे में जानना चाहते हैं?`
        : `We have ${count}+ agriculture schemes including PM-KISAN, crop insurance, and equipment subsidies. What would you like to know?`;
    }

    if (lowerMsg.includes('education') || lowerMsg.includes('scholarship') || lowerMsg.includes('छात्रवृत्ति') || lowerMsg.includes('शिक्षा')) {
      const count = ALL_SCHEMES_COMBINED.filter(s => s.category === 'Education').length;
      return language === 'hi'
        ? `हमारे पास ${count}+ शिक्षा योजनाएं हैं जिनमें SC/ST, OBC, और मेरिट छात्रवृत्तियां शामिल हैं। आपकी शिक्षा स्तर क्या है?`
        : `We have ${count}+ education schemes including SC/ST, OBC, and merit scholarships. What's your education level?`;
    }

    if (lowerMsg.includes('health') || lowerMsg.includes('medical') || lowerMsg.includes('स्वास्थ्य') || lowerMsg.includes('चिकित्सा')) {
      const count = ALL_SCHEMES_COMBINED.filter(s => s.category === 'Healthcare').length;
      return language === 'hi'
        ? `हमारे पास ${count}+ स्वास्थ्य योजनाएं हैं जैसे आयुष्मान भारत, मातृत्व लाभ, और स्वास्थ्य बीमा। आप किस बारे में जानना चाहते हैं?`
        : `We have ${count}+ healthcare schemes like Ayushman Bharat, maternity benefits, and health insurance. What would you like to know?`;
    }

    // Eligibility questions
    if (lowerMsg.includes('eligible') || lowerMsg.includes('qualify') || lowerMsg.includes('पात्र')) {
      if (profile) {
        return language === 'hi'
          ? `आपकी प्रोफ़ाइल के आधार पर, मैं आपके लिए योजनाएं ढूंढ सकता हूँ। "पात्र योजनाएं देखें" पर क्लिक करें या मुझे बताएं कि आप किस प्रकार की योजना में रुचि रखते हैं।`
          : `Based on your profile, I can find schemes for you. Click "View Eligible Schemes" or tell me what type of scheme you're interested in.`;
      } else {
        return language === 'hi'
          ? `पहले अपनी प्रोफ़ाइल पूरी करें ताकि मैं आपके लिए सही योजनाएं ढूंढ सकूं। "प्रोफ़ाइल अपडेट करें" पर क्लिक करें।`
          : `Please complete your profile first so I can find the right schemes for you. Click "Update Profile".`;
      }
    }

    // Application process
    if (lowerMsg.includes('apply') || lowerMsg.includes('application') || lowerMsg.includes('आवेदन')) {
      return language === 'hi'
        ? `आवेदन करने के 3 तरीके हैं:\n\n1. ऑनलाइन - आधिकारिक वेबसाइट पर\n2. CSC केंद्र - नजदीकी कॉमन सर्विस सेंटर पर\n3. सरकारी कार्यालय - सीधे कार्यालय में\n\nकिस योजना के लिए आवेदन करना चाहते हैं?`
        : `There are 3 ways to apply:\n\n1. Online - On official website\n2. CSC Center - Visit nearest Common Service Center\n3. Government Office - Visit office directly\n\nWhich scheme do you want to apply for?`;
    }

    // Documents
    if (lowerMsg.includes('document') || lowerMsg.includes('दस्तावेज')) {
      return language === 'hi'
        ? `अधिकांश योजनाओं के लिए आवश्यक दस्तावेज:\n\n• आधार कार्ड\n• बैंक खाता\n• आय प्रमाण पत्र\n• निवास प्रमाण\n• फोटो\n\nविशिष्ट योजना के लिए, "विवरण देखें" पर क्लिक करें।`
        : `Common documents needed:\n\n• Aadhaar Card\n• Bank Account\n• Income Certificate\n• Address Proof\n• Photograph\n\nFor specific schemes, click "View Details".`;
    }

    // Count query
    if (lowerMsg.includes('how many') || lowerMsg.includes('कितनी')) {
      return language === 'hi'
        ? `हमारे डेटाबेस में ${ALL_SCHEMES_COMBINED.length}+ सरकारी योजनाएं हैं जो 12 श्रेणियों और सभी भारतीय राज्यों को कवर करती हैं।`
        : `We have ${ALL_SCHEMES_COMBINED.length}+ government schemes in our database covering 12 categories across all Indian states.`;
    }

    // Help
    if (lowerMsg.includes('help') || lowerMsg.includes('मदद')) {
      return language === 'hi'
        ? `मैं आपकी मदद कर सकता हूँ:\n\n• योजनाएं खोजें\n• पात्रता जांचें\n• आवेदन प्रक्रिया समझें\n• दस्तावेज जानकारी\n• संपर्क विवरण\n\nआप क्या जानना चाहते हैं?`
        : `I can help you with:\n\n• Finding schemes\n• Checking eligibility\n• Understanding application process\n• Document requirements\n• Contact information\n\nWhat would you like to know?`;
    }

    // Default response
    const defaultResponses = language === 'hi' ? [
      'मैं आपकी मदद करने की कोशिश कर रहा हूँ। क्या आप अपना सवाल दूसरे तरीके से पूछ सकते हैं?',
      'मुझे समझने में थोड़ी मुश्किल हो रही है। आप "योजनाएं", "पात्रता", या "आवेदन" के बारे में पूछ सकते हैं।',
      'मैं सरकारी योजनाओं के बारे में जानकारी दे सकता हूँ। आप किस बारे में जानना चाहते हैं?'
    ] : [
      'I\'m trying to help you. Could you rephrase your question?',
      'I\'m having trouble understanding. You can ask about "schemes", "eligibility", or "application".',
      'I can provide information about government schemes. What would you like to know?'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    const userMsg: Message = { role: 'user', text: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI thinking and generate response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const assistantMsg: Message = { role: 'assistant', text: aiResponse };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000);
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
                    {ALL_SCHEMES_COMBINED.length}+ Schemes
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
