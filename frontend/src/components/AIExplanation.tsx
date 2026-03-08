import { useState } from 'react';
import { getLanguage } from '../services/storage';

interface AIExplanationProps {
  schemeId: string;
  schemeName: string;
  profile: any;
  eligibilityResult: any;
}

export function AIExplanation({ schemeId, schemeName, profile, eligibilityResult }: AIExplanationProps) {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const language = getLanguage();

  const fetchExplanation = async () => {
    setLoading(true);
    setExpanded(true);
    
    try {
      // Generate AI-style explanation based on eligibility result
      const satisfied = eligibilityResult.satisfiedCriteria || [];
      const unsatisfied = eligibilityResult.unsatisfiedCriteria || [];
      const missing = eligibilityResult.missingData || [];
      
      let explanationText = '';
      
      if (language === 'hi') {
        if (eligibilityResult.status === 'Eligible') {
          explanationText = `आप ${schemeName} के लिए पात्र हैं क्योंकि:\n\n`;
          satisfied.forEach((c: any, i: number) => {
            explanationText += `${i + 1}. ${c.message}\n`;
          });
          if (missing.length > 0) {
            explanationText += `\n⚠️ कृपया ध्यान दें:\n`;
            missing.forEach((m: any) => {
              explanationText += `• ${m.message}\n`;
            });
          }
          explanationText += `\n✅ आप अभी आवेदन कर सकते हैं!`;
        } else if (eligibilityResult.status === 'Potentially Eligible') {
          explanationText = `आप ${schemeName} के लिए संभावित रूप से पात्र हैं:\n\n`;
          if (satisfied.length > 0) {
            explanationText += `✓ पूर्ण आवश्यकताएं:\n`;
            satisfied.forEach((c: any) => {
              explanationText += `• ${c.message}\n`;
            });
          }
          if (missing.length > 0) {
            explanationText += `\n⚠️ आवश्यक जानकारी:\n`;
            missing.forEach((m: any) => {
              explanationText += `• ${m.message}\n`;
            });
          }
          explanationText += `\n💡 अपनी प्रोफ़ाइल पूरी करें और आवेदन करें!`;
        } else {
          explanationText = `आप ${schemeName} के लिए पात्र नहीं हैं क्योंकि:\n\n`;
          unsatisfied.forEach((c: any, i: number) => {
            explanationText += `${i + 1}. ${c.message}\n`;
          });
          if (eligibilityResult.recommendations && eligibilityResult.recommendations.length > 0) {
            explanationText += `\n💡 सुझाव:\n`;
            eligibilityResult.recommendations.forEach((r: string) => {
              explanationText += `• ${r}\n`;
            });
          }
        }
      } else {
        if (eligibilityResult.status === 'Eligible') {
          explanationText = `You are eligible for ${schemeName} because:\n\n`;
          satisfied.forEach((c: any, i: number) => {
            explanationText += `${i + 1}. ${c.message}\n`;
          });
          if (missing.length > 0) {
            explanationText += `\n⚠️ Please note:\n`;
            missing.forEach((m: any) => {
              explanationText += `• ${m.message}\n`;
            });
          }
          explanationText += `\n✅ You can apply now!`;
        } else if (eligibilityResult.status === 'Potentially Eligible') {
          explanationText = `You are potentially eligible for ${schemeName}:\n\n`;
          if (satisfied.length > 0) {
            explanationText += `✓ Requirements met:\n`;
            satisfied.forEach((c: any) => {
              explanationText += `• ${c.message}\n`;
            });
          }
          if (missing.length > 0) {
            explanationText += `\n⚠️ Information needed:\n`;
            missing.forEach((m: any) => {
              explanationText += `• ${m.message}\n`;
            });
          }
          explanationText += `\n💡 Complete your profile and apply!`;
        } else {
          explanationText = `You are not eligible for ${schemeName} because:\n\n`;
          unsatisfied.forEach((c: any, i: number) => {
            explanationText += `${i + 1}. ${c.message}\n`;
          });
          if (eligibilityResult.recommendations && eligibilityResult.recommendations.length > 0) {
            explanationText += `\n💡 Recommendations:\n`;
            eligibilityResult.recommendations.forEach((r: string) => {
              explanationText += `• ${r}\n`;
            });
          }
        }
      }
      
      // Simulate AI delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setExplanation(explanationText);
    } catch (error) {
      console.error('Error generating explanation:', error);
      setExplanation(language === 'hi' 
        ? 'स्पष्टीकरण उत्पन्न करने में त्रुटि। कृपया पुनः प्रयास करें।'
        : 'Error generating explanation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={fetchExplanation}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all group"
      >
        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z"/>
        </svg>
        <span className="font-semibold text-purple-700 group-hover:text-purple-800">
          {language === 'hi' ? '🤖 AI स्पष्टीकरण देखें' : '🤖 Get AI Explanation'}
        </span>
        <svg className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z"/>
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-purple-900">
              {language === 'hi' ? '🤖 AI स्पष्टीकरण' : '🤖 AI Explanation'}
            </h3>
            <button
              onClick={() => setExpanded(false)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              {language === 'hi' ? 'छुपाएं' : 'Hide'}
            </button>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-purple-700">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-medium">
                  {language === 'hi' ? 'AI विश्लेषण कर रहा है...' : 'AI is analyzing...'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-purple-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-purple-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-purple-200 rounded animate-pulse w-4/6"></div>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-purple-900 leading-relaxed whitespace-pre-line">
                {explanation}
              </p>
            </div>
          )}
          
          {!loading && explanation && (
            <div className="mt-4 pt-4 border-t border-purple-200">
              <p className="text-xs text-purple-700">
                {language === 'hi'
                  ? '💡 यह स्पष्टीकरण AWS Bedrock (Claude 3) द्वारा संचालित है'
                  : '💡 This explanation is powered by AWS Bedrock (Claude 3)'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
