import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLanguage } from '../services/storage';
import { PrimaryButton, SecondaryButton, pageVariants } from '../components/EditorialComponents';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface SimpleProfile {
  age: number;
  state: string;
  occupation: string;
  annualIncome: number;
  gender: string;
  socialCategory: string;
  // Optional occupation-specific
  ownsLand?: boolean;
  landSize?: number;
  educationLevel?: string;
  institutionType?: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function SimpleProfilePage() {
  const navigate = useNavigate();
  const language = getLanguage();
  
  const [profile, setProfile] = useState<SimpleProfile>({
    age: 0,
    state: '',
    occupation: '',
    annualIncome: 0,
    gender: '',
    socialCategory: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!profile.age || profile.age < 1 || profile.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!profile.state) {
      newErrors.state = 'Please select your state';
    }
    if (!profile.occupation) {
      newErrors.occupation = 'Please select your occupation';
    }
    if (!profile.gender) {
      newErrors.gender = 'Please select your gender';
    }
    if (!profile.socialCategory) {
      newErrors.socialCategory = 'Please select your category';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save profile
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('userId', 'user-' + Date.now());
    
    // Navigate to results
    navigate('/enhanced-results');
  };

  const updateField = (field: keyof SimpleProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FAF9F6]"
    >
      <header className="bg-[#FAF9F6] border-b-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
              {language === 'hi' ? 'अपनी जानकारी भरें' : 'Fill Your Information'}
            </h1>
            <button
              onClick={() => navigate('/')}
              className="text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 transition-colors"
            >
              {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#FAF9F6] border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-stone-900 mb-3 uppercase tracking-wider">
              {language === 'hi' ? 'बुनियादी जानकारी' : 'Basic Information'}
            </h2>
            <p className="text-stone-600 font-medium">
              {language === 'hi' 
                ? 'केवल 6 आवश्यक प्रश्न - 2 मिनट में पूरा करें'
                : 'Only 6 essential questions - Complete in 2 minutes'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                {language === 'hi' ? '1. आपकी उम्र क्या है?' : '1. What is your age?'} *
              </label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) => updateField('age', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors text-lg"
                placeholder={language === 'hi' ? 'उदाहरण: 45' : 'Example: 45'}
              />
              {errors.age && <p className="mt-2 text-sm text-red-600 font-bold">{errors.age}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                {language === 'hi' ? '2. आप किस राज्य में रहते हैं?' : '2. Which state do you live in?'} *
              </label>
              <select
                value={profile.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors text-lg"
              >
                <option value="">{language === 'hi' ? 'राज्य चुनें' : 'Select State'}</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="mt-2 text-sm text-red-600 font-bold">{errors.state}</p>}
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                {language === 'hi' ? '3. आप क्या काम करते हैं?' : '3. What is your occupation?'} *
              </label>
              <select
                value={profile.occupation}
                onChange={(e) => updateField('occupation', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors text-lg"
              >
                <option value="">{language === 'hi' ? 'पेशा चुनें' : 'Select Occupation'}</option>
                <option value="Farmer">{language === 'hi' ? 'किसान' : 'Farmer'}</option>
                <option value="Agricultural Worker">{language === 'hi' ? 'कृषि मजदूर' : 'Agricultural Worker'}</option>
                <option value="Student">{language === 'hi' ? 'छात्र' : 'Student'}</option>
                <option value="Unemployed">{language === 'hi' ? 'बेरोजगार' : 'Unemployed'}</option>
                <option value="Self-Employed">{language === 'hi' ? 'स्व-रोजगार' : 'Self-Employed'}</option>
                <option value="Private Sector">{language === 'hi' ? 'निजी क्षेत्र' : 'Private Sector'}</option>
                <option value="Government Employee">{language === 'hi' ? 'सरकारी कर्मचारी' : 'Government Employee'}</option>
                <option value="Daily Wage Worker">{language === 'hi' ? 'दिहाड़ी मजदूर' : 'Daily Wage Worker'}</option>
                <option value="Artisan">{language === 'hi' ? 'कारीगर' : 'Artisan'}</option>
                <option value="Fisherman">{language === 'hi' ? 'मछुआरा' : 'Fisherman'}</option>
                <option value="Other">{language === 'hi' ? 'अन्य' : 'Other'}</option>
              </select>
              {errors.occupation && <p className="mt-2 text-sm text-red-600 font-bold">{errors.occupation}</p>}
            </div>

            {/* Farmer-specific fields */}
            {profile.occupation === 'Farmer' && (
              <div className="pl-6 border-l-4 border-[#059669] space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                    {language === 'hi' ? 'क्या आपके पास जमीन है?' : 'Do you own land?'}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateField('ownsLand', true)}
                      className={`px-6 py-4 border-2 font-bold uppercase tracking-wider transition-all ${
                        profile.ownsLand === true
                          ? 'bg-[#059669] text-white border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]'
                          : 'bg-[#FAF9F6] text-stone-700 border-stone-300 hover:border-stone-900'
                      }`}
                    >
                      {language === 'hi' ? 'हाँ' : 'Yes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('ownsLand', false)}
                      className={`px-6 py-4 border-2 font-bold uppercase tracking-wider transition-all ${
                        profile.ownsLand === false
                          ? 'bg-[#059669] text-white border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]'
                          : 'bg-[#FAF9F6] text-stone-700 border-stone-300 hover:border-stone-900'
                      }`}
                    >
                      {language === 'hi' ? 'नहीं' : 'No'}
                    </button>
                  </div>
                </div>

                {profile.ownsLand && (
                  <div>
                    <label className="block text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                      {language === 'hi' ? 'कितनी जमीन है? (एकड़ में)' : 'How much land? (in acres)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={profile.landSize || ''}
                      onChange={(e) => updateField('landSize', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
                      placeholder={language === 'hi' ? 'उदाहरण: 2.5' : 'Example: 2.5'}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Student-specific fields */}
            {profile.occupation === 'Student' && (
              <div className="pl-6 border-l-4 border-[#7C3AED] space-y-6">
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                    {language === 'hi' ? 'शिक्षा स्तर' : 'Education Level'}
                  </label>
                  <select
                    value={profile.educationLevel || ''}
                    onChange={(e) => updateField('educationLevel', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
                  >
                    <option value="">{language === 'hi' ? 'चुनें' : 'Select'}</option>
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="Graduate">{language === 'hi' ? 'स्नातक' : 'Graduate'}</option>
                    <option value="Postgraduate">{language === 'hi' ? 'स्नातकोत्तर' : 'Postgraduate'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                    {language === 'hi' ? 'संस्थान का प्रकार' : 'Institution Type'}
                  </label>
                  <select
                    value={profile.institutionType || ''}
                    onChange={(e) => updateField('institutionType', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
                  >
                    <option value="">{language === 'hi' ? 'चुनें' : 'Select'}</option>
                    <option value="Government">{language === 'hi' ? 'सरकारी' : 'Government'}</option>
                    <option value="Private">{language === 'hi' ? 'निजी' : 'Private'}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Annual Income */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                {language === 'hi' ? '4. आपकी वार्षिक आय क्या है?' : '4. What is your annual income?'} *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-stone-500 text-lg font-bold">₹</span>
                <input
                  type="number"
                  value={profile.annualIncome || ''}
                  onChange={(e) => updateField('annualIncome', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors text-lg"
                  placeholder={language === 'hi' ? 'उदाहरण: 250000' : 'Example: 250000'}
                />
              </div>
              {errors.annualIncome && <p className="mt-2 text-sm text-red-600 font-bold">{errors.annualIncome}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                {language === 'hi' ? '5. आपका लिंग क्या है?' : '5. What is your gender?'} *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['Male', 'Female', 'Other'].map(gender => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => updateField('gender', gender)}
                    className={`px-4 py-4 border-2 font-bold uppercase tracking-wider transition-all ${
                      profile.gender === gender
                        ? 'bg-[#059669] text-white border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]'
                        : 'bg-[#FAF9F6] text-stone-700 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    {language === 'hi' 
                      ? gender === 'Male' ? 'पुरुष' : gender === 'Female' ? 'महिला' : 'अन्य'
                      : gender
                    }
                  </button>
                ))}
              </div>
              {errors.gender && <p className="mt-2 text-sm text-red-600 font-bold">{errors.gender}</p>}
            </div>

            {/* Social Category */}
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-3 uppercase tracking-wider">
                {language === 'hi' ? '6. आपकी सामाजिक श्रेणी क्या है?' : '6. What is your social category?'} *
              </label>
              <select
                value={profile.socialCategory}
                onChange={(e) => updateField('socialCategory', e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors text-lg"
              >
                <option value="">{language === 'hi' ? 'श्रेणी चुनें' : 'Select Category'}</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
              {errors.socialCategory && <p className="mt-2 text-sm text-red-600 font-bold">{errors.socialCategory}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <PrimaryButton
                type="submit"
                icon={<ChevronRight size={20} strokeWidth={2.5} />}
                className="w-full text-lg px-8 py-5"
              >
                {language === 'hi' ? 'योजनाएं खोजें' : 'Find Schemes'}
              </PrimaryButton>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-[#ECFDF5] border-2 border-[#059669]/30 p-5 shadow-[2px_2px_0px_0px_rgba(5,150,105,0.2)]">
          <h3 className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wider">
            {language === 'hi' ? '💡 क्यों पूछा जा रहा है?' : '💡 Why are we asking?'}
          </h3>
          <p className="text-sm text-stone-700 font-medium leading-relaxed">
            {language === 'hi'
              ? 'यह जानकारी हमें आपके लिए सही सरकारी योजनाएं खोजने में मदद करती है। आपका डेटा सुरक्षित और निजी है।'
              : 'This information helps us find the right government schemes for you. Your data is secure and private.'
            }
          </p>
        </div>
      </main>
    </motion.div>
  );
}
