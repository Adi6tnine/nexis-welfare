import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, Badge } from './EditorialComponents';
import { AIExplanationPanel } from './AIExplanationPanel';

interface SchemeCardProps {
  scheme: {
    schemeId: string;
    schemeName: string;
    description: string;
    benefits: string;
    matchScore?: number;
    status: 'Eligible' | 'Not Eligible' | 'Potentially Eligible';
    satisfiedCriteria?: string[];
    unsatisfiedCriteria?: Array<{ criterion: string; message: string }>;
  };
  userProfile?: {
    age: number;
    occupation: string;
    annualIncome: number;
    state: string;
  };
  onViewDetails: () => void;
  onApply?: () => void;
}

export function SchemeCard({ scheme, userProfile, onViewDetails, onApply }: SchemeCardProps) {
  const getStatusVariant = (): 'success' | 'warning' | 'error' => {
    switch (scheme.status) {
      case 'Eligible':
        return 'success';
      case 'Potentially Eligible':
        return 'warning';
      case 'Not Eligible':
        return 'error';
      default:
        return 'success';
    }
  };

  const getStatusIcon = () => {
    switch (scheme.status) {
      case 'Eligible':
        return <CheckCircle2 size={16} strokeWidth={2.5} />;
      case 'Potentially Eligible':
        return <AlertCircle size={16} strokeWidth={2.5} />;
      case 'Not Eligible':
        return <XCircle size={16} strokeWidth={2.5} />;
    }
  };

  return (
    <Card className="p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-stone-900 mb-1 leading-tight">{scheme.schemeName}</h3>
          <p className="text-xs text-stone-600 line-clamp-1 font-medium">{scheme.description}</p>
        </div>

        {/* Match Score */}
        {scheme.matchScore !== undefined && (
          <div className="flex flex-col items-center shrink-0">
            <div className="w-10 h-10 border-3 border-[#059669] flex items-center justify-center">
              <span className="text-xs font-bold text-stone-900">{scheme.matchScore}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <Badge variant={getStatusVariant()} className="inline-flex items-center gap-1.5 text-xs">
          {getStatusIcon()}
          {scheme.status}
        </Badge>
      </div>

      {/* Benefits */}
      <div className="mb-3 p-2.5 bg-[#ECFDF5] border border-[#059669]/20">
        <p className="text-[10px] font-bold text-stone-900 mb-1 uppercase tracking-wider">Benefits:</p>
        <p className="text-xs text-stone-700 font-medium line-clamp-2">{scheme.benefits}</p>
      </div>

      {/* Satisfied Criteria - Show only 2 */}
      {scheme.satisfiedCriteria && scheme.satisfiedCriteria.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-bold text-stone-700 mb-2 uppercase tracking-wider">✓ Requirements Met:</p>
          <div className="space-y-1.5">
            {scheme.satisfiedCriteria.slice(0, 2).map((criteria, index) => (
              <div key={index} className="flex items-start gap-1.5 text-xs text-stone-600">
                <CheckCircle2 size={12} className="text-[#059669] mt-0.5 shrink-0" strokeWidth={2.5} />
                <span className="font-medium line-clamp-1">{criteria}</span>
              </div>
            ))}
            {scheme.satisfiedCriteria.length > 2 && (
              <p className="text-[10px] text-stone-500 ml-5">+{scheme.satisfiedCriteria.length - 2} more</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto pt-3">
        {userProfile && (
          <AIExplanationPanel
            scheme={{
              schemeId: scheme.schemeId,
              schemeName: scheme.schemeName,
              description: scheme.description,
              benefits: scheme.benefits,
              status: scheme.status as 'Eligible' | 'Not Eligible',
              satisfiedCriteria: scheme.satisfiedCriteria || [],
              unsatisfiedCriteria: scheme.unsatisfiedCriteria || []
            }}
            userProfile={userProfile}
          />
        )}
        
        <button
          onClick={onViewDetails}
          className="flex-1 px-3 py-2 border-2 border-stone-900 text-stone-900 hover:bg-stone-100 font-bold text-[10px] uppercase tracking-widest transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)]"
        >
          Details
        </button>

        {scheme.status === 'Eligible' && onApply && (
          <button
            onClick={onApply}
            className="flex-1 px-3 py-2 bg-[#059669] text-[#FAF9F6] border-2 border-transparent hover:bg-[#047857] font-bold text-[10px] uppercase tracking-widest transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(28,25,23,0.15)] flex items-center justify-center gap-1.5"
          >
            Apply
            <ExternalLink size={10} />
          </button>
        )}
      </div>
    </Card>
  );
}
