import { useNavigate } from 'react-router-dom';
import { DEMO_PROFILES, type DemoProfile } from '../data/demoProfiles';
import { getLanguage } from '../services/storage';

export function DemoProfileButtons() {
  const navigate = useNavigate();
  const language = getLanguage();

  const handleDemoClick = (profile: DemoProfile) => {
    // Save profile to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile.profile));
    localStorage.setItem('userId', `demo-${profile.id}-${Date.now()}`);
    localStorage.setItem('demoMode', 'true');
    
    // Navigate to results
    navigate('/enhanced-results');
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {language === 'hi' ? '⚡ त्वरित डेमो' : '⚡ Quick Demo'}
        </h3>
        <p className="text-sm text-gray-600">
          {language === 'hi' 
            ? 'एक प्रोफ़ाइल चुनें और तुरंत परिणाम देखें'
            : 'Choose a profile and see results instantly'
          }
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {DEMO_PROFILES.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleDemoClick(profile)}
            className="group relative bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{profile.emoji}</div>
              <div className="text-sm font-bold text-gray-900 mb-1">
                {profile.name}
              </div>
              <div className="text-xs text-gray-600 line-clamp-2">
                {profile.description[language as keyof typeof profile.description]}
              </div>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-emerald-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {language === 'hi'
            ? '💡 ये डेमो प्रोफाइल हैं। आप अपनी वास्तविक जानकारी भी दर्ज कर सकते हैं।'
            : '💡 These are demo profiles. You can also enter your real information.'
          }
        </p>
      </div>
    </div>
  );
}
