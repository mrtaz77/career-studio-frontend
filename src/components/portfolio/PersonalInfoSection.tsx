import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, User } from 'lucide-react';
import { PortfolioPersonalInfo } from '@/types/portfolio';

interface PersonalInfoSectionProps {
  data: PortfolioPersonalInfo;
  onChange: (data: PortfolioPersonalInfo) => void;
}

export const PersonalInfoSection = ({ data, onChange }: PersonalInfoSectionProps) => {
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (field: keyof PortfolioPersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      // Here you would implement the actual image upload logic
      // For now, we'll create a placeholder URL
      const imageUrl = URL.createObjectURL(file);
      handleChange('avatar', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {data.avatar ? (
                <img src={data.avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-jobathon-600 text-white p-1 rounded-full cursor-pointer hover:bg-jobathon-700">
              <Upload className="h-3 w-3" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={imageUploading}
              />
            </label>
          </div>
          <div>
            <h3 className="font-medium">Profile Picture</h3>
            <p className="text-sm text-gray-600">Upload a professional photo</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="title">Professional Title *</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Software Engineer"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Location</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="City, State, Country"
            className="mt-1"
          />
        </div>

        {/* Professional Summary */}
        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={data.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Write a brief summary about your professional background, skills, and career objectives..."
            className="mt-1"
            rows={4}
          />
          <p className="text-xs text-gray-600 mt-1">
            This will be displayed prominently on your portfolio homepage
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
