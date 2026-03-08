import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLanguage } from '../services/storage';
import { 
  QUESTION_BANK, 
  getNextQuestions, 
  isProfileComplete, 
  getProgress,
  type Question 
} from '../data/questionBank';
import { ProgressBar, StepNumber, PrimaryButton, SecondaryButton, pageVariants } from '../components/EditorialComponents';
import { Check, ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';

export default function AdaptiveQuestionnairePage() {
  const navigate = useNavigate();
  const language = getLanguage();
  
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsToAsk, setQuestionsToAsk] = useState<Question[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<any>('');

  useEffect(() => {
    // Get initial questions
    const initialQuestions = getNextQuestions({});
    console.log('Initial questions loaded:', initialQuestions.length);
    setQuestionsToAsk(initialQuestions);
  }, []);

  useEffect(() => {
    console.log('Current answers:', answers);
    console.log('Questions remaining:', questionsToAsk.length);
  }, [answers, questionsToAsk]);

  const handleNext = () => {
    if (currentAnswer === '' || currentAnswer === undefined) {
      return;
    }

    const currentQuestion = questionsToAsk[currentQuestionIndex];
    
    // Save the answer
    const newAnswers = { ...answers, [currentQuestion.fieldName]: currentAnswer };
    setAnswers(newAnswers);
    
    // Clear current answer
    setCurrentAnswer('');
    
    // Get updated questions based on new answers
    const updatedQuestions = getNextQuestions(newAnswers);
    console.log('Updated questions after answer:', updatedQuestions.length);
    setQuestionsToAsk(updatedQuestions);
    
    // Check if we're done
    if (isProfileComplete(newAnswers)) {
      console.log('Profile complete!');
      setIsComplete(true);
      return;
    }
    
    // Move to next question if available
    if (updatedQuestions.length > 0) {
      // Find the next unanswered question
      const nextIndex = updatedQuestions.findIndex(q => newAnswers[q.fieldName] === undefined);
      if (nextIndex !== -1) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        // All questions answered
        setIsComplete(true);
      }
    } else {
      setIsComplete(true);
    }
  };

  const handleSkip = () => {
    const currentQuestion = questionsToAsk[currentQuestionIndex];
    
    if (currentQuestion.required) {
      return; // Can't skip required questions
    }
    
    // Move to next question
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questionsToAsk.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentAnswer('');
    } else {
      // Check if profile is complete
      if (isProfileComplete(answers)) {
        setIsComplete(true);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQuestion = questionsToAsk[currentQuestionIndex - 1];
      setCurrentAnswer(answers[prevQuestion.fieldName] || '');
    }
  };

  const handleSubmit = () => {
    // Build complete profile
    const profile: any = {
      ...answers,
      documents: []
    };

    // Add documents based on answers
    if (answers.hasAadhaar) profile.documents.push('aadhaar');
    if (answers.hasBankAccount) profile.documents.push('bank_account');
    if (answers.ownsLand) profile.documents.push('land_records');

    console.log('Final profile:', profile);

    // Save profile
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('userId', 'user-' + Date.now());
    
    // Navigate to results
    navigate('/enhanced-results');
  };

  const currentQuestion = questionsToAsk[currentQuestionIndex];
  const progress = getProgress(answers);
  const isAnswered = currentAnswer !== '' && currentAnswer !== undefined;

  if (isComplete) {
    return (
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-[#FAF9F6] border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] p-12">
            <div className="w-20 h-20 bg-[#059669] border-2 border-stone-900 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
              <Check size={48} className="text-white" strokeWidth={3} />
            </div>
            
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">
              {language === 'hi' ? 'प्रोफ़ाइल पूर्ण!' : 'Profile Complete!'}
            </h2>
            
            <p className="text-lg text-stone-600 font-medium mb-8">
              {language === 'hi'
                ? `आपने ${Object.keys(answers).length} प्रश्नों के उत्तर दिए। अब हम आपके लिए योजनाएं खोजेंगे।`
                : `You answered ${Object.keys(answers).length} questions. Now we'll find schemes for you.`
              }
            </p>

            <PrimaryButton
              onClick={handleSubmit}
              icon={<ChevronRight size={20} strokeWidth={2.5} />}
              className="text-lg px-10 py-5"
            >
              {language === 'hi' ? 'योजनाएं देखें' : 'View Schemes'}
            </PrimaryButton>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#059669] border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-bold text-stone-900 uppercase tracking-widest">
            {language === 'hi' ? 'प्रश्न लोड हो रहे हैं...' : 'Loading questions...'}
          </p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
              {language === 'hi' ? 'आपकी जानकारी' : 'Your Information'}
            </h1>
            <button
              onClick={() => navigate('/landing')}
              className="text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-[#FAF9F6] border-b-2 border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-700">
              {language === 'hi' ? 'प्रगति' : 'Progress'}
            </span>
            <span className="text-2xl font-serif font-bold text-[#059669]">
              {progress}%
            </span>
          </div>
          <ProgressBar progress={progress} />
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mt-3">
            {language === 'hi'
              ? `प्रश्न ${currentQuestionIndex + 1} / ${questionsToAsk.length} • ${Object.keys(answers).length} उत्तर दिए`
              : `Question ${currentQuestionIndex + 1} of ${questionsToAsk.length} • ${Object.keys(answers).length} answered`
            }
          </p>
        </div>
      </div>

      {/* Question */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#FAF9F6] border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] p-8 md:p-12"
        >
          {/* Question Number */}
          <div className="flex items-center space-x-4 mb-8">
            <StepNumber number={currentQuestionIndex + 1} active={true} className="w-14 h-14 text-xl" />
            <div className="flex-1">
              <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">
                {currentQuestion.category}
              </p>
              {currentQuestion.required && (
                <span className="text-xs text-red-600 font-bold uppercase tracking-wider">* Required</span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-stone-900 mb-4 md:mb-6 leading-tight">
            {currentQuestion.text[language as keyof typeof currentQuestion.text]}
          </h2>

          {/* Help Text */}
          {currentQuestion.helpText && (
            <p className="text-stone-600 font-medium text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
              {currentQuestion.helpText[language as keyof typeof currentQuestion.helpText]}
            </p>
          )}

          {/* Answer Input */}
          <div className="mb-10">
            {currentQuestion.type === 'number' && (
              <div>
                <input
                  type="number"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value ? parseInt(e.target.value) : '')}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && isAnswered) {
                      handleNext();
                    }
                  }}
                  className="w-full bg-transparent border-b-4 border-stone-300 text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 pb-3 md:pb-4 outline-none transition-all placeholder:text-stone-300 focus:border-stone-900"
                  placeholder={language === 'hi' ? 'उत्तर दर्ज करें' : 'Enter answer'}
                  autoFocus
                />
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && isAnswered) {
                    handleNext();
                  }
                }}
                className="w-full bg-transparent border-b-4 border-stone-300 text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 pb-3 md:pb-4 outline-none transition-all placeholder:text-stone-300 focus:border-stone-900"
                placeholder={language === 'hi' ? 'उत्तर दर्ज करें' : 'Enter answer'}
                autoFocus
              />
            )}

            {currentQuestion.type === 'boolean' && (
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <button
                  onClick={() => setCurrentAnswer(true)}
                  className={`px-6 md:px-8 py-5 md:py-6 border-2 font-bold text-base md:text-lg uppercase tracking-wider transition-all ${
                    currentAnswer === true
                      ? 'bg-[#059669] text-white border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]'
                      : 'bg-[#FAF9F6] text-stone-700 border-stone-300 hover:border-stone-900'
                  }`}
                >
                  {language === 'hi' ? 'हाँ' : 'Yes'}
                </button>
                <button
                  onClick={() => setCurrentAnswer(false)}
                  className={`px-6 md:px-8 py-5 md:py-6 border-2 font-bold text-base md:text-lg uppercase tracking-wider transition-all ${
                    currentAnswer === false
                      ? 'bg-[#059669] text-white border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]'
                      : 'bg-[#FAF9F6] text-stone-700 border-stone-300 hover:border-stone-900'
                  }`}
                >
                  {language === 'hi' ? 'नहीं' : 'No'}
                </button>
              </div>
            )}

            {currentQuestion.type === 'select' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCurrentAnswer(option.value)}
                    className={`w-full px-5 md:px-6 py-4 md:py-5 border-2 font-bold text-left transition-all uppercase tracking-wider text-sm md:text-base ${
                      currentAnswer === option.value
                        ? 'bg-[#059669] text-white border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]'
                        : 'bg-[#FAF9F6] text-stone-700 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    {option.label[language as keyof typeof option.label]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            {currentQuestionIndex > 0 && (
              <SecondaryButton
                onClick={handleBack}
                icon={<ArrowLeft size={18} strokeWidth={2.5} />}
                iconPosition="left"
                className="w-full sm:w-auto text-sm md:text-base"
              >
                {language === 'hi' ? 'पिछला' : 'Back'}
              </SecondaryButton>
            )}
            
            <PrimaryButton
              onClick={handleNext}
              disabled={!isAnswered}
              icon={<ArrowRight size={18} strokeWidth={2.5} />}
              className="flex-1 text-sm md:text-base"
            >
              {currentQuestionIndex < questionsToAsk.length - 1
                ? (language === 'hi' ? 'अगला' : 'Next')
                : (language === 'hi' ? 'पूर्ण करें' : 'Complete')
              }
            </PrimaryButton>

            {!currentQuestion.required && (
              <button
                onClick={handleSkip}
                className="px-4 md:px-6 py-2 md:py-3 text-stone-600 hover:text-stone-900 font-bold uppercase tracking-wider transition-colors text-xs md:text-sm"
              >
                {language === 'hi' ? 'छोड़ें' : 'Skip'}
              </button>
            )}
          </div>
        </motion.div>

        {/* Info Box */}
        <div className="mt-6 bg-stone-100 border-2 border-stone-300 p-4 md:p-5 shadow-[2px_2px_0px_0px_rgba(231,229,228,1)]">
          <p className="text-xs md:text-sm text-stone-700 font-medium leading-relaxed">
            {language === 'hi'
              ? '💡 हम केवल प्रासंगिक प्रश्न पूछते हैं। आपके उत्तरों के आधार पर, आपको 10-12 प्रश्नों के उत्तर देने होंगे।'
              : '💡 We only ask relevant questions. Based on your answers, you\'ll answer 10-12 questions.'
            }
          </p>
        </div>
      </main>
    </motion.div>
  );
}
