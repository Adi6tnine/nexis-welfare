import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLanguage } from '../services/storage';
import { AIExplanation } from '../components/AIExplanation';
import { SchemeDetailModal } from '../components/SchemeDetailModal';
import { SchemeCard } from '../components/SchemeCard';
import { Stat, pageVariants } from '../components/EditorialComponents';
import { User, MessageCircle } from 'lucide-react';
import '../styles/design-system.css';

interface CriterionDetail {
  criterion: string;
  value: any;
  requirement: any;
  message: string;
}

interface UnsatisfiedCriterion {
  criterion: string;
  currentValue: any;
  requiredValue: any;
  gap: string;
  message: string;
  fixable: boolean;
  howToFix?: string;
}

interface MissingDataItem {
  field: string;
  importance: 'Critical' | 'Important' | 'Optional';
  message: string;
}

interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  status: 'Eligible' | 'Potentially Eligible' | 'Not Eligible';
  matchScore: number;
  confidence: 'High' | 'Medium' | 'Low';
  satisfiedCriteria: CriterionDetail[];
  unsatisfiedCriteria: UnsatisfiedCriterion[];
  missingData: MissingDataItem[];
  recommendations: string[];
  alternativeSchemes: string[];
}

interface TimelinePrediction {
  schemeId: string;
  schemeName: string;
  date: string;
  event: string;
  probability: number;
  action: string;
}

export default function EnhancedResultsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState<EligibilityResult[]>([]);
  const [potential, setPotential] = useState<EligibilityResult[]>([]);
  const [ineligible, setIneligible] = useState<EligibilityResult[]>([]);
  const [timeline, setTimeline] = useState<TimelinePrediction[]>([]);
  const [selectedTab, setSelectedTab] = useState<'eligible' | 'potential' | 'all'>('eligible');
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const language = getLanguage();

  const handleViewDetails = (result: EligibilityResult) => {
    console.log('Opening details for:', result);
    console.log('Setting modal open to true');
    
    // Use the result data directly since we have all the info we need
    const schemeForModal = {
      schemeId: result.schemeId,
      schemeName: result.schemeName,
      description: result.description || 'Government scheme providing benefits to eligible citizens',
      benefits: result.benefits || 'Financial assistance and support',
      category: 'Government Scheme',
      state: 'All India',
      eligibilityRules: {
        ageMin: undefined,
        ageMax: undefined,
        incomeMax: undefined,
        states: [],
        occupations: [],
        gender: [],
        socialCategories: [],
        ruralOnly: false,
        requiresDisability: false,
        requiredDocuments: []
      },
      applicationProcess: {
        steps: ['Visit official website', 'Fill application form', 'Submit required documents', 'Track application status'],
        estimatedTime: '15-30 days',
        documentsRequired: ['Aadhaar Card', 'Income Certificate', 'Address Proof']
      },
      contactInfo: {
        website: '#',
        helpline: '1800-XXX-XXXX',
        email: 'support@scheme.gov.in'
      }
    };
    
    console.log('Scheme for modal:', schemeForModal);
    setSelectedScheme(schemeForModal);
    setIsModalOpen(true);
    console.log('Modal state should be open now');
  };

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      setUserProfile(profile);
      
      // Use real API
      const { checkEligibility } = await import('../services/api');
      const data = await checkEligibility(profile);

      console.log('API Response Data:', data);

      // Handle API format: { eligibleSchemes, ineligibleSchemes }
      setEligible(data.eligibleSchemes || []);
      setPotential([]); // No potential schemes in current API
      setIneligible(data.ineligibleSchemes || []);
      setTimeline([]); // No timeline in current API
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (schemeId: string) => {
    navigate(`/guided-application/${schemeId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Eligible': return 'success';
      case 'Potentially Eligible': return 'warning';
      case 'Not Eligible': return 'error';
      default: return 'info';
    }
  };

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    return <span className={`badge badge-${color}`}>{status}</span>;
  };

  const renderMatchScore = (score: number, confidence: string) => {
    const getScoreColor = (s: number) => {
      if (s >= 80) return '#22c55e';
      if (s >= 60) return '#f59e0b';
      return '#ef4444';
    };

    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke={getScoreColor(score)}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{score}%</span>
          </div>
        </div>
        <span className="text-sm text-gray-600 mt-2">{confidence} Confidence</span>
      </div>
    );
  };

  const renderSchemeCard = (result: EligibilityResult) => {
    return (
      <div key={result.schemeId} className="card card-interactive fade-in">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{result.schemeName}</h3>
                {getStatusBadge(result.status)}
              </div>
            </div>
            {renderMatchScore(result.matchScore, result.confidence)}
          </div>

          {/* AI Explanation */}
          <div className="mb-4">
            <AIExplanation
              schemeId={result.schemeId}
              schemeName={result.schemeName}
              profile={JSON.parse(localStorage.getItem('userProfile') || '{}')}
              eligibilityResult={result}
            />
          </div>

          {/* Satisfied Criteria */}
          {result.satisfiedCriteria.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Why You Qualify:</h4>
              <div className="space-y-2">
                {result.satisfiedCriteria.map((criterion, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{criterion.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unsatisfied Criteria */}
          {result.unsatisfiedCriteria.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Requirements Not Met:</h4>
              <div className="space-y-2">
                {result.unsatisfiedCriteria.map((criterion, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <span className="text-sm text-gray-700">{criterion.message}</span>
                      {criterion.fixable && criterion.howToFix && (
                        <p className="text-xs text-emerald-600 mt-1">{criterion.howToFix}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Data */}
          {result.missingData.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Information Needed:</h4>
              <div className="space-y-2">
                {result.missingData.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <span className="text-sm text-gray-700">{item.message}</span>
                      <span className={`text-xs ml-2 ${item.importance === 'Critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                        ({item.importance})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => handleViewDetails(result)}
              className="btn btn-primary flex-1"
            >
              {language === 'hi' ? 'विवरण देखें' : 'View Details & Apply'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#059669] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold text-stone-900 uppercase tracking-widest">Analyzing your eligibility...</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">Your Eligibility Results</h1>
              <p className="text-stone-600 mt-2 font-medium">
                {language === 'hi' 
                  ? 'आपके लिए उपलब्ध योजनाएं'
                  : 'Schemes available for you'
                }
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#FAF9F6] text-stone-900 border-2 border-stone-900 font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#059669] text-white p-5 md:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] md:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]"
          >
            <Stat value={eligible.length} label="Eligible Schemes" accent={false} className="text-white" />
            <p className="text-xs md:text-sm opacity-90 mt-2 md:mt-3 font-medium">You can apply now</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#D97706] text-white p-5 md:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] md:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]"
          >
            <Stat value={potential.length} label="Potentially Eligible" accent={false} className="text-white" />
            <p className="text-xs md:text-sm opacity-90 mt-2 md:mt-3 font-medium">Complete your profile</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#7C3AED] text-white p-5 md:p-8 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] md:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] sm:col-span-2 md:col-span-1"
          >
            <Stat value={timeline.length} label="Future Opportunities" accent={false} className="text-white" />
            <p className="text-xs md:text-sm opacity-90 mt-2 md:mt-3 font-medium">Coming soon for you</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] mb-6 overflow-x-auto">
          <div className="flex border-b-2 border-stone-200 min-w-max md:min-w-0">
            <button
              onClick={() => setSelectedTab('eligible')}
              className={`flex-1 px-4 md:px-6 py-3 md:py-4 font-bold uppercase tracking-wider text-xs md:text-sm transition-colors whitespace-nowrap ${
                selectedTab === 'eligible'
                  ? 'text-stone-900 border-b-4 border-stone-900'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <span className="hidden sm:inline">Eligible Now</span>
              <span className="sm:hidden">Eligible</span> ({eligible.length})
            </button>
            <button
              onClick={() => setSelectedTab('potential')}
              className={`flex-1 px-4 md:px-6 py-3 md:py-4 font-bold uppercase tracking-wider text-xs md:text-sm transition-colors whitespace-nowrap ${
                selectedTab === 'potential'
                  ? 'text-stone-900 border-b-4 border-stone-900'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <span className="hidden sm:inline">Potentially Eligible</span>
              <span className="sm:hidden">Potential</span> ({potential.length})
            </button>
            <button
              onClick={() => setSelectedTab('all')}
              className={`flex-1 px-4 md:px-6 py-3 md:py-4 font-bold uppercase tracking-wider text-xs md:text-sm transition-colors whitespace-nowrap ${
                selectedTab === 'all'
                  ? 'text-stone-900 border-b-4 border-stone-900'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All ({eligible.length + potential.length + ineligible.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Schemes List */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {selectedTab === 'eligible' && eligible.length === 0 && (
              <div className="bg-[#FAF9F6] border-2 border-stone-300 p-12 text-center shadow-[4px_4px_0px_0px_rgba(231,229,228,1)]">
                <div className="w-16 h-16 border-2 border-stone-300 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-stone-600 font-medium">No eligible schemes found. Try completing your profile.</p>
              </div>
            )}

            {selectedTab === 'eligible' && eligible.map((result) => (
              <SchemeCard
                key={result.schemeId}
                scheme={{
                  schemeId: result.schemeId,
                  schemeName: result.schemeName,
                  description: result.description || 'Government scheme',
                  benefits: result.benefits || 'Financial assistance and support',
                  matchScore: result.matchScore,
                  status: 'Eligible',
                  satisfiedCriteria: result.satisfiedCriteria || [],
                  unsatisfiedCriteria: result.unsatisfiedCriteria || []
                }}
                userProfile={userProfile}
                onViewDetails={() => handleViewDetails(result)}
                onApply={() => handleApply(result.schemeId)}
              />
            ))}

            {selectedTab === 'potential' && potential.map((result) => (
              <SchemeCard
                key={result.schemeId}
                scheme={{
                  schemeId: result.schemeId,
                  schemeName: result.schemeName,
                  description: result.description || 'Government scheme',
                  benefits: result.benefits || 'Financial assistance and support',
                  matchScore: result.matchScore,
                  status: 'Potentially Eligible',
                  satisfiedCriteria: result.satisfiedCriteria || [],
                  unsatisfiedCriteria: result.unsatisfiedCriteria || []
                }}
                userProfile={userProfile}
                onViewDetails={() => handleViewDetails(result)}
              />
            ))}

            {selectedTab === 'all' && (
              <>
                {eligible.map((result) => (
                  <SchemeCard
                    key={result.schemeId}
                    scheme={{
                      schemeId: result.schemeId,
                      schemeName: result.schemeName,
                      description: result.satisfiedCriteria[0]?.message || 'Government scheme',
                      benefits: result.recommendations[0] || 'Financial assistance and support',
                      matchScore: result.matchScore,
                      status: result.status,
                      satisfiedCriteria: result.satisfiedCriteria.map(c => c.message),
                      unsatisfiedCriteria: result.unsatisfiedCriteria
                    }}
                    userProfile={userProfile}
                    onViewDetails={() => handleViewDetails(result)}
                    onApply={() => handleApply(result.schemeId)}
                  />
                ))}
                {potential.map((result) => (
                  <SchemeCard
                    key={result.schemeId}
                    scheme={{
                      schemeId: result.schemeId,
                      schemeName: result.schemeName,
                      description: result.satisfiedCriteria[0]?.message || 'Government scheme',
                      benefits: result.recommendations[0] || 'Financial assistance and support',
                      matchScore: result.matchScore,
                      status: result.status,
                      satisfiedCriteria: result.satisfiedCriteria.map(c => c.message),
                      unsatisfiedCriteria: result.unsatisfiedCriteria
                    }}
                    userProfile={userProfile}
                    onViewDetails={() => handleViewDetails(result)}
                  />
                ))}
                {ineligible.map((result) => (
                  <SchemeCard
                    key={result.schemeId}
                    scheme={{
                      schemeId: result.schemeId,
                      schemeName: result.schemeName,
                      description: result.satisfiedCriteria[0]?.message || 'Government scheme',
                      benefits: result.recommendations[0] || 'Financial assistance and support',
                      matchScore: result.matchScore,
                      status: result.status,
                      satisfiedCriteria: result.satisfiedCriteria.map(c => c.message),
                      unsatisfiedCriteria: result.unsatisfiedCriteria
                    }}
                    userProfile={userProfile}
                    onViewDetails={() => handleViewDetails(result)}
                  />
                ))}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] p-5 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-stone-900 mb-4 uppercase tracking-wider">Future Eligibility</h3>
                <div className="space-y-4">
                  {timeline.map((event, idx) => (
                    <div key={idx} className="border-l-4 border-[#059669] pl-4 pb-4">
                      <div className="text-xs text-stone-500 mb-1 font-bold uppercase tracking-wider">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="font-bold text-stone-900 text-sm">{event.event}</div>
                      <div className="text-xs text-stone-600 mt-1 font-medium">{event.schemeName}</div>
                      <div className="text-xs text-[#059669] mt-2 font-bold uppercase tracking-wider">{event.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] p-5 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-stone-900 mb-4 uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#ECFDF5] text-[#059669] border-2 border-[#059669]/20 hover:border-[#059669] font-bold text-xs uppercase tracking-widest text-left flex items-center space-x-2 md:space-x-3 transition-all"
                >
                  <User size={16} strokeWidth={2.5} className="md:w-[18px] md:h-[18px]" />
                  <span>Update Profile</span>
                </button>

                <button
                  onClick={() => navigate('/chat')}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#FAF5FF] text-[#7C3AED] border-2 border-[#7C3AED]/20 hover:border-[#7C3AED] font-bold text-xs uppercase tracking-widest text-left flex items-center space-x-2 md:space-x-3 transition-all"
                >
                  <MessageCircle size={16} strokeWidth={2.5} className="md:w-[18px] md:h-[18px]" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>
            </div>

            {/* Help */}
            <div className="bg-[#7C3AED] text-white p-5 md:p-6 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] md:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]">
              <h3 className="text-base md:text-lg font-bold mb-2 uppercase tracking-wider">Need Help?</h3>
              <p className="text-xs md:text-sm opacity-90 mb-4 font-medium">
                Our AI assistant can answer your questions about schemes and applications.
              </p>
              <button
                onClick={() => navigate('/chat')}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-white text-[#7C3AED] border-2 border-transparent hover:bg-stone-100 font-bold text-xs uppercase tracking-widest transition-colors shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)]"
              >
                Chat with AI
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Scheme Detail Modal */}
      <SchemeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scheme={selectedScheme}
      />
    </motion.div>
  );
}
