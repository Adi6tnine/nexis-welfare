import { useNavigate } from 'react-router-dom';
import { getLanguage, saveLanguage } from '../services/storage';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, ChevronRight, Zap, BookOpen, Briefcase, Accessibility, Sprout, Heart } from 'lucide-react';
import { getTotalSchemeCount } from '../data/schemes';

const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
];

// Animation configuration
const transition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };
const fadeUpVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition }
};

export default function ProfessionalLandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<string>(getLanguage());
  const [schemeCount, setSchemeCount] = useState(0);

  useEffect(() => {
    setSchemeCount(getTotalSchemeCount());
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    saveLanguage(lang);
  };

  const content = {
    en: {
      hero: {
        badge: 'AI-Powered Platform',
        title: 'Discover Government',
        titleItalic: 'Schemes You Qualify For',
        subtitle: 'Helping Indian citizens find and apply for welfare schemes in minutes. No bureaucracy, just results.',
        voiceButton: 'Start with Voice',
        formButton: 'Fill Form',
        stats: [
          { value: `${schemeCount}+`, label: 'Schemes' },
          { value: '95%', label: 'Accuracy' },
          { value: '2m', label: 'Avg Time' }
        ]
      },
      demo: {
        badge: 'Quick Demo',
        subtitle: 'Choose a profile and see results instantly.',
        disclaimer: 'Demo profiles. Enter real information.',
        profiles: [
          { name: 'Ramesh Kumar', desc: 'Small farmer from Maharashtra with...', icon: 'Sprout' },
          { name: 'Priya Sharma', desc: 'SC category student pursuin...', icon: 'BookOpen' },
          { name: 'Lakshmi Devi', desc: 'Senior citizen widow from Tami...', icon: 'Heart' },
          { name: 'Arjun Patel', desc: 'Young entrepreneur...', icon: 'Briefcase' },
          { name: 'Savitri Bai', desc: 'Woman farmer from Uttar...', icon: 'Sprout' },
          { name: 'Rajesh Singh', desc: 'Person with 40% disability from...', icon: 'Accessibility' }
        ]
      },
      features: {
        title: 'How It Works',
        items: [
          {
            title: 'Share Information',
            description: 'Tell us about yourself securely through voice or a simple form interface.'
          },
          {
            title: 'Get Matched',
            description: 'Our AI analyzes 500+ government schemes instantly to find your best matches.'
          },
          {
            title: 'Apply Guidance',
            description: 'Step-by-step authoritative assistance to complete your official application.'
          }
        ]
      },
      benefits: {
        title: 'Why Choose NEXIS',
        items: [
          {
            title: 'Voice-First Design',
            description: 'Speak naturally in Hindi or English. Zero typing required to discover your eligibility.'
          },
          {
            title: 'Smart Matching',
            description: 'Advanced logic finds the specific schemes you actually qualify for, cutting through the noise.'
          },
          {
            title: 'Application Support',
            description: 'Real-time guidance prevents common mistakes and helps you gather the right documents.'
          },
          {
            title: 'Always Updated',
            description: 'Latest schemes and eligibility rules synced directly from official government sources.'
          }
        ]
      },
      cta: {
        title: 'Get Started Today',
        subtitle: 'It takes just 2 minutes to find the right government schemes for you.',
        button: 'Start Now'
      },
      footer: {
        copyright: 'Built to serve Indian citizens.'
      }
    },
    hi: {
      hero: {
        badge: 'AI-संचालित प्लेटफॉर्म',
        title: 'जानें कौन सी सरकारी',
        titleItalic: 'योजनाएं आपके लिए हैं',
        subtitle: 'भारतीय नागरिकों को मिनटों में कल्याण योजनाएं खोजने और आवेदन करने में मदद करना। कोई नौकरशाही नहीं, बस परिणाम।',
        voiceButton: 'आवाज़ से शुरू करें',
        formButton: 'फॉर्म भरें',
        stats: [
          { value: `${schemeCount}+`, label: 'योजनाएं' },
          { value: '95%', label: 'सटीकता' },
          { value: '2 मि', label: 'औसत समय' }
        ]
      },
      demo: {
        badge: 'त्वरित डेमो',
        subtitle: 'एक प्रोफ़ाइल चुनें और तुरंत परिणाम देखें।',
        disclaimer: 'डेमो प्रोफ़ाइल। वास्तविक जानकारी दर्ज करें।',
        profiles: [
          { name: 'रमेश कुमार', desc: 'महाराष्ट्र से छोटे किसान...', icon: 'Sprout' },
          { name: 'प्रिया शर्मा', desc: 'SC श्रेणी की छात्रा...', icon: 'BookOpen' },
          { name: 'लक्ष्मी देवी', desc: 'तमिलनाडु से वरिष्ठ नागरिक विधवा...', icon: 'Heart' },
          { name: 'अर्जुन पटेल', desc: 'युवा उद्यमी...', icon: 'Briefcase' },
          { name: 'सावित्री बाई', desc: 'उत्तर प्रदेश से महिला किसान...', icon: 'Sprout' },
          { name: 'राजेश सिंह', desc: '40% विकलांगता वाले व्यक्ति...', icon: 'Accessibility' }
        ]
      },
      features: {
        title: 'यह कैसे काम करता है',
        items: [
          {
            title: 'जानकारी साझा करें',
            description: 'आवाज़ या सरल फॉर्म इंटरफ़ेस के माध्यम से सुरक्षित रूप से हमें अपने बारे में बताएं।'
          },
          {
            title: 'मैच प्राप्त करें',
            description: 'हमारा AI आपके सर्वोत्तम मैच खोजने के लिए तुरंत 500+ सरकारी योजनाओं का विश्लेषण करता है।'
          },
          {
            title: 'आवेदन मार्गदर्शन',
            description: 'अपना आधिकारिक आवेदन पूरा करने के लिए चरण-दर-चरण आधिकारिक सहायता।'
          }
        ]
      },
      benefits: {
        title: 'NEXIS क्यों चुनें',
        items: [
          {
            title: 'आवाज़-प्रथम डिज़ाइन',
            description: 'हिंदी या अंग्रेजी में स्वाभाविक रूप से बोलें। अपनी पात्रता जानने के लिए शून्य टाइपिंग की आवश्यकता है।'
          },
          {
            title: 'स्मार्ट मैचिंग',
            description: 'उन्नत तर्क उन विशिष्ट योजनाओं को ढूंढता है जिनके लिए आप वास्तव में योग्य हैं, शोर को काटते हुए।'
          },
          {
            title: 'आवेदन सहायता',
            description: 'वास्तविक समय मार्गदर्शन सामान्य गलतियों को रोकता है और सही दस्तावेज़ एकत्र करने में मदद करता है।'
          },
          {
            title: 'हमेशा अपडेट',
            description: 'आधिकारिक सरकारी स्रोतों से सीधे नवीनतम योजनाएं और पात्रता नियम समन्वयित।'
          }
        ]
      },
      cta: {
        title: 'आज ही शुरू करें',
        subtitle: 'अपने लिए सही सरकारी योजनाएं खोजने में केवल 2 मिनट लगते हैं।',
        button: 'अभी शुरू करें'
      },
      footer: {
        copyright: 'भारतीय नागरिकों की सेवा के लिए बनाया गया।'
      }
    }
  };

  const t = content[language as keyof typeof content];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-emerald-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                N
              </div>
              <span className="text-xl font-bold text-gray-900">NEXIS</span>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-5 py-2 rounded-xl font-semibold transition-all text-sm ${
                    language === lang.code
                      ? 'bg-white text-emerald-600 shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t.hero.title}
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => navigate('/voice-onboarding')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                {t.hero.voiceButton}
              </button>

              <button
                onClick={() => navigate('/adaptive-profile')}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-emerald-700 bg-white border-2 border-emerald-600 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                {t.hero.formButton}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
              {t.hero.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Demo Profile Buttons */}
            <div className="max-w-5xl mx-auto">
              <DemoProfileButtons />
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            {t.features.title}
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {t.features.items.map((feature, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-2xl font-bold text-xl mb-6 shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            {t.benefits.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {t.benefits.items.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {language === 'hi' ? 'आज ही शुरू करें' : 'Get Started Today'}
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            {language === 'hi' 
              ? 'अपने लिए सही सरकारी योजनाएं खोजने में केवल 2 मिनट लगते हैं'
              : 'It takes just 2 minutes to find the right government schemes for you'
            }
          </p>
          <button
            onClick={() => navigate('/voice-onboarding')}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-emerald-700 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            {language === 'hi' ? 'अभी शुरू करें' : 'Start Now'}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <span className="text-xl font-bold text-white">NEXIS</span>
            </div>
            <p className="text-sm">
              {language === 'hi' 
                ? '© 2026 NEXIS. भारतीय नागरिकों की सेवा के लिए बनाया गया।'
                : '© 2026 NEXIS. Built to serve Indian citizens.'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
