import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  CheckCircle, 
  Download, 
  BarChart3, 
  Target, 
  Globe, 
  Users, 
  Zap,
  Droplets,
  Heart,
  GraduationCap,
  Scale,
  Building,
  Recycle,
  TreePine,
  Shield,
  Award,
  TrendingUp,
  ArrowRight,
  Info,
  X
} from 'lucide-react';

interface SDGItem {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: 'social' | 'environmental' | 'economic';
  criteria: string[];
  weight: number;
}

interface ChecklistResponse {
  sdgId: number;
  score: number; // 0-4 scale
  evidence: string;
  notes: string;
}

interface ESGScore {
  environmental: number;
  social: number;
  governance: number;
  overall: number;
  sdgAlignment: number;
}

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  companySize: string;
  industry: string;
  currentChallenges: string;
  budget: string;
  timeline: string;
}

const ESGChecklist: React.FC = () => {
  const [responses, setResponses] = useState<ChecklistResponse[]>([]);
  const [currentSDG, setCurrentSDG] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [esgScore, setESGScore] = useState<ESGScore | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Lead capture state
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadFormData, setLeadFormData] = useState<LeadFormData>({
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
  const [leadFormStep, setLeadFormStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const sdgData: SDGItem[] = [
    {
      id: 1,
      title: "No Poverty",
      description: "End poverty in all its forms everywhere",
      icon: Users,
      color: "from-red-500 to-red-600",
      category: 'social',
      criteria: [
        "Project creates employment opportunities",
        "Addresses income inequality",
        "Provides access to basic services",
        "Supports vulnerable populations"
      ],
      weight: 0.8
    },
    {
      id: 2,
      title: "Zero Hunger",
      description: "End hunger, achieve food security and improved nutrition",
      icon: Heart,
      color: "from-yellow-500 to-yellow-600",
      category: 'social',
      criteria: [
        "Improves food security",
        "Supports sustainable agriculture",
        "Reduces food waste",
        "Enhances nutrition access"
      ],
      weight: 0.7
    },
    {
      id: 3,
      title: "Good Health and Well-being",
      description: "Ensure healthy lives and promote well-being for all",
      icon: Heart,
      color: "from-green-500 to-green-600",
      category: 'social',
      criteria: [
        "Improves health outcomes",
        "Reduces health risks",
        "Promotes mental well-being",
        "Ensures healthcare access"
      ],
      weight: 0.9
    },
    {
      id: 4,
      title: "Quality Education",
      description: "Ensure inclusive and equitable quality education",
      icon: GraduationCap,
      color: "from-red-600 to-red-700",
      category: 'social',
      criteria: [
        "Enhances educational access",
        "Improves learning outcomes",
        "Supports skills development",
        "Promotes lifelong learning"
      ],
      weight: 0.8
    },
    {
      id: 5,
      title: "Gender Equality",
      description: "Achieve gender equality and empower all women and girls",
      icon: Scale,
      color: "from-orange-500 to-orange-600",
      category: 'social',
      criteria: [
        "Promotes gender equality",
        "Empowers women and girls",
        "Addresses gender-based discrimination",
        "Ensures equal opportunities"
      ],
      weight: 0.9
    },
    {
      id: 6,
      title: "Clean Water and Sanitation",
      description: "Ensure availability and sustainable management of water",
      icon: Droplets,
      color: "from-blue-500 to-blue-600",
      category: 'environmental',
      criteria: [
        "Improves water quality",
        "Ensures water access",
        "Promotes water conservation",
        "Enhances sanitation systems"
      ],
      weight: 0.8
    },
    {
      id: 7,
      title: "Affordable and Clean Energy",
      description: "Ensure access to affordable, reliable, sustainable energy",
      icon: Zap,
      color: "from-yellow-600 to-yellow-700",
      category: 'environmental',
      criteria: [
        "Promotes renewable energy",
        "Improves energy efficiency",
        "Ensures energy access",
        "Reduces carbon emissions"
      ],
      weight: 1.0
    },
    {
      id: 8,
      title: "Decent Work and Economic Growth",
      description: "Promote sustained, inclusive economic growth",
      icon: TrendingUp,
      color: "from-red-700 to-red-800",
      category: 'economic',
      criteria: [
        "Creates decent employment",
        "Promotes economic growth",
        "Supports entrepreneurship",
        "Ensures fair labor practices"
      ],
      weight: 0.9
    },
    {
      id: 9,
      title: "Industry, Innovation and Infrastructure",
      description: "Build resilient infrastructure, promote innovation",
      icon: Building,
      color: "from-orange-600 to-orange-700",
      category: 'economic',
      criteria: [
        "Develops sustainable infrastructure",
        "Promotes innovation",
        "Supports industrialization",
        "Enhances technological capacity"
      ],
      weight: 1.0
    },
    {
      id: 10,
      title: "Reduced Inequalities",
      description: "Reduce inequality within and among countries",
      icon: Scale,
      color: "from-pink-500 to-pink-600",
      category: 'social',
      criteria: [
        "Reduces income inequality",
        "Promotes social inclusion",
        "Addresses discrimination",
        "Ensures equal opportunities"
      ],
      weight: 0.8
    },
    {
      id: 11,
      title: "Sustainable Cities and Communities",
      description: "Make cities and human settlements inclusive and sustainable",
      icon: Building,
      color: "from-yellow-700 to-yellow-800",
      category: 'environmental',
      criteria: [
        "Promotes sustainable urbanization",
        "Improves urban planning",
        "Enhances community resilience",
        "Reduces environmental impact"
      ],
      weight: 0.9
    },
    {
      id: 12,
      title: "Responsible Consumption and Production",
      description: "Ensure sustainable consumption and production patterns",
      icon: Recycle,
      color: "from-yellow-800 to-yellow-900",
      category: 'environmental',
      criteria: [
        "Promotes sustainable consumption",
        "Reduces waste generation",
        "Improves resource efficiency",
        "Supports circular economy"
      ],
      weight: 1.0
    },
    {
      id: 13,
      title: "Climate Action",
      description: "Take urgent action to combat climate change",
      icon: Globe,
      color: "from-green-600 to-green-700",
      category: 'environmental',
      criteria: [
        "Reduces greenhouse gas emissions",
        "Enhances climate resilience",
        "Promotes climate adaptation",
        "Supports climate mitigation"
      ],
      weight: 1.2
    },
    {
      id: 14,
      title: "Life Below Water",
      description: "Conserve and sustainably use oceans and marine resources",
      icon: Droplets,
      color: "from-blue-600 to-blue-700",
      category: 'environmental',
      criteria: [
        "Protects marine ecosystems",
        "Reduces marine pollution",
        "Promotes sustainable fishing",
        "Conserves ocean resources"
      ],
      weight: 0.7
    },
    {
      id: 15,
      title: "Life on Land",
      description: "Protect, restore and promote sustainable use of ecosystems",
      icon: TreePine,
      color: "from-green-700 to-green-800",
      category: 'environmental',
      criteria: [
        "Protects terrestrial ecosystems",
        "Promotes biodiversity conservation",
        "Supports sustainable land use",
        "Prevents deforestation"
      ],
      weight: 0.8
    },
    {
      id: 16,
      title: "Peace, Justice and Strong Institutions",
      description: "Promote peaceful and inclusive societies",
      icon: Shield,
      color: "from-blue-700 to-blue-800",
      category: 'social',
      criteria: [
        "Promotes rule of law",
        "Ensures transparent governance",
        "Reduces corruption",
        "Protects human rights"
      ],
      weight: 0.9
    },
    {
      id: 17,
      title: "Partnerships for the Goals",
      description: "Strengthen means of implementation and global partnership",
      icon: Users,
      color: "from-blue-800 to-blue-900",
      category: 'economic',
      criteria: [
        "Promotes multi-stakeholder partnerships",
        "Enhances international cooperation",
        "Supports knowledge sharing",
        "Mobilizes resources for development"
      ],
      weight: 0.8
    }
  ];

  const scoreLabels = [
    { value: 0, label: "Not Applicable", description: "This SDG is not relevant to the project" },
    { value: 1, label: "Minimal Impact", description: "Project has very limited positive impact" },
    { value: 2, label: "Moderate Impact", description: "Project has some positive impact" },
    { value: 3, label: "Significant Impact", description: "Project has substantial positive impact" },
    { value: 4, label: "Transformative Impact", description: "Project creates transformative positive change" }
  ];

  const handleResponseChange = (sdgId: number, field: keyof ChecklistResponse, value: string | number) => {
    setResponses(prev => {
      const existing = prev.find(r => r.sdgId === sdgId);
      if (existing) {
        return prev.map(r => r.sdgId === sdgId ? { ...r, [field]: value } : r);
      } else {
        return [...prev, { sdgId, score: 0, evidence: '', notes: '', [field]: value }];
      }
    });
  };

  const getResponse = (sdgId: number): ChecklistResponse => {
    return responses.find(r => r.sdgId === sdgId) || { sdgId, score: 0, evidence: '', notes: '' };
  };

  const calculateESGScore = (): ESGScore => {
    const environmentalSDGs = sdgData.filter(sdg => sdg.category === 'environmental');
    const socialSDGs = sdgData.filter(sdg => sdg.category === 'social');
    const economicSDGs = sdgData.filter(sdg => sdg.category === 'economic'); // Used as governance proxy
    
    const calculateCategoryScore = (sdgs: SDGItem[]): number => {
      const totalWeight = sdgs.reduce((sum, sdg) => sum + sdg.weight, 0);
      const weightedScore = sdgs.reduce((sum, sdg) => {
        const response = getResponse(sdg.id);
        return sum + (response.score * sdg.weight);
      }, 0);
      
      return totalWeight > 0 ? (weightedScore / totalWeight) * 25 : 0; // Convert to 0-100 scale
    };

    const environmental = calculateCategoryScore(environmentalSDGs);
    const social = calculateCategoryScore(socialSDGs);
    const governance = calculateCategoryScore(economicSDGs); // Economic governance
    
    const overall = (environmental + social + governance) / 3;
    
    // Calculate SDG alignment percentage
    const totalResponses = responses.filter(r => r.score > 0).length;
    const sdgAlignment = (totalResponses / sdgData.length) * 100;

    return {
      environmental: Math.round(environmental),
      social: Math.round(social),
      governance: Math.round(governance),
      overall: Math.round(overall),
      sdgAlignment: Math.round(sdgAlignment)
    };
  };

  const handleComplete = () => {
    const score = calculateESGScore();
    setESGScore(score);
    setShowResults(true);
  };

  const nextSDG = () => {
    if (currentSDG < sdgData.length) setCurrentSDG(currentSDG + 1);
  };

  const prevSDG = () => {
    if (currentSDG > 1) setCurrentSDG(currentSDG - 1);
  };

  const getCompletionRate = (): number => {
    const completedResponses = responses.filter(r => r.score > 0 || r.evidence || r.notes).length;
    return (completedResponses / sdgData.length) * 100;
  };

  const getESGRating = (score: number): { rating: string; color: string; description: string } => {
    if (score >= 80) return { 
      rating: 'Excellent', 
      color: 'text-green-500', 
      description: 'Outstanding ESG performance with transformative impact' 
    };
    if (score >= 65) return { 
      rating: 'Good', 
      color: 'text-blue-500', 
      description: 'Strong ESG performance with significant positive impact' 
    };
    if (score >= 50) return { 
      rating: 'Fair', 
      color: 'text-yellow-500', 
      description: 'Moderate ESG performance with room for improvement' 
    };
    if (score >= 35) return { 
      rating: 'Needs Improvement', 
      color: 'text-orange-500', 
      description: 'Basic ESG consideration with significant gaps' 
    };
    return { 
      rating: 'Poor', 
      color: 'text-red-500', 
      description: 'Limited ESG integration requiring major improvements' 
    };
  };

  useEffect(() => {
    // Check for dark mode
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkMode);
  }, []);

  // Lead capture handlers
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
        source: 'esg_checklist',
        downloadRequested: true
      });
      
      // Simulate API success
      const response = { ok: true };
      
      if (response.ok) {
        // Generate download link
        const downloadUrl = `https://app.nextlevdecisions.com/downloads/esg-report-${Date.now()}.pdf?token=${btoa(leadFormData.email + Date.now())}`;
        setDownloadLink(downloadUrl);
        setShowSuccessModal(true);
        setShowLeadModal(false);
        
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
      alert('There was an error submitting your form. Please try again or contact us directly.');
    }
  };

  const nextFormStep = () => {
    if (leadFormStep < 3) setLeadFormStep(leadFormStep + 1);
  };

  const prevFormStep = () => {
    if (leadFormStep > 1) setLeadFormStep(leadFormStep - 1);
  };

  const handleDownloadReport = () => {
    setShowLeadModal(true);
  };

  const handleScheduleConsultation = () => {
    setShowLeadModal(true);
  };

  const currentSDGData = sdgData.find(sdg => sdg.id === currentSDG)!;

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              ESG Compliance Checklist
            </span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            17-point UN SDG alignment assessment with comprehensive scoring templates for sustainability reporting
          </p>
        </div>

        {!showResults ? (
          <div className={`rounded-2xl border p-8 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  SDG {currentSDG} of {sdgData.length}
                </span>
                <span className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {Math.round(getCompletionRate())}% Complete
                </span>
              </div>
              <div className={`w-full h-2 rounded-full transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${(currentSDG / sdgData.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current SDG */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${currentSDGData.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <currentSDGData.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    SDG {currentSDGData.id}: {currentSDGData.title}
                  </h2>
                  <p className={`text-lg mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {currentSDGData.description}
                  </p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                    currentSDGData.category === 'environmental' 
                      ? isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                      : currentSDGData.category === 'social'
                      ? isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                      : isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {currentSDGData.category.charAt(0).toUpperCase() + currentSDGData.category.slice(1)}
                  </div>
                </div>
              </div>

              {/* Assessment Criteria */}
              <div className={`p-4 rounded-lg border-l-4 transition-colors duration-300 ${
                isDarkMode 
                  ? `border-green-500 bg-green-900/20` 
                  : `border-green-500 bg-green-50`
              }`}>
                <h3 className={`font-semibold mb-3 flex items-center transition-colors duration-300 ${
                  isDarkMode ? 'text-green-300' : 'text-green-800'
                }`}>
                  <Target className="w-5 h-5 mr-2" />
                  Assessment Criteria
                </h3>
                <ul className="space-y-2">
                  {currentSDGData.criteria.map((criterion, index) => (
                    <li key={index} className={`flex items-center text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-green-200' : 'text-green-700'
                    }`}>
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact Score */}
              <div>
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Impact Assessment Score
                </label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {scoreLabels.map((scoreLabel) => (
                    <button
                      key={scoreLabel.value}
                      onClick={() => handleResponseChange(currentSDG, 'score', scoreLabel.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        getResponse(currentSDG).score === scoreLabel.value
                          ? isDarkMode
                            ? 'border-green-500 bg-green-900/30'
                            : 'border-green-500 bg-green-50'
                          : isDarkMode
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                      }`}
                    >
                      <div className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
                        getResponse(currentSDG).score === scoreLabel.value
                          ? 'text-green-500'
                          : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {scoreLabel.value}
                      </div>
                      <div className={`font-medium text-sm mb-1 transition-colors duration-300 ${
                        getResponse(currentSDG).score === scoreLabel.value
                          ? isDarkMode ? 'text-green-300' : 'text-green-700'
                          : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {scoreLabel.label}
                      </div>
                      <div className={`text-xs transition-colors duration-300 ${
                        getResponse(currentSDG).score === scoreLabel.value
                          ? isDarkMode ? 'text-green-400' : 'text-green-600'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {scoreLabel.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Supporting Evidence (Optional)
                </label>
                <textarea
                  value={getResponse(currentSDG).evidence}
                  onChange={(e) => handleResponseChange(currentSDG, 'evidence', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  rows={3}
                  placeholder="Describe specific evidence, metrics, or examples that support your impact assessment..."
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={getResponse(currentSDG).notes}
                  onChange={(e) => handleResponseChange(currentSDG, 'notes', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  rows={2}
                  placeholder="Any additional context, challenges, or opportunities related to this SDG..."
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevSDG}
                disabled={currentSDG === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentSDG === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode
                    ? 'border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                    : 'border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
                }`}
              >
                Previous SDG
              </button>
              
              <div className="flex space-x-3">
                {currentSDG < sdgData.length ? (
                  <button
                    onClick={nextSDG}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all"
                  >
                    Next SDG
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all flex items-center"
                  >
                    Complete Assessment
                    <BarChart3 className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            </div>

            {/* SDG Overview */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Assessment Progress
              </h3>
              <div className="grid grid-cols-6 md:grid-cols-9 lg:grid-cols-17 gap-2">
                {sdgData.map((sdg) => {
                  const response = getResponse(sdg.id);
                  const isCompleted = response.score > 0 || response.evidence || response.notes;
                  return (
                    <button
                      key={sdg.id}
                      onClick={() => setCurrentSDG(sdg.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                        currentSDG === sdg.id
                          ? `bg-gradient-to-br ${sdg.color} text-white ring-2 ring-offset-2 ring-white`
                          : isCompleted
                          ? isDarkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-800'
                          : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                      }`}
                      title={`SDG ${sdg.id}: ${sdg.title}`}
                    >
                      {sdg.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* ESG Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-800 to-blue-900 border-blue-700' 
                  : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <Globe className="w-8 h-8 text-blue-500" />
                  <span className={`text-sm font-medium px-2 py-1 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-200 text-blue-800'
                  }`}>
                    Overall
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {esgScore!.overall}
                </div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-200' : 'text-blue-700'
                }`}>
                  ESG Score
                </p>
                <div className={`text-xs mt-2 font-medium ${getESGRating(esgScore!.overall).color}`}>
                  {getESGRating(esgScore!.overall).rating}
                </div>
              </div>

              <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-green-800 to-green-900 border-green-700' 
                  : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <TreePine className="w-8 h-8 text-green-500" />
                  <span className={`text-sm font-medium px-2 py-1 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-200 text-green-800'
                  }`}>
                    Environmental
                  </span>
                </div>
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {esgScore!.environmental}
                </div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-green-200' : 'text-green-700'
                }`}>
                  Environmental Impact
                </p>
              </div>

              <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-800 to-purple-900 border-purple-700' 
                  : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-purple-500" />
                  <span className={`text-sm font-medium px-2 py-1 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-200 text-purple-800'
                  }`}>
                    Social
                  </span>
                </div>
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {esgScore!.social}
                </div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-700'
                }`}>
                  Social Impact
                </p>
              </div>

              <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-orange-800 to-orange-900 border-orange-700' 
                  : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <Shield className="w-8 h-8 text-orange-500" />
                  <span className={`text-sm font-medium px-2 py-1 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-200 text-orange-800'
                  }`}>
                    Governance
                  </span>
                </div>
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {esgScore!.governance}
                </div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-orange-200' : 'text-orange-700'
                }`}>
                  Governance Score
                </p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className={`rounded-2xl border p-8 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-blue-500" />
                ESG Assessment Results
              </h3>

              {/* Overall Rating */}
              <div className={`p-6 rounded-lg border-l-4 mb-6 transition-colors duration-300 ${
                esgScore!.overall >= 80 
                  ? isDarkMode ? 'border-green-500 bg-green-900/20' : 'border-green-500 bg-green-50'
                  : esgScore!.overall >= 65
                  ? isDarkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50'
                  : esgScore!.overall >= 50
                  ? isDarkMode ? 'border-yellow-500 bg-yellow-900/20' : 'border-yellow-500 bg-yellow-50'
                  : esgScore!.overall >= 35
                  ? isDarkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-500 bg-orange-50'
                  : isDarkMode ? 'border-red-500 bg-red-900/20' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-xl font-bold ${getESGRating(esgScore!.overall).color}`}>
                    {getESGRating(esgScore!.overall).rating} ESG Performance
                  </h4>
                  <div className={`text-3xl font-bold ${getESGRating(esgScore!.overall).color}`}>
                    {esgScore!.overall}/100
                  </div>
                </div>
                <p className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {getESGRating(esgScore!.overall).description}
                </p>
              </div>

              {/* SDG Alignment */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-500" />
                    UN SDG Alignment
                  </h4>
                  
                  <div className={`p-4 rounded-lg transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        SDGs Addressed
                      </span>
                      <span className="text-lg font-bold text-green-500">
                        {responses.filter(r => r.score > 0).length} of 17
                      </span>
                    </div>
                    <div className={`w-full h-3 rounded-full transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${esgScore!.sdgAlignment}%` }}
                      ></div>
                    </div>
                    <div className={`text-sm mt-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      {esgScore!.sdgAlignment}% SDG Coverage
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                    Impact Distribution
                  </h4>
                  
                  <div className="space-y-3">
                    {scoreLabels.slice(1).reverse().map((label) => {
                      const count = responses.filter(r => r.score === label.value).length;
                      const percentage = sdgData.length > 0 ? (count / sdgData.length) * 100 : 0;
                      
                      return (
                        <div key={label.value} className={`p-3 rounded-lg transition-colors duration-300 ${
                          isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-sm font-medium transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {label.label}
                            </span>
                            <span className={`text-sm font-bold transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>
                              {count} SDGs
                            </span>
                          </div>
                          <div className={`w-full h-2 rounded-full transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                          }`}>
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                label.value === 4 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                label.value === 3 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                label.value === 2 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                'bg-gradient-to-r from-orange-500 to-orange-600'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className={`mt-8 p-6 rounded-lg border-l-4 border-blue-500 transition-colors duration-300 ${
                isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                <h4 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-800'
                }`}>
                  <Info className="w-5 h-5 mr-2" />
                  Recommendations for Improvement
                </h4>
                <div className="space-y-2">
                  {esgScore!.overall < 80 && (
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-200' : 'text-blue-700'
                    }`}>
                      • Consider strengthening initiatives that address high-impact SDGs (Climate Action, Clean Energy, Gender Equality)
                    </p>
                  )}
                  {esgScore!.environmental < 70 && (
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-200' : 'text-blue-700'
                    }`}>
                      • Focus on environmental sustainability measures and carbon footprint reduction
                    </p>
                  )}
                  {esgScore!.social < 70 && (
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-200' : 'text-blue-700'
                    }`}>
                      • Enhance social impact through community engagement and inclusive practices
                    </p>
                  )}
                  {esgScore!.governance < 70 && (
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-200' : 'text-blue-700'
                    }`}>
                      • Strengthen governance frameworks and transparency measures
                    </p>
                  )}
                  {responses.filter(r => r.score > 0).length < 12 && (
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-200' : 'text-blue-700'
                    }`}>
                      • Explore opportunities to address additional SDGs for broader impact
                    </p>
                  )}
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-700'
                  }`}>
                    • Consider implementing comprehensive sustainability reporting frameworks
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-700'
                  }`}>
                    • Engage stakeholders in sustainability planning and decision-making processes
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowResults(false);
                  setCurrentSDG(1);
                }}
                className={`px-6 py-3 rounded-lg font-medium border transition-all ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
                }`}
              >
                Revise Assessment
              </button>
              
              <button 
                onClick={handleDownloadReport}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download ESG Report
              </button>
              
              <button 
                onClick={handleScheduleConsultation}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all flex items-center justify-center"
              >
                Schedule ESG Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Lead Capture Modal */}
        {showLeadModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl p-8 max-w-md w-full border relative animate-in zoom-in duration-300 shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <button
                onClick={() => setShowLeadModal(false)}
                className={`absolute top-4 right-4 transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Get Your ESG Report
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Download your comprehensive ESG assessment and schedule a consultation with our sustainability experts.
                </p>
              </div>

              <form onSubmit={handleLeadFormSubmit} className="space-y-4">
                {leadFormStep === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={leadFormData.firstName}
                          onChange={(e) => handleLeadFormChange('firstName', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={leadFormData.lastName}
                          onChange={(e) => handleLeadFormChange('lastName', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={leadFormData.email}
                        onChange={(e) => handleLeadFormChange('email', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={leadFormData.company}
                        onChange={(e) => handleLeadFormChange('company', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                        }`}
                      />
                    </div>
                  </>
                )}

                {leadFormStep === 2 && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={leadFormData.jobTitle}
                        onChange={(e) => handleLeadFormChange('jobTitle', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Company Size
                      </label>
                      <select
                        value={leadFormData.companySize}
                        onChange={(e) => handleLeadFormChange('companySize', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                        }`}
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Industry
                      </label>
                      <select
                        value={leadFormData.industry}
                        onChange={(e) => handleLeadFormChange('industry', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                        }`}
                      >
                        <option value="">Select industry</option>
                        <option value="technology">Technology</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="finance">Finance</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="retail">Retail</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                {leadFormStep === 3 && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Current Sustainability Challenges
                      </label>
                      <textarea
                        value={leadFormData.currentChallenges}
                        onChange={(e) => handleLeadFormChange('currentChallenges', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                        }`}
                        placeholder="Tell us about your current sustainability challenges..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Budget Range
                        </label>
                        <select
                          value={leadFormData.budget}
                          onChange={(e) => handleLeadFormChange('budget', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                          }`}
                        >
                          <option value="">Select budget range</option>
                          <option value="under-25k">Under $25K</option>
                          <option value="25k-50k">$25K - $50K</option>
                          <option value="50k-100k">$50K - $100K</option>
                          <option value="100k-250k">$100K - $250K</option>
                          <option value="250k+">$250K+</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Timeline
                        </label>
                        <select
                          value={leadFormData.timeline}
                          onChange={(e) => handleLeadFormChange('timeline', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                          }`}
                        >
                          <option value="">Select timeline</option>
                          <option value="immediate">Immediate</option>
                          <option value="1-3-months">1-3 months</option>
                          <option value="3-6-months">3-6 months</option>
                          <option value="6-12-months">6-12 months</option>
                          <option value="12+months">12+ months</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-4">
                  {leadFormStep > 1 && (
                    <button
                      type="button"
                      onClick={prevFormStep}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Previous
                    </button>
                  )}
                  
                  <div className="flex-1" />
                  
                  {leadFormStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextFormStep}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all flex items-center"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Get My ESG Report
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl p-8 max-w-md w-full border relative animate-in zoom-in duration-300 shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Success!
                </h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your comprehensive ESG report has been generated and is ready for download.
                </p>
                
                <div className="space-y-4">
                  <a
                    href={downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all text-center"
                  >
                    <Download className="w-5 h-5 inline mr-2" />
                    Download ESG Report
                  </a>
                  
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ESGChecklist;
