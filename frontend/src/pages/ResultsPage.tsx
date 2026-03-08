import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Bot,
  Loader2,
  ChevronDown,
  FileText,
  ExternalLink,
  Check,
  User,
  MessageSquare
} from 'lucide-react';
import { getCachedResult, getLanguage } from '../services/storage';
import { EligibilityResult } from '../services/api';
import { getTranslation } from '../locales/translations';
import {
  Header,
  Footer,
  Card,
  Badge,
  PrimaryButton,
  SecondaryButton,
  Checkbox,
  Toast,
  pageVariants
} from '../components/EditorialComponents';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [language] = useState<string>(getLanguage());
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [filter, setFilter] = useState<'eligible' | 'potentially' | 'all'>('eligible');
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [showDetails, setShowDetails] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [docsReady, setDocsReady] = useState({
    aadhaar: false,
    disability: false,
    bank: false,
    photo: false
  });

  const t = getTranslation(language);

  useEffect(() => {
    const cached = getCachedResult();
    if (!cached) {
      navigate('/profile');
      return;
    }
    setResult(cached);
  }, [navigate]);

  const toggleDoc = (doc: keyof typeof docsReady) => {
    setDocsReady((prev) => ({ ...prev, [doc]: !prev[doc] }));
  };

  const allDocsReady = Object.values(docsReady).every(Boolean);

  const handleAIExplanation = () => {
    if (aiState === 'idle') {
      setAiState('loading');
      setTimeout(() => setAiState('done'), 1500);
    } else if (aiState === 'done') {
      setAiState('idle');
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-[#059669]" />
          <p className="text-stone-600 font-bold uppercase tracking-widest text-sm">
            {t.common.loading}
          </p>
        </div>
      </div>
    );
  }

  const eligibleCount = result.eligibleSchemes.length;
  const potentialCount = 394; // Mock data
  const totalCount = result.totalSchemes;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FAF9F6]"
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#059669] focus:text-white focus:border-2 focus:border-stone-900"
      >
        Skip to main content
      </a>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>

      {/* Header */}
      <Header lang={language} setLang={() => {}} translations={t} />

      {/* Main Content */}
      <main id="main-content" className="w-full min-h-screen pb-32 pt-12 px-6 md:px-12 max-w-7xl mx-auto" role="main">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">{t.results.title}</h1>
            <p className="text-stone-500 font-medium mt-3 italic font-serif text-lg border-l-2 border-[#059669] pl-4">
              {t.results.subtitle}
            </p>
          </div>
          <SecondaryButton
            onClick={() => navigate('/')}
            icon={<ArrowLeft size={16} />}
            iconPosition="left"
            className="text-sm py-3 px-6"
          >
            {t.results.back}
          </SecondaryButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card accent className="p-5 md:p-8 flex flex-col">
            <div className="text-5xl md:text-6xl font-serif font-bold mb-3 md:mb-4">{eligibleCount}</div>
            <div className="font-bold uppercase tracking-widest text-xs md:text-sm mb-1">{t.results.stat1Title}</div>
            <div className="text-[#A7F3D0] text-xs md:text-sm font-medium">{t.results.stat1Desc}</div>
          </Card>

          <div className="bg-[#D97706] text-white p-5 md:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] md:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] flex flex-col">
            <div className="text-5xl md:text-6xl font-serif font-bold mb-3 md:mb-4">{potentialCount}</div>
            <div className="font-bold uppercase tracking-widest text-xs md:text-sm mb-1">{t.results.stat2Title}</div>
            <div className="text-[#FDE68A] text-xs md:text-sm font-medium">{t.results.stat2Desc}</div>
          </div>

          <div className="bg-[#7C3AED] text-white p-5 md:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] md:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] flex flex-col sm:col-span-2 md:col-span-1">
            <div className="text-5xl md:text-6xl font-serif font-bold mb-3 md:mb-4">0</div>
            <div className="font-bold uppercase tracking-widest text-xs md:text-sm mb-1">{t.results.stat3Title}</div>
            <div className="text-[#DDD6FE] text-xs md:text-sm font-medium">{t.results.stat3Desc}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-stone-200 mb-8 md:mb-10 overflow-x-auto no-scrollbar" role="tablist">
          <button
            role="tab"
            aria-selected={filter === 'eligible'}
            onClick={() => setFilter('eligible')}
            className={`px-5 md:px-8 py-3 md:py-4 font-bold uppercase tracking-widest text-xs md:text-sm whitespace-nowrap transition-colors ${
              filter === 'eligible'
                ? 'border-b-4 border-stone-900 text-stone-900'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {t.results.tab1}
          </button>
          <button
            role="tab"
            aria-selected={filter === 'potentially'}
            onClick={() => {
              setFilter('potentially');
              setToastMessage('Exploring Potentially Eligible Schemes...');
            }}
            className={`px-5 md:px-8 py-3 md:py-4 font-bold uppercase tracking-widest text-xs md:text-sm whitespace-nowrap transition-colors ${
              filter === 'potentially'
                ? 'border-b-4 border-stone-900 text-stone-900'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {t.results.tab2}
          </button>
          <button
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => {
              setFilter('all');
              setToastMessage('Viewing All Schemes...');
            }}
            className={`px-5 md:px-8 py-3 md:py-4 font-bold uppercase tracking-widest text-xs md:text-sm whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'border-b-4 border-stone-900 text-stone-900'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {t.results.tab3}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          {/* Scheme Details - Left Column */}
          <div className="lg:col-span-2">
            <Card elevated className="p-5 md:p-8">
              {/* Scheme Header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 leading-tight max-w-lg">
                  {t.results.schemeTitle}
                </h2>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant="success">{t.results.tagEligible}</Badge>
                  <div className="flex flex-col items-center mt-2">
                    <div className="w-16 h-16 rounded-none border-4 border-[#059669] flex items-center justify-center mb-1">
                      <span className="font-bold text-stone-900 text-lg">100%</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                      {t.results.tagConf}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Explanation Button */}
              <button
                onClick={handleAIExplanation}
                disabled={aiState === 'loading'}
                className={`w-full flex items-center justify-center gap-3 py-4 transition-colors font-bold text-xs uppercase tracking-widest mb-8 border-2 border-dashed ${
                  aiState !== 'idle'
                    ? 'bg-[#FAF5FF] text-[#7C3AED] border-[#7C3AED]'
                    : 'bg-stone-100 text-stone-900 border-stone-300 hover:bg-stone-200 hover:border-stone-400'
                }`}
              >
                {aiState === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#7C3AED]" />
                    Analyzing profile data...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className={aiState === 'done' ? 'text-[#7C3AED]' : 'text-stone-500'} />
                    {aiState === 'done' ? 'Hide AI Explanation' : t.results.btnExp}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${aiState === 'done' ? 'rotate-180' : ''}`}
                    />
                  </>
                )}
              </button>

              {/* AI Explanation Content */}
              <AnimatePresence>
                {aiState === 'done' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-8"
                  >
                    <div className="p-6 bg-[#FAF5FF] border-2 border-stone-900 text-sm text-stone-800 leading-relaxed shadow-[4px_4px_0px_0px_rgba(124,58,237,0.3)] font-serif italic">
                      <div className="flex items-center gap-2 mb-3 not-italic">
                        <Sparkles size={18} className="text-[#7C3AED]" />
                        <strong className="text-stone-900 uppercase tracking-widest font-sans text-xs">
                          AI Analysis Complete
                        </strong>
                      </div>
                      Based on the age and income (₹50,000) provided in your profile, you strongly meet the primary
                      criteria for this pension scheme. Our system successfully cross-verified your Aadhaar and
                      Disability certificates with state databases, ensuring a 100% match confidence.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Why You Qualify */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-6 border-b border-stone-200 pb-2">
                  {t.results.whyTitle}
                </h3>
                <ul className="space-y-4">
                  {[t.results.q1, t.results.q2, t.results.q3, t.results.q4, t.results.q5].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-700 text-sm md:text-base font-medium">
                      <CheckCircle2 size={20} className="text-[#059669] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* View Details Button */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`w-full py-4 text-sm font-bold uppercase tracking-widest border-2 border-stone-900 transition-all flex justify-center items-center gap-3 ${
                  showDetails
                    ? 'bg-stone-100 text-stone-900'
                    : 'bg-[#1E3A8A] text-[#FAF9F6] shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]'
                }`}
              >
                {showDetails ? 'Hide Application Checklist' : t.results.btnApply}
                <ChevronDown size={18} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              </button>

              {/* Application Checklist */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 md:p-8 bg-stone-100 border-2 border-stone-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h4 className="font-bold text-stone-900 text-sm uppercase tracking-widest">
                          {t.results.detailsReq}
                        </h4>
                        <span className="text-xs font-bold text-[#059669] bg-[#059669]/10 border border-[#059669] px-3 py-1 uppercase tracking-wider">
                          {Object.values(docsReady).filter(Boolean).length}/4 Ready
                        </span>
                      </div>
                      <p className="text-sm text-stone-500 mb-6 font-serif italic border-l-2 border-stone-300 pl-3">
                        Mark documents as ready before proceeding to the official portal.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {[
                          { key: 'aadhaar', label: 'Aadhaar Card' },
                          { key: 'disability', label: 'Disability Cert.' },
                          { key: 'bank', label: 'Bank Passbook' },
                          { key: 'photo', label: 'Passport Photo' }
                        ].map((doc) => (
                          <Checkbox
                            key={doc.key}
                            checked={docsReady[doc.key as keyof typeof docsReady]}
                            onChange={() => toggleDoc(doc.key as keyof typeof docsReady)}
                            label={doc.label}
                          />
                        ))}
                      </div>
                      <button
                        disabled={!allDocsReady}
                        onClick={() => setToastMessage('Redirecting to Official Government Portal...')}
                        className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-all flex justify-center items-center gap-3 border-2 ${
                          allDocsReady
                            ? 'bg-[#059669] text-[#FAF9F6] border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]'
                            : 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                        }`}
                      >
                        {t.results.detailsLink} <ExternalLink size={18} />
                      </button>
                      {!allDocsReady && (
                        <p className="text-center text-xs text-stone-500 mt-4 font-bold uppercase tracking-widest">
                          Complete checklist to proceed
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-6 md:gap-8">
            {/* Quick Actions */}
            <Card className="p-5 md:p-6">
              <h3 className="text-xs md:text-sm font-bold text-stone-900 uppercase tracking-widest mb-4 md:mb-6 border-b border-stone-200 pb-2">
                {t.results.actionTitle}
              </h3>
              <div className="flex flex-col gap-3 md:gap-4">
                <button
                  onClick={() => setToastMessage('Opening Profile Editor...')}
                  className="flex items-center gap-2 md:gap-3 w-full bg-[#059669]/5 hover:bg-[#059669]/10 text-[#059669] p-3 md:p-4 border border-[#059669]/20 transition-colors font-bold text-xs md:text-sm"
                >
                  <User size={16} className="md:w-[18px] md:h-[18px]" />
                  {t.results.btnUpdate}
                </button>
                <button
                  onClick={() => setToastMessage('Initializing AI Assistant Chat...')}
                  className="flex items-center gap-2 md:gap-3 w-full bg-[#7C3AED]/5 hover:bg-[#7C3AED]/10 text-[#7C3AED] p-3 md:p-4 border border-[#7C3AED]/20 transition-colors font-bold text-xs md:text-sm"
                >
                  <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" />
                  {t.results.btnAsk}
                </button>
              </div>
            </Card>

            {/* Help Card */}
            <div className="bg-[#1E3A8A] border-2 border-stone-900 p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] md:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] text-white flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10">
                <Bot size={100} className="md:w-[120px] md:h-[120px]" />
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold mb-3 md:mb-4 relative z-10">{t.results.helpTitle}</h3>
              <p className="text-[#BFDBFE] text-xs md:text-sm leading-relaxed mb-6 md:mb-8 relative z-10">{t.results.helpDesc}</p>
              <button
                onClick={() => setToastMessage('Connecting to live AI Assistant...')}
                className="w-full bg-[#FAF9F6] text-[#1E3A8A] py-2.5 md:py-3 text-xs md:text-sm font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] md:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] border-2 border-stone-900 hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)] md:hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] transition-all relative z-10"
              >
                {t.results.btnChat}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
