import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveLanguage } from '../services/storage';
import { pageVariants } from '../components/EditorialComponents';
import { Globe, Check } from 'lucide-react';

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
];

export default function LanguageSelectionPage() {
  const navigate = useNavigate();

  const handleLanguageSelect = (languageCode: string) => {
    saveLanguage(languageCode);
    navigate('/landing');
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#059669] flex items-center justify-center p-4"
    >
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-white border-4 border-stone-900 mb-8 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
            <Globe size={64} className="text-[#059669]" strokeWidth={2} />
          </div>
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            Welcome to NEXIS
          </h1>
          <p className="text-xl text-white mb-3 font-bold uppercase tracking-widest">
            National Eligibility eXpert and Information System
          </p>
          <p className="text-lg text-white/90 font-medium">
            Select your preferred language | अपनी भाषा चुनें
          </p>
        </div>

        <div className="bg-[#FAF9F6] border-4 border-stone-900 shadow-[12px_12px_0px_0px_rgba(28,25,23,1)] p-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center uppercase tracking-wider">
            Choose Your Language
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className="group relative p-6 bg-[#FAF9F6] hover:bg-[#ECFDF5] border-2 border-stone-300 hover:border-[#059669] transition-all duration-200 transform hover:scale-105 hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,1)] focus:outline-none focus:ring-4 focus:ring-[#059669]/30"
                aria-label={`Select ${language.name}`}
              >
                <div className="text-4xl mb-3">{language.flag}</div>
                <div className="text-lg font-bold text-stone-900 mb-1">
                  {language.nativeName}
                </div>
                <div className="text-sm text-stone-600 font-medium uppercase tracking-wider">
                  {language.name}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check size={20} className="text-[#059669]" strokeWidth={3} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t-2 border-stone-200">
            <div className="flex items-start gap-3 text-sm text-stone-600">
              <div className="w-6 h-6 border-2 border-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#059669] font-bold text-xs">i</span>
              </div>
              <p className="font-medium leading-relaxed">
                You can change the language anytime from the settings. All government schemes and information will be displayed in your selected language.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white text-sm font-bold uppercase tracking-widest">
            Powered by Digital India Initiative | भारत सरकार
          </p>
        </div>
      </div>
    </motion.div>
  );
}
