import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, Share, Trash2, ExternalLink, Globe, Calendar } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PortfolioManagementPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch portfolios
  const fetchPortfolios = async () => {
    if (!currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/list`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolios(data.portfolios || []);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast({
        title: 'Error',
        description: 'Failed to load portfolios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [currentUser]);

  const handleCreatePortfolio = async () => {
    if (!newPortfolioTitle.trim() || !selectedTemplate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
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
          title: newPortfolioTitle,
          description: newPortfolioDescription,
          theme: selectedTemplate,
        }),
      });

      if (response.ok) {
        const newPortfolio = await response.json();
        toast({
          title: 'Success',
          description: 'Portfolio created successfully!',
        });
        setShowCreateDialog(false);
        setNewPortfolioTitle('');
        setNewPortfolioDescription('');
        setSelectedTemplate('');
        // Navigate to portfolio builder
        navigate(`/portfolio/builder/${newPortfolio.id}`);
      } else {
        throw new Error('Failed to create portfolio');
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to create portfolio',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleEditPortfolio = (portfolioId: string) => {
    navigate(`/portfolio/builder/${portfolioId}`);
  };

  const handlePreviewPortfolio = (portfolioId: string) => {
    navigate(`/portfolio/preview/${portfolioId}`);
  };

  const handleSharePortfolio = async (portfolio: Portfolio) => {
    if (portfolio.shareableUrl) {
      await navigator.clipboard.writeText(portfolio.shareableUrl);
      toast({
        title: 'Link copied!',
        description: 'Portfolio link has been copied to clipboard',
      });
    } else {
      toast({
        title: 'Not published',
        description: 'Portfolio must be published to get a shareable link',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;

    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${portfolioId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        setPortfolios((prev) => prev.filter((p) => p.id !== portfolioId));
        toast({
          title: 'Success',
          description: 'Portfolio deleted successfully',
        });
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete portfolio',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Portfolios</h1>
            <p className="text-gray-600">Create and manage your professional portfolios</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-jobathon-600 hover:bg-jobathon-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Portfolio
          </Button>
        </div>

        {/* Portfolio Grid */}
        {portfolios.length === 0 ? (
          <Card className="py-16">
            <CardContent className="text-center">
              <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No portfolios yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first portfolio to showcase your work
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-jobathon-600 hover:bg-jobathon-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Portfolio
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg truncate">{portfolio.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Updated {new Date(portfolio.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={portfolio.published ? 'default' : 'secondary'}>
                      {portfolio.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Portfolio Preview */}
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Portfolio Preview</span>
                  </div>

                  {/* Portfolio Info */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Theme:{' '}
                      {portfolioTemplates.find((t) => t.id === portfolio.theme)?.name || 'Custom'}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPortfolio(portfolio.id!)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewPortfolio(portfolio.id!)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSharePortfolio(portfolio)}
                        className="flex-1"
                        disabled={!portfolio.published}
                      >
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePortfolio(portfolio.id!)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {portfolio.shareableUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(portfolio.shareableUrl, '_blank')}
                        className="w-full text-jobathon-600"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Live
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
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Choose a template and provide basic information for your portfolio
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Portfolio Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Portfolio Title *</Label>
                  <Input
                    id="title"
                    value={newPortfolioTitle}
                    onChange={(e) => setNewPortfolioTitle(e.target.value)}
                    placeholder="My Professional Portfolio"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPortfolioDescription}
                    onChange={(e) => setNewPortfolioDescription(e.target.value)}
                    placeholder="Brief description of your portfolio"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <Label className="text-base font-medium">Choose a Template *</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Select a template that best fits your style
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {portfolioTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? 'border-jobathon-600 bg-jobathon-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md mb-3 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Template Preview</span>
                      </div>
                      <h4 className="font-semibold text-sm">{template.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {template.layout}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Button */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePortfolio}
                  disabled={creating || !newPortfolioTitle.trim() || !selectedTemplate}
                  className="bg-jobathon-600 hover:bg-jobathon-700"
                >
                  {creating ? 'Creating...' : 'Create Portfolio'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
