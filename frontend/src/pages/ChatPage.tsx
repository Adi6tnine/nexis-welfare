import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sendChatMessage, ChatResponse } from '../services/api';
import { getProfile, getLanguage } from '../services/storage';
import { pageVariants } from '../components/EditorialComponents';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const profile = getProfile();
  const language = getLanguage();

  useEffect(() => {
    if (!profile) {
      navigate('/profile');
    }
  }, [profile, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !profile) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage(
        input,
        profile,
        sessionId,
        language as 'en' | 'hi'
      );

      setSessionId(response.sessionId);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FAF9F6] flex flex-col"
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#059669] focus:text-white focus:border-2 focus:border-stone-900">
        Skip to main content
      </a>
      <header className="bg-[#FAF9F6] border-b-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] sticky top-0 z-40" role="banner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('/')} aria-label="Go to home page" className="text-2xl font-serif font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#059669] focus:ring-offset-2">
              NEXIS
            </button>
            <button
              onClick={() => navigate('/results')}
              aria-label="Go back to results page"
              className="px-6 py-3 bg-[#FAF9F6] text-stone-900 border-2 border-stone-900 font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:ring-offset-2"
            >
              Back to Results
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col" role="main">
        <div className="bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b-2 border-stone-200 bg-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#059669] border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
                <MessageCircle size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 id="chat-heading" className="text-lg font-bold text-stone-900 uppercase tracking-wider">AI Assistant</h2>
                <p className="text-sm text-stone-600 font-medium">Ask me anything about government schemes</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4" role="log" aria-live="polite" aria-atomic="false" aria-label="Chat conversation">
            {messages.length === 0 && (
              <div className="text-center text-stone-500 py-12">
                <p className="mb-6 font-medium text-lg">Start a conversation by asking a question</p>
                <div className="space-y-3" role="group" aria-label="Suggested questions">
                  <button
                    onClick={() => setInput('What schemes am I eligible for?')}
                    aria-label="Ask: What schemes am I eligible for?"
                    className="block w-full max-w-md mx-auto px-6 py-4 bg-[#FAF9F6] text-stone-700 border-2 border-stone-300 hover:border-stone-900 text-sm font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  >
                    What schemes am I eligible for?
                  </button>
                  <button
                    onClick={() => setInput('How do I apply for schemes?')}
                    aria-label="Ask: How do I apply for schemes?"
                    className="block w-full max-w-md mx-auto px-6 py-4 bg-[#FAF9F6] text-stone-700 border-2 border-stone-300 hover:border-stone-900 text-sm font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  >
                    How do I apply for schemes?
                  </button>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] px-4 md:px-5 py-3 md:py-4 border-2 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] ${
                    message.role === 'user'
                      ? 'bg-[#059669] text-white border-stone-900'
                      : 'bg-stone-100 text-stone-900 border-stone-300'
                  }`}
                >
                  <p className="text-sm md:text-base font-medium whitespace-pre-wrap leading-relaxed break-words">{message.content}</p>
                  <p className={`text-xs mt-2 font-bold uppercase tracking-wider ${
                    message.role === 'user' ? 'text-white/70' : 'text-stone-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start" role="status" aria-live="polite" aria-label="AI is typing">
                <div className="bg-stone-100 border-2 border-stone-300 px-5 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 md:p-6 border-t-2 border-stone-200 bg-stone-50">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} aria-labelledby="chat-heading">
              <div className="flex gap-2 md:gap-3">
                <label htmlFor="chat-input" className="sr-only">Type your question</label>
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors focus:ring-2 focus:ring-[#059669] text-sm md:text-base"
                  disabled={loading}
                  aria-label="Chat message input"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="px-4 md:px-6 py-2 md:py-3 bg-[#059669] text-white border-2 border-transparent hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] transition-all text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] focus:ring-offset-2 flex items-center gap-2"
                >
                  <Send size={14} strokeWidth={2.5} className="md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
