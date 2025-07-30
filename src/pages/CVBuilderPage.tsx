import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CVForm } from '@/components/cv/CVForm';
import { CVPreview } from '@/components/cv/CVPreview';
import { TopNavigation } from '@/components/cv/TopNavigation';
import { CVData, defaultCVData, Education } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

// Interface for education API response
interface EducationApiResponse {
  id: string;
  institution: string;
  degree: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa?: number;
  honors?: string;
}

// Utility to escape LaTeX special characters
function escapeLatex(str: string) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function sanitizeCVData(cvData: CVData) {
  // Helper for date
  const fixDate = (d: string) => {
    if (!d) return '';
    if (d.length === 7) return d + '-01';
    return d;
  };
  return {
    ...cvData,
    save_content: {
      ...cvData.save_content,
      title: escapeLatex(cvData.save_content.title),
      experiences: (cvData.save_content.experiences || []).map((exp) => ({
        id: exp.id || null,
        job_title: escapeLatex(exp.jobTitle),
        position: escapeLatex(exp.position),
        company: escapeLatex(exp.company),
        company_url: escapeLatex(exp.companyUrl),
        company_logo: escapeLatex(exp.companyLogo),
        location: escapeLatex(exp.location),
        employment_type: escapeLatex(exp.employmentType),
        location_type: escapeLatex(exp.locationType),
        industry: escapeLatex(exp.industry),
        start_date: fixDate(exp.startDate),
        end_date: fixDate(exp.endDate),
        description: escapeLatex(exp.description),
      })),
      publications: (cvData.save_content.publications || []).map((pub) => ({
        id: pub.id || null,
        title: escapeLatex(pub.title),
        journal: escapeLatex(pub.journal),
        year: pub.year,
        urls: (pub.urls || []).map((url) => ({
          id: url.id || null,
          label: escapeLatex(url.label),
          url: escapeLatex(url.url),
          source_type: url.source_type || 'publication',
        })),
      })),
      technical_skills: (cvData.save_content.technical_skills || []).map((skill) => ({
        id: skill.id || null,
        name: escapeLatex(skill.name),
        category: escapeLatex(skill.category),
      })),
      projects: (cvData.save_content.projects || []).map((proj) => ({
        id: proj.id || null,
        name: escapeLatex(proj.name),
        description: escapeLatex(proj.description),
        technologies: (proj.technologies || []).map((tech) => ({
          id: tech.id || null,
          technology: escapeLatex(tech.technology || tech.name || ''),
        })),
        urls: (proj.urls || []).map((url) => ({
          id: url.id || null,
          label: escapeLatex(url.label),
          url: escapeLatex(url.url),
          source_type: url.source_type || 'project',
        })),
      })),
    },
  };
}

// Utility function to parse backend HTML into sections
function parseBackendSections(html: string) {
  if (!html) return {};
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections = Array.from(doc.querySelectorAll('section'));
  const result: { [key: string]: string } = {};
  const sectionNames = [
    'education',
    'experience',
    'projects',
    'technicalSkills',
    'publications',
    'certifications',
  ];
  sections.forEach((section, idx) => {
    result[sectionNames[idx] || `section${idx}`] = section.outerHTML;
  });
  const header = doc.querySelector('header');
  if (header) result.header = header.outerHTML;
  return result;
}

export const CVBuilderPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);
  const [backendHtmlPreview, setBackendHtmlPreview] = useState('');
  const [backendPreviewLoading, setBackendPreviewLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'react' | 'backend'>('react');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [backendSections, setBackendSections] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cvId = queryParams.get('cv_id');

  const handleSaveNewVersion = async () => {
    if (!currentUser) {
      alert('You must be logged in to save your CV.');
      return;
    }
    if (!cvId) {
      alert('No CV ID found.');
      return;
    }
    const idToken = await currentUser.getIdToken();
    const payload = {
      cv_id: Number(cvId),
      pdf_url: '',
      save_content: {
        ...cvData.save_content,
        experiences: (cvData.save_content.experiences || []).map((exp) => ({ ...exp, id: null })),
        publications: (cvData.save_content.publications || []).map((pub) => ({ ...pub, id: null })),
        technical_skills: (cvData.save_content.technical_skills || []).map((skill) => ({
          ...skill,
          id: null,
        })),
        projects: (cvData.save_content.projects || []).map((proj) => ({ ...proj, id: null })),
      },
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/cv/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast({ title: 'Success', description: 'CV version saved!' });
      } else {
        const errorText = await res.text();
        toast({
          title: 'Error',
          description: 'Failed to save CV: ' + errorText,
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Error saving CV', variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    console.log('Save button clicked');
    if (!currentUser) {
      alert('You must be logged in to save your CV.');
      setIsSaving(false);
      return;
    }
    if (!cvId) {
      alert('No CV ID found.');
      setIsSaving(false);
      return;
    }
    const idToken = await currentUser.getIdToken();
    const sanitized = sanitizeCVData(cvData);
    console.log('Sending save payload:', {
      cv_id: Number(cvId),
      pdf_url: '',
      save_content: sanitized.save_content,
    });
    const payload = {
      cv_id: Number(cvId),
      pdf_url: '',
      save_content: sanitized.save_content,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/cv/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });
      let responseJson;
      try {
        responseJson = await res.clone().json();
        console.log('Save API response:', responseJson);
      } catch (jsonErr) {
        console.log('Save API response (not JSON):', await res.text());
      }
      if (res.ok) {
        toast({ title: 'Success', description: 'CV saved!' });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        console.log('CV saved successfully');
      } else {
        const errorText = await res.text();
        toast({
          title: 'Error',
          description: 'Failed to save CV: ' + errorText,
          variant: 'destructive',
        });
        console.error('Failed to save CV:', errorText);
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Error saving CV', variant: 'destructive' });
      console.error('Error saving CV:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = async (templateOverride?: number) => {
    setPreviewLoading(true);
    setPreviewError('');
    setShowPreview(true);
    if (!currentUser || !cvId) {
      setPreviewError('You must be logged in and have a CV loaded to preview.');
      setPreviewLoading(false);
      return;
    }
    const idToken = await currentUser.getIdToken();
    const sanitized = sanitizeCVData(cvData);
    const payload: any = {
      cv_id: Number(cvId),
      draft_content: sanitized.save_content,
    };
    if (typeof templateOverride === 'number') {
      payload.template = templateOverride;
    } else if (previewTemplate !== null) {
      payload.template = previewTemplate;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/cv/render`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.html_content) {
        setPreviewHtml(data.html_content);
      } else {
        setPreviewError('Failed to render CV: ' + (data.detail || 'Unknown error'));
      }
    } catch (err) {
      setPreviewError('Error rendering CV');
      console.error('Error rendering CV:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Fetch backend preview (debounced)
  const fetchBackendPreview = async (cvDataOverride = null, templateOverride = null) => {
    setBackendPreviewLoading(true);
    const dataToSend = cvDataOverride || cvData;
    const templateToSend = templateOverride || cvData.template || 1;
    const sanitized = sanitizeCVData(dataToSend);
    const payload = {
      cv_id: Number(cvId),
      draft_content: sanitized.save_content,
      template: templateToSend,
    };
    const idToken = currentUser ? await currentUser.getIdToken() : undefined;
    const res = await fetch(`${API_BASE_URL}/api/v1/cv/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setBackendHtmlPreview(data.html_content || '');
    console.log('BACKEND_RENDERED_HTML:', data.html_content); // Print the full HTML to the console
    setBackendPreviewLoading(false);
  };

  // Fetch backend preview on load and on edit (debounced)
  useEffect(() => {
    if (!cvId) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchBackendPreview();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvData, cvId, cvData.template]);

  // Fetch backend preview immediately when template changes
  const handleTemplateChange = async (templateId: number) => {
    if (!currentUser || !cvId) return;
    // Update template in backend
    const idToken = await currentUser.getIdToken();
    await fetch(`${API_BASE_URL}/api/v1/cv/${cvId}/template`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ template: templateId }),
    });
    setCvData((prev) => ({ ...prev, template: templateId }));
    handlePreview(templateId); // Refresh preview with new template
    fetchBackendPreview(null, templateId); // Also refresh backend preview
  };

  // Fetch user profile and education data when component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      if (!currentUser || !cvId) {
        setIsProfileLoading(false);
        return;
      }
      try {
        // 1. Fetch CV data
        const idToken = await currentUser.getIdToken();
        const cvRes = await fetch(`${API_BASE_URL}/api/v1/cv/${cvId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        let cvDataFromApi = null;
        if (cvRes.ok) {
          cvDataFromApi = await cvRes.json();
          console.log('Fetched CV data:', cvDataFromApi);
        } else {
          const errorText = await cvRes.text();
          console.error('Failed to fetch CV data:', errorText);
        }

        // 2. Fetch profile and education data
        let profileData = null;
        let educationData = null;
        try {
          const profileResponse = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
          });
          if (profileResponse.ok) {
            profileData = await profileResponse.json();
          }
          const educationResponse = await fetch(`${API_BASE_URL}/api/v1/education`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
          });
          if (educationResponse.ok) {
            educationData = await educationResponse.json();
          }
        } catch (err) {
          console.warn('Failed to fetch profile or education:', err);
        }

        // 3. Merge data and setCvData
        setCvData((prev) => ({
          ...prev,
          save_content: {
            ...prev.save_content,
            // Use CV data for all fields except personalInfo and education
            title: cvDataFromApi?.title || 'Professional CV',
            experiences: (cvDataFromApi?.experiences || []).map((exp) => ({
              id: exp.id,
              jobTitle: exp.job_title,
              position: exp.position,
              company: exp.company,
              companyUrl: exp.company_url,
              companyLogo: exp.company_logo,
              location: exp.location,
              employmentType: exp.employment_type,
              locationType: exp.location_type,
              industry: exp.industry,
              startDate: exp.start_date,
              endDate: exp.end_date,
              description: exp.description,
            })),
            publications: (cvDataFromApi?.publications || []).map((pub) => ({
              id: pub.id,
              title: pub.title,
              journal: pub.journal,
              year: pub.year,
              urls: pub.urls || [],
            })),
            technical_skills: (cvDataFromApi?.technical_skills || []).map((skill) => ({
              id: skill.id,
              name: skill.name,
              category: skill.category,
            })),
            projects: (cvDataFromApi?.projects || []).map((proj) => ({
              id: proj.id,
              name: proj.name,
              description: proj.description,
              technologies: proj.technologies || [],
              urls: proj.urls || [],
            })),
            // Use profile/education API for these fields:
            personalInfo: profileData
              ? {
                  name: profileData?.full_name || '',
                  email: profileData?.email || '',
                  phone: profileData?.phone || '',
                  address: profileData?.address || '',
                }
              : prev.save_content.personalInfo,
            education: educationData
              ? educationData.map((edu) => ({
                  id: edu.id,
                  degree: edu.degree,
                  institution: edu.institution,
                  location: edu.location,
                  startDate: edu.start_date,
                  endDate: edu.end_date,
                  gpa: edu.gpa?.toString() || '',
                  honors: edu.honors || '',
                }))
              : prev.save_content.education,
          },
        }));
      } catch (err) {
        console.error('Error fetching all CV/profile/education data:', err);
      } finally {
        setIsProfileLoading(false);
      }
    };
    fetchAllData();
  }, [currentUser, cvId, API_BASE_URL]);

  useEffect(() => {
    if (backendHtmlPreview) {
      setBackendSections(parseBackendSections(backendHtmlPreview));
    }
  }, [backendHtmlPreview]);

  useEffect(() => {
    let styleEl, linkEl;
    if (previewMode === 'backend' && backendSections.style) {
      // Remove previous
      const prevStyle = document.getElementById('backend-template-style');
      if (prevStyle) prevStyle.remove();
      const prevLink = document.getElementById('backend-template-font');
      if (prevLink) prevLink.remove();

      // Extract @import
      const importMatch = backendSections.style.match(/@import url\(([^)]+)\);/);
      if (importMatch) {
        linkEl = document.createElement('link');
        linkEl.id = 'backend-template-font';
        linkEl.rel = 'stylesheet';
        linkEl.href = importMatch[1].replace(/['"]/g, '');
        document.head.appendChild(linkEl);
      }

      // Remove @import from style
      const css = backendSections.style
        .replace(/<style[^>]*>|<\/style>/g, '')
        .replace(/@import[^;]+;/, '');
      styleEl = document.createElement('style');
      styleEl.id = 'backend-template-style';
      styleEl.innerHTML = css;
      document.head.appendChild(styleEl);
    }
    return () => {
      const prevStyle = document.getElementById('backend-template-style');
      if (prevStyle) prevStyle.remove();
      const prevLink = document.getElementById('backend-template-font');
      if (prevLink) prevLink.remove();
    };
  }, [previewMode, backendSections.style]);

  const handleDataChange = (newData: Partial<CVData['save_content']>) => {
    setCvData((prev) => ({
      ...prev,
      save_content: { ...prev.save_content, ...newData },
    }));
  };

  const handleTitleChange = (title: string) => {
    handleDataChange({ title });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    console.log('Downloading CV as PDF...');
    if (!currentUser || !cvId) {
      alert('You must be logged in and have a CV loaded to download.');
      setIsDownloading(false);
      return;
    }
    const idToken = await currentUser.getIdToken();
    const sanitized = sanitizeCVData(cvData);
    console.log('Sanitized CV data for download:', sanitized);
    const payload = {
      cv_id: Number(cvId),
      draft_content: sanitized.save_content,
      force_regenerate: true,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/cv/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('CV generate response:', data);
      if (res.ok && data.pdf_url) {
        window.open(data.pdf_url, '_blank');
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2000);
      } else {
        alert('Failed to generate CV PDF: ' + (data.detail || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error generating CV PDF:', err);
      alert('Error generating CV PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    console.log('Opening share modal...');
    alert('Share functionality would be implemented here');
  };

  const handleVersions = () => {
    console.log('Opening versions panel...');
    alert('Version management would be available here');
  };

  const handleLayouts = () => {
    console.log('Opening layout selector...');
    alert('Layout templates would be available here');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-800">CV Builder</h1>
            <Button
              onClick={handlePreview}
              variant="secondary"
              size="sm"
              className="ml-2 font-bold shadow border border-purple-500 rounded-md px-4 py-1 transition-all duration-150 hover:bg-purple-100 hover:text-purple-800"
            >
              Preview
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              size="sm"
              className="ml-4 font-bold shadow border border-blue-500 rounded-md px-4 py-1 transition-all duration-150 hover:bg-blue-100 hover:text-blue-800"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </span>
              ) : saveSuccess ? (
                'Saved'
              ) : (
                'Save'
              )}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="ml-2 font-bold shadow border border-green-500 rounded-md px-4 py-1 transition-all duration-150 hover:bg-green-100 hover:text-green-800"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-green-700 border-t-transparent rounded-full"></span>
                  Downloading...
                </span>
              ) : downloadSuccess ? (
                'Downloaded'
              ) : (
                'Download'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Top Navigation */}
      <TopNavigation
        title={cvData.save_content.title}
        onTitleChange={handleTitleChange}
        onShare={handleShare}
        onTemplateChange={handleTemplateChange}
        currentTemplate={cvData.template || 1}
        isLoading={isLoading}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full w-full">
          <Panel
            defaultSize={50}
            minSize={20}
            maxSize={80}
            className="bg-white/80 backdrop-blur-sm border-r-2 border-blue-200 shadow-xl"
          >
            <div className="h-full overflow-y-auto">
              {isProfileLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Loading your profile and education information...
                    </p>
                  </div>
                </div>
              ) : (
                <CVForm data={cvData.save_content} onChange={handleDataChange} />
              )}
            </div>
          </Panel>
          <PanelResizeHandle className="bg-blue-200 hover:bg-blue-400 transition-colors duration-200" />
          <Panel
            defaultSize={50}
            minSize={20}
            maxSize={80}
            className="bg-gray-50/90 backdrop-blur-sm shadow-inner"
          >
            <div className="h-full overflow-y-auto">
              <div className="flex justify-end mb-2">
                <button
                  className={`px-3 py-1 rounded-l border ${previewMode === 'react' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
                  onClick={() => setPreviewMode('react')}
                >
                  Live Preview
                </button>
                <button
                  className={`px-3 py-1 rounded-r border-l-0 border ${previewMode === 'backend' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 border-purple-600'}`}
                  onClick={() => setPreviewMode('backend')}
                >
                  Template Preview
                </button>
              </div>
              {previewMode === 'react' ? (
                <CVPreview data={cvData.save_content} isLoading={isLoading} />
              ) : backendPreviewLoading ? (
                <div className="flex items-center justify-center h-full py-8 text-lg text-gray-400">
                  Loading template preview...
                </div>
              ) : (
                <iframe
                  title="Template Preview"
                  style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
                  srcDoc={backendHtmlPreview}
                />
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>CV Preview</DialogTitle>

            <DialogClose asChild>
              <Button variant="outline" className="absolute right-4 top-4">
                Close
              </Button>
            </DialogClose>
          </DialogHeader>
          {previewLoading ? (
            <div className="py-8 text-center">Loading preview...</div>
          ) : previewError ? (
            <div className="py-8 text-center text-red-500">{previewError}</div>
          ) : (
            <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
