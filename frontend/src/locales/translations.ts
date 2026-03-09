export type TranslationKey = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'as';

export interface Translations {
  nav: {
    english: string;
    hindi: string;
  };
  hero: {
    tag: string;
    title1: string;
    title2: string;
    desc: string;
    btnVoice: string;
    btnForm: string;
    stat1: string;
    stat2: string;
    stat3: string;
  };
  demo: {
    title: string;
    subtitle: string;
    note: string;
    p1Name: string;
    p1Desc: string;
    p2Name: string;
    p2Desc: string;
    p3Name: string;
    p3Desc: string;
    p4Name: string;
    p4Desc: string;
    p5Name: string;
    p5Desc: string;
    p6Name: string;
    p6Desc: string;
  };
  how: {
    title: string;
    s1Title: string;
    s1Desc: string;
    s2Title: string;
    s2Desc: string;
    s3Title: string;
    s3Desc: string;
  };
  why: {
    title: string;
    w1Title: string;
    w1Desc: string;
    w2Title: string;
    w2Desc: string;
    w3Title: string;
    w3Desc: string;
    w4Title: string;
    w4Desc: string;
  };
  cta: {
    title: string;
    desc: string;
    btn: string;
  };
  form: {
    title: string;
    cancel: string;
    progress: string;
    q1Title: string;
    q1Sub: string;
    q1Placeholder: string;
    q2Title: string;
    q2Sub: string;
    q2Placeholder: string;
    next: string;
    submit: string;
    tip: string;
  };
  results: {
    title: string;
    subtitle: string;
    back: string;
    stat1Title: string;
    stat1Desc: string;
    stat2Title: string;
    stat2Desc: string;
    stat3Title: string;
    stat3Desc: string;
    tab1: string;
    tab2: string;
    tab3: string;
    schemeTitle: string;
    tagEligible: string;
    tagConf: string;
    btnExp: string;
    whyTitle: string;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    btnApply: string;
    actionTitle: string;
    btnUpdate: string;
    btnAsk: string;
    helpTitle: string;
    helpDesc: string;
    btnChat: string;
    detailsReq: string;
    detailsLink: string;
    eligible: string;
  };
  landing: {
    title: string;
    subtitle: string;
    cta: string;
    features: string[];
    howItWorks: string;
    steps: Array<{ title: string; desc: string }>;
  };
  profile: {
    title: string;
    subtitle: string;
    fields: {
      age: string;
      state: string;
      occupation: string;
      income: string;
      gender: string;
      category: string;
      disability: string;
    };
    submit: string;
  };
  chat: {
    title: string;
    placeholder: string;
    send: string;
  };
  common: {
    loading: string;
    error: string;
    back: string;
    next: string;
    yes: string;
    no: string;
  };
}

export const translations: Record<TranslationKey, Translations> = {
  en: {
    nav: { english: "English", hindi: "हिंदी" },
    hero: {
      tag: "AI-Powered Platform",
      title1: "Discover Government",
      title2: "Schemes You Qualify For",
      desc: "Helping Indian citizens find and apply for welfare schemes in minutes. No bureaucracy, just results.",
      btnVoice: "Start with Voice",
      btnForm: "Fill Form",
      stat1: "Schemes",
      stat2: "Accuracy",
      stat3: "Avg Time"
    },
    demo: {
      title: "Quick Demo",
      subtitle: "Choose a profile and see results instantly.",
      note: "Demo profiles. Enter real information.",
      p1Name: "Ramesh Kumar",
      p1Desc: "Small farmer from Maharashtra with...",
      p2Name: "Priya Sharma",
      p2Desc: "SC category student pursuing...",
      p3Name: "Lakshmi Devi",
      p3Desc: "Senior citizen widow from Tamil...",
      p4Name: "Arjun Patel",
      p4Desc: "Young entrepreneur...",
      p5Name: "Savitri Bai",
      p5Desc: "Woman farmer from Uttar...",
      p6Name: "Rajesh Singh",
      p6Desc: "Person with 40% disability from..."
    },
    how: {
      title: "How It Works",
      s1Title: "Share Information",
      s1Desc: "Tell us about yourself securely through voice or a simple form interface.",
      s2Title: "Get Matched",
      s2Desc: "Our AI analyzes 500+ government schemes instantly to find your best matches.",
      s3Title: "Apply Guidance",
      s3Desc: "Step-by-step authoritative assistance to complete your official application."
    },
    why: {
      title: "Why Choose NEXIS",
      w1Title: "Voice-First Design",
      w1Desc: "Speak naturally in Hindi or English. Zero typing required to discover your eligibility.",
      w2Title: "Smart Matching",
      w2Desc: "Advanced logic finds the specific schemes you actually qualify for, cutting through the noise.",
      w3Title: "Application Support",
      w3Desc: "Real-time guidance prevents common mistakes and helps you gather the right documents.",
      w4Title: "Always Updated",
      w4Desc: "Latest schemes and eligibility rules synced directly from official government sources."
    },
    cta: {
      title: "Get Started Today",
      desc: "It takes just 2 minutes to find the right government schemes for you.",
      btn: "Start Now"
    },
    form: {
      title: "Your Information",
      cancel: "Cancel",
      progress: "Progress",
      q1Title: "What is your age?",
      q1Sub: "Enter your age in years",
      q1Placeholder: "Enter answer",
      q2Title: "What is your annual family income?",
      q2Sub: "Enter approximate amount in INR",
      q2Placeholder: "e.g. 50000",
      next: "Next step",
      submit: "Find Schemes",
      tip: "We only ask relevant questions. Based on your answers, you'll complete this in ~2 mins."
    },
    results: {
      title: "Your Eligibility Results",
      subtitle: "Schemes available based on your profile",
      back: "Back to Home",
      stat1Title: "Eligible Schemes",
      stat1Desc: "You can apply now",
      stat2Title: "Potentially Eligible",
      stat2Desc: "Complete your profile",
      stat3Title: "Future Opportunities",
      stat3Desc: "Coming soon for you",
      tab1: "Eligible Now (1)",
      tab2: "Potentially Eligible (394)",
      tab3: "All Schemes (500)",
      schemeTitle: "National Social Assistance Programme – Disability Pension",
      tagEligible: "Eligible",
      tagConf: "High Confidence",
      btnExp: "Get AI Explanation",
      whyTitle: "Why You Qualify",
      q1: "Age is within required range",
      q2: "Annual income ₹60,000 is within limit (₹1,000,000)",
      q3: "Aadhaar document verified",
      q4: "Disability certificate document verified",
      q5: "Income certificate document verified",
      btnApply: "View Details & Apply",
      actionTitle: "Quick Actions",
      btnUpdate: "Update Profile",
      btnAsk: "Ask AI Assistant",
      helpTitle: "Need Help?",
      helpDesc: "Our AI assistant can answer your questions about schemes and help you through the application process step-by-step.",
      btnChat: "Chat with AI",
      detailsReq: "Required Documents Checklist",
      detailsLink: "Proceed to Official Portal"
    },
    landing: {
      title: "Don't miss out on government benefits",
      subtitle: "Answer a few simple questions and discover schemes worth thousands of rupees",
      cta: "Check My Eligibility",
      features: ["Takes 2 minutes", "247,832 people helped", "Completely free"],
      howItWorks: "How NEXIS Works",
      steps: [
        { title: "Tell us about yourself", desc: "Basic information like age, state, and occupation" },
        { title: "AI finds matches", desc: "Our system checks all available schemes" },
        { title: "Apply with guidance", desc: "Get step-by-step help to apply" }
      ]
    },
    profile: {
      title: "Your Profile",
      subtitle: "Tell us about yourself to find matching schemes",
      fields: {
        age: "Age",
        state: "State",
        occupation: "Occupation",
        income: "Annual Income (₹)",
        gender: "Gender",
        category: "Social Category",
        disability: "Do you have a disability?"
      },
      submit: "Check Eligibility"
    },
    chat: {
      title: "Ask Questions",
      placeholder: "Ask about schemes, eligibility, or application process...",
      send: "Send"
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      back: "Back",
      next: "Next",
      yes: "Yes",
      no: "No"
    }
  },
  hi: {
    nav: { english: "English", hindi: "हिंदी" },
    hero: {
      tag: "AI-संचालित प्लेटफॉर्म",
      title1: "सरकारी योजनाएं खोजें",
      title2: "जिनके आप योग्य हैं",
      desc: "भारतीय नागरिकों को मिनटों में कल्याणकारी योजनाओं को खोजने और आवेदन करने में मदद करना। कोई नौकरशाही नहीं, केवल परिणाम।",
      btnVoice: "बोलकर शुरू करें",
      btnForm: "फॉर्म भरें",
      stat1: "योजनाएं",
      stat2: "सटीकता",
      stat3: "औसत समय"
    },
    demo: {
      title: "त्वरित डेमो",
      subtitle: "एक प्रोफ़ाइल चुनें और तुरंत परिणाम देखें।",
      note: "डेमो प्रोफ़ाइल। वास्तविक जानकारी दर्ज करें।",
      p1Name: "रमेश कुमार",
      p1Desc: "महाराष्ट्र के छोटे किसान...",
      p2Name: "प्रिया शर्मा",
      p2Desc: "एससी वर्ग की छात्रा...",
      p3Name: "लक्ष्मी देवी",
      p3Desc: "तमिलनाडु से वरिष्ठ नागरिक विधवा...",
      p4Name: "अर्जुन पटेल",
      p4Desc: "युवा उद्यमी...",
      p5Name: "सावित्री बाई",
      p5Desc: "उत्तर प्रदेश की महिला किसान...",
      p6Name: "राजेश सिंह",
      p6Desc: "40% विकलांगता वाले व्यक्ति..."
    },
    how: {
      title: "यह कैसे काम करता है",
      s1Title: "जानकारी साझा करें",
      s1Desc: "आवाज़ या एक सरल फ़ॉर्म इंटरफ़ेस के माध्यम से सुरक्षित रूप से अपने बारे में बताएं।",
      s2Title: "मिलान प्राप्त करें",
      s2Desc: "हमारा AI आपके सर्वोत्तम मिलान खोजने के लिए 500+ सरकारी योजनाओं का तुरंत विश्लेषण करता है।",
      s3Title: "आवेदन मार्गदर्शन",
      s3Desc: "अपना आधिकारिक आवेदन पूरा करने के लिए चरण-दर-चरण सहायता प्राप्त करें।"
    },
    why: {
      title: "NEXIS क्यों चुनें",
      w1Title: "वॉयस-फर्स्ट डिज़ाइन",
      w1Desc: "हिंदी या अंग्रेजी में स्वाभाविक रूप से बोलें। अपनी पात्रता खोजने के लिए टाइपिंग की आवश्यकता नहीं है।",
      w2Title: "स्मार्ट मिलान",
      w2Desc: "उन्नत तर्क उन विशिष्ट योजनाओं को खोजता है जिनके आप वास्तव में योग्य हैं।",
      w3Title: "आवेदन सहायता",
      w3Desc: "वास्तविक समय का मार्गदर्शन सामान्य गलतियों को रोकता है और सही दस्तावेज़ एकत्र करने में मदद करता है।",
      w4Title: "हमेशा अपडेटेड",
      w4Desc: "आधिकारिक सरकारी स्रोतों से सीधे सिंक की गई नवीनतम योजनाएं और पात्रता नियम।"
    },
    cta: {
      title: "आज ही शुरू करें",
      desc: "आपके लिए सही सरकारी योजनाएं खोजने में केवल 2 मिनट लगते हैं।",
      btn: "अभी शुरू करें"
    },
    form: {
      title: "आपकी जानकारी",
      cancel: "रद्द करें",
      progress: "प्रगति",
      q1Title: "आपकी आयु क्या है?",
      q1Sub: "अपनी आयु वर्षों में दर्ज करें",
      q1Placeholder: "उत्तर दर्ज करें",
      q2Title: "आपकी पारिवारिक वार्षिक आय क्या है?",
      q2Sub: "रुपये में अनुमानित राशि दर्ज करें",
      q2Placeholder: "उदा. 50000",
      next: "अगला कदम",
      submit: "योजनाएं खोजें",
      tip: "हम केवल प्रासंगिक प्रश्न पूछते हैं। आपके उत्तरों के आधार पर, आप इसे ~2 मिनट में पूरा करेंगे।"
    },
    results: {
      title: "आपके पात्रता परिणाम",
      subtitle: "आपकी प्रोफ़ाइल के आधार पर उपलब्ध योजनाएं",
      back: "होम पर वापस जाएं",
      stat1Title: "पात्र योजनाएं",
      stat1Desc: "आप अभी आवेदन कर सकते हैं",
      stat2Title: "संभावित रूप से पात्र",
      stat2Desc: "अपनी प्रोफ़ाइल पूरी करें",
      stat3Title: "भविष्य के अवसर",
      stat3Desc: "आपके लिए जल्द ही आ रहा है",
      tab1: "अभी पात्र (1)",
      tab2: "संभावित पात्र (394)",
      tab3: "सभी योजनाएं (500)",
      schemeTitle: "राष्ट्रीय सामाजिक सहायता कार्यक्रम - विकलांगता पेंशन",
      tagEligible: "पात्र",
      tagConf: "उच्च विश्वास",
      btnExp: "AI स्पष्टीकरण प्राप्त करें",
      whyTitle: "आप क्यों योग्य हैं",
      q1: "आयु आवश्यक सीमा के भीतर है",
      q2: "वार्षिक आय ₹60,000 सीमा (₹10,00,000) के भीतर है",
      q3: "आधार दस्तावेज़ सत्यापित",
      q4: "विकलांगता प्रमाण पत्र सत्यापित",
      q5: "आय प्रमाण पत्र सत्यापित",
      btnApply: "विवरण देखें और आवेदन करें",
      actionTitle: "त्वरित कार्रवाइयां",
      btnUpdate: "प्रोफ़ाइल अपडेट करें",
      btnAsk: "AI सहायक से पूछें",
      helpTitle: "मदद चाहिए?",
      helpDesc: "हमारा AI सहायक योजनाओं के बारे में आपके सवालों के जवाब दे सकता है और आवेदन प्रक्रिया में आपकी मदद कर सकता है।",
      btnChat: "AI के साथ चैट करें",
      detailsReq: "आवश्यक दस्तावेज़ चेकलिस्ट",
      detailsLink: "आधिकारिक पोर्टल पर जाएं"
    },
    landing: {
      title: "सरकारी योजनाओं का लाभ न चूकें",
      subtitle: "कुछ सरल सवालों के जवाब दें और हजारों रुपये की योजनाओं की जानकारी पाएं",
      cta: "अपनी पात्रता जांचें",
      features: ["केवल 2 मिनट", "2,47,832 लोगों की मदद की", "पूरी तरह मुफ्त"],
      howItWorks: "NEXIS कैसे काम करता है",
      steps: [
        { title: "अपने बारे में बताएं", desc: "उम्र, राज्य और पेशे जैसी बुनियादी जानकारी" },
        { title: "AI मिलान ढूंढता है", desc: "हमारा सिस्टम सभी उपलब्ध योजनाओं की जांच करता है" },
        { title: "मार्गदर्शन के साथ आवेदन करें", desc: "आवेदन करने के लिए चरण-दर-चरण सहायता प्राप्त करें" }
      ]
    },
    profile: {
      title: "आपकी प्रोफ़ाइल",
      subtitle: "मिलान योजनाओं को खोजने के लिए अपने बारे में बताएं",
      fields: {
        age: "उम्र",
        state: "राज्य",
        occupation: "पेशा",
        income: "वार्षिक आय (₹)",
        gender: "लिंग",
        category: "सामाजिक श्रेणी",
        disability: "क्या आपको कोई विकलांगता है?"
      },
      submit: "पात्रता जांचें"
    },
    chat: {
      title: "प्रश्न पूछें",
      placeholder: "योजनाओं, पात्रता या आवेदन प्रक्रिया के बारे में पूछें...",
      send: "भेजें"
    },
    common: {
      loading: "लोड हो रहा है...",
      error: "कुछ गलत हो गया",
      back: "वापस",
      next: "अगला",
      yes: "हाँ",
      no: "नहीं"
    }
  },
  bn: {
    landing: {
      title: "সরকারি সুবিধা মিস করবেন না",
      subtitle: "কয়েকটি সহজ প্রশ্নের উত্তর দিন এবং হাজার হাজার টাকার প্রকল্প আবিষ্কার করুন",
      cta: "আমার যোগ্যতা পরীক্ষা করুন",
      features: ["মাত্র ২ মিনিট", "২,৪৭,৮৩২ জনকে সাহায্য করা হয়েছে", "সম্পূর্ণ বিনামূল্যে"],
      howItWorks: "NEXIS কীভাবে কাজ করে",
      steps: [
        { title: "আপনার সম্পর্কে বলুন", desc: "বয়স, রাজ্য এবং পেশার মতো মৌলিক তথ্য" },
        { title: "AI মিল খুঁজে পায়", desc: "আমাদের সিস্টেম সমস্ত উপলব্ধ প্রকল্প পরীক্ষা করে" },
        { title: "নির্দেশনা সহ আবেদন করুন", desc: "আবেদন করার জন্য ধাপে ধাপে সাহায্য পান" }
      ]
    },
    profile: {
      title: "আপনার প্রোফাইল",
      subtitle: "মিলে যাওয়া প্রকল্প খুঁজতে আপনার সম্পর্কে বলুন",
      fields: {
        age: "বয়স",
        state: "রাজ্য",
        occupation: "পেশা",
        income: "বার্ষিক আয় (₹)",
        gender: "লিঙ্গ",
        category: "সামাজিক শ্রেণী",
        disability: "আপনার কি কোনো প্রতিবন্ধকতা আছে?"
      },
      submit: "যোগ্যতা পরীক্ষা করুন"
    },
    results: {
      title: "আপনার যোগ্য প্রকল্প",
      eligible: "যোগ্য",
      ineligible: "অযোগ্য",
      viewDetails: "বিস্তারিত দেখুন",
      applyNow: "এখনই আবেদন করুন"
    },
    chat: {
      title: "প্রশ্ন জিজ্ঞাসা করুন",
      placeholder: "প্রকল্প, যোগ্যতা বা আবেদন প্রক্রিয়া সম্পর্কে জিজ্ঞাসা করুন...",
      send: "পাঠান"
    },
    common: {
      loading: "লোড হচ্ছে...",
      error: "কিছু ভুল হয়েছে",
      back: "পিছনে",
      next: "পরবর্তী",
      yes: "হ্যাঁ",
      no: "না"
    }
  },
  te: {
    landing: {
      title: "ప్రభుత్వ ప్రయోజనాలను కోల్పోకండి",
      subtitle: "కొన్ని సాధారణ ప్రశ్నలకు సమాధానం ఇవ్వండి మరియు వేల రూపాయల పథకాలను కనుగొనండి",
      cta: "నా అర్హతను తనిఖీ చేయండి",
      features: ["కేవలం 2 నిమిషాలు", "2,47,832 మందికి సహాయం చేసింది", "పూర్తిగా ఉచితం"],
      howItWorks: "NEXIS ఎలా పనిచేస్తుంది",
      steps: [
        { title: "మీ గురించి చెప్పండి", desc: "వయస్సు, రాష్ట్రం మరియు వృత్తి వంటి ప్రాథమిక సమాచారం" },
        { title: "AI సరిపోలికలను కనుగొంటుంది", desc: "మా సిస్టమ్ అందుబాటులో ఉన్న అన్ని పథకాలను తనిఖీ చేస్తుంది" },
        { title: "మార్గదర్శకత్వంతో దరఖాస్తు చేసుకోండి", desc: "దరఖాస్తు చేసుకోవడానికి దశల వారీ సహాయం పొందండి" }
      ]
    },
    profile: {
      title: "మీ ప్రొఫైల్",
      subtitle: "సరిపోలే పథకాలను కనుగొనడానికి మీ గురించి చెప్పండి",
      fields: {
        age: "వయస్సు",
        state: "రాష్ట్రం",
        occupation: "వృత్తి",
        income: "వార్షిక ఆదాయం (₹)",
        gender: "లింగం",
        category: "సామాజిక వర్గం",
        disability: "మీకు వైకల్యం ఉందా?"
      },
      submit: "అర్హతను తనిఖీ చేయండి"
    },
    results: {
      title: "మీ అర్హత పథకాలు",
      eligible: "అర్హత",
      ineligible: "అనర్హత",
      viewDetails: "వివరాలు చూడండి",
      applyNow: "ఇప్పుడే దరఖాస్తు చేసుకోండి"
    },
    chat: {
      title: "ప్రశ్నలు అడగండి",
      placeholder: "పథకాలు, అర్హత లేదా దరఖాస్తు ప్రక్రియ గురించి అడగండి...",
      send: "పంపండి"
    },
    common: {
      loading: "లోడ్ అవుతోంది...",
      error: "ఏదో తప్పు జరిగింది",
      back: "వెనుకకు",
      next: "తదుపరి",
      yes: "అవును",
      no: "కాదు"
    }
  },
  mr: {
    landing: {
      title: "सरकारी लाभ गमावू नका",
      subtitle: "काही साध्या प्रश्नांची उत्तरे द्या आणि हजारो रुपयांच्या योजना शोधा",
      cta: "माझी पात्रता तपासा",
      features: ["फक्त 2 मिनिटे", "2,47,832 लोकांना मदत केली", "पूर्णपणे मोफत"],
      howItWorks: "NEXIS कसे कार्य करते",
      steps: [
        { title: "आपल्याबद्दल सांगा", desc: "वय, राज्य आणि व्यवसाय यासारखी मूलभूत माहिती" },
        { title: "AI जुळणी शोधते", desc: "आमची प्रणाली सर्व उपलब्ध योजना तपासते" },
        { title: "मार्गदर्शनासह अर्ज करा", desc: "अर्ज करण्यासाठी चरण-दर-चरण मदत मिळवा" }
      ]
    },
    profile: {
      title: "तुमचे प्रोफाइल",
      subtitle: "जुळणाऱ्या योजना शोधण्यासाठी आपल्याबद्दल सांगा",
      fields: {
        age: "वय",
        state: "राज्य",
        occupation: "व्यवसाय",
        income: "वार्षिक उत्पन्न (₹)",
        gender: "लिंग",
        category: "सामाजिक श्रेणी",
        disability: "तुम्हाला अपंगत्व आहे का?"
      },
      submit: "पात्रता तपासा"
    },
    results: {
      title: "तुमच्या पात्र योजना",
      eligible: "पात्र",
      ineligible: "अपात्र",
      viewDetails: "तपशील पहा",
      applyNow: "आता अर्ज करा"
    },
    chat: {
      title: "प्रश्न विचारा",
      placeholder: "योजना, पात्रता किंवा अर्ज प्रक्रियेबद्दल विचारा...",
      send: "पाठवा"
    },
    common: {
      loading: "लोड होत आहे...",
      error: "काहीतरी चूक झाली",
      back: "मागे",
      next: "पुढे",
      yes: "होय",
      no: "नाही"
    }
  },
  ta: {
    landing: {
      title: "அரசு நலன்களை தவறவிடாதீர்கள்",
      subtitle: "சில எளிய கேள்விகளுக்கு பதிலளித்து ஆயிரக்கணக்கான ரூபாய் திட்டங்களைக் கண்டறியுங்கள்",
      cta: "எனது தகுதியை சரிபார்க்கவும்",
      features: ["2 நிமிடங்கள் மட்டுமே", "2,47,832 பேருக்கு உதவியது", "முற்றிலும் இலவசம்"],
      howItWorks: "NEXIS எவ்வாறு செயல்படுகிறது",
      steps: [
        { title: "உங்களைப் பற்றி சொல்லுங்கள்", desc: "வயது, மாநிலம் மற்றும் தொழில் போன்ற அடிப்படை தகவல்" },
        { title: "AI பொருத்தங்களைக் கண்டறியும்", desc: "எங்கள் அமைப்பு கிடைக்கக்கூடிய அனைத்து திட்டங்களையும் சரிபார்க்கிறது" },
        { title: "வழிகாட்டுதலுடன் விண்ணப்பிக்கவும்", desc: "விண்ணப்பிக்க படிப்படியான உதவியைப் பெறுங்கள்" }
      ]
    },
    profile: {
      title: "உங்கள் சுயவிவரம்",
      subtitle: "பொருந்தும் திட்டங்களைக் கண்டறிய உங்களைப் பற்றி சொல்லுங்கள்",
      fields: {
        age: "வயது",
        state: "மாநிலம்",
        occupation: "தொழில்",
        income: "ஆண்டு வருமானம் (₹)",
        gender: "பாலினம்",
        category: "சமூக வகை",
        disability: "உங்களுக்கு ஊனம் உள்ளதா?"
      },
      submit: "தகுதியை சரிபார்க்கவும்"
    },
    results: {
      title: "உங்கள் தகுதியான திட்டங்கள்",
      eligible: "தகுதியானது",
      ineligible: "தகுதியற்றது",
      viewDetails: "விவரங்களைக் காண்க",
      applyNow: "இப்போது விண்ணப்பிக்கவும்"
    },
    chat: {
      title: "கேள்விகள் கேளுங்கள்",
      placeholder: "திட்டங்கள், தகுதி அல்லது விண்ணப்ப செயல்முறை பற்றி கேளுங்கள்...",
      send: "அனுப்பு"
    },
    common: {
      loading: "ஏற்றுகிறது...",
      error: "ஏதோ தவறு நடந்தது",
      back: "பின்",
      next: "அடுத்து",
      yes: "ஆம்",
      no: "இல்லை"
    }
  },
  gu: {
    landing: {
      title: "સરકારી લાભો ગુમાવશો નહીં",
      subtitle: "કેટલાક સરળ પ્રશ્નોના જવાબ આપો અને હજારો રૂપિયાની યોજનાઓ શોધો",
      cta: "મારી પાત્રતા તપાસો",
      features: ["માત્ર 2 મિનિટ", "2,47,832 લોકોને મદદ કરી", "સંપૂર્ણપણે મફત"],
      howItWorks: "NEXIS કેવી રીતે કામ કરે છે",
      steps: [
        { title: "તમારા વિશે જણાવો", desc: "ઉંમર, રાજ્ય અને વ્યવસાય જેવી મૂળભૂત માહિતી" },
        { title: "AI મેળ શોધે છે", desc: "અમારી સિસ્ટમ બધી ઉપલબ્ધ યોજનાઓ તપાસે છે" },
        { title: "માર્ગદર્શન સાથે અરજી કરો", desc: "અરજી કરવા માટે પગલું-દર-પગલું મદદ મેળવો" }
      ]
    },
    profile: {
      title: "તમારી પ્રોફાઇલ",
      subtitle: "મેળ ખાતી યોજનાઓ શોધવા માટે તમારા વિશે જણાવો",
      fields: {
        age: "ઉંમર",
        state: "રાજ્ય",
        occupation: "વ્યવસાય",
        income: "વાર્ષિક આવક (₹)",
        gender: "લિંગ",
        category: "સામાજિક વર્ગ",
        disability: "શું તમને વિકલાંગતા છે?"
      },
      submit: "પાત્રતા તપાસો"
    },
    results: {
      title: "તમારી પાત્ર યોજનાઓ",
      eligible: "પાત્ર",
      ineligible: "અપાત્ર",
      viewDetails: "વિગતો જુઓ",
      applyNow: "હમણાં અરજી કરો"
    },
    chat: {
      title: "પ્રશ્નો પૂછો",
      placeholder: "યોજનાઓ, પાત્રતા અથવા અરજી પ્રક્રિયા વિશે પૂછો...",
      send: "મોકલો"
    },
    common: {
      loading: "લોડ થઈ રહ્યું છે...",
      error: "કંઈક ખોટું થયું",
      back: "પાછળ",
      next: "આગળ",
      yes: "હા",
      no: "ના"
    }
  },
  kn: {
    landing: {
      title: "ಸರ್ಕಾರಿ ಪ್ರಯೋಜನಗಳನ್ನು ಕಳೆದುಕೊಳ್ಳಬೇಡಿ",
      subtitle: "ಕೆಲವು ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ ಮತ್ತು ಸಾವಿರಾರು ರೂಪಾಯಿಗಳ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ",
      cta: "ನನ್ನ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ",
      features: ["ಕೇವಲ 2 ನಿಮಿಷಗಳು", "2,47,832 ಜನರಿಗೆ ಸಹಾಯ ಮಾಡಲಾಗಿದೆ", "ಸಂಪೂರ್ಣವಾಗಿ ಉಚಿತ"],
      howItWorks: "NEXIS ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
      steps: [
        { title: "ನಿಮ್ಮ ಬಗ್ಗೆ ತಿಳಿಸಿ", desc: "ವಯಸ್ಸು, ರಾಜ್ಯ ಮತ್ತು ಉದ್ಯೋಗದಂತಹ ಮೂಲ ಮಾಹಿತಿ" },
        { title: "AI ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯುತ್ತದೆ", desc: "ನಮ್ಮ ವ್ಯವಸ್ಥೆಯು ಲಭ್ಯವಿರುವ ಎಲ್ಲಾ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ" },
        { title: "ಮಾರ್ಗದರ್ಶನದೊಂದಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ", desc: "ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಹಂತ-ಹಂತದ ಸಹಾಯವನ್ನು ಪಡೆಯಿರಿ" }
      ]
    },
    profile: {
      title: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್",
      subtitle: "ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯಲು ನಿಮ್ಮ ಬಗ್ಗೆ ತಿಳಿಸಿ",
      fields: {
        age: "ವಯಸ್ಸು",
        state: "ರಾಜ್ಯ",
        occupation: "ಉದ್ಯೋಗ",
        income: "ವಾರ್ಷಿಕ ಆದಾಯ (₹)",
        gender: "ಲಿಂಗ",
        category: "ಸಾಮಾಜಿಕ ವರ್ಗ",
        disability: "ನಿಮಗೆ ಅಂಗವೈಕಲ್ಯವಿದೆಯೇ?"
      },
      submit: "ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ"
    },
    results: {
      title: "ನಿಮ್ಮ ಅರ್ಹ ಯೋಜನೆಗಳು",
      eligible: "ಅರ್ಹ",
      ineligible: "ಅನರ್ಹ",
      viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      applyNow: "ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ"
    },
    chat: {
      title: "ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ",
      placeholder: "ಯೋಜನೆಗಳು, ಅರ್ಹತೆ ಅಥವಾ ಅರ್ಜಿ ಪ್ರಕ್ರಿಯೆಯ ಬಗ್ಗೆ ಕೇಳಿ...",
      send: "ಕಳುಹಿಸಿ"
    },
    common: {
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      error: "ಏನೋ ತಪ್ಪಾಗಿದೆ",
      back: "ಹಿಂದೆ",
      next: "ಮುಂದೆ",
      yes: "ಹೌದು",
      no: "ಇಲ್ಲ"
    }
  },
  ml: {
    landing: {
      title: "സർക്കാർ ആനുകൂല്യങ്ങൾ നഷ്ടപ്പെടുത്തരുത്",
      subtitle: "ചില ലളിതമായ ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുകയും ആയിരക്കണക്കിന് രൂപയുടെ പദ്ധതികൾ കണ്ടെത്തുകയും ചെയ്യുക",
      cta: "എന്റെ യോഗ്യത പരിശോധിക്കുക",
      features: ["വെറും 2 മിനിറ്റ്", "2,47,832 ആളുകളെ സഹായിച്ചു", "പൂർണ്ണമായും സൗജന്യം"],
      howItWorks: "NEXIS എങ്ങനെ പ്രവർത്തിക്കുന്നു",
      steps: [
        { title: "നിങ്ങളെക്കുറിച്ച് പറയുക", desc: "പ്രായം, സംസ്ഥാനം, തൊഴിൽ എന്നിവ പോലുള്ള അടിസ്ഥാന വിവരങ്ങൾ" },
        { title: "AI പൊരുത്തങ്ങൾ കണ്ടെത്തുന്നു", desc: "ഞങ്ങളുടെ സിസ്റ്റം ലഭ്യമായ എല്ലാ പദ്ധതികളും പരിശോധിക്കുന്നു" },
        { title: "മാർഗ്ഗനിർദ്ദേശത്തോടെ അപേക്ഷിക്കുക", desc: "അപേക്ഷിക്കാൻ ഘട്ടം ഘട്ടമായുള്ള സഹായം നേടുക" }
      ]
    },
    profile: {
      title: "നിങ്ങളുടെ പ്രൊഫൈൽ",
      subtitle: "പൊരുത്തപ്പെടുന്ന പദ്ധതികൾ കണ്ടെത്താൻ നിങ്ങളെക്കുറിച്ച് പറയുക",
      fields: {
        age: "പ്രായം",
        state: "സംസ്ഥാനം",
        occupation: "തൊഴിൽ",
        income: "വാർഷിക വരുമാനം (₹)",
        gender: "ലിംഗം",
        category: "സാമൂഹിക വിഭാഗം",
        disability: "നിങ്ങൾക്ക് വൈകല്യമുണ്ടോ?"
      },
      submit: "യോഗ്യത പരിശോധിക്കുക"
    },
    results: {
      title: "നിങ്ങളുടെ യോഗ്യമായ പദ്ധതികൾ",
      eligible: "യോഗ്യമായ",
      ineligible: "അയോഗ്യമായ",
      viewDetails: "വിശദാംശങ്ങൾ കാണുക",
      applyNow: "ഇപ്പോൾ അപേക്ഷിക്കുക"
    },
    chat: {
      title: "ചോദ്യങ്ങൾ ചോദിക്കുക",
      placeholder: "പദ്ധതികൾ, യോഗ്യത അല്ലെങ്കിൽ അപേക്ഷാ പ്രക്രിയയെക്കുറിച്ച് ചോദിക്കുക...",
      send: "അയയ്ക്കുക"
    },
    common: {
      loading: "ലോഡ് ചെയ്യുന്നു...",
      error: "എന്തോ തെറ്റ് സംഭവിച്ചു",
      back: "പിന്നോട്ട്",
      next: "അടുത്തത്",
      yes: "അതെ",
      no: "ഇല്ല"
    }
  },
  pa: {
    landing: {
      title: "ਸਰਕਾਰੀ ਲਾਭ ਗੁਆਓ ਨਾ",
      subtitle: "ਕੁਝ ਸਧਾਰਨ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ ਅਤੇ ਹਜ਼ਾਰਾਂ ਰੁਪਏ ਦੀਆਂ ਯੋਜਨਾਵਾਂ ਖੋਜੋ",
      cta: "ਮੇਰੀ ਯੋਗਤਾ ਜਾਂਚੋ",
      features: ["ਸਿਰਫ਼ 2 ਮਿੰਟ", "2,47,832 ਲੋਕਾਂ ਦੀ ਮਦਦ ਕੀਤੀ", "ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ"],
      howItWorks: "NEXIS ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
      steps: [
        { title: "ਆਪਣੇ ਬਾਰੇ ਦੱਸੋ", desc: "ਉਮਰ, ਰਾਜ ਅਤੇ ਪੇਸ਼ੇ ਵਰਗੀ ਬੁਨਿਆਦੀ ਜਾਣਕਾਰੀ" },
        { title: "AI ਮੇਲ ਲੱਭਦਾ ਹੈ", desc: "ਸਾਡਾ ਸਿਸਟਮ ਸਾਰੀਆਂ ਉਪਲਬਧ ਯੋਜਨਾਵਾਂ ਦੀ ਜਾਂਚ ਕਰਦਾ ਹੈ" },
        { title: "ਮਾਰਗਦਰਸ਼ਨ ਨਾਲ ਅਰਜ਼ੀ ਦਿਓ", desc: "ਅਰਜ਼ੀ ਦੇਣ ਲਈ ਕਦਮ-ਦਰ-ਕਦਮ ਮਦਦ ਪ੍ਰਾਪਤ ਕਰੋ" }
      ]
    },
    profile: {
      title: "ਤੁਹਾਡਾ ਪ੍ਰੋਫਾਈਲ",
      subtitle: "ਮੇਲ ਖਾਂਦੀਆਂ ਯੋਜਨਾਵਾਂ ਲੱਭਣ ਲਈ ਆਪਣੇ ਬਾਰੇ ਦੱਸੋ",
      fields: {
        age: "ਉਮਰ",
        state: "ਰਾਜ",
        occupation: "ਪੇਸ਼ਾ",
        income: "ਸਾਲਾਨਾ ਆਮਦਨ (₹)",
        gender: "ਲਿੰਗ",
        category: "ਸਮਾਜਿਕ ਸ਼੍ਰੇਣੀ",
        disability: "ਕੀ ਤੁਹਾਨੂੰ ਕੋਈ ਅਪਾਹਜਤਾ ਹੈ?"
      },
      submit: "ਯੋਗਤਾ ਜਾਂਚੋ"
    },
    results: {
      title: "ਤੁਹਾਡੀਆਂ ਯੋਗ ਯੋਜਨਾਵਾਂ",
      eligible: "ਯੋਗ",
      ineligible: "ਅਯੋਗ",
      viewDetails: "ਵੇਰਵੇ ਦੇਖੋ",
      applyNow: "ਹੁਣੇ ਅਰਜ਼ੀ ਦਿਓ"
    },
    chat: {
      title: "ਸਵਾਲ ਪੁੱਛੋ",
      placeholder: "ਯੋਜਨਾਵਾਂ, ਯੋਗਤਾ ਜਾਂ ਅਰਜ਼ੀ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਪੁੱਛੋ...",
      send: "ਭੇਜੋ"
    },
    common: {
      loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      error: "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ",
      back: "ਪਿੱਛੇ",
      next: "ਅੱਗੇ",
      yes: "ਹਾਂ",
      no: "ਨਹੀਂ"
    }
  },
  or: {
    landing: {
      title: "ସରକାରୀ ସୁବିଧା ହରାନ୍ତୁ ନାହିଁ",
      subtitle: "କିଛି ସରଳ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ ଏବଂ ହଜାରେ ଟଙ୍କାର ଯୋଜନା ଆବିଷ୍କାର କରନ୍ତୁ",
      cta: "ମୋର ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ",
      features: ["କେବଳ 2 ମିନିଟ୍", "2,47,832 ଲୋକଙ୍କୁ ସାହାଯ୍ୟ କରାଯାଇଛି", "ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା"],
      howItWorks: "NEXIS କିପରି କାମ କରେ",
      steps: [
        { title: "ନିଜ ବିଷୟରେ କୁହନ୍ତୁ", desc: "ବୟସ, ରାଜ୍ୟ ଏବଂ ବୃତ୍ତି ଭଳି ମୌଳିକ ସୂଚନା" },
        { title: "AI ମେଳ ଖୋଜେ", desc: "ଆମର ସିଷ୍ଟମ୍ ସମସ୍ତ ଉପଲବ୍ଧ ଯୋଜନା ଯାଞ୍ଚ କରେ" },
        { title: "ମାର୍ଗଦର୍ଶନ ସହିତ ଆବେଦନ କରନ୍ତୁ", desc: "ଆବେଦନ କରିବା ପାଇଁ ପଦକ୍ଷେପ-ଦର-ପଦକ୍ଷେପ ସାହାଯ୍ୟ ପାଆନ୍ତୁ" }
      ]
    },
    profile: {
      title: "ଆପଣଙ୍କର ପ୍ରୋଫାଇଲ୍",
      subtitle: "ମେଳ ଖାଉଥିବା ଯୋଜନା ଖୋଜିବା ପାଇଁ ନିଜ ବିଷୟରେ କୁହନ୍ତୁ",
      fields: {
        age: "ବୟସ",
        state: "ରାଜ୍ୟ",
        occupation: "ବୃତ୍ତି",
        income: "ବାର୍ଷିକ ଆୟ (₹)",
        gender: "ଲିଙ୍ଗ",
        category: "ସାମାଜିକ ଶ୍ରେଣୀ",
        disability: "ଆପଣଙ୍କର କୌଣସି ଅକ୍ଷମତା ଅଛି କି?"
      },
      submit: "ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ"
    },
    results: {
      title: "ଆପଣଙ୍କର ଯୋଗ୍ୟ ଯୋଜନା",
      eligible: "ଯୋଗ୍ୟ",
      ineligible: "ଅଯୋଗ୍ୟ",
      viewDetails: "ବିବରଣୀ ଦେଖନ୍ତୁ",
      applyNow: "ବର୍ତ୍ତମାନ ଆବେଦନ କରନ୍ତୁ"
    },
    chat: {
      title: "ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ",
      placeholder: "ଯୋଜନା, ଯୋଗ୍ୟତା କିମ୍ବା ଆବେଦନ ପ୍ରକ୍ରିୟା ବିଷୟରେ ପଚାରନ୍ତୁ...",
      send: "ପଠାନ୍ତୁ"
    },
    common: {
      loading: "ଲୋଡ୍ ହେଉଛି...",
      error: "କିଛି ଭୁଲ୍ ହୋଇଛି",
      back: "ପଛକୁ",
      next: "ପରବର୍ତ୍ତୀ",
      yes: "ହଁ",
      no: "ନା"
    }
  },
  as: {
    landing: {
      title: "চৰকাৰী সুবিধা হেৰুৱাব নালাগে",
      subtitle: "কেইটামান সহজ প্ৰশ্নৰ উত্তৰ দিয়ক আৰু হাজাৰ হাজাৰ টকাৰ আঁচনি আৱিষ্কাৰ কৰক",
      cta: "মোৰ যোগ্যতা পৰীক্ষা কৰক",
      features: ["মাত্ৰ ২ মিনিট", "২,৪৭,৮৩২ জনক সহায় কৰা হৈছে", "সম্পূৰ্ণ বিনামূলীয়া"],
      howItWorks: "NEXIS কেনেকৈ কাম কৰে",
      steps: [
        { title: "আপোনাৰ বিষয়ে কওক", desc: "বয়স, ৰাজ্য আৰু পেছাৰ দৰে মৌলিক তথ্য" },
        { title: "AI মিল বিচাৰি পায়", desc: "আমাৰ ব্যৱস্থাই সকলো উপলব্ধ আঁচনি পৰীক্ষা কৰে" },
        { title: "নিৰ্দেশনাৰ সৈতে আবেদন কৰক", desc: "আবেদন কৰিবলৈ পদক্ষেপ-দৰ-পদক্ষেপ সহায় লাভ কৰক" }
      ]
    },
    profile: {
      title: "আপোনাৰ প্ৰ'ফাইল",
      subtitle: "মিলা আঁচনি বিচাৰিবলৈ আপোনাৰ বিষয়ে কওক",
      fields: {
        age: "বয়স",
        state: "ৰাজ্য",
        occupation: "পেছা",
        income: "বাৰ্ষিক আয় (₹)",
        gender: "লিংগ",
        category: "সামাজিক শ্ৰেণী",
        disability: "আপোনাৰ কোনো অক্ষমতা আছে নেকি?"
      },
      submit: "যোগ্যতা পৰীক্ষা কৰক"
    },
    results: {
      title: "আপোনাৰ যোগ্য আঁচনি",
      eligible: "যোগ্য",
      ineligible: "অযোগ্য",
      viewDetails: "বিৱৰণ চাওক",
      applyNow: "এতিয়াই আবেদন কৰক"
    },
    chat: {
      title: "প্ৰশ্ন সোধক",
      placeholder: "আঁচনি, যোগ্যতা বা আবেদন প্ৰক্ৰিয়াৰ বিষয়ে সোধক...",
      send: "পঠিয়াওক"
    },
    common: {
      loading: "ল'ড হৈ আছে...",
      error: "কিবা ভুল হৈছে",
      back: "পিছলৈ",
      next: "পৰৱৰ্তী",
      yes: "হয়",
      no: "নহয়"
    }
  }
};

export function getTranslation(lang: string): Translations {
  return translations[lang as TranslationKey] || translations.en;
}
