import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApplicationStepper } from '../components/ApplicationStepper';
import { FormField } from '../components/FormField';
import { getLanguage } from '../services/storage';

interface ApplicationStep {
  stepId: string;
  stepNumber: number;
  title: string;
  description: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  fieldName: string;
  required: boolean;
  helpText: string;
  aiGuidance?: string;
  options?: string[];
}

export default function GuidedApplicationPage() {
  const navigate = useNavigate();
  const { schemeId } = useParams();
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ApplicationStep | null>(null);
  const [fieldValue, setFieldValue] = useState<any>('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [allSteps, setAllSteps] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const language = getLanguage();

  useEffect(() => {
    startApplication();
  }, [schemeId]);

  const startApplication = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') || 'user-' + Date.now();

      // Import mock API
      const { mockFetch } = await import('../services/mockApi');
      
      const response = await mockFetch('/api/applications/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          userId,
          schemeId: schemeId || 'pm-kisan'
        })
      });

      const data = await response.json();

      if (data.success) {
        setApplicationId(data.data.applicationId);
        setCurrentStep(data.data.currentStep);
        setProgress(data.data.progress);
        
        // Set prefilled value if available
        if (data.data.prefilledFields.includes(data.data.currentStep.fieldName)) {
          setFieldValue(data.data.currentStep.prefilledValue);
        }
      } else {
        throw new Error(data.error?.message || 'Failed to start application');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!applicationId || !currentStep) return;

    setLoading(true);
    setError(null);
    setAiSuggestion(null);

    try {
      // Import mock API
      const { mockFetch } = await import('../services/mockApi');
      
      const response = await mockFetch('/api/applications/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'next_step',
          applicationId,
          fieldValue
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.status === 'complete') {
          setIsComplete(true);
        } else {
          setCurrentStep(data.data.currentStep);
          setProgress(data.data.progress);
          setFieldValue('');
        }
      } else {
        setError(data.error?.message || 'Validation failed');
        setAiSuggestion(data.error?.aiSuggestion);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!applicationId) return;

    setLoading(true);
    try {
      // Import mock API
      const { mockFetch } = await import('../services/mockApi');
      
      const response = await mockFetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          applicationId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to success page
        navigate(`/application-success/${data.data.trackingNumber}`);
      } else {
        throw new Error(data.error?.message || 'Submission failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentStep) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Loading application...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Application Complete!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your application is ready for submission. Please review all details before submitting.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-lg font-bold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
              >
                Review & Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Guided Application</h1>
              <p className="text-sm text-gray-600">PM-KISAN Scheme</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Save & Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Application Progress</span>
            <span className="text-lg font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        {currentStep && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            {/* Step Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  Step {currentStep.stepNumber}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStep.title}
              </h2>
              <p className="text-gray-600">
                {currentStep.description}
              </p>
            </div>

            {/* AI Guidance Box */}
            {currentStep.aiGuidance && (
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">AI Guidance:</p>
                    <p className="text-sm text-blue-800">{currentStep.aiGuidance}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="mb-8">
              <FormField
                type={currentStep.fieldType}
                value={fieldValue}
                onChange={setFieldValue}
                label={currentStep.title}
                description={currentStep.description}
                helpText={currentStep.helpText}
                required={currentStep.required}
                options={currentStep.options}
                error={error || undefined}
                aiGuidance={currentStep.aiGuidance}
              />
            </div>

            {/* AI Suggestion for Errors */}
            {aiSuggestion && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-yellow-900 mb-1">AI Suggestion:</p>
                    <p className="text-sm text-yellow-800">{aiSuggestion}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                ← Back
              </button>
              
              <button
                onClick={handleNext}
                disabled={loading || !fieldValue}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Next →'}
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Need Help?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• AI will guide you through each step</li>
            <li>• Your progress is automatically saved</li>
            <li>• You can exit and continue later</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
