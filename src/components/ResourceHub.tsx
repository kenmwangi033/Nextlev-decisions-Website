import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Calculator, 
  FileText, 
  Leaf,
  ArrowRight,
  CheckCircle,
  X,
  Clock,
  Star,
  TrendingUp,
  Shield,
  Globe,
  ExternalLink
} from 'lucide-react';
import ROICalculatorTeaser from './ROICalculatorTeaser';
import SDGChecklistTeaser from './SDGChecklistTeaser';

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  companySize: string;
  industry: string;
  resourceType: string;
}

const ResourceHub: React.FC = () => {
  const [activeResource, setActiveResource] = useState<'hub' | 'roi-calculator' | 'esg-checklist' | 'ai-guide'>('hub');
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [leadFormData, setLeadFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    companySize: '',
    industry: '',
    resourceType: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);


  const resources = [
    {
      id: 'ai-framework-guide',
      icon: FileText,
      title: "Free AI Decision Framework Guide",
      subtitle: "47-Page Complete Implementation Guide",
      description: "Master AI-powered decision making with our comprehensive guide covering the NextLev 6-Category Framework, 50+ AI criteria, and enterprise implementation strategies.",
      value: "$297 Value - Free Today",
      features: [
        "6-Category Scoring System with 50+ AI Criteria",
        "Complete ESG integration with 17 UN SDGs",
        "Industry-specific applications and case studies",
        "90-day implementation roadmap",
        "Templates, checklists, and practical tools",
        "Real client success stories and ROI analysis"
      ],
      cta: "Download Free Guide",
      color: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-800 to-blue-900",
      borderColor: "border-blue-700",
      type: 'download' as const
    },
    {
      id: 'roi-calculator',
      icon: Calculator,
      title: "ROI Calculator Preview",
      subtitle: "Quick Financial Impact Assessment",
      description: "Get a taste of your potential savings and ROI in under 2 minutes. Our lightweight preview tool shows instant results with confidence ratings and industry benchmarks.",
      value: "2-Minute Preview",
      features: [
        "3-step quick assessment process",
        "Industry & company size selection",
        "Instant ROI calculation with confidence rating",
        "Visual results with savings breakdown",
        "Lead capture for detailed analysis",
        "Professional blue theme with animations"
      ],
      cta: "Try Quick Calculator",
      color: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-800 to-blue-900",
      borderColor: "border-blue-700",
      type: 'interactive' as const
    },
    {
      id: 'esg-checklist',
      icon: Leaf,
      title: "SDG Compliance Check",
      subtitle: "Quick Sustainability Assessment",
      description: "See where you stand on sustainability in under 2 minutes. Our preview tool assesses Environmental, Social, and Governance dimensions with visual results and UN SDG alignment scoring.",
      value: "2-Minute Check",
      features: [
        "3-category quick assessment (Env/Soc/Gov)",
        "Interactive sliders with visual feedback",
        "Circular progress chart with overall score",
        "UN SDG alignment percentage",
        "Lead capture for full 17-goal report",
        "Professional green theme with animations"
      ],
      cta: "Try Quick Assessment",
      color: "from-green-500 to-green-600",
      bgGradient: "from-green-800 to-green-900",
      borderColor: "border-green-700",
      type: 'interactive' as const
    }
  ];

  const handleResourceAccess = (resourceId: string, type: 'download' | 'interactive') => {
    if (type === 'interactive') {
      if (resourceId === 'roi-calculator') {
        setActiveResource('roi-calculator');
        try { if (window && window.location) window.location.hash = 'roi'; } catch {}
      } else if (resourceId === 'esg-checklist') {
        setActiveResource('esg-checklist');
        try { if (window && window.location) window.location.hash = 'sdg'; } catch {}
      }
    } else {
      setSelectedResource(resourceId);
      setLeadFormData(prev => ({ ...prev, resourceType: resourceId }));
      setShowLeadCapture(true);
    }
  };

  const handleLeadFormChange = (field: keyof LeadFormData, value: string) => {
    setLeadFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLeadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // For demo purposes, we'll simulate successful form submission
      // In production, integrate with your actual CRM/backend
      console.log('Lead captured (Demo Mode):', {
        ...leadFormData,
        timestamp: new Date().toISOString(),
        source: 'resource_hub',
        downloadRequested: true
      });
      
      // Simulate API success
      const response = { ok: true };

      if (response.ok) {
        // Generate download link based on resource type
        let downloadUrl = '';
        switch (selectedResource) {
          case 'ai-framework-guide':
            downloadUrl = `/downloads/nextlev-ai-decision-framework-guide.pdf?token=${btoa(leadFormData.email + Date.now())}`;
            break;
          default:
            downloadUrl = `/downloads/${selectedResource}.pdf?token=${btoa(leadFormData.email + Date.now())}`;
        }
        
        setDownloadLink(downloadUrl);
        setShowSuccessModal(true);
        setShowLeadCapture(false);
        
        // Reset form
        setLeadFormData({
          firstName: '', lastName: '', email: '', company: '', jobTitle: '',
          companySize: '', industry: '', resourceType: ''
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again or contact us directly.');
    }
  };

  useEffect(() => {
    // Check for dark mode
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkMode);
    
    // Deep link via hash: #roi or #sdg
    const hash = window.location.hash?.toLowerCase();
    if (hash === '#roi') {
      setActiveResource('roi-calculator');
    } else if (hash === '#sdg') {
      setActiveResource('esg-checklist');
    }
  }, []);

  if (activeResource === 'roi-calculator') {
    return (
      <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => {
                setActiveResource('hub');
                if (window && window.location) {
                  window.location.hash = 'resources';
                }
              }}
              className={`flex items-center text-sm font-medium transition-colors ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              ← Back to Resource Hub
            </button>
          </div>
          <ROICalculatorTeaser 
            onLeadCapture={() => {
              setSelectedResource('roi-calculator');
              setLeadFormData(prev => ({ ...prev, resourceType: 'roi-calculator' }));
              setShowLeadCapture(true);
            }}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    );
  }

  if (activeResource === 'esg-checklist') {
    return (
      <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => {
                setActiveResource('hub');
                if (window && window.location) {
                  window.location.hash = 'resources';
                }
              }}
              className={`flex items-center text-sm font-medium transition-colors ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              ← Back to Resource Hub
            </button>
          </div>
          <SDGChecklistTeaser 
            onLeadCapture={() => {
              setSelectedResource('esg-checklist');
              setLeadFormData(prev => ({ ...prev, resourceType: 'esg-checklist' }));
              setShowLeadCapture(true);
            }}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Download className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Free <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Decision Intelligence</span> Resources
          </h1>
          <p className={`text-xl max-w-3xl mx-auto mb-8 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-800'
          }`}>
            Try our lightweight preview tools instantly or download comprehensive guides. Get valuable insights in under 2 minutes with no signup required.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8 opacity-60">
            <div className={`text-sm font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              Trusted by Fortune 500
            </div>
            <div className={`text-sm font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              500+ Enterprises
            </div>
            <div className={`text-sm font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              $2.4M Avg Savings
            </div>
            <div className={`text-sm font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-700'
            }`}>
              94.7% Success Rate
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {resources.map((resource) => (
            <div 
              key={resource.id} 
              className={`group relative rounded-2xl border p-8 transition-all duration-300 hover:transform hover:scale-105 ${
                isDarkMode 
                  ? `bg-gradient-to-br ${resource.bgGradient} ${resource.borderColor} hover:border-opacity-70` 
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Value Badge */}
              <div className={`absolute top-4 right-4 bg-gradient-to-r ${resource.color} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                {resource.value}
              </div>
              
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <resource.icon className="w-8 h-8 text-white" />
              </div>
              
              {/* Content */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{resource.title}</h3>
                <p className={`text-sm font-medium mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  {resource.subtitle}
                </p>
                <p className={`text-base leading-relaxed mb-6 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  {resource.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {resource.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-start text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <CheckCircle className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* CTA Button */}
              <button 
                onClick={() => handleResourceAccess(resource.id, resource.type)}
                className={`w-full bg-gradient-to-r ${resource.color} hover:opacity-90 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center group-hover:shadow-lg`}
              >
                {resource.cta}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Social Proof Section */}
        <div className={`rounded-2xl border p-8 mb-16 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Trusted by Industry Leaders
            </h2>
            <p className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join hundreds of organizations that have transformed their decision-making
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">500+</div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Enterprise Clients
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">$2.4M</div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Average Annual Savings
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">94.7%</div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                AI Prediction Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { 
              icon: TrendingUp, 
              title: "Improve Success Rates", 
              description: "40-60% improvement in project success rates",
              color: "text-green-500"
            },
            { 
              icon: Clock, 
              title: "Faster Decisions", 
              description: "60-80% reduction in decision-making time",
              color: "text-blue-500"
            },
            { 
              icon: Shield, 
              title: "Risk Mitigation", 
              description: "Comprehensive risk assessment and management",
              color: "text-orange-500"
            },
            { 
              icon: Globe, 
              title: "ESG Compliance", 
              description: "Complete UN SDG integration and reporting",
              color: "text-emerald-500"
            }
          ].map((benefit, index) => (
            <div key={index} className={`text-center p-6 rounded-xl border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <benefit.icon className={`w-8 h-8 ${benefit.color} mx-auto mb-4`} />
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className={`text-sm flex items-center justify-center transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Shield className="w-4 h-4 mr-2" />
            No credit card required • Instant access • Used by 500+ enterprises • Enterprise security
          </p>
        </div>
      </div>

      {/* Lead Capture Modal */}
      {showLeadCapture && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl p-8 max-w-md w-full border relative animate-in zoom-in duration-300 shadow-2xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <button 
              onClick={() => setShowLeadCapture(false)}
              className={`absolute top-4 right-4 transition-colors ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Get Your Free Resource</h3>
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Access your selected resource instantly by providing your details below
              </p>
            </div>

            <form onSubmit={handleLeadFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="First Name*" 
                  value={leadFormData.firstName}
                  onChange={(e) => handleLeadFormChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Last Name*" 
                  value={leadFormData.lastName}
                  onChange={(e) => handleLeadFormChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <input 
                type="email" 
                placeholder="Business Email*" 
                value={leadFormData.email}
                onChange={(e) => handleLeadFormChange('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Company*" 
                  value={leadFormData.company}
                  onChange={(e) => handleLeadFormChange('company', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Job Title" 
                  value={leadFormData.jobTitle}
                  onChange={(e) => handleLeadFormChange('jobTitle', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <select 
                value={leadFormData.companySize}
                onChange={(e) => handleLeadFormChange('companySize', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Company Size</option>
                <option value="1-50">1-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1,000 employees</option>
                <option value="1000+">1,000+ employees</option>
              </select>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 rounded-lg font-semibold transition-all text-white flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Get Free Access Now
              </button>
            </form>

            <p className={`text-xs mt-4 text-center transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No spam. Unsubscribe anytime. Your data is secure and protected.
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl p-8 max-w-md w-full border relative animate-in zoom-in duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className={`absolute top-4 right-4 transition-colors ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Success!</h3>
              <p className={`mb-6 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Your resource is ready! Check your email for additional materials and next steps.
              </p>
              
              {downloadLink && (
                <div className={`p-4 rounded-lg border-l-4 border-green-500 mb-6 transition-colors duration-300 ${
                  isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                }`}>
                  <h4 className={`font-semibold mb-2 flex items-center transition-colors duration-300 ${
                    isDarkMode ? 'text-green-300' : 'text-green-800'
                  }`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Instant Access Available
                  </h4>
                  <a
                    href={downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Now
                  </a>
                </div>
              )}

              <button 
                onClick={() => setShowSuccessModal(false)}
                className={`w-full py-3 rounded-lg font-semibold transition-all border ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
                }`}
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceHub;
