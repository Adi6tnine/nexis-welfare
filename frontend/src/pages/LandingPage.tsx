import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ChevronRight, Zap, BookOpen, Briefcase, Accessibility, Sprout, Heart, Lightbulb } from 'lucide-react';
import { getLanguage, saveLanguage } from '../services/storage';
import { getTranslation } from '../locales/translations';
import {
  Header,
  Footer,
  PrimaryButton,
  SecondaryButton,
  Card,
  SectionTag,
  Stat,
  IconBox,
  StepNumber,
  Alert,
  Toast,
  fadeUpVariants,
  pageVariants
} from '../components/EditorialComponents';

const demoProfiles = [
  { icon: Sprout, bg: 'bg-amber-50', border: 'border-amber-200' },
  { icon: BookOpen, bg: 'bg-rose-50', border: 'border-rose-200' },
  { icon: Heart, bg: 'bg-purple-50', border: 'border-purple-200' },
  { icon: Briefcase, bg: 'bg-blue-50', border: 'border-blue-200' },
  { icon: Sprout, bg: 'bg-orange-50', border: 'border-orange-200' },
  { icon: Accessibility, bg: 'bg-indigo-50', border: 'border-indigo-200' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<string>(getLanguage());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    saveLanguage(lang);
  };

  const t = getTranslation(language);

  const handleDemoProfile = (profileName: string) => {
    setToastMessage(`Loading Profile: ${profileName}`);
    setTimeout(() => navigate('/results'), 600);
  };

  const handleVoiceStart = () => {
    setToastMessage('Voice Assistant Activated... Listening!');
    setTimeout(() => navigate('/voice-onboarding'), 600);
  };

  const handleFormStart = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans selection:bg-[#059669] selection:text-white">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#059669] focus:text-white focus:border-2 focus:border-stone-900"
      >
        Skip to main content
      </a>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>

      {/* Header */}
      <Header lang={language} setLang={handleLanguageChange} translations={t} />

      {/* Main Content */}
      <main id="main-content" role="main">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="px-6 md:px-12 pt-24 pb-16 w-full flex flex-col items-center text-center relative overflow-hidden"
          aria-labelledby="hero-heading"
        >
          {/* Decorative Circle */}
          <div
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-3xl max-h-3xl border-[1px] border-stone-200 rounded-full opacity-40 -z-10 pointer-events-none"
            aria-hidden="true"
          />

          {/* Tag */}
          <SectionTag className="mb-6">{t.hero.tag}</SectionTag>

          {/* Title */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-serif font-bold text-stone-900 leading-[1.05] tracking-tight max-w-5xl px-4"
          >
            {t.hero.title1}
            <br />
            <span className="italic font-light text-[#059669]">{t.hero.title2}</span>
          </h1>

          {/* Description */}
          <p className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-stone-600 font-medium max-w-2xl border-l-2 border-stone-200 pl-4 mx-4">
            {t.hero.desc}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full">
            <PrimaryButton
              onClick={handleVoiceStart}
              icon={<Mic size={18} />}
              iconPosition="left"
              className="w-full max-w-xs sm:w-auto text-sm md:text-base"
            >
              {t.hero.btnVoice}
            </PrimaryButton>

            <SecondaryButton
              onClick={handleFormStart}
              icon={<ChevronRight size={18} />}
              iconPosition="right"
              className="w-full max-w-xs sm:w-auto text-sm md:text-base"
            >
              {t.hero.btnForm}
            </SecondaryButton>
          </div>

          {/* Stats */}
          <div className="mt-16 md:mt-20 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-32 border-y border-stone-200 py-6 md:py-8 w-full max-w-4xl px-4">
            <Stat value="500+" label={t.hero.stat1} />
            <div className="hidden sm:block w-px h-12 bg-stone-300" aria-hidden="true"></div>
            <Stat value="95%" label={t.hero.stat2} accent />
            <div className="hidden sm:block w-px h-12 bg-stone-300" aria-hidden="true"></div>
            <Stat value="2m" label={t.hero.stat3} />
          </div>
        </motion.section>

        {/* Demo Profiles Section */}
        <section
          className="w-full pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center"
          aria-labelledby="demo-heading"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-stone-900 fill-stone-900" />
            <h2 id="demo-heading" className="text-sm font-bold text-stone-900 uppercase tracking-widest">
              {t.demo.title}
            </h2>
          </div>
          <p className="text-sm text-stone-500 mb-10 font-serif italic">{t.demo.subtitle}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
            {demoProfiles.map((profile, i) => {
              const profileNames = [
                t.demo.p1Name,
                t.demo.p2Name,
                t.demo.p3Name,
                t.demo.p4Name,
                t.demo.p5Name,
                t.demo.p6Name
              ];
              const profileDescs = [
                t.demo.p1Desc,
                t.demo.p2Desc,
                t.demo.p3Desc,
                t.demo.p4Desc,
                t.demo.p5Desc,
                t.demo.p6Desc
              ];

              return (
                <Card
                  key={i}
                  onClick={() => handleDemoProfile(profileNames[i])}
                  className="p-5 flex flex-col items-center text-center"
                >
                  <IconBox
                    icon={<profile.icon size={22} className="text-stone-800" strokeWidth={1.5} />}
                    bgColor={profile.bg}
                    borderColor={profile.border}
                    className="mb-4"
                  />
                  <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">
                    {profileNames[i]}
                  </h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">{profileDescs[i]}</p>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400">
            <div className="w-4 h-px bg-stone-300" aria-hidden="true"></div>
            <span>{t.demo.note}</span>
            <div className="w-4 h-px bg-stone-300" aria-hidden="true"></div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          className="w-full py-24 px-6 md:px-12 border-t border-stone-200"
          aria-labelledby="how-it-works-heading"
        >
          <div className="max-w-6xl mx-auto">
            <h2
              id="how-it-works-heading"
              className="text-3xl md:text-5xl font-serif font-bold text-center text-stone-900 mb-20"
            >
              {t.how.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
              {[
                { title: t.how.s1Title, desc: t.how.s1Desc, num: 1 },
                { title: t.how.s2Title, desc: t.how.s2Desc, num: 2 },
                { title: t.how.s3Title, desc: t.how.s3Desc, num: 3 }
              ].map((step, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-start border-l-2 ${
                    i === 2 ? 'border-[#059669]' : 'border-stone-200'
                  } pl-6 relative`}
                >
                  <div className="absolute -left-[21px] top-0">
                    <StepNumber number={step.num} active={i === 2} />
                  </div>
                  <h3 className="font-bold text-stone-900 text-xl mb-3 mt-1">{step.title}</h3>
                  <p className="text-base text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose NEXIS Section */}
        <section
          className="w-full py-24 px-6 md:px-12 bg-stone-100 border-y border-stone-300 relative overflow-hidden"
          aria-labelledby="why-choose-heading"
        >
          <div className="absolute inset-0 pattern-lines opacity-50 z-0" aria-hidden="true"></div>

          <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">
            <h2
              id="why-choose-heading"
              className="text-3xl md:text-5xl font-serif font-bold text-center text-stone-900 mb-16"
            >
              {t.why.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {[
                { title: t.why.w1Title, desc: t.why.w1Desc },
                { title: t.why.w2Title, desc: t.why.w2Desc },
                { title: t.why.w3Title, desc: t.why.w3Desc },
                { title: t.why.w4Title, desc: t.why.w4Desc }
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#FAF9F6] p-8 border-2 border-stone-300 shadow-[6px_6px_0px_0px_rgba(28,25,23,0.05)] flex flex-col hover:border-stone-400 transition-colors"
                >
                  <h3 className="font-bold text-stone-900 text-lg mb-3 uppercase tracking-widest">{item.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="w-full py-24 px-6 md:px-12 bg-stone-900 text-center relative overflow-hidden"
          aria-labelledby="cta-heading"
        >
          <div className="absolute inset-0 pattern-lines-light opacity-50 z-0" aria-hidden="true"></div>

          <div className="relative z-10">
            <h2 id="cta-heading" className="text-4xl md:text-6xl font-serif font-bold text-[#FAF9F6] mb-6">
              {t.cta.title}
            </h2>
            <p className="text-stone-400 text-lg md:text-xl font-medium mb-12 max-w-xl mx-auto italic font-serif">
              {t.cta.desc}
            </p>
            <PrimaryButton
              onClick={handleFormStart}
              icon={<ChevronRight size={18} />}
              iconPosition="right"
              className="mx-auto"
            >
              {t.cta.btn}
            </PrimaryButton>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
