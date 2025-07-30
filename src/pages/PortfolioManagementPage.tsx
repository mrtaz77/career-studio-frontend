import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit,
  Share,
  Trash2,
  Globe,
  Calendar,
  ArrowLeft,
  Star,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Portfolio, portfolioTemplates } from '@/types/portfolio';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PortfolioManagementPage = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [creating, setCreating] = useState(false);

  // Fetch portfolios
  const fetchPortfolios = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/list`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const portfolios = await response.json();
        // console.log('Fetched portfolios:', portfolios);
        setPortfolios(portfolios || []);
      }
    } catch (error) {
      // Console error for debugging - will be replaced with proper logging in production
      // eslint-disable-next-line no-console
      console.error('Error fetching portfolios:', error);
      toast({
        title: 'Error',
        description: 'Failed to load portfolios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser, toast]);

  // Authentication verification - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access portfolio management',
        variant: 'destructive',
      });
      navigate('/auth/login');
    }
  }, [currentUser, authLoading, navigate, toast]);

  useEffect(() => {
    if (currentUser) {
      fetchPortfolios();
    }
  }, [currentUser, fetchPortfolios]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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

  const handleCreatePortfolio = async () => {
    if (!selectedTemplate) {
      toast({
        title: 'Template Required',
        description: 'Please select a portfolio template to continue',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          theme: selectedTemplate,
        }),
      });

      if (response.ok) {
        const newPortfolio = await response.json();
        // eslint-disable-next-line no-console
        // console.log('New portfolio created:', newPortfolio);
        toast({
          title: 'Portfolio Created!',
          description: "Your new portfolio has been created successfully. Let's build it!",
        });
        setShowCreateDialog(false);
        setSelectedTemplate('');
        navigate(`/portfolio/builder/${newPortfolio?.portfolio_id}`);
      } else {
        throw new Error('Failed to create portfolio');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating portfolio:', error);
      toast({
        title: 'Creation Failed',
        description: 'Unable to create portfolio. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleEditPortfolio = (portfolio_id: string) => {
    navigate(`/portfolio/builder/${portfolio_id}`);
  };

  const handleSharePortfolio = async (portfolio: Portfolio) => {
    if (portfolio.shareableUrl) {
      await navigator.clipboard.writeText(portfolio.shareableUrl);
      toast({
        title: 'Link Copied!',
        description: 'Portfolio sharing link has been copied to your clipboard',
      });
    } else {
      toast({
        title: 'Not Published',
        description: 'Portfolio must be published first to generate a shareable link',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePortfolio = async (portfolio_id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this portfolio? This action cannot be undone.'
      )
    )
      return;

    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/unpublish/${portfolio_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        await fetchPortfolios(); // Refresh the list

        toast({
          title: 'Portfolio Deleted',
          description: 'Portfolio has been successfully deleted',
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting portfolio:', error);
      toast({
        title: 'Deletion Failed',
        description: 'Unable to delete portfolio. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-96"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Portfolio Studio</h1>
              </div>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Create, customize, and share your professional portfolios with the world. Showcase
                your skills, projects, and achievements in style.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Professional Templates
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Mobile Responsive
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Share className="h-3 w-3 mr-1" />
                  Easy Sharing
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto order-1 sm:order-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Portfolio
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Portfolios</p>
                  <p className="text-2xl font-bold text-gray-900">{portfolios.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {portfolios.filter((p) => p.is_public === true).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {portfolios.filter((p) => !p.is_public).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Grid */}
        {portfolios.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
            <CardContent className="py-16 px-6">
              <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Create Your First Portfolio?
                </h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Start building your professional online presence with our beautiful, customizable
                  portfolio templates. Showcase your work and attract opportunities.
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {portfolios.map((portfolio) => (
              <Card
                key={portfolio.id}
                className="bg-white/70 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                        {portfolio.title || 'Untitled Portfolio'}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 mt-1">
                        Theme: {portfolio.theme || 'Default'} •{' '}
                        <span className="ml-1">
                          {portfolio.is_public ? (
                            <span className="text-green-600 font-medium">Published</span>
                          ) : (
                            <span className="text-orange-600 font-medium">Draft</span>
                          )}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant={portfolio.is_public ? 'default' : 'secondary'} className="ml-2">
                      {portfolio.is_public ? 'Live' : 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created {new Date(portfolio.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditPortfolio(portfolio.id!)}
                      className="flex-1 sm:flex-none"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>

                    {portfolio?.is_public && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSharePortfolio(portfolio)}
                        className="flex-1 sm:flex-none"
                      >
                        <Share className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    )}

                    {portfolio?.is_public && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePortfolio(portfolio.id!)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Unpublish
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Portfolio Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">Create Your New Portfolio</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Choose a professional template that best represents your style and industry. You can
                customize everything later in the portfolio builder.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <Label className="text-base font-medium">Choose Your Template</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Each template is fully customizable and mobile-responsive
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md mb-3 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20"></div>
                        <span className="text-xs text-gray-600 relative z-10">
                          Template Preview
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {template.layout}
                        </Badge>
                        {selectedTemplate === template.id && (
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePortfolio}
                  disabled={creating || !selectedTemplate}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto order-1 sm:order-2"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Portfolio...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Portfolio
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
