import { X, ExternalLink, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLanguage } from '../services/storage';

interface SchemeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: any;
}

export function SchemeDetailModal({ isOpen, onClose, scheme }: SchemeDetailModalProps) {
  const language = getLanguage();

  if (!scheme) return null;

  const content = {
    en: {
      overview: 'Scheme Overview',
      benefits: 'Benefits',
      documents: 'Required Documents',
      procedure: 'Application Procedure',
      contact: 'Contact Information',
      helpline: 'Helpline',
      email: 'Email',
      applyOnline: 'Apply Online',
      close: 'Close',
    },
    hi: {
      overview: 'योजना अवलोकन',
      benefits: 'लाभ',
      documents: 'आवश्यक दस्तावेज',
      procedure: 'आवेदन प्रक्रिया',
      contact: 'संपर्क जानकारी',
      helpline: 'हेल्पलाइन',
      email: 'ईमेल',
      applyOnline: 'ऑनलाइन आवेदन करें',
      close: 'बंद करें',
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-stone-900/80 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF9F6] w-full max-w-3xl border-4 border-stone-900 shadow-[12px_12px_0px_0px_rgba(28,25,23,1)] max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-[#059669] border-b-4 border-stone-900 flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-xl font-black text-[#FAF9F6] mb-1 uppercase tracking-wide">{scheme.schemeName}</h2>
                <p className="text-[#FAF9F6]/90 text-xs font-bold uppercase tracking-widest">{scheme.category} • {scheme.state}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-stone-900 text-[#FAF9F6] hover:bg-stone-800 border-2 border-[#FAF9F6] transition-colors"
                aria-label={t.close}
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Overview */}
              <section>
                <h3 className="text-sm font-black text-stone-900 mb-2 uppercase tracking-widest border-b-2 border-stone-900 pb-2">
                  {t.overview}
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed font-medium">{scheme.description}</p>
              </section>

              {/* Benefits */}
              <section>
                <h3 className="text-sm font-black text-stone-900 mb-2 uppercase tracking-widest border-b-2 border-stone-900 pb-2">{t.benefits}</h3>
                <div className="bg-[#ECFDF5] border-2 border-[#059669] p-4 shadow-[4px_4px_0px_0px_rgba(5,150,105,1)]">
                  <p className="text-sm text-stone-800 font-bold">{scheme.benefits}</p>
                </div>
              </section>

              {/* Documents */}
              {scheme.applicationProcess?.documentsRequired && (
                <section>
                  <h3 className="text-sm font-black text-stone-900 mb-2 uppercase tracking-widest border-b-2 border-stone-900 pb-2">{t.documents}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {scheme.applicationProcess.documentsRequired.map((doc: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-stone-900 bg-[#FAF9F6] p-2 border-2 border-stone-300">
                        <span className="w-5 h-5 bg-[#059669] text-[#FAF9F6] flex items-center justify-center text-[10px] font-black">✓</span>
                        {doc}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Application Procedure */}
              <section className="bg-stone-100 p-4 border-2 border-stone-900">
                <h3 className="text-sm font-black text-stone-900 mb-3 uppercase tracking-widest">{t.procedure}</h3>
                
                <div className="space-y-3">
                  {scheme.applicationProcess?.steps.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 bg-[#FAF9F6] p-3 border-2 border-stone-300">
                      <span className="w-6 h-6 bg-stone-900 text-[#FAF9F6] flex items-center justify-center text-xs font-black shrink-0">{idx + 1}</span>
                      <span className="text-xs font-bold text-stone-700">{step}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contact Info */}
              {scheme.contactInfo && (
                <section>
                  <h3 className="text-sm font-black text-stone-900 mb-2 uppercase tracking-widest border-b-2 border-stone-900 pb-2">{t.contact}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {scheme.contactInfo.helpline && (
                      <div className="flex items-center gap-3 bg-[#FAF9F6] p-3 border-2 border-stone-300">
                        <Phone size={16} className="text-[#059669]" strokeWidth={3} />
                        <div>
                          <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">{t.helpline}</div>
                          <div className="text-sm font-black text-stone-900">{scheme.contactInfo.helpline}</div>
                        </div>
                      </div>
                    )}
                    {scheme.contactInfo.email && (
                      <div className="flex items-center gap-3 bg-[#FAF9F6] p-3 border-2 border-stone-300">
                        <Mail size={16} className="text-[#059669]" strokeWidth={3} />
                        <div>
                          <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">{t.email}</div>
                          <div className="text-sm font-black text-stone-900">{scheme.contactInfo.email}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-stone-100 border-t-4 border-stone-900 flex gap-3">
              {scheme.contactInfo?.website && scheme.contactInfo.website !== '#' && (
                <a
                  href={scheme.contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-[#059669] text-[#FAF9F6] border-2 border-stone-900 font-black text-xs uppercase tracking-widest hover:bg-[#047857] transition-all shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] text-center flex items-center justify-center gap-2"
                >
                  {t.applyOnline}
                  <ExternalLink size={14} strokeWidth={3} />
                </a>
              )}
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#FAF9F6] text-stone-900 border-2 border-stone-900 font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
              >
                {t.close}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
