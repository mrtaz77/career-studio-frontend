import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';
import { PortfolioTheme } from '@/types/portfolio';

interface ThemeSectionProps {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
}

const themes: PortfolioTheme[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Clean and professional with blue accents',
    preview: 'bg-gradient-to-br from-blue-500 to-blue-700',
    layout: 'professional',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA',
      background: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    description: 'Sophisticated design with purple gradients',
    preview: 'bg-gradient-to-br from-purple-500 to-purple-700',
    layout: 'creative',
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA',
      background: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    id: 'minimalist-gray',
    name: 'Minimalist Gray',
    description: 'Simple and clean monochromatic design',
    preview: 'bg-gradient-to-br from-gray-500 to-gray-700',
    layout: 'minimal',
    colors: {
      primary: '#6B7280',
      secondary: '#4B5563',
      accent: '#9CA3AF',
      background: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    id: 'vibrant-green',
    name: 'Vibrant Green',
    description: 'Fresh and energetic with green highlights',
    preview: 'bg-gradient-to-br from-green-500 to-green-700',
    layout: 'creative',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      background: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    description: 'Creative and energetic with orange tones',
    preview: 'bg-gradient-to-br from-orange-500 to-red-600',
    layout: 'creative',
    colors: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FB923C',
      background: '#FFFFFF',
      text: '#1F2937',
    },
  },
  {
    id: 'dark-mode',
    name: 'Dark Professional',
    description: 'Sleek dark theme for modern professionals',
    preview: 'bg-gradient-to-br from-gray-800 to-gray-900',
    layout: 'professional',
    colors: {
      primary: '#60A5FA',
      secondary: '#3B82F6',
      accent: '#93C5FD',
      background: '#111827',
      text: '#F9FAFB',
    },
  },
];

export const ThemeSection = ({ selectedTheme, onThemeChange }: ThemeSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Choose Theme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg ${
                selectedTheme === theme.id
                  ? 'border-jobathon-500 ring-2 ring-jobathon-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onThemeChange(theme.id)}
            >
              {/* Theme Preview */}
              <div className={`h-32 ${theme.preview} relative`}>
                <div className="absolute inset-0 bg-black/10" />
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                    <Check className="h-4 w-4 text-jobathon-600" />
                  </div>
                )}

                {/* Mini portfolio preview */}
                <div className="absolute inset-4 bg-white/90 rounded p-2 text-xs">
                  <div
                    className="h-2 w-16 rounded mb-1"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div className="h-1 w-12 bg-gray-300 rounded mb-1" />
                  <div className="h-1 w-10 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Theme Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{theme.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{theme.description}</p>

                {/* Color Palette */}
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary Color"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary Color"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent Color"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: theme.colors.background }}
                    title="Background Color"
                  />
                </div>
              </div>

              {/* Select Button */}
              <div className="p-4 pt-0">
                <Button
                  variant={selectedTheme === theme.id ? 'default' : 'outline'}
                  size="sm"
                  className={`w-full ${
                    selectedTheme === theme.id
                      ? 'bg-jobathon-600 hover:bg-jobathon-700'
                      : 'hover:bg-jobathon-50 hover:border-jobathon-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onThemeChange(theme.id);
                  }}
                >
                  {selectedTheme === theme.id ? 'Selected' : 'Select Theme'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Theme Customization</h4>
          <p className="text-sm text-blue-800">
            The selected theme will be applied to your portfolio. You can switch themes anytime, and
            your content will automatically adapt to the new design.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
