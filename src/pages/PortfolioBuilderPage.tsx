import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Save,
  Share,
  User,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Award,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Portfolio, portfolioTemplates } from '@/types/portfolio';
import { PersonalInfoSection } from '@/components/portfolio/PersonalInfoSection';
import { ExperienceSection } from '@/components/portfolio/ExperienceSection';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { EducationSection } from '@/components/portfolio/EducationSection';
import { SkillsSection } from '@/components/portfolio/SkillsSection';
import { CertificatesSection } from '@/components/portfolio/CertificatesSection';
import { PublicationsSection } from '@/components/portfolio/PublicationSection';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PortfolioBuilderPage = () => {
  const { portfolio_id } = useParams<{ portfolio_id: string }>();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Authentication verification - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access portfolio builder',
        variant: 'destructive',
      });
      navigate('/auth/login');
    }
  }, [currentUser, authLoading, navigate, toast]);

  // Load portfolio data
  // console.log('Loading portfolio with ID:', portfolio_id);
  // console.log('Current user:', currentUser);
  useEffect(() => {
    const loadPortfolio = async () => {
      if (!currentUser || !portfolio_id) return;

      try {
        const idToken = await currentUser.getIdToken();
        const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${portfolio_id}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPortfolio(data);
        } else {
          throw new Error('Portfolio not found');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading portfolio:', error);
        toast({
          title: 'Error',
          description: 'Failed to load portfolio',
          variant: 'destructive',
        });
        navigate('/portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && !authLoading) {
      loadPortfolio();
    }
  }, [portfolio_id, currentUser, authLoading, navigate, toast]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!currentUser) {
    return null;
  }

  // Show loading state while loading portfolio
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Portfolio not found</h1>
          <p className="text-gray-600 mb-6">
            The portfolio you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            permission to access it.
          </p>
          <Button onClick={() => navigate('/portfolio')}>Back to Portfolios</Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!portfolio || !currentUser) return;

    setSaving(true);
    try {
      const idToken = await currentUser.getIdToken();

      // Prepare form data similar to example.js
      const formData = new FormData();
      formData.append('portfolio_id', portfolio_id || '');
      formData.append('title', portfolio.title || '');
      formData.append('bio', portfolio.content?.personalInfo?.bio || '');

      // Convert experiences to the expected format
      const experiences = (portfolio.content?.experiences || []).map((exp) => {
        // Convert date formats from YYYY-MM to YYYY-MM-01 for backend compatibility
        const formatDate = (dateStr: string) => {
          if (!dateStr) return '';
          // If it's already in YYYY-MM-DD format, return as is
          if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
          // If it's in YYYY-MM format, add -01 for the first day of the month
          if (dateStr.match(/^\d{4}-\d{2}$/)) return `${dateStr}-01`;
          return dateStr;
        };

        return {
          job_title: exp.title,
          position: exp.title,
          company: exp.company,
          company_url: exp.companyUrl || '',
          company_logo: '', // Default empty value - could be added as a field later
          location: exp.location,
          employment_type: 'Full-time', // Default value
          location_type: 'Onsite', // Default value
          industry: exp.industry || 'Technology', // Use from experience or default
          start_date: formatDate(exp.startDate),
          end_date: exp.current ? '' : formatDate(exp.endDate),
          description: exp.description,
        };
      });
      formData.append('experiences', JSON.stringify(experiences));

      // Convert projects to the expected format
      const projects = (portfolio.content?.projects || []).map((project) => ({
        name: project.name,
        description: project.description,
        technologies: project.technologies.map((tech) => ({ technology: tech })),
        urls: [
          ...(project.githubUrl
            ? [{ label: 'GitHub', url: project.githubUrl, source_type: 'project' }]
            : []),
          ...(project.liveUrl
            ? [{ label: 'Live Demo', url: project.liveUrl, source_type: 'project' }]
            : []),
        ],
      }));
      formData.append('projects', JSON.stringify(projects));

      // Convert publications to the expected format
      const publications = (portfolio.content?.publications || []).map((pub) => {
        // Handle date formatting for publications
        const formatPublicationDate = (dateStr: string) => {
          if (!dateStr) return new Date().getFullYear();
          const date = new Date(dateStr);
          return isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear();
        };

        return {
          title: pub.title,
          journal: 'Journal', // Default value or you can add this field to the interface
          year: formatPublicationDate(pub.date),
          urls: pub.link
            ? [{ label: 'Publication', url: pub.link, source_type: 'publication' }]
            : [],
        };
      });
      formData.append('publications', JSON.stringify(publications));

      // Convert technical skills to the expected format
      const technicalSkills = (portfolio.content?.technical_skills || []).map((skill) => ({
        name: skill.name,
        category: skill.category,
      }));
      formData.append('technical_skills', JSON.stringify(technicalSkills));

      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/update`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Portfolio saved successfully!',
        });
      } else {
        throw new Error('Failed to save portfolio');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to save portfolio',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!portfolio || !currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/publish/${portfolio_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line no-console
        //  console.log('Publish response:', data);

        // Extract the published_url from the response
        const publishedUrlValue = data.published_url || data.shareableUrl;

        setPortfolio((prev) =>
          prev ? { ...prev, published: true, shareableUrl: publishedUrlValue } : null
        );

        setPublishedUrl(publishedUrlValue);
        setShareDialogOpen(true);

        toast({
          title: 'Success',
          description: 'Portfolio published successfully!',
        });
      } else {
        throw new Error('Failed to publish portfolio');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error publishing portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to publish portfolio',
        variant: 'destructive',
      });
    }
  };

  const updatePortfolioContent = (section: string, data: unknown) => {
    setPortfolio((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        content: {
          ...prev.content,
          [section]: data,
        },
      };
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Portfolio URL copied to clipboard',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy URL',
        variant: 'destructive',
      });
    }
  };

  const getFullPortfolioUrl = () => {
    const baseUrl = window.location.origin;
    return publishedUrl ? `${baseUrl}/p/${publishedUrl}` : '';
  };

  const currentTemplate = portfolioTemplates.find((t) => t.id === portfolio?.theme);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/portfolio')}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Portfolios</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {portfolio?.title || 'Untitled Portfolio'}
                </h1>
                <p className="text-sm text-gray-600 truncate">
                  Template: {currentTemplate?.name || 'Default'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 sm:flex-none"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
              >
                <Share className="h-4 w-4 mr-2" />
                {portfolio?.is_public ? 'Update' : 'Publish'}
              </Button>

              {/* Share Button - only show if portfolio is published */}
              {portfolio?.is_public && portfolio?.shareableUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPublishedUrl(portfolio.shareableUrl || '');
                    setShareDialogOpen(true);
                  }}
                  className="hidden sm:flex"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Tabs - Horizontal Scroll */}
          <div className="sm:hidden">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 mb-6 overflow-x-auto">
              <TabsTrigger
                value="personal"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs"
              >
                <User className="h-4 w-4" />
                <span>Contact</span>
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs"
              >
                <Briefcase className="h-4 w-4" />
                <span>Work</span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Projects</span>
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Education</span>
              </TabsTrigger>
            </TabsList>

            {/* Second row of tabs for mobile */}
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-6">
              <TabsTrigger
                value="skills"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs"
              >
                <Award className="h-4 w-4" />
                <span>Skills</span>
              </TabsTrigger>
              <TabsTrigger
                value="certificates"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs"
              >
                <Award className="h-4 w-4" />
                <span>Certificates</span>
              </TabsTrigger>
              <TabsTrigger
                value="publications"
                className="flex flex-col items-center gap-1 py-2 px-1 text-xs"
              >
                <Award className="h-4 w-4" />
                <span>Publications</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block">
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Info
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="certificates" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="publications" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Publications
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="space-y-6">
            <TabsContent value="personal">
              <PersonalInfoSection
                data={portfolio?.content?.personalInfo}
                onChange={(data) => updatePortfolioContent('personalInfo', data)}
              />
            </TabsContent>

            <TabsContent value="experience">
              <ExperienceSection
                data={portfolio?.content?.experiences}
                onChange={(data) => updatePortfolioContent('experiences', data)}
              />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsSection
                data={portfolio?.content?.projects}
                onChange={(data) => updatePortfolioContent('projects', data)}
              />
            </TabsContent>

            <TabsContent value="education">
              <EducationSection
                data={portfolio?.content?.education}
                onChange={(data) => updatePortfolioContent('education', data)}
                color={currentTemplate?.colors.background}
              />
            </TabsContent>

            <TabsContent value="publications">
              <PublicationsSection
                data={portfolio?.content?.publications}
                onChange={(data) => updatePortfolioContent('publications', data)}
              />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsSection
                data={portfolio?.content?.technical_skills}
                onChange={(data) => updatePortfolioContent('technical_skills', data)}
              />
            </TabsContent>

            <TabsContent value="certificates">
              <CertificatesSection
                data={portfolio?.content?.certificates}
                onChange={(data) => updatePortfolioContent('certificates', data)}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg">Share Your Portfolio</DialogTitle>
            <DialogDescription className="text-sm">
              Your portfolio has been published! Share this link with others to showcase your work.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="portfolio-link" className="sr-only">
                Portfolio Link
              </Label>
              <Input
                id="portfolio-link"
                defaultValue={getFullPortfolioUrl()}
                readOnly
                className="h-9 text-sm"
              />
            </div>
            <Button
              size="sm"
              className="px-3 shrink-0"
              onClick={() => copyToClipboard(getFullPortfolioUrl())}
            >
              <span className="sr-only">Copy</span>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => window.open(getFullPortfolioUrl(), '_blank')}
              className="w-full sm:w-auto"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Portfolio
            </Button>
            <Button onClick={() => setShareDialogOpen(false)} className="w-full sm:w-auto">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
