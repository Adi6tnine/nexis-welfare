import { useState } from 'react';

interface FormFieldProps {
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  value: any;
  onChange: (value: any) => void;
  label: string;
  description?: string;
  helpText?: string;
  required?: boolean;
  options?: string[];
  error?: string;
  aiGuidance?: string;
}

export function FormField({
  type,
  value,
  onChange,
  label,
  description,
  helpText,
  required = false,
  options = [],
  error,
  aiGuidance
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);

  const renderInput = () => {
    const baseClasses = `
      w-full px-4 py-3 border-2 rounded-lg transition-all
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
    `;

    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClasses}
            placeholder={`Enter ${label.toLowerCase()}`}
            required={required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClasses}
            placeholder={`Enter ${label.toLowerCase()}`}
            required={required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClasses}
            required={required}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClasses}
            required={required}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">{label}</span>
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      {type !== 'checkbox' && (
        <label className="block text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {/* AI Guidance */}
      {aiGuidance && focused && (
        <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-xs font-medium text-blue-900 mb-1">AI Suggestion:</p>
            <p className="text-sm text-blue-800">{aiGuidance}</p>
          </div>
        </div>
      )}

      {/* Input Field */}
      {renderInput()}

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-xs text-gray-500 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>{helpText}</span>
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
