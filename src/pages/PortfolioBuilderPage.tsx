import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Save,
  Eye,
  Share,
  Settings,
  User,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Award,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Portfolio, defaultPortfolioContent, portfolioTemplates } from '@/types/portfolio';
import { PersonalInfoSection } from '@/components/portfolio/PersonalInfoSection';
import { ExperienceSection } from '@/components/portfolio/ExperienceSection';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { EducationSection } from '@/components/portfolio/EducationSection';
import { SkillsSection } from '@/components/portfolio/SkillsSection';
import { CertificatesSection } from '@/components/portfolio/CertificatesSection';
import { SocialLinksSection } from '@/components/portfolio/SocialLinksSection';
import { ThemeSection } from '@/components/portfolio/ThemeSection';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PortfolioBuilderPage = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Load portfolio data
  useEffect(() => {
    const loadPortfolio = async () => {
      if (!currentUser || !portfolioId) return;

      try {
        const idToken = await currentUser.getIdToken();
        const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${portfolioId}`, {
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

    loadPortfolio();
  }, [portfolioId, currentUser, navigate, toast]);

  const handleSave = async () => {
    if (!portfolio || !currentUser) return;

    setSaving(true);
    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          title: portfolio.title,
          theme: portfolio.theme,
          content: portfolio.content,
        }),
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

  const handlePreview = () => {
    navigate(`/portfolio/preview/${portfolioId}`);
  };

  const handlePublish = async () => {
    if (!portfolio || !currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${portfolioId}/publish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolio((prev) =>
          prev ? { ...prev, published: true, shareableUrl: data.shareableUrl } : null
        );
        toast({
          title: 'Success',
          description: 'Portfolio published successfully!',
        });
      } else {
        throw new Error('Failed to publish portfolio');
      }
    } catch (error) {
      console.error('Error publishing portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to publish portfolio',
        variant: 'destructive',
      });
    }
  };

  const updatePortfolioContent = (section: string, data: any) => {
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

  const updateTheme = (themeId: string) => {
    setPortfolio((prev) => (prev ? { ...prev, theme: themeId } : null));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-jobathon-600"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Portfolio not found</h1>
          <Button onClick={() => navigate('/portfolio')}>Back to Portfolios</Button>
        </div>
      </div>
    );
  }

  const currentTemplate = portfolioTemplates.find((t) => t.id === portfolio.theme);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/portfolio')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portfolios
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{portfolio.title}</h1>
                <p className="text-sm text-gray-600">Template: {currentTemplate?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                className="bg-jobathon-600 hover:bg-jobathon-700"
              >
                <Share className="h-4 w-4 mr-2" />
                {portfolio.published ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal
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
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Theme
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <PersonalInfoSection
              data={portfolio.content.personalInfo}
              onChange={(data) => updatePortfolioContent('personalInfo', data)}
            />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceSection
              data={portfolio.content.experiences}
              onChange={(data) => updatePortfolioContent('experiences', data)}
            />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsSection
              data={portfolio.content.projects}
              onChange={(data) => updatePortfolioContent('projects', data)}
            />
          </TabsContent>

          <TabsContent value="education">
            <EducationSection
              data={portfolio.content.education}
              onChange={(data) => updatePortfolioContent('education', data)}
            />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsSection
              data={portfolio.content.skills}
              onChange={(data) => updatePortfolioContent('skills', data)}
            />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificatesSection
              data={portfolio.content.certificates}
              onChange={(data) => updatePortfolioContent('certificates', data)}
            />
          </TabsContent>

          <TabsContent value="social">
            <SocialLinksSection
              data={portfolio.content.socialLinks}
              onChange={(data) => updatePortfolioContent('socialLinks', data)}
            />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeSection currentTheme={portfolio.theme} onChange={updateTheme} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
