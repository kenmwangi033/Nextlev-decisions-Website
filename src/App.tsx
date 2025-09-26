import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Star, 
  TrendingUp, 
  Shield, 
  Users, 
  BarChart3, 
  Target, 
  Leaf, 
  Check, 
  X, 
  Plus,
  Minus,
  Menu,
  ArrowRight,
  Download,
  Calculator,
  FileText,
  MessageCircle,
  Gift,
  Clock,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'KES'>('USD');
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  
  // Lead capture states
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);
  const [timeOnSite, setTimeOnSite] = useState(0);
  const [leadFormStep, setLeadFormStep] = useState(1);
  const [leadFormData, setLeadFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    companySize: '',
    industry: '',
    currentChallenges: '',
    budget: '',
    timeline: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [demoAccessLink, setDemoAccessLink] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I\'m here to help you find the perfect decision intelligence solution. What\'s your biggest project challenge?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Dashboard card states
  const [activeDashboardCard, setActiveDashboardCard] = useState<'risk' | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    trackConversion('theme_toggle', { theme: !isDarkMode ? 'light' : 'dark' });
  };

  // Lead capture functions
  const handleLeadFormChange = (field: string, value: string) => {
    setLeadFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLeadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Track conversion
      trackConversion('lead_captured', leadFormData);
      
      // For demo purposes, we'll simulate successful form submission
      // In production, integrate with your actual CRM/backend
      console.log('Lead captured (Demo Mode):', {
        ...leadFormData,
        timestamp: new Date().toISOString(),
        source: 'landing_page',
        demoRequested: true
      });
      
      // Simulate API success
      const response = { ok: true };
      
      if (response.ok) {
        // Generate demo access link (replace with your actual app URL)
        const demoLink = `https://app.nextlevdecisions.com/demo?token=${btoa(leadFormData.email + Date.now())}&email=${encodeURIComponent(leadFormData.email)}&name=${encodeURIComponent(leadFormData.firstName + ' ' + leadFormData.lastName)}`;
        
        // Store demo link for success modal
        setDemoAccessLink(demoLink);
        setShowSuccessModal(true);
        setShowExitIntent(false);
        setExitIntentTriggered(true);
        
        // Reset form
        setLeadFormData({
          firstName: '', lastName: '', email: '', company: '', jobTitle: '',
          companySize: '', industry: '', currentChallenges: '', budget: '', timeline: ''
        });
        setLeadFormStep(1);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message to user
      alert('There was an error submitting your form. Please try again or contact us directly.');
    }
  };

  const nextFormStep = () => {
    if (leadFormStep < 3) setLeadFormStep(leadFormStep + 1);
  };

  const prevFormStep = () => {
    if (leadFormStep > 1) setLeadFormStep(leadFormStep - 1);
  };

  // Theme persistence and initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Time tracking for better exit intent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnSite(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Improved exit intent detection
  useEffect(() => {
    let exitTimer: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if:
      // 1. User has been on site for at least 30 seconds
      // 2. Mouse is leaving from the top (actual exit intent)
      // 3. Haven't already triggered in this session
      // 4. Not already showing
      if (
        e.clientY <= 0 && 
        timeOnSite >= 30 && 
        !exitIntentTriggered && 
        !showExitIntent &&
        !showSuccessModal
      ) {
        // Add a small delay to avoid false triggers
        exitTimer = setTimeout(() => {
          setShowExitIntent(true);
          setExitIntentTriggered(true);
        }, 500);
      }
    };

    const handleMouseEnter = () => {
      // Cancel the timer if user comes back quickly
      if (exitTimer) {
        clearTimeout(exitTimer);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, [timeOnSite, exitIntentTriggered, showExitIntent, showSuccessModal]);

  // Chat functions
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { type: 'user', message: chatInput }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        message: 'Thanks for that insight! Based on your needs, I\'d recommend starting with our Pro plan. Would you like me to schedule a personalized demo to show you exactly how we can help?' 
      }]);
    }, 1000);
    
    setChatInput('');
  };

  // Analytics tracking functions
  const trackConversion = (event: string, data?: any) => {
    console.log('Conversion tracked:', event, data);
    // In production, integrate with Google Analytics, Mixpanel, etc.
  };

  // Smooth scroll function
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId.substring(1));
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMenuOpen(false); // Close mobile menu if open
  };

  // Exit-intent dynamic message based on current section
  const getExitIntentMessage = () => {
    try {
      const hash = (window?.location?.hash || '').toLowerCase();
      if (hash.includes('sdg') || hash.includes('esg')) {
        return 'Check your ESG alignment in minutes in the ESG COMPLIANCE CHECKLIST';
      }
      if (hash.includes('roi')) {
        return 'Try our quick ROI Calculator — get a savings and ROI snapshot in under 2 minutes.';
      }
      // Also check pathname for deep links
      const path = (window?.location?.pathname || '').toLowerCase();
      if (path.includes('esg') || path.includes('sdg')) {
        return 'Check your ESG alignment in minutes in the ESG COMPLIANCE CHECKLIST';
      }
    } catch {}
    // Default to ROI teaser
    return 'Try our quick ROI Calculator — get a savings and ROI snapshot in under 2 minutes.';
  };

  // Dashboard card functions
  const handleDashboardCardClick = (cardType: 'risk') => {
    setActiveDashboardCard(activeDashboardCard === cardType ? null : cardType);
    trackConversion('dashboard_card_clicked', { cardType });
  };

  const leadMagnets = [
    {
      icon: Download,
      title: "Free AI Decision Framework Guide",
      description: "Complete 47-page guide on implementing AI-powered decision making in your organization",
      cta: "Download Free Guide",
      value: "$297 Value - Free Today"
    },
    {
      icon: Calculator,
      title: "ROI Calculator Tool",
      description: "Calculate your potential savings and ROI with our interactive project decision calculator",
      cta: "Access Free Calculator",
      value: "Get Instant Results"
    },
    {
      icon: FileText,
      title: "ESG Compliance Checklist",
      description: "17-point UN SDG alignment checklist with scoring templates for sustainability reporting",
      cta: "Get Checklist",
      value: "Enterprise Template"
    }
  ];

  const features = [
    {
      icon: Target,
      title: "6-Category Premium Scoring",
      description: "Advanced scoring across Value, Success, Sustainability, Portfolio, Governance & Documentation with 50+ criteria and real-time AI recommendations."
    },
    {
      icon: TrendingUp,
      title: "Advanced Financial Intelligence",
      description: "Multi-currency ROI modeling, cash flow projections, cost-benefit analysis, and revenue forecasting with predictive analytics."
    },
    {
      icon: Shield,
      title: "AI-Powered Risk Detection",
      description: "Proactive identification across 11 risk factors with predictive modeling, mitigation strategies, and real-time monitoring."
    },
    {
      icon: Users,
      title: "5-Tier Team Collaboration",
      description: "Role-based access (Admin, Owner, Scorer, Reviewer, Viewer) with project assignments, multi-user scoring, and performance analytics."
    },
    {
      icon: BarChart3,
      title: "11 Specialized Reports",
      description: "AI-generated reports including Viability, ESG/SDG, Strategic Analysis, Synergy, Financial, Risk, and Governance with natural language insights."
    },
    {
      icon: Leaf,
      title: "17 UN SDGs Tracking",
      description: "Comprehensive ESG scoring with UN Sustainable Development Goals alignment, impact assessment, and sustainability success quadrant analysis."
    }
  ];

  const testimonials = [
    {
      quote: "NextLev Decisions transformed how we approach portfolio management. We've seen a 40% improvement in project success rates and saved millions in misallocated resources.",
      author: "Sarah Johnson",
      role: "Chief Strategy Officer",
      company: "TechCorp Industries",
      initials: "SJ"
    },
    {
      quote: "The AI-powered insights are game-changing. What used to take our team weeks of analysis now happens in hours, with much more accurate results.",
      author: "Michael Chen",
      role: "VP of Operations",
      company: "Global Innovations",
      initials: "MC"
    },
    {
      quote: "The ESG tracking and sustainability features align perfectly with our values. It's helped us maintain our A+ sustainability rating while maximizing returns.",
      author: "Emily Rodriguez",
      role: "Portfolio Director",
      company: "Sustainable Ventures",
      initials: "ER"
    }
  ];

  const pricingPlans = [
    {
      name: "Free Trial",
      price: { 
        monthly: { USD: 0, KES: 0 }, 
        yearly: { USD: 0, KES: 0 } 
      },
      period: "14 days",
      description: "For individuals or teams evaluating the platform",
      features: [
        "1 active project",
        "Core scoring engine (5 categories)",
        "Basic dashboard & 3 reports",
        "Email support",
        "Demo data access"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Starter",
      price: { 
        monthly: { USD: 299, KES: 39870 }, 
        yearly: { USD: 239, KES: 31870 } 
      },
      period: "per month",
      description: "For small teams building their strategic decision workflows",
      features: [
        "Up to 10 projects/month",
        "Advanced scoring engine (5 categories + AI insights)",
        "9 pre-built report types",
        "Portfolio mapping & synergy analysis",
        "Up to 5 users with role management",
        "ESG/SDG impact tracking",
        "Financial analysis & ROI modeling",
        "Standard support & training"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Pro",
      price: { 
        monthly: { USD: 899, KES: 119870 }, 
        yearly: { USD: 719, KES: 95870 } 
      },
      period: "per month",
      description: "For mid-sized teams needing comprehensive analytics and collaboration",
      features: [
        "Unlimited projects",
        "Full AI scoring suite with predictive analytics",
        "All 11 report types + custom reports",
        "Advanced team management & project assignments",
        "Risk assessment & mitigation planning",
        "Sustainability success quadrant analysis",
        "Integration marketplace access",
        "Up to 25 users with granular permissions",
        "Priority support & dedicated onboarding"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      price: { 
        monthly: { USD: "Custom", KES: "Custom" }, 
        yearly: { USD: "Custom", KES: "Custom" } 
      },
      period: "custom pricing",
      description: "Scalable, secure solutions for enterprise-grade organizations",
      features: [
        "Unlimited projects & users",
        "Enterprise integrations (SSO, API, ERP)",
        "Custom scoring frameworks & algorithms",
        "Advanced admin controls & system monitoring",
        "White-label reporting & branding",
        "Compliance frameworks (SFDR, CSRD, TCFD)",
        "Data governance & security controls",
        "24/7 support & dedicated CSM",
        "Custom training & implementation"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How quickly can we get started with the AI-powered platform?",
      answer: "You can start immediately with our 14-day free trial that includes access to all 6 scoring categories and 5 core reports. Most organizations are analyzing projects within 24 hours, with full AI model training completed within a week. Enterprise clients get dedicated onboarding with custom AI configuration."
    },
    {
      question: "What types of projects can be analyzed with the 50+ AI criteria?",
      answer: "Our AI analyzes any project type across 6 core categories (Value, Success, Sustainability, Portfolio, Governance, Documentation). From healthcare implementations with Epic integration to manufacturing MES systems, banking core systems, and energy infrastructure. The AI adapts to your industry with specialized scoring frameworks."
    },
    {
      question: "How does the advanced AI scoring system with 50+ criteria work?",
      answer: "Our AI orchestration engine analyzes projects across 50+ criteria in 6 categories, using machine learning to provide predictive insights. It processes strategic alignment, financial metrics, 11 risk factors, resource requirements, and ESG impact across 17 UN SDGs. The system learns from your data and industry benchmarks, providing natural language insights and automated recommendations."
    },
    {
      question: "What enterprise integrations are available in the marketplace?",
      answer: "We offer comprehensive integrations across major industries: Healthcare (Epic Healthcare), Banking (Core Banking Suite), Manufacturing (MES systems), Energy (Asset Management), plus CRM/ERP connectivity with Salesforce and HubSpot. Our API/Webhook ecosystem supports custom integrations, with Enterprise plans including dedicated integration specialists and real-time data sync monitoring."
    },
    {
      question: "What security and compliance certifications do you maintain?",
      answer: "We maintain SOC 2 Type II and ISO 27001 certifications with enterprise-grade encryption and 99.9% uptime SLA. Our platform supports comprehensive compliance frameworks including SFDR, CSRD, TCFD for sustainability reporting, plus GDPR, CCPA, and industry-specific requirements. Enterprise plans include advanced data governance, audit trails, and dedicated security controls."
    },
    {
      question: "What support and training do you provide for the AI platform?",
      answer: "We provide comprehensive support including email support for all plans, priority support with dedicated CSM for Pro plans, and 24/7 support with dedicated customer success management for Enterprise clients. All paid plans include AI model training, custom onboarding, and ongoing optimization. Enterprise clients receive custom AI algorithm development and implementation support."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`fixed top-0 w-full backdrop-blur-sm border-b z-50 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/95 border-gray-800' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold">NextLev</div>
                <div className="text-sm text-blue-400 -mt-1">Decisions</div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className={`transition-colors cursor-pointer ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Features</a>
              <a href="#benefits" onClick={(e) => handleSmoothScroll(e, '#benefits')} className={`transition-colors cursor-pointer ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Benefits</a>
              <a href="#pricing" onClick={(e) => handleSmoothScroll(e, '#pricing')} className={`transition-colors cursor-pointer ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Pricing</a>
              <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className={`transition-colors cursor-pointer ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Reviews</a>
              <a href="#resources" onClick={(e) => handleSmoothScroll(e, '#resources')} className={`transition-colors cursor-pointer ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Resources</a>
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const demoSection = document.getElementById('demo');
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  trackConversion('header_demo_request');
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                Request Demo
              </button>
            </div>

            <button 
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden border-t transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="px-4 py-2 space-y-2">
              <a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className={`block py-2 cursor-pointer transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Features</a>
              <a href="#benefits" onClick={(e) => handleSmoothScroll(e, '#benefits')} className={`block py-2 cursor-pointer transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Benefits</a>
              <a href="#pricing" onClick={(e) => handleSmoothScroll(e, '#pricing')} className={`block py-2 cursor-pointer transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Pricing</a>
              <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, '#testimonials')} className={`block py-2 cursor-pointer transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Reviews</a>
              <a href="#resources" onClick={(e) => handleSmoothScroll(e, '#resources')} className={`block py-2 cursor-pointer transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Resources</a>
              
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const demoSection = document.getElementById('demo');
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  setIsMenuOpen(false);
                  trackConversion('mobile_header_demo_request');
                }}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 py-2 rounded-lg font-medium"
              >
                Request Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-gray-900' 
            : 'bg-gradient-to-br from-blue-50 via-purple-50 to-gray-100'
        }`}></div>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-colors duration-300 ${
          isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/20'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl transition-colors duration-300 ${
          isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/20'
        }`}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className={`inline-block border rounded-full px-6 py-3 mb-8 backdrop-blur-sm transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/30' 
                  : 'bg-gradient-to-r from-blue-100/60 to-purple-100/60 border-blue-300/50'
              }`}>
                <span className={`text-sm font-medium flex items-center transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  #1 AI-Powered Decision Intelligence Platform
                </span>
            </div>
              
              <h1 className="font-bold mb-6 leading-relaxed space-y-2">
                <div className="text-2xl md:text-3xl lg:text-4xl">
                  <span className={`bg-clip-text text-transparent transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300' 
                      : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700'
                  }`}>
                    Transform Your Business with
                  </span>
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl">
                  <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Smarter • Sustainable • Strategic
                  </span>
                </div>
                <div className="text-2xl md:text-3xl lg:text-4xl">
                  <span className={`bg-clip-text text-transparent transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-white to-gray-200' 
                      : 'bg-gradient-to-r from-gray-900 to-gray-800'
                  }`}>
                    AI Decision Intelligence
                  </span>
                </div>
            </h1>
              
              <p className={`text-xl mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Enterprise-grade platform delivering <span className="text-blue-400 font-semibold">real-time AI insights</span> across 50+ criteria, 11 specialized reports, and comprehensive ESG tracking with 17 UN SDGs.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <button 
                  onClick={() => {
                    const demoSection = document.getElementById('demo');
                    if (demoSection) {
                      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    trackConversion('hero_demo_request');
                  }}
                  className="group bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Get Your Free Demo
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
                
                <button 
                  onClick={() => {
                    const demoSection = document.getElementById('demo');
                    if (demoSection) {
                      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    trackConversion('hero_watch_demo');
                  }}
                  className="group flex items-center space-x-2 border-2 border-gray-600 hover:border-blue-500 bg-gray-800/50 hover:bg-blue-900/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all backdrop-blur-sm"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                  <span>Watch 3-Min Demo</span>
              </button>
            </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm mb-8">
                <span className={`flex items-center px-3 py-2 rounded-full backdrop-blur-sm transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'
                }`}>
                  <Check className="w-4 h-4 mr-2 text-green-400" /> 
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>No credit card required</span>
                </span>
                <span className={`flex items-center px-3 py-2 rounded-full backdrop-blur-sm transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'
                }`}>
                  <Check className="w-4 h-4 mr-2 text-green-400" /> 
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>14-day free trial</span>
                </span>
                <span className={`flex items-center px-3 py-2 rounded-full backdrop-blur-sm transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'
                }`}>
                  <Shield className="w-4 h-4 mr-2 text-blue-400" /> 
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Enterprise security</span>
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-blue-400">500+</div>
                  <div className={`text-xs transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Enterprises</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-green-400">$2.4M</div>
                  <div className={`text-xs transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Avg Savings</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-purple-400">99.9%</div>
                  <div className={`text-xs transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Uptime SLA</div>
                </div>
            </div>
          </div>

            {/* Right Column - Floating Dashboard Images */}
            <div className="relative lg:block hidden">
              <div className="relative w-full h-[600px]">
                
                {/* Main Dashboard - Center */}
                <div className="absolute top-8 left-8 w-80 h-72 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 shadow-2xl transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer group z-30">
                  {/* Browser Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-400 font-medium">NextLev Dashboard</div>
                  </div>
                  
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <div className="text-xs text-white font-bold">N</div>
                    </div>
                      <div className="text-sm font-bold text-white">NextLev</div>
                    </div>
                    <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                  </div>
                  
                  {/* Metrics Cards */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-gray-700/50 p-2 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-400">24</div>
                      <div className="text-xs text-gray-400">Total</div>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-400">18</div>
                      <div className="text-xs text-gray-400">Active</div>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded-lg text-center">
                      <div className="text-lg font-bold text-purple-400">92%</div>
                      <div className="text-xs text-gray-400">Success</div>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded-lg text-center">
                      <div className="text-lg font-bold text-orange-400">45</div>
                      <div className="text-xs text-gray-400">Team</div>
                    </div>
                    </div>
                    
                  {/* ESG Metrics */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium text-gray-300">Sustainability & ESG</div>
                      <div className="text-xs text-green-400">82.5%</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-green-400 font-bold">1.2M</div>
                        <div className="text-gray-500">Carbon</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">85/100</div>
                        <div className="text-gray-500">ESG</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-bold">12</div>
                        <div className="text-gray-500">Green</div>
                      </div>
                    </div>
                    </div>
                    
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </div>

                {/* Overall Viability Score - Top Right */}
                <div className="absolute top-0 right-0 w-72 h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 shadow-2xl transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-700 cursor-pointer group z-20">
                  {/* Browser Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                      </div>
                    <div className="text-xs text-gray-400 font-medium">Viability Analysis</div>
                    </div>
                    
                  {/* Viability Header */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white mb-1">Overall Viability Score</div>
                      <div className="text-xs text-green-400">Comprehensive project assessment</div>
                    </div>
                  </div>
                  
                  {/* Viability Content */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0">
                        <div className="w-20 h-20 rounded-full border-4 border-gray-600"></div>
                        <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-green-500" style={{
                          background: `conic-gradient(#22c55e 0deg ${87 * 3.6}deg, transparent ${87 * 3.6}deg 360deg)`,
                          borderRadius: '50%',
                          mask: 'radial-gradient(circle at center, transparent 40%, black 40%)'
                        }}></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-green-400">87%</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="bg-green-500 text-white px-3 py-2 rounded text-sm font-medium text-center">
                        92% Value
                      </div>
                      <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium text-center">
                        85% Success
                      </div>
                      <div className="bg-purple-500 text-white px-3 py-2 rounded text-sm font-medium text-center">
                        84% Sustainability
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Breakdown */}
                  <div className="bg-gray-700/30 rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-300 mb-2">Score Breakdown</div>
                    <div className="text-xs text-gray-400">Hover to explore comprehensive assessment details</div>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>

                 {/* Risk Assessment Card - Positioned Below */}
                 <div className="absolute inset-0 pointer-events-none">
                   {/* Overall Risk Assessment - Bottom Center */}
                   <div 
                     onClick={() => handleDashboardCardClick('risk')}
                     className={`absolute bottom-32 left-1/2 transform -translate-x-1/2 w-64 h-36 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 shadow-2xl transition-all duration-500 cursor-pointer group pointer-events-auto ${
                       activeDashboardCard === 'risk' 
                         ? 'z-50 rotate-0 scale-110' 
                         : 'z-30 rotate-1 hover:rotate-0 hover:scale-105'
                     }`}
                   >
                     <div className="flex items-center mb-3">
                       <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                         <Shield className="w-5 h-5 text-white" />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-white">Risk Assessment</div>
                         <div className="text-xs text-yellow-400">Comprehensive risk evaluation</div>
                       </div>
                     </div>
                     
                     <div className="flex items-center justify-between">
                       <div>
                         <div className="text-3xl font-bold text-white mb-1">33%</div>
                         <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium inline-block">Medium Risk</div>
                       </div>
                       <div className="text-right">
                         <div className="text-xs text-gray-400 mb-1">Risk Tolerance</div>
                         <div className="text-sm font-bold text-orange-400">Needs Attention</div>
                       </div>
                     </div>
                     
                     <div className="mt-2">
                       <div className="text-xs text-gray-300">Risk Summary</div>
                       <div className="text-xs text-gray-400">Moderate levels identified. Implement targeted mitigation strategies.</div>
                     </div>
                     
                     <div className="absolute bottom-2 right-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                       Click to focus →
                     </div>
                     
                     {/* Hover Glow Effect */}
                     <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                   </div>
                 </div>

                {/* Floating Action Badges */}
                <div className="absolute top-32 right-12 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-bounce shadow-lg" style={{animationDelay: '1s'}}>
                  <span className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    Live Data
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Enhanced Metrics Cards */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Platform Capabilities</h2>
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Comprehensive AI-powered decision intelligence at your fingertips</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { 
                  label: "AI Scoring Criteria", 
                  value: "50+", 
                  color: "from-green-500 to-emerald-600",
                  icon: Target,
                  description: "Advanced scoring metrics"
                },
                { 
                  label: "Report Types", 
                  value: "11", 
                  color: "from-blue-500 to-blue-600",
                  icon: FileText,
                  description: "Comprehensive analytics"
                },
                { 
                  label: "UN SDGs Tracked", 
                  value: "17", 
                  color: "from-green-500 to-teal-600",
                  icon: Leaf,
                  description: "Sustainability goals"
                },
                { 
                  label: "Risk Factors", 
                  value: "11", 
                  color: "from-yellow-500 to-orange-600",
                  icon: Shield,
                  description: "Risk assessment"
                },
                { 
                  label: "User Roles", 
                  value: "5", 
                  color: "from-purple-500 to-indigo-600",
                  icon: Users,
                  description: "Team collaboration"
                },
                { 
                  label: "AI Insights", 
                  value: "24/7", 
                  color: "from-pink-500 to-red-600",
                  icon: BarChart3,
                  description: "Real-time monitoring"
                }
            ].map((metric, index) => (
                <div key={index} className={`group rounded-2xl p-6 border transition-all hover:transform hover:scale-105 backdrop-blur-sm relative overflow-hidden ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 hover:border-gray-600/50' 
                    : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50 hover:border-gray-300/50'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <metric.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className={`w-2 h-2 bg-gradient-to-r ${metric.color} rounded-full animate-pulse`}></div>
                    </div>
                    
                    <div className={`text-3xl font-bold mb-2 bg-clip-text text-transparent transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-white to-gray-300' 
                        : 'bg-gradient-to-r from-gray-900 to-gray-700'
                    }`}>
                      {metric.value}
                    </div>
                    
                    <div className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>{metric.label}</div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>{metric.description}</div>
                    
                    <div className={`w-full h-1 bg-gradient-to-r ${metric.color} rounded-full mt-3 opacity-60`}></div>
                  </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnets Section */}
      <section id="resources" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/10 to-purple-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Free <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Decision Intelligence</span> Resources
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get instant access to our premium decision-making tools and frameworks used by enterprise clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadMagnets.map((magnet, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-105 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {magnet.value}
                </div>
                
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <magnet.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{magnet.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{magnet.description}</p>
                
                <button 
                  onClick={() => {
                    trackConversion('lead_magnet_click', { type: magnet.title });
                    setShowExitIntent(true);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  {magnet.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm flex items-center justify-center">
              <Gift className="w-4 h-4 mr-2" />
              No credit card required • Instant download • Used by 500+ enterprises
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Social Proof */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Trusted by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">500+ Enterprises</span> Worldwide
            </h2>
            <div className="flex items-center justify-center space-x-8 mb-8 opacity-60">
              <div className="text-gray-400 font-semibold">Microsoft</div>
              <div className="text-gray-400 font-semibold">IBM</div>
              <div className="text-gray-400 font-semibold">Deloitte</div>
              <div className="text-gray-400 font-semibold">PwC</div>
              <div className="text-gray-400 font-semibold">KPMG</div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center mb-12">
            {[
              { number: "1,247+", label: "Active Users", trend: "+23% this month" },
              { number: "2.5M+", label: "Projects Analyzed", trend: "Real-time analytics" },
              { number: "$2.4M", label: "Average Annual Savings", trend: "Per enterprise client" },
              { number: "60%", label: "Project Success Rate Increase", trend: "Industry leading" }
            ].map((stat, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-6 border border-gray-600/50 hover:border-blue-500/30 transition-all">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-green-400">{stat.trend}</div>
              </div>
            ))}
          </div>

          {/* Live Activity Feed */}
          <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl p-6 border border-gray-600/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              Live Activity
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-300">
                <span>TechCorp just saved $340K using our AI recommendations</span>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Global Innovations completed their 50th project analysis</span>
                <span className="text-xs text-gray-400">5 min ago</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>New enterprise client onboarded in Healthcare sector</span>
                <span className="text-xs text-gray-400">12 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Enterprise-Grade <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Decision Intelligence</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI orchestration with predictive analytics, comprehensive reporting, and enterprise integrations across major industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Transform Your Organization's<br />
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Decision Intelligence</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join hundreds of forward-thinking organizations that have revolutionized their strategic decision-making with NextLev Decisions.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Reduce project failure rates by up to 60%",
                  "Increase portfolio ROI by an average of 45%",
                  "Cut decision-making time from weeks to hours",
                  "Improve resource allocation efficiency by 35%",
                  "Ensure ESG compliance and sustainability goals",
                  "Enable data-driven strategic planning"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => {
                  const demoSection = document.getElementById('demo');
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  trackConversion('benefits_start_transformation');
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
              >
                Start Your Transformation
              </button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-8 border border-gray-600">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Real-Time AI Insights</h3>
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                    Live Data
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">94.7%</div>
                    <div className="text-gray-400 text-sm">AI Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">2.3s</div>
                    <div className="text-gray-400 text-sm">Analysis Speed</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-600/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">Latest AI Recommendations</span>
                      <span className="text-xs text-green-400">Updated 2 min ago</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      • Optimize Project Alpha timeline by 15 days<br/>
                      • Reallocate $340K from low-impact initiatives<br/>
                      • ESG compliance score improved to 87%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-400">47</div>
                      <div className="text-xs text-gray-400">Active Projects</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-400">12</div>
                      <div className="text-xs text-gray-400">AI Alerts</div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-orange-400">3</div>
                      <div className="text-xs text-gray-400">Risk Factors</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Trusted by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-300">
              See what our customers are saying about their transformation with NextLev Decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-gray-400">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Choose Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Strategic Intelligence</span> Plan
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Advanced AI-powered decision frameworks with comprehensive analytics, team collaboration, and enterprise integrations.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="bg-gray-700 rounded-lg p-1 flex">
                <button 
                  className={`px-4 py-2 rounded-md transition-all ${pricingPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                  onClick={() => setPricingPeriod('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`px-4 py-2 rounded-md transition-all ${pricingPeriod === 'yearly' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                  onClick={() => setPricingPeriod('yearly')}
                >
                  Yearly
                  <span className="ml-1 text-xs bg-green-500 text-white px-1 rounded">Save 20%</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center mb-8">
              <div className="bg-gray-700 rounded-lg p-1 flex">
                <button 
                  className={`px-4 py-2 rounded-md transition-all ${currency === 'USD' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                  onClick={() => setCurrency('USD')}
                >
                  USD
                </button>
                <button 
                  className={`px-4 py-2 rounded-md transition-all ${currency === 'KES' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                  onClick={() => setCurrency('KES')}
                >
                  KES
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border transition-all hover:transform hover:scale-105 ${
                plan.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-700 hover:border-gray-600'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">
                      {typeof plan.price[pricingPeriod][currency] === 'number' 
                        ? `${currency === 'USD' ? '$' : 'KSh'}${plan.price[pricingPeriod][currency].toLocaleString()}` 
                        : plan.price[pricingPeriod][currency]}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => {
                    if (plan.cta === 'Contact Sales') {
                      // For Enterprise plan, scroll to demo section for contact
                      const demoSection = document.getElementById('demo');
                      if (demoSection) {
                        demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      trackConversion('pricing_contact_sales', { plan: plan.name });
                    } else {
                      // For all other plans, scroll to demo section to start trial/signup
                      const demoSection = document.getElementById('demo');
                      if (demoSection) {
                        demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      trackConversion('pricing_plan_selected', { plan: plan.name, cta: plan.cta });
                    }
                  }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
                      : 'border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 text-gray-400">
            All paid plans include a 14-day free trial • No credit card required • Cancel anytime
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your<br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Strategic Decisions?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            See NextLev Decisions in action with a personalized demo tailored to your organization's needs.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Questions? Let's talk</h3>
              <ul className="space-y-2 text-gray-300 text-left mb-6">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-2" /> 30-minute personalized demo</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-2" /> Custom use case scenarios</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-2" /> ROI calculation for your portfolio</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-2" /> Implementation roadmap</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg font-semibold transition-all">
                Request Your Demo
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 relative">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                <Clock className="w-3 h-3 inline mr-1" />
                Limited Time
              </div>
              
              <h3 className="text-xl font-bold mb-2">Get Your Strategic Assessment</h3>
              <p className="text-gray-300 text-sm mb-4">Complete your profile to receive customized insights and recommendations</p>
              
              <form onSubmit={handleLeadFormSubmit} className="space-y-4">
                {leadFormStep === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                        placeholder="First Name*" 
                        value={leadFormData.firstName}
                        onChange={(e) => handleLeadFormChange('firstName', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                        required
                />
                <input 
                  type="text" 
                        placeholder="Last Name*" 
                        value={leadFormData.lastName}
                        onChange={(e) => handleLeadFormChange('lastName', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                        required
                />
                    </div>
                <input 
                  type="email" 
                      placeholder="Business Email*" 
                      value={leadFormData.email}
                      onChange={(e) => handleLeadFormChange('email', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={nextFormStep}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg font-semibold transition-all"
                    >
                      Continue → Company Details
                    </button>
                  </>
                )}

                {leadFormStep === 2 && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                        placeholder="Company*" 
                        value={leadFormData.company}
                        onChange={(e) => handleLeadFormChange('company', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                        required
                      />
                      <input 
                        type="text" 
                        placeholder="Job Title" 
                        value={leadFormData.jobTitle}
                        onChange={(e) => handleLeadFormChange('jobTitle', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <select 
                      value={leadFormData.companySize}
                      onChange={(e) => handleLeadFormChange('companySize', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Company Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                    <div className="flex gap-3">
                      <button 
                        type="button" 
                        onClick={prevFormStep}
                        className="flex-1 border border-gray-600 hover:border-gray-500 py-3 rounded-lg font-semibold transition-all"
                      >
                        ← Back
                      </button>
                      <button 
                        type="button" 
                        onClick={nextFormStep}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg font-semibold transition-all"
                      >
                        Complete Assessment →
                </button>
              </div>
                  </>
                )}

                {leadFormStep === 3 && (
                  <>
                    <select 
                      value={leadFormData.budget}
                      onChange={(e) => handleLeadFormChange('budget', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Annual Budget Range</option>
                      <option value="<10k">Less than $10,000</option>
                      <option value="10k-50k">$10,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k+">$100,000+</option>
                    </select>
                    <select 
                      value={leadFormData.timeline}
                      onChange={(e) => handleLeadFormChange('timeline', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Implementation Timeline</option>
                      <option value="immediate">Immediate (within 1 month)</option>
                      <option value="quarter">This quarter (1-3 months)</option>
                      <option value="half-year">Next 6 months</option>
                      <option value="exploring">Just exploring</option>
                    </select>
                    <textarea 
                      placeholder="What's your biggest decision-making challenge?"
                      value={leadFormData.currentChallenges}
                      onChange={(e) => handleLeadFormChange('currentChallenges', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none h-20 resize-none"
                    />
                    <div className="flex gap-3">
                      <button 
                        type="button" 
                        onClick={prevFormStep}
                        className="flex-1 border border-gray-600 hover:border-gray-500 py-3 rounded-lg font-semibold transition-all"
                      >
                        ← Back
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 rounded-lg font-semibold transition-all"
                      >
                        Submit Assessment
                      </button>
                    </div>
                  </>
                )}
              </form>
              
              <p className="text-xs text-gray-400 mt-4 flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Your data is secure and will not be shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-300">
              Get answers to common questions about NextLev Decisions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/20 rounded-xl transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  {openFaq === index ? (
                    <Minus className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Still have questions?</p>
            <button 
              onClick={() => {
                const demoSection = document.getElementById('demo');
                if (demoSection) {
                  demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                trackConversion('faq_contact_team');
              }}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center mx-auto"
            >
              Contact our team <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold">NextLev Decisions</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering organizations to make better strategic decisions through AI-powered portfolio intelligence and comprehensive project analysis.
              </p>
              <div className="space-y-3 text-gray-400 mb-6">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  <a href="mailto:info@nextlevdecisions.com" className="hover:text-white transition-colors">
                    info@nextlevdecisions.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-blue-400" />
                  <a href="tel:+254728399504" className="hover:text-white transition-colors">
                    +254 728 399 504
                  </a>
                </div>
              </div>
              
              {/* Professional Social Media Links */}
              <div className="flex space-x-4">
                <a 
                  href="https://linkedin.com/company/nextlev-decisions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-gray-300 hover:text-white" />
                </a>
                <a 
                  href="https://twitter.com/nextlevdecisions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center hover:from-blue-400 hover:to-blue-500 transition-all transform hover:scale-105"
                  title="Twitter"
                >
                  <Twitter className="w-5 h-5 text-gray-300 hover:text-white" />
                </a>
                <a 
                  href="https://nextlevdecisions.com/blog" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                  title="Blog & Resources"
                >
                  <Globe className="w-5 h-5 text-gray-300 hover:text-white" />
                </a>
                <a 
                  href="https://github.com/nextlev-decisions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  title="Open Source & Research"
                >
                  <ExternalLink className="w-5 h-5 text-gray-300 hover:text-white" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 NextLev Decisions. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 relative animate-in zoom-in duration-300 shadow-2xl">
            <button 
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Before You Go...</h3>
              <p className="text-gray-300">{getExitIntentMessage()}</p>
            </div>

            <form onSubmit={handleLeadFormSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="First Name" 
                value={leadFormData.firstName}
                onChange={(e) => handleLeadFormChange('firstName', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
              <input 
                type="email" 
                placeholder="Business Email" 
                value={leadFormData.email}
                onChange={(e) => handleLeadFormChange('email', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
              <div className="space-y-3">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 rounded-lg font-semibold transition-all"
                >
                  Get Free Guide Now
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowExitIntent(false)}
                  className="w-full text-gray-400 hover:text-white py-2 text-sm transition-colors"
                >
                  No thanks, I'll continue browsing
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-400 mt-4 text-center">
              No spam. Unsubscribe anytime. Used by 500+ enterprises.
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Success!</h3>
              <p className="text-gray-300 mb-6">
                Thank you! Your demo access is ready. Check your email in the next 5 minutes for additional resources:
              </p>
              
              <div className="text-left space-y-2 mb-6">
                <div className="flex items-center text-green-400">
                  <Check className="w-4 h-4 mr-2" />
                  <span className="text-sm">Your custom ROI calculation</span>
                </div>
                <div className="flex items-center text-green-400">
                  <Check className="w-4 h-4 mr-2" />
                  <span className="text-sm">Free AI Decision Framework Guide</span>
                </div>
                <div className="flex items-center text-green-400">
                  <Check className="w-4 h-4 mr-2" />
                  <span className="text-sm">Calendar link for personal consultation</span>
                </div>
              </div>

              {demoAccessLink && (
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-4 mb-6">
                  <h4 className="text-green-400 font-semibold mb-2 flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Instant Demo Access
                  </h4>
                  <p className="text-sm text-gray-300 mb-3">
                    Click below to access your personalized demo environment:
                  </p>
                  <a
                    href={demoAccessLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center text-white"
                    onClick={() => trackConversion('demo_access_clicked')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Access Your Demo Now
                  </a>
                </div>
              )}

              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  trackConversion('success_modal_continue');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg font-semibold transition-all"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {showChat ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl w-80 h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">AI Assistant</div>
                  <div className="text-xs text-green-400 flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                    Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-2 rounded-lg transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => {
              setShowChat(true);
              trackConversion('chat_opened');
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 animate-pulse"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;