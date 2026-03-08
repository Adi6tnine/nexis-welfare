import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit2, Save, X, CheckCircle, AlertCircle, MapPin, DollarSign, FileText } from 'lucide-react';
import { getLanguage, getProfile } from '../services/storage';
import { motion } from 'framer-motion';
import { Header, Footer, PrimaryButton, SecondaryButton, Card, ProgressBar, Alert } from '../components/EditorialComponents';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const language = getLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [completeness, setCompleteness] = useState(0);

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setEditedProfile(savedProfile);
      calculateCompleteness(savedProfile);
    } else {
      navigate('/adaptive-profile');
    }
  }, [navigate]);

  const calculateCompleteness = (prof: any) => {
    const fields = [
      'age', 'gender', 'occupation', 'state', 'district', 'residence',
      'annualIncome', 'socialCategory', 'hasAadhaar', 'hasBankAccount',
      'education', 'maritalStatus'
    ];
    
    const filledFields = fields.filter(field => {
      const value = prof[field];
      return value !== undefined && value !== null && value !== '';
    });
    
    const percentage = Math.round((filledFields.length / fields.length) * 100);
    setCompleteness(percentage);
  };

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(editedProfile));
    setProfile(editedProfile);
    calculateCompleteness(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const content = {
    en: {
      title: 'My Profile',
      subtitle: 'Manage your personal information',
      edit: 'Edit Profile',
      save: 'Save Changes',
      cancel: 'Cancel',
      completeness: 'Profile Completeness',
      completeProfile: 'Complete your profile to get better scheme recommendations',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      economicInfo: 'Economic Information',
      documents: 'Documents',
      age: 'Age',
      gender: 'Gender',
      occupation: 'Occupation',
      state: 'State',
      district: 'District',
      residence: 'Residence Type',
      annualIncome: 'Annual Income',
      socialCategory: 'Social Category',
      education: 'Education Level',
      maritalStatus: 'Marital Status',
      hasAadhaar: 'Has Aadhaar',
      hasBankAccount: 'Has Bank Account',
      mobile: 'Mobile Number',
      email: 'Email Address',
      yes: 'Yes',
      no: 'No',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      rural: 'Rural',
      urban: 'Urban',
      general: 'General',
      obc: 'OBC',
      sc: 'SC',
      st: 'ST',
      farmer: 'Farmer',
      student: 'Student',
      business: 'Business',
      employed: 'Employed',
      unemployed: 'Unemployed',
      viewSchemes: 'View Eligible Schemes',
      updateProfile: 'Update Profile',
    },
    hi: {
      title: 'मेरी प्रोफ़ाइल',
      subtitle: 'अपनी व्यक्तिगत जानकारी प्रबंधित करें',
      edit: 'प्रोफ़ाइल संपादित करें',
      save: 'परिवर्तन सहेजें',
      cancel: 'रद्द करें',
      completeness: 'प्रोफ़ाइल पूर्णता',
      completeProfile: 'बेहतर योजना सिफारिशों के लिए अपनी प्रोफ़ाइल पूरी करें',
      personalInfo: 'व्यक्तिगत जानकारी',
      contactInfo: 'संपर्क जानकारी',
      economicInfo: 'आर्थिक जानकारी',
      documents: 'दस्तावेज़',
      age: 'आयु',
      gender: 'लिंग',
      occupation: 'व्यवसाय',
      state: 'राज्य',
      district: 'जिला',
      residence: 'निवास प्रकार',
      annualIncome: 'वार्षिक आय',
      socialCategory: 'सामाजिक श्रेणी',
      education: 'शिक्षा स्तर',
      maritalStatus: 'वैवाहिक स्थिति',
      hasAadhaar: 'आधार है',
      hasBankAccount: 'बैंक खाता है',
      mobile: 'मोबाइल नंबर',
      email: 'ईमेल पता',
      yes: 'हाँ',
      no: 'नहीं',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      rural: 'ग्रामीण',
      urban: 'शहरी',
      general: 'सामान्य',
      obc: 'ओबीसी',
      sc: 'एससी',
      st: 'एसटी',
      farmer: 'किसान',
      student: 'छात्र',
      business: 'व्यवसाय',
      employed: 'नियोजित',
      unemployed: 'बेरोजगार',
      viewSchemes: 'पात्र योजनाएं देखें',
      updateProfile: 'प्रोफ़ाइल अपडेट करें',
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#059669] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold text-stone-900 uppercase tracking-widest">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getCompletenessColor = () => {
    if (completeness >= 80) return 'emerald';
    if (completeness >= 50) return 'yellow';
    return 'red';
  };

  const color = getCompletenessColor();

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Header */}
      <header className="bg-[#FAF9F6] border-b-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#059669] border-2 border-stone-900 flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] md:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
                <User size={24} strokeWidth={2.5} className="md:w-8 md:h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">{t.title}</h1>
                <p className="text-stone-600 mt-1 font-medium text-sm md:text-base">{t.subtitle}</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-[#059669] text-[#FAF9F6] border-2 border-transparent font-bold uppercase tracking-wider hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] md:shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(28,25,23,0.15)] md:hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] text-xs md:text-sm"
              >
                <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                {t.edit}
              </button>
            ) : (
              <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-[#059669] text-[#FAF9F6] border-2 border-transparent font-bold uppercase tracking-wider hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] md:shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(28,25,23,0.15)] md:hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] text-xs md:text-sm"
                >
                  <Save size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="hidden sm:inline">{t.save}</span>
                  <span className="sm:hidden">Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-[#FAF9F6] text-stone-900 border-2 border-stone-900 font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] md:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)] md:hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] text-xs md:text-sm"
                >
                  <X size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="hidden sm:inline">{t.cancel}</span>
                  <span className="sm:hidden">Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Profile Completeness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FAF9F6] border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] md:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] p-5 md:p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <div>
              <h3 className="text-base md:text-lg font-bold text-stone-900 uppercase tracking-widest">{t.completeness}</h3>
              <p className="text-xs md:text-sm text-stone-600 font-medium mt-1">{t.completeProfile}</p>
            </div>
            <div className="text-left sm:text-right">
              <div className={`text-2xl md:text-3xl font-serif font-bold ${completeness >= 80 ? 'text-[#059669]' : completeness >= 50 ? 'text-[#D97706]' : 'text-red-600'}`}>
                {completeness}%
              </div>
              <div className="text-xs text-stone-500 font-bold uppercase tracking-widest">Complete</div>
            </div>
          </div>
          <ProgressBar progress={completeness} />
          {completeness < 100 && (
            <Alert variant="warning" icon={<AlertCircle size={18} className="text-[#D97706] shrink-0 mt-0.5 md:w-5 md:h-5" />} className="mt-4">
              <span className="text-xs md:text-sm">Complete your profile to unlock more scheme recommendations and improve match accuracy.</span>
            </Alert>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] p-5 md:p-6"
          >
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <User size={18} className="text-[#059669] md:w-5 md:h-5" strokeWidth={2.5} />
              {t.personalInfo}
            </h3>
            <div className="space-y-4">
              <ProfileField
                label={t.age}
                value={profile.age}
                isEditing={isEditing}
                onChange={(v) => handleChange('age', v)}
                type="number"
              />
              <ProfileField
                label={t.gender}
                value={profile.gender}
                isEditing={isEditing}
                onChange={(v) => handleChange('gender', v)}
                type="select"
                options={['Male', 'Female', 'Other']}
              />
              <ProfileField
                label={t.occupation}
                value={profile.occupation}
                isEditing={isEditing}
                onChange={(v) => handleChange('occupation', v)}
                type="select"
                options={['Farmer', 'Agricultural Worker', 'Student', 'Unemployed', 'Self-Employed', 'Private Sector', 'Government Employee', 'Daily Wage Worker', 'Artisan', 'Fisherman', 'Other']}
              />
              <ProfileField
                label={t.education}
                value={profile.education}
                isEditing={isEditing}
                onChange={(v) => handleChange('education', v)}
              />
              <ProfileField
                label={t.maritalStatus}
                value={profile.maritalStatus}
                isEditing={isEditing}
                onChange={(v) => handleChange('maritalStatus', v)}
                type="select"
                options={['Single', 'Married', 'Widowed', 'Divorced']}
              />
            </div>
          </motion.div>

          {/* Location Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] p-5 md:p-6"
          >
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <MapPin size={18} className="text-[#059669] md:w-5 md:h-5" strokeWidth={2.5} />
              Location & Contact
            </h3>
            <div className="space-y-4">
              <ProfileField
                label={t.state}
                value={profile.state}
                isEditing={isEditing}
                onChange={(v) => handleChange('state', v)}
              />
              <ProfileField
                label={t.district}
                value={profile.district}
                isEditing={isEditing}
                onChange={(v) => handleChange('district', v)}
              />
              <ProfileField
                label={t.residence}
                value={profile.residence}
                isEditing={isEditing}
                onChange={(v) => handleChange('residence', v)}
                type="select"
                options={['Rural', 'Urban']}
              />
              <ProfileField
                label={t.mobile}
                value={profile.mobile}
                isEditing={isEditing}
                onChange={(v) => handleChange('mobile', v)}
                type="tel"
              />
              <ProfileField
                label={t.email}
                value={profile.email}
                isEditing={isEditing}
                onChange={(v) => handleChange('email', v)}
                type="email"
              />
            </div>
          </motion.div>

          {/* Economic Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] p-5 md:p-6"
          >
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <DollarSign size={18} className="text-[#059669] md:w-5 md:h-5" strokeWidth={2.5} />
              {t.economicInfo}
            </h3>
            <div className="space-y-4">
              <ProfileField
                label={t.annualIncome}
                value={profile.annualIncome}
                isEditing={isEditing}
                onChange={(v) => handleChange('annualIncome', v)}
                type="number"
                prefix="₹"
              />
              <ProfileField
                label={t.socialCategory}
                value={profile.socialCategory}
                isEditing={isEditing}
                onChange={(v) => handleChange('socialCategory', v)}
                type="select"
                options={['General', 'OBC', 'SC', 'ST', 'EWS']}
              />
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FAF9F6] border-2 border-stone-300 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)] p-5 md:p-6"
          >
            <h3 className="text-base md:text-lg font-bold text-stone-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <FileText size={18} className="text-[#059669] md:w-5 md:h-5" strokeWidth={2.5} />
              {t.documents}
            </h3>
            <div className="space-y-4">
              <ProfileField
                label={t.hasAadhaar}
                value={profile.hasAadhaar ? 'Yes' : 'No'}
                isEditing={isEditing}
                onChange={(v) => handleChange('hasAadhaar', v === 'Yes')}
                type="select"
                options={['Yes', 'No']}
              />
              <ProfileField
                label={t.hasBankAccount}
                value={profile.hasBankAccount ? 'Yes' : 'No'}
                isEditing={isEditing}
                onChange={(v) => handleChange('hasBankAccount', v === 'Yes')}
                type="select"
                options={['Yes', 'No']}
              />
              {profile.documents && profile.documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-bold text-stone-700 mb-2 uppercase tracking-wider">Available Documents:</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.documents.map((doc: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-[#059669]/10 text-[#059669] border border-[#059669] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle size={14} strokeWidth={2.5} />
                        {doc.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 md:mt-8 text-center"
        >
          <button
            onClick={() => navigate('/enhanced-results')}
            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#059669] text-[#FAF9F6] border-2 border-transparent font-bold text-base md:text-lg uppercase tracking-wider hover:bg-[#047857] shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] md:shadow-[6px_6px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] md:hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] transition-all"
          >
            {t.viewSchemes}
          </button>
        </motion.div>
      </main>
    </div>
  );
}

// Profile Field Component
function ProfileField({ label, value, isEditing, onChange, type = 'text', options, prefix }: {
  label: string;
  value: any;
  isEditing: boolean;
  onChange: (value: any) => void;
  type?: string;
  options?: string[];
  prefix?: string;
}) {
  if (!isEditing) {
    return (
      <div>
        <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">{label}</label>
        <p className="text-base font-bold text-stone-900 mt-1">
          {prefix && value ? prefix : ''}{value || '-'}
        </p>
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div>
        <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">{label}</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full px-4 py-2 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
        >
          <option value="">Select...</option>
          {options?.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">{label}</label>
      <div className="relative mt-1">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-bold">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          className={`w-full px-4 py-2 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors ${prefix ? 'pl-8' : ''}`}
        />
      </div>
    </div>
  );
}
