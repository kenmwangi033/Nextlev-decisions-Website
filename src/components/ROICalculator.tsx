import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock, 
  Users, 
  BarChart3,
  Download,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  X
} from 'lucide-react';

interface CalculatorInputs {
  // Company Information
  companySize: string;
  industry: string;
  annualRevenue: number;
  
  // Current State
  currentProjects: number;
  averageProjectValue: number;
  currentSuccessRate: number;
  decisionTimeWeeks: number;
  teamSize: number;
  
  // Costs
  averageHourlyCost: number;
  failedProjectCost: number;
  
  // Goals
  targetSuccessRate: number;
  targetDecisionTime: number;
}

interface ROIResults {
  // Current State Costs
  currentDecisionCost: number;
  currentFailureCost: number;
  currentTotalCost: number;
  
  // Improved State
  improvedDecisionCost: number;
  improvedFailureCost: number;
  improvedTotalCost: number;
  
  // Savings & ROI
  annualSavings: number;
  timeSavings: number;
  productivityGain: number;
  roiPercentage: number;
  paybackMonths: number;
  
  // Industry Benchmarks
  industryBenchmark: {
    averageROI: number;
    averagePayback: number;
    averageImprovement: number;
  };
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

const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    companySize: '',
    industry: '',
    annualRevenue: 10000000,
    currentProjects: 12,
    averageProjectValue: 250000,
    currentSuccessRate: 65,
    decisionTimeWeeks: 8,
    teamSize: 15,
    averageHourlyCost: 125,
    failedProjectCost: 150000,
    targetSuccessRate: 85,
    targetDecisionTime: 2
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
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

  // Industry benchmarks and multipliers
  const industryData = {
    'technology': { multiplier: 1.2, avgROI: 340, avgPayback: 8, avgImprovement: 45 },
    'healthcare': { multiplier: 1.1, avgROI: 280, avgPayback: 10, avgImprovement: 38 },
    'financial': { multiplier: 1.3, avgROI: 420, avgPayback: 6, avgImprovement: 52 },
    'manufacturing': { multiplier: 1.0, avgROI: 250, avgPayback: 12, avgImprovement: 35 },
    'energy': { multiplier: 1.1, avgROI: 290, avgPayback: 14, avgImprovement: 40 },
    'retail': { multiplier: 0.9, avgROI: 210, avgPayback: 16, avgImprovement: 30 },
    'consulting': { multiplier: 1.4, avgROI: 380, avgPayback: 9, avgImprovement: 48 },
    'other': { multiplier: 1.0, avgROI: 250, avgPayback: 12, avgImprovement: 35 }
  };

  const companySizeMultipliers = {
    '1-50': 0.8,
    '51-200': 1.0,
    '201-1000': 1.2,
    '1000-5000': 1.4,
    '5000+': 1.6
  };

  const calculateROI = (): ROIResults => {
    const industryInfo = industryData[inputs.industry as keyof typeof industryData] || industryData.other;
    const sizeMultiplier = companySizeMultipliers[inputs.companySize as keyof typeof companySizeMultipliers] || 1.0;
    
    // Current state calculations
    const currentDecisionHours = inputs.decisionTimeWeeks * 40 * inputs.teamSize;
    const currentDecisionCost = currentDecisionHours * inputs.averageHourlyCost * inputs.currentProjects;
    
    const currentFailureRate = (100 - inputs.currentSuccessRate) / 100;
    const currentFailureCost = inputs.currentProjects * currentFailureRate * inputs.failedProjectCost;
    
    const currentTotalCost = currentDecisionCost + currentFailureCost;
    
    // Improved state calculations (with NextLev)
    const improvedDecisionHours = inputs.targetDecisionTime * 40 * inputs.teamSize;
    const improvedDecisionCost = improvedDecisionHours * inputs.averageHourlyCost * inputs.currentProjects;
    
    const improvedFailureRate = (100 - inputs.targetSuccessRate) / 100;
    const improvedFailureCost = inputs.currentProjects * improvedFailureRate * inputs.failedProjectCost;
    
    const improvedTotalCost = improvedDecisionCost + improvedFailureCost;
    
    // Savings calculations
    const annualSavings = (currentTotalCost - improvedTotalCost) * industryInfo.multiplier * sizeMultiplier;
    const timeSavings = (inputs.decisionTimeWeeks - inputs.targetDecisionTime) * inputs.currentProjects;
    const productivityGain = (inputs.targetSuccessRate - inputs.currentSuccessRate) / 100 * inputs.currentProjects;
    
  // Calculate ROI based on savings potential
  const roiPercentage = annualSavings > 0 ? ((annualSavings - 50000) / 50000) * 100 : 0; // Assume baseline implementation cost
  const paybackMonths = annualSavings > 0 ? (50000 / (annualSavings / 12)) : 12; // Baseline payback calculation
    
    return {
      currentDecisionCost,
      currentFailureCost,
      currentTotalCost,
      improvedDecisionCost,
      improvedFailureCost,
      improvedTotalCost,
      annualSavings,
      timeSavings,
      productivityGain,
      roiPercentage,
      paybackMonths,
      industryBenchmark: {
        averageROI: industryInfo.avgROI,
        averagePayback: industryInfo.avgPayback,
        averageImprovement: industryInfo.avgImprovement
      }
    };
  };

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCalculate = () => {
    const calculatedResults = calculateROI();
    setResults(calculatedResults);
    setShowResults(true);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

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
        source: 'roi_calculator',
        downloadRequested: true
      });
      
      // Simulate API success
      const response = { ok: true };
      
      if (response.ok) {
        // Generate download link
        const downloadUrl = `https://app.nextlevdecisions.com/downloads/roi-report-${Date.now()}.pdf?token=${btoa(leadFormData.email + Date.now())}`;
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

  const handleScheduleDemo = () => {
    setShowLeadModal(true);
  };

  useEffect(() => {
    // Check for dark mode
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkMode);
  }, []);

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              ROI Calculator
            </span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Calculate your potential savings and ROI with NextLev's AI-powered decision intelligence platform
          </p>
        </div>

        {!showResults ? (
          <div className={`rounded-2xl border p-8 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Step {currentStep} of 4
                </span>
                <span className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {Math.round((currentStep / 4) * 100)}% Complete
                </span>
              </div>
              <div className={`w-full h-2 rounded-full transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-blue-500" />
                  Company Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Company Size
                    </label>
                    <select
                      value={inputs.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    >
                      <option value="">Select company size</option>
                      <option value="1-50">1-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1,000 employees</option>
                      <option value="1000-5000">1,000-5,000 employees</option>
                      <option value="5000+">5,000+ employees</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Industry
                    </label>
                    <select
                      value={inputs.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      required
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology & Software</option>
                      <option value="healthcare">Healthcare & Life Sciences</option>
                      <option value="financial">Financial Services</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="energy">Energy & Utilities</option>
                      <option value="retail">Retail & Consumer</option>
                      <option value="consulting">Consulting & Professional Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Annual Revenue (USD)
                    </label>
                    <input
                      type="number"
                      value={inputs.annualRevenue}
                      onChange={(e) => handleInputChange('annualRevenue', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="10000000"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Current Project State */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-blue-500" />
                  Current Project Performance
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Projects per Year
                    </label>
                    <input
                      type="number"
                      value={inputs.currentProjects}
                      onChange={(e) => handleInputChange('currentProjects', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Average Project Value (USD)
                    </label>
                    <input
                      type="number"
                      value={inputs.averageProjectValue}
                      onChange={(e) => handleInputChange('averageProjectValue', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Current Success Rate (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.currentSuccessRate}
                      onChange={(e) => handleInputChange('currentSuccessRate', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Decision Time (Weeks)
                    </label>
                    <input
                      type="number"
                      value={inputs.decisionTimeWeeks}
                      onChange={(e) => handleInputChange('decisionTimeWeeks', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min="1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Team & Costs */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <DollarSign className="w-6 h-6 mr-3 text-blue-500" />
                  Team & Cost Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Decision Team Size
                    </label>
                    <input
                      type="number"
                      value={inputs.teamSize}
                      onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Average Hourly Cost (USD)
                    </label>
                    <input
                      type="number"
                      value={inputs.averageHourlyCost}
                      onChange={(e) => handleInputChange('averageHourlyCost', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min="0"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Cost of Failed Project (USD)
                    </label>
                    <input
                      type="number"
                      value={inputs.failedProjectCost}
                      onChange={(e) => handleInputChange('failedProjectCost', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min="0"
                    />
                    <p className={`text-sm mt-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Include opportunity cost, sunk costs, and resources wasted on failed initiatives
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Improvement Goals */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-blue-500" />
                  Improvement Goals with NextLev
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Target Success Rate (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.targetSuccessRate}
                      onChange={(e) => handleInputChange('targetSuccessRate', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min={inputs.currentSuccessRate}
                      max="100"
                    />
                    <p className={`text-sm mt-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      NextLev clients typically achieve 85-95% success rates
                    </p>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Target Decision Time (Weeks)
                    </label>
                    <input
                      type="number"
                      value={inputs.targetDecisionTime}
                      onChange={(e) => handleInputChange('targetDecisionTime', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min="1"
                      max={inputs.decisionTimeWeeks}
                    />
                    <p className={`text-sm mt-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      AI-powered decisions typically reduce time by 60-80%
                    </p>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border-l-4 border-blue-500 transition-colors duration-300 ${
                  isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                }`}>
                  <div className="flex">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className={`font-medium mb-1 transition-colors duration-300 ${
                        isDarkMode ? 'text-blue-300' : 'text-blue-800'
                      }`}>
                        NextLev Success Factors
                      </h4>
                      <p className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-blue-200' : 'text-blue-700'
                      }`}>
                        Our AI-powered platform typically helps organizations achieve 20-60% improvement in success rates 
                        and 60-80% reduction in decision time through advanced scoring, predictive analytics, and real-time insights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode
                    ? 'border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                    : 'border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
                }`}
              >
                Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!inputs.companySize || !inputs.industry)) ||
                    (currentStep === 2 && (!inputs.currentProjects || !inputs.currentSuccessRate))
                  }
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleCalculate}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all flex items-center"
                >
                  Calculate ROI
                  <Calculator className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-green-800 to-green-900 border-green-700' 
                  : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <span className={`text-sm font-medium px-2 py-1 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-200 text-green-800'
                  }`}>
                    Annual
                  </span>
                </div>
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {formatCurrency(results!.annualSavings)}
                </div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-green-200' : 'text-green-700'
                }`}>
                  Total Annual Savings
                </p>
              </div>

              <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-800 to-blue-900 border-blue-700' 
                  : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                  <span className={`text-sm font-medium px-2 py-1 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-200 text-blue-800'
                  }`}>
                    ROI
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {Math.round(results!.roiPercentage)}%
                </div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-200' : 'text-blue-700'
                }`}>
                  Return on Investment
                </p>
              </div>

              <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-800 to-purple-900 border-purple-700' 
                  : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-purple-500" />
                  <span className={`text-sm font-medium px-2 py-1 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-200 text-purple-800'
                  }`}>
                    Payback
                  </span>
                </div>
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {Math.round(results!.paybackMonths)} mo
                </div>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-700'
                }`}>
                  Payback Period
                </p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className={`rounded-2xl border p-8 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className="text-2xl font-bold mb-6">Detailed ROI Analysis</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current vs Improved State */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                    Current State vs NextLev Impact
                  </h4>
                  
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Decision-Making Costs
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={`transition-colors duration-300 ${
                          isDarkMode ? 'text-red-400' : 'text-red-600'
                        }`}>
                          Current: {formatCurrency(results!.currentDecisionCost)}
                        </span>
                        <span className={`transition-colors duration-300 ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          With NextLev: {formatCurrency(results!.improvedDecisionCost)}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Project Failure Costs
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={`transition-colors duration-300 ${
                          isDarkMode ? 'text-red-400' : 'text-red-600'
                        }`}>
                          Current: {formatCurrency(results!.currentFailureCost)}
                        </span>
                        <span className={`transition-colors duration-300 ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          With NextLev: {formatCurrency(results!.improvedFailureCost)}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border-l-4 border-green-500 transition-colors duration-300 ${
                      isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-green-300' : 'text-green-800'
                        }`}>
                          Total Annual Savings
                        </span>
                        <span className={`text-xl font-bold transition-colors duration-300 ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          {formatCurrency(results!.annualSavings)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Improvements */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Performance Improvements
                  </h4>
                  
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Success Rate Improvement
                        </span>
                        <span className="text-lg font-bold text-green-500">
                          +{inputs.targetSuccessRate - inputs.currentSuccessRate}%
                        </span>
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        From {inputs.currentSuccessRate}% to {inputs.targetSuccessRate}%
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Time Savings per Year
                        </span>
                        <span className="text-lg font-bold text-blue-500">
                          {formatNumber(results!.timeSavings)} weeks
                        </span>
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        {Math.round((inputs.decisionTimeWeeks - inputs.targetDecisionTime) / inputs.decisionTimeWeeks * 100)}% faster decisions
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Additional Successful Projects
                        </span>
                        <span className="text-lg font-bold text-purple-500">
                          +{Math.round(results!.productivityGain)}
                        </span>
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        More projects delivered successfully
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Key Insights */}
            <div className={`mt-8 p-6 rounded-lg border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-blue-900/20 border-blue-700' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Key Performance Insights
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-1">
                    {Math.round(results!.roiPercentage)}%
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-700'
                  }`}>
                    Your ROI
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-300 ${
                    results!.roiPercentage > 300 ? 'text-green-500' : 
                    results!.roiPercentage > 200 ? 'text-blue-500' : 'text-orange-500'
                  }`}>
                    {results!.roiPercentage > 300 ? 'Excellent' : 
                     results!.roiPercentage > 200 ? 'Good' : 'Moderate'} Performance
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-1">
                    {Math.round(results!.paybackMonths)}
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-700'
                  }`}>
                    Payback (months)
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-300 ${
                    results!.paybackMonths < 6 ? 'text-green-500' : 
                    results!.paybackMonths < 12 ? 'text-blue-500' : 'text-orange-500'
                  }`}>
                    {results!.paybackMonths < 6 ? 'Fast' : 
                     results!.paybackMonths < 12 ? 'Moderate' : 'Extended'} Recovery
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-1">
                    +{inputs.targetSuccessRate - inputs.currentSuccessRate}%
                  </div>
                  <div className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-700'
                  }`}>
                    Success Improvement
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-300 ${
                    (inputs.targetSuccessRate - inputs.currentSuccessRate) > 20 ? 'text-green-500' : 
                    (inputs.targetSuccessRate - inputs.currentSuccessRate) > 10 ? 'text-blue-500' : 'text-orange-500'
                  }`}>
                    {(inputs.targetSuccessRate - inputs.currentSuccessRate) > 20 ? 'Significant' : 
                     (inputs.targetSuccessRate - inputs.currentSuccessRate) > 10 ? 'Moderate' : 'Basic'} Impact
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowResults(false);
                  setCurrentStep(1);
                }}
                className={`px-6 py-3 rounded-lg font-medium border transition-all ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
                }`}
              >
                Recalculate
              </button>
              
              <button 
                onClick={handleDownloadReport}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Full Report
              </button>
              
              <button 
                onClick={handleScheduleDemo}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all flex items-center justify-center"
              >
                Schedule Demo
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Get Your Detailed ROI Report
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Download your personalized ROI analysis and schedule a consultation with our experts.
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
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
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
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
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
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
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
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
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
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
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
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
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
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
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
                        Current Decision-Making Challenges
                      </label>
                      <textarea
                        value={leadFormData.currentChallenges}
                        onChange={(e) => handleLeadFormChange('currentChallenges', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                        placeholder="Tell us about your current decision-making challenges..."
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
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
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
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
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
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all flex items-center"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Get My Report
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
                  Your detailed ROI report has been generated and is ready for download.
                </p>
                
                <div className="space-y-4">
                  <a
                    href={downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all text-center"
                  >
                    <Download className="w-5 h-5 inline mr-2" />
                    Download Report
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

export default ROICalculator;
