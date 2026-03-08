import { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAIExplanation, AIExplanationRequest } from '../services/bedrockAI';
import { getLanguage } from '../services/storage';

interface AIExplanationPanelProps {
  scheme: {
    schemeId: string;
    schemeName: string;
    description: string;
    benefits: string;
    status: 'Eligible' | 'Not Eligible';
    satisfiedCriteria: string[];
    unsatisfiedCriteria: Array<{ criterion: string; message: string }>;
  };
  userProfile: {
    age: number;
    occupation: string;
    annualIncome: number;
    state: string;
  };
}

export function AIExplanationPanel({ scheme, userProfile }: AIExplanationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<any>(null);
  const language = getLanguage();

  const handleGetExplanation = async () => {
    setIsOpen(true);
    setLoading(true);

    try {
      const request: AIExplanationRequest = {
        schemeId: scheme.schemeId,
        schemeName: scheme.schemeName,
        userProfile: {
          age: userProfile.age,
          occupation: userProfile.occupation,
          income: userProfile.annualIncome,
          state: userProfile.state,
        },
        eligibilityStatus: scheme.status,
        satisfiedCriteria: scheme.satisfiedCriteria,
        unsatisfiedCriteria: scheme.unsatisfiedCriteria,
        language: language as 'en' | 'hi',
      };

      const result = await generateAIExplanation(request);
      setExplanation(result);
    } catch (error) {
      console.error('Error getting AI explanation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* AI Explain Button */}
      <button
        onClick={handleGetExplanation}
        className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white border-2 border-stone-900 font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)]"
      >
        <Sparkles size={14} strokeWidth={3} />
        AI Explain
      </button>

      {/* Explanation Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-stone-900/80 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF9F6] w-full max-w-2xl border-4 border-stone-900 shadow-[12px_12px_0px_0px_rgba(28,25,23,1)] max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 bg-purple-600 border-b-4 border-stone-900 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Sparkles size={24} className="text-white" strokeWidth={3} />
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wide">
                      AI Explanation
                    </h2>
                    <p className="text-white/90 text-xs font-bold uppercase tracking-widest">
                      Powered by AWS Bedrock
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-stone-900 text-white hover:bg-stone-800 border-2 border-white transition-colors"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 size={48} className="text-purple-600 animate-spin mb-4" strokeWidth={3} />
                    <p className="text-sm font-bold text-stone-600 uppercase tracking-wider">
                      Generating AI Explanation...
                    </p>
                  </div>
                ) : explanation ? (
                  <>
                    {/* Main Explanation */}
                    <div className="bg-purple-50 border-2 border-purple-600 p-4 shadow-[4px_4px_0px_0px_rgba(147,51,234,1)]">
                      <p className="text-sm text-stone-800 font-medium leading-relaxed">
                        {explanation.explanation}
                      </p>
                    </div>

                    {/* Key Points */}
                    <div>
                      <h3 className="text-sm font-black text-stone-900 mb-2 uppercase tracking-widest border-b-2 border-stone-900 pb-2">
                        Key Points
                      </h3>
                      <div className="space-y-2">
                        {explanation.keyPoints.map((point: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 bg-[#FAF9F6] p-2 border-2 border-stone-300 text-xs font-bold text-stone-700"
                          >
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div>
                      <h3 className="text-sm font-black text-stone-900 mb-2 uppercase tracking-widest border-b-2 border-stone-900 pb-2">
                        Next Steps
                      </h3>
                      <div className="space-y-2">
                        {explanation.nextSteps.map((step: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 bg-[#FAF9F6] p-3 border-2 border-stone-300"
                          >
                            <span className="w-6 h-6 bg-purple-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-stone-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="bg-stone-100 border-2 border-stone-900 p-3">
                      <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                        Estimated Time:
                      </span>
                      <span className="ml-2 text-sm font-black text-stone-900">
                        {explanation.estimatedTime}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Footer */}
              <div className="p-4 bg-stone-100 border-t-4 border-stone-900">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-3 bg-[#FAF9F6] text-stone-900 border-2 border-stone-900 font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
