import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentScanner } from '../components/DocumentScanner';
import { getLanguage } from '../services/storage';

interface OCRResult {
  documentId: string;
  documentType: string;
  extractedData: any;
  confidence: number;
  validationStatus: string;
  validationResults: any[];
}

const DOCUMENT_TYPES = [
  { id: 'aadhaar', name: 'Aadhaar Card', icon: '🆔', required: true },
  { id: 'pan', name: 'PAN Card', icon: '💳', required: false },
  { id: 'income', name: 'Income Certificate', icon: '📄', required: false },
  { id: 'ration', name: 'Ration Card', icon: '🎫', required: false },
  { id: 'land', name: 'Land Records', icon: '🏞️', required: false },
];

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());
  const language = getLanguage();

  const handleCapture = async (imageData: string) => {
    if (!selectedType) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const userId = localStorage.getItem('userId') || 'user-' + Date.now();

      // Import mock API
      const { mockFetch } = await import('../services/mockApi');
      
      const response = await mockFetch('/api/documents/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          documentType: selectedType,
          imageData
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setUploadedDocs(prev => new Set([...prev, selectedType]));
        
        // Auto-advance after 3 seconds
        setTimeout(() => {
          setSelectedType(null);
          setResult(null);
        }, 3000);
      } else {
        throw new Error(data.error?.message || 'OCR failed');
      }

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to process document');
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = () => {
    // Save uploaded documents info
    localStorage.setItem('uploadedDocuments', JSON.stringify(Array.from(uploadedDocs)));
    navigate('/results');
  };

  if (selectedType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedType(null);
                  setResult(null);
                  setError(null);
                }}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {selectedType} Document
              </h1>
              <div className="w-16" /> {/* Spacer */}
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {uploading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">Processing document...</p>
              <p className="text-sm text-gray-600 mt-2">Extracting information using AI</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-green-900">Document Verified!</h2>
                    <p className="text-sm text-green-700">Confidence: {Math.round(result.confidence * 100)}%</p>
                  </div>
                </div>
              </div>

              {/* Extracted Data */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Information</h3>
                <div className="space-y-3">
                  {Object.entries(result.extractedData).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm text-gray-900 font-semibold">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation Results */}
              {result.validationResults.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Status</h3>
                  <div className="space-y-2">
                    {result.validationResults.map((validation, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 p-3 rounded-lg ${
                          validation.status === 'valid'
                            ? 'bg-green-50 text-green-800'
                            : validation.status === 'invalid'
                            ? 'bg-red-50 text-red-800'
                            : 'bg-yellow-50 text-yellow-800'
                        }`}
                      >
                        {validation.status === 'valid' ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="text-sm font-medium">{validation.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : error ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-900">Upload Failed</h2>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="w-full mt-4 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <DocumentScanner
                documentType={selectedType}
                onCapture={handleCapture}
              />
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Skip for now
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Documents Uploaded</span>
            <span className="text-sm font-bold text-blue-600">
              {uploadedDocs.size} / {DOCUMENT_TYPES.filter(d => d.required).length} required
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(uploadedDocs.size / DOCUMENT_TYPES.filter(d => d.required).length) * 100}%` }}
            />
          </div>
        </div>

        {/* Document Types Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {DOCUMENT_TYPES.map((docType) => {
            const isUploaded = uploadedDocs.has(docType.id);
            
            return (
              <button
                key={docType.id}
                onClick={() => setSelectedType(docType.id)}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all
                  ${isUploaded
                    ? 'bg-green-50 border-green-500'
                    : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-lg'
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{docType.icon}</div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-gray-900">{docType.name}</h3>
                    <p className="text-sm text-gray-600">
                      {isUploaded ? '✓ Uploaded' : docType.required ? 'Required' : 'Optional'}
                    </p>
                  </div>
                  {isUploaded && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {docType.required && !isUploaded && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Required
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        {uploadedDocs.size >= DOCUMENT_TYPES.filter(d => d.required).length && (
          <button
            onClick={handleContinue}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-lg font-bold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all"
          >
            Continue to Eligibility Check →
          </button>
        )}
      </main>
    </div>
  );
}
