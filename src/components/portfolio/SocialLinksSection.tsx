import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Trash2,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  ExternalLink,
} from 'lucide-react';
import { PortfolioSocialLink } from '@/types/portfolio';

interface SocialLinksSectionProps {
  data: PortfolioSocialLink[];
  onChange: (data: PortfolioSocialLink[]) => void;
}

const socialPlatforms = [
  { id: 'website', name: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
  { id: 'github', name: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    placeholder: 'https://linkedin.com/in/username',
  },
  { id: 'twitter', name: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username' },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    placeholder: 'https://instagram.com/username',
  },
];

export const SocialLinksSection = ({ data, onChange }: SocialLinksSectionProps) => {
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const addSocialLink = () => {
    if (!newPlatform || !newUrl) return;

    const platform = socialPlatforms.find((p) => p.id === newPlatform);
    const newLink: PortfolioSocialLink = {
      id: Date.now().toString(),
      platform: newPlatform,
      url: newUrl,
      icon: platform?.id || 'external-link',
    };

    onChange([...data, newLink]);
    setNewPlatform('');
    setNewUrl('');
  };

  const updateSocialLink = (id: string, field: keyof PortfolioSocialLink, value: string) => {
    const updated = data.map((link) => (link.id === id ? { ...link, [field]: value } : link));
    onChange(updated);
  };

  const removeSocialLink = (id: string) => {
    onChange(data.filter((link) => link.id !== id));
  };

  const getIcon = (platform: string) => {
    const platformData = socialPlatforms.find((p) => p.id === platform);
    const IconComponent = platformData?.icon || ExternalLink;
    return <IconComponent className="h-4 w-4" />;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Social Links ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new social link */}
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="font-medium mb-4">Add Social Link</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <select
                id="platform"
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jobathon-500"
              >
                <option value="">Select platform</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={
                  newPlatform
                    ? socialPlatforms.find((p) => p.id === newPlatform)?.placeholder ||
                      'https://example.com'
                    : 'Select platform first'
                }
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={addSocialLink}
                disabled={!newPlatform || !newUrl}
                className="w-full bg-jobathon-600 hover:bg-jobathon-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        </div>

        {/* Existing social links */}
        <div className="space-y-3">
          {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No social links added yet</p>
              <p className="text-sm">Add your professional and social media profiles</p>
            </div>
          ) : (
            data.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {getIcon(link.platform)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {socialPlatforms.find((p) => p.id === link.platform)?.name || link.platform}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Input
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id!, 'url', e.target.value)}
                        placeholder="https://example.com"
                        className={`text-sm ${
                          link.url && !isValidUrl(link.url)
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                      />
                      {link.url && !isValidUrl(link.url) && (
                        <p className="text-xs text-red-600 mt-1">Please enter a valid URL</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {link.url && isValidUrl(link.url) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(link.url, '_blank')}
                      className="text-jobathon-600 hover:text-jobathon-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSocialLink(link.id!)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {data.length > 0 && (
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Tip:</strong> These links will be displayed prominently on your portfolio to
            help visitors connect with you across different platforms.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
