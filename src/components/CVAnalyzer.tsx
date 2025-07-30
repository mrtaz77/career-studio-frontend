import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  TrendingUp,
  Target,
  Search,
  Layout,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Angular Gauge Component
const AngularGauge = ({ score, title, icon: Icon, colorClass }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'; // green-500
    if (score >= 60) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  const getScoreTextColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Half circle
  const strokeProgress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className={`h-5 w-5 ${colorClass}`} />
        <h3 className="font-semibold text-gray-900 text-center">{title}</h3>
      </div>

      <div className="relative">
        <svg width={size} height={size / 2 + 20} className="overflow-visible">
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={`${strokeProgress} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              transformOrigin: 'center',
            }}
          />
        </svg>

        {/* Score text in center */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ top: '20%' }}
        >
          <span className={`text-3xl font-bold ${getScoreTextColor(score)}`}>{score}</span>
          <span className="text-xs text-gray-500 mt-1">/ 100</span>
        </div>
      </div>
    </div>
  );
};

// Markdown-style content renderer
const AnalysisSection = ({ title, content, type = 'text' }) => {
  if (!content) return null;

  const renderContent = () => {
    if (type === 'list' && Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside space-y-2">
          {content.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    if (type === 'skills' && Array.isArray(content)) {
      return (
        <div className="flex flex-wrap gap-2">
          {content.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {skill}
            </span>
          ))}
        </div>
      );
    }

    if (type === 'missing-skills' && Array.isArray(content)) {
      return (
        <div className="flex flex-wrap gap-2">
          {content.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
            >
              {skill}
            </span>
          ))}
        </div>
      );
    }

    return <p className="text-gray-700 leading-relaxed">{content}</p>;
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
        {title}
      </h3>
      {renderContent()}
    </div>
  );
};

const CVAnalyzer = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisDone, setAnalysisDone] = useState(false);
  const { currentUser } = useAuth();

  // Dummy upload progress simulation (fast)
  const simulateUpload = (cb) => {
    setIsUploading(true);
    setUploadProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(100);
        cb();
      }
    }, 60);
  };

  // Dummy analysis progress simulation (slow, stops at 95% until response)
  const simulateAnalysis = async (file) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisDone(false);
    let progress = 0;
    let interval = setInterval(() => {
      if (progress < 95) {
        progress += 5;
        setAnalysisProgress(progress);
      } else {
        clearInterval(interval);
      }
    }, 120);

    try {
      const formData = new FormData();
      formData.append('file', file);

      let idToken = '';
      if (currentUser) {
        idToken = await currentUser.getIdToken();
      }

      fetch(`${API_BASE_URL}/api/v1/ai/analyze`, {
        method: 'POST',
        headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined,
        body: formData,
      })
        .then(async (res) => {
          const data = await res.json();
          setAnalysisResult(data);
          setAnalysisDone(true);
          setAnalysisProgress(100);
          setIsAnalyzing(false);
        })
        .catch(() => {
          setAnalysisResult({ error: 'Failed to analyze CV.' });
          setAnalysisDone(true);
          setAnalysisProgress(100);
          setIsAnalyzing(false);
        });
    } catch (err) {
      setAnalysisResult({ error: 'Failed to analyze CV.' });
      setAnalysisDone(true);
      setAnalysisProgress(100);
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc'))
    ) {
      setAnalysisResult(null);
      simulateUpload(() => setUploadedFile(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (
      file &&
      (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc'))
    ) {
      setAnalysisResult(null);
      simulateUpload(() => setUploadedFile(file));
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    setAnalysisResult(null);
    setAnalysisDone(false);
    simulateAnalysis(uploadedFile);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setIsUploading(false);
    setIsAnalyzing(false);
    setUploadProgress(0);
    setAnalysisProgress(0);
    setAnalysisDone(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Analyzer</h1>
        <p className="text-gray-600">
          Upload your CV (PDF or DOCX) for comprehensive analysis and feedback.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
        {!uploadedFile ? (
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Your CV</h2>
              <p className="text-gray-500">Supported formats: PDF, DOCX</p>
            </div>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <UploadCloud className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <div className="mb-4">
                <p className="text-lg text-gray-600 mb-2">Drag and drop your CV here, or</p>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                    browse to upload
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-400">Maximum file size: 8MB</p>
            </div>
            {isUploading && (
              <div className="mt-6">
                <div className="text-sm text-gray-500 mb-1">Uploading...</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="mt-8 text-center text-gray-500">
              <p>Your CV will be analyzed for structure, keywords, and formatting.</p>
              <p>Detailed feedback will be provided once analysis is complete.</p>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{uploadedFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
            {isAnalyzing && (
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">Analyzing...</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || analysisDone}
                className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                style={{ minWidth: '120px' }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
              <button
                onClick={resetUpload}
                className="flex-1 min-w-[120px] px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                style={{ minWidth: '120px' }}
              >
                Upload New
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResult && !analysisResult.error && (
        <div className="space-y-8">
          {/* Score Gauges in 2x2 grid with borders */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Performance Scores</h2>
            <div className="grid grid-cols-2 gap-0">
              {/* Top Left */}
              <div className="border-r border-b border-gray-200 p-8 h-48 flex justify-center items-center">
                <AngularGauge
                  score={analysisResult.resume_score}
                  title="Overall Score"
                  icon={TrendingUp}
                  colorClass="text-blue-600"
                />
              </div>
              {/* Top Right */}
              <div className="border-b border-gray-200 p-8 h-48 flex justify-center items-center">
                <AngularGauge
                  score={analysisResult.ats_score}
                  title="ATS Score"
                  icon={Target}
                  colorClass="text-green-600"
                />
              </div>
              {/* Bottom Left */}
              <div className="border-r border-gray-200 p-8 h-48 flex justify-center items-center">
                <AngularGauge
                  score={analysisResult.keyword_match_score}
                  title="Keyword Match"
                  icon={Search}
                  colorClass="text-yellow-600"
                />
              </div>
              {/* Bottom Right */}
              <div className="p-8 h-48 flex justify-center items-center">
                <AngularGauge
                  score={analysisResult.formatting_score}
                  title="Formatting"
                  icon={Layout}
                  colorClass="text-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
              Detailed Analysis
            </h2>

            <div className="space-y-8">
              <AnalysisSection
                title="📋 Overall Assessment"
                content={analysisResult.overall_assessment}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <AnalysisSection
                    title="💪 Strengths"
                    content={analysisResult.strengths}
                    type="list"
                  />
                </div>
                <div>
                  <AnalysisSection
                    title="🎯 Areas for Improvement"
                    content={analysisResult.weaknesses}
                    type="list"
                  />
                </div>
              </div>

              <AnalysisSection
                title="🛠️ Technical Skills"
                content={analysisResult.skills}
                type="skills"
              />

              <AnalysisSection
                title="❗ Missing Skills"
                content={analysisResult.missing_skills}
                type="missing-skills"
              />

              <AnalysisSection
                title="💼 Experience Summary"
                content={analysisResult.experience_summary}
              />

              <AnalysisSection
                title="🎓 Education Summary"
                content={analysisResult.education_summary}
              />

              <AnalysisSection
                title="📝 Recommendations"
                content={analysisResult.recommended_courses}
                type="list"
              />
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {analysisResult && analysisResult.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Analysis Error</h3>
          </div>
          <p className="text-red-700 mt-2">{analysisResult.error}</p>
        </div>
      )}
    </div>
  );
};

export default CVAnalyzer;
