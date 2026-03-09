import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, UserPlus, Zap, Save, ArrowLeft } from 'lucide-react';
import { getLanguage } from '../services/storage';
import { isAuthenticated, getCurrentUser } from '../services/auth';
import { PrimaryButton, SecondaryButton, pageVariants } from '../components/EditorialComponents';

interface SimpleProfile {
  age: number;
  state: string;
  occupation: string;
  annualIncome: number;
  gender: string;
  socialCategory: string;
  hasDisability: boolean;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const OCCUPATIONS = [
  'Farmer', 'Daily Wage Worker', 'Self-Employed', 'Private Sector',
  'Government Employee', 'Student', 'Unemployed', 'Retired', 'Other'
];

export default function FlexibleProfilePage() {
  const navigate = useNavigate();
  const language = getLanguage();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [profile, setProfile] = useState<SimpleProfile>({
    age: 0,
    state: '',
    occupation: '',
    annualIncome: 0,
    gender: '',
    socialCategory: '',
    hasDisability: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);
    
    // If logged in and has profile, redirect to results
    if (loggedIn) {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        try {
          const savedProfile = JSON.parse(saved);
          // Check if profile is complete
          if (savedProfile.age && savedProfile.state && savedProfile.occupation) {
            // User is logged in and has profile, redirect to results
            navigate('/enhanced-results');
            return;
          }
        } catch (e) {
          console.error('Failed to load profile');
        }
      }
    }
    
    // Load saved profile if exists
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load profile');
      }
    }
  }, [navigate]);

  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!profile.age || profile.age < 1 || profile.age > 120) {
      newErrors.age = language === 'hi' ? 'कृपया वैध उम्र दर्ज करें' : 'Please enter a valid age';
    }
    if (!profile.state) {
      newErrors.state = language === 'hi' ? 'कृपया राज्य चुनें' : 'Please select your state';
    }
    if (!profile.occupation) {
      newErrors.occupation = language === 'hi' ? 'कृपया व्यवसाय चुनें' : 'Please select your occupation';
    }
    if (!profile.gender) {
      newErrors.gender = language === 'hi' ? 'कृपया लिंग चुनें' : 'Please select your gender';
    }
    if (!profile.socialCategory) {
      newErrors.socialCategory = language === 'hi' ? 'कृपया श्रेणी चुनें' : 'Please select your category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfile()) return;

    // Save profile temporarily
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('userId', 'guest-' + Date.now());
    
    // Navigate to results
    navigate('/enhanced-results');
  };

  const handleSaveAndCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfile()) return;

    if (!isLoggedIn) {
      // Show auth prompt
      setShowAuthPrompt(true);
      return;
    }

    // Save profile with user account
    localStorage.setItem('userProfile', JSON.stringify(profile));
    const user = getCurrentUser();
    if (user) {
      localStorage.setItem('userId', user.userId);
    }
    
    // Navigate to results
    navigate('/enhanced-results');
  };

  const updateField = (field: keyof SimpleProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const t = {
    title: language === 'hi' ? 'पात्रता जांच' : 'Eligibility Check',
    subtitle: language === 'hi' 
      ? 'अपनी जानकारी भरें और पता करें कि आप किन योजनाओं के लिए पात्र हैं'
      : 'Fill your information and find out which schemes you are eligible for',
    guestMode: language === 'hi' ? 'अतिथि मोड' : 'Guest Mode',
    guestDesc: language === 'hi' 
      ? 'त्वरित जांच - कोई खाता आवश्यक नहीं'
      : 'Quick check - No account required',
    saveMode: language === 'hi' ? 'सहेजें और जांचें' : 'Save & Check',
    saveDesc: language === 'hi'
      ? 'अपनी जानकारी सहेजें और बाद में वापस आएं'
      : 'Save your information and come back later',
    quickCheck: language === 'hi' ? 'त्वरित जांच' : 'Quick Check',
    saveAndCheck: language === 'hi' ? 'सहेजें और जांचें' : 'Save & Check',
    loginFirst: language === 'hi' ? 'पहले लॉगिन करें' : 'Login First',
    signupFirst: language === 'hi' ? 'पहले साइन अप करें' : 'Sign Up First',
    authPromptTitle: language === 'hi' ? 'अपनी जानकारी सहेजें' : 'Save Your Information',
    authPromptDesc: language === 'hi'
      ? 'अपनी प्रोफाइल सहेजने के लिए कृपया लॉगिन करें या साइन अप करें'
      : 'Please login or sign up to save your profile',
    login: language === 'hi' ? 'लॉगिन' : 'Login',
    signup: language === 'hi' ? 'साइन अप' : 'Sign Up',
    continueGuest: language === 'hi' ? 'अतिथि के रूप में जारी रखें' : 'Continue as Guest',
    back: language === 'hi' ? 'वापस' : 'Back'
  };

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
              {t.title}
            </h1>
            <button
              onClick={() => navigate('/landing')}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft size={16} />
              {t.back}
            </button>
          </div>
        </div>
      </header>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FAF9F6] border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t.authPromptTitle}
            </h3>
            <p className="text-stone-600 mb-6">
              {t.authPromptDesc}
            </p>
            <div className="space-y-3">
              <PrimaryButton
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2"
              >
                <User size={20} />
                {t.login}
              </PrimaryButton>
              <SecondaryButton
                onClick={() => navigate('/register')}
                className="w-full flex items-center justify-center gap-2"
              >
                <UserPlus size={20} />
                {t.signup}
              </SecondaryButton>
              <button
                onClick={() => {
                  setShowAuthPrompt(false);
                  handleQuickCheck(new Event('submit') as any);
                }}
                className="w-full py-3 text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
              >
                {t.continueGuest}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Selection */}
        {!isLoggedIn && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-amber-50 border-2 border-amber-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="text-amber-600" size={24} />
                <h3 className="font-bold text-stone-900 uppercase tracking-wider">
                  {t.guestMode}
                </h3>
              </div>
              <p className="text-sm text-stone-600">
                {t.guestDesc}
              </p>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Save className="text-emerald-600" size={24} />
                <h3 className="font-bold text-stone-900 uppercase tracking-wider">
                  {t.saveMode}
                </h3>
              </div>
              <p className="text-sm text-stone-600">
                {t.saveDesc}
              </p>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-[#FAF9F6] border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] p-8">
          <form className="space-y-6">
            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                {language === 'hi' ? 'उम्र' : 'Age'} *
              </label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) => updateField('age', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
                placeholder={language === 'hi' ? 'उदाहरण: 35' : 'Example: 35'}
              />
              {errors.age && <p className="mt-1 text-sm text-red-600 font-bold">{errors.age}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                {language === 'hi' ? 'राज्य' : 'State'} *
              </label>
              <select
                value={profile.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
              >
                <option value="">{language === 'hi' ? 'राज्य चुनें' : 'Select State'}</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="mt-1 text-sm text-red-600 font-bold">{errors.state}</p>}
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                {language === 'hi' ? 'व्यवसाय' : 'Occupation'} *
              </label>
              <select
                value={profile.occupation}
                onChange={(e) => updateField('occupation', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
              >
                <option value="">{language === 'hi' ? 'व्यवसाय चुनें' : 'Select Occupation'}</option>
                {OCCUPATIONS.map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
              {errors.occupation && <p className="mt-1 text-sm text-red-600 font-bold">{errors.occupation}</p>}
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                {language === 'hi' ? 'वार्षिक आय (₹)' : 'Annual Income (₹)'} *
              </label>
              <input
                type="number"
                value={profile.annualIncome || ''}
                onChange={(e) => updateField('annualIncome', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
                placeholder={language === 'hi' ? 'उदाहरण: 50000' : 'Example: 50000'}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                {language === 'hi' ? 'लिंग' : 'Gender'} *
              </label>
              <select
                value={profile.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
              >
                <option value="">{language === 'hi' ? 'लिंग चुनें' : 'Select Gender'}</option>
                <option value="Male">{language === 'hi' ? 'पुरुष' : 'Male'}</option>
                <option value="Female">{language === 'hi' ? 'महिला' : 'Female'}</option>
                <option value="Other">{language === 'hi' ? 'अन्य' : 'Other'}</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-600 font-bold">{errors.gender}</p>}
            </div>

            {/* Social Category */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                {language === 'hi' ? 'सामाजिक श्रेणी' : 'Social Category'} *
              </label>
              <select
                value={profile.socialCategory}
                onChange={(e) => updateField('socialCategory', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
              >
                <option value="">{language === 'hi' ? 'श्रेणी चुनें' : 'Select Category'}</option>
                <option value="General">{language === 'hi' ? 'सामान्य' : 'General'}</option>
                <option value="OBC">{language === 'hi' ? 'ओबीसी' : 'OBC'}</option>
                <option value="SC">{language === 'hi' ? 'अनुसूचित जाति' : 'SC'}</option>
                <option value="ST">{language === 'hi' ? 'अनुसूचित जनजाति' : 'ST'}</option>
              </select>
              {errors.socialCategory && <p className="mt-1 text-sm text-red-600 font-bold">{errors.socialCategory}</p>}
            </div>

            {/* Disability */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasDisability"
                checked={profile.hasDisability}
                onChange={(e) => updateField('hasDisability', e.target.checked)}
                className="w-5 h-5 border-2 border-stone-300"
              />
              <label htmlFor="hasDisability" className="text-sm font-bold text-stone-900">
                {language === 'hi' ? 'मुझे विकलांगता है' : 'I have a disability'}
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <PrimaryButton
                onClick={handleQuickCheck}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                {t.quickCheck}
              </PrimaryButton>
              
              {isLoggedIn ? (
                <SecondaryButton
                  onClick={handleSaveAndCheck}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {t.saveAndCheck}
                </SecondaryButton>
              ) : (
                <SecondaryButton
                  onClick={handleSaveAndCheck}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <UserPlus size={20} />
                  {t.loginFirst}
                </SecondaryButton>
              )}
            </div>
          </form>
        </div>
      </main>
    </motion.div>
  );
}
