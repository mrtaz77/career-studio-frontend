import { useState } from 'react';
import { Experience } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronRight, Plus, Trash2, Building, MapPin, Calendar } from 'lucide-react';

interface ExperienceSectionProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Volunteer',
];

const locationTypes = ['on-site', 'remote', 'hybrid'];

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Non-profit',
  'Government',
  'Other',
];

export const ExperienceSection = ({ data, onChange }: ExperienceSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const addExperience = () => {
    const newExperience: Experience = {
      id: null,
      jobTitle: '',
      position: '',
      company: '',
      companyUrl: '',
      companyLogo: '',
      location: '',
      employmentType: '',
      locationType: 'on-site',
      industry: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange([...data, newExperience]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExperiences = [...data];
    updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
    onChange(updatedExperiences);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center justify-between">
              <span>Experience ({data.length})</span>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {data.map((experience, index) => (
              <div key={experience.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Job Title and Position */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`job-title-${index}`}>Job Title</Label>
                      <Input
                        id={`job-title-${index}`}
                        value={experience.jobTitle}
                        onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`position-${index}`}>Position</Label>
                      <Input
                        id={`position-${index}`}
                        value={experience.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        placeholder="e.g., Team Lead"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`company-${index}`}>Company</Label>
                      <Input
                        id={`company-${index}`}
                        value={experience.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        placeholder="Company name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`company-url-${index}`}>Company Website</Label>
                      <Input
                        id={`company-url-${index}`}
                        value={experience.companyUrl}
                        onChange={(e) => updateExperience(index, 'companyUrl', e.target.value)}
                        placeholder="https://company.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Location and Employment Type */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`location-${index}`}>Location</Label>
                      <Input
                        id={`location-${index}`}
                        value={experience.location}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                        placeholder="City, Country"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`employment-type-${index}`}>Employment Type</Label>
                      <Select
                        value={experience.employmentType}
                        onValueChange={(value) => updateExperience(index, 'employmentType', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {employmentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`location-type-${index}`}>Work Location</Label>
                      <Select
                        value={experience.locationType}
                        onValueChange={(value) =>
                          updateExperience(
                            index,
                            'locationType',
                            value as 'remote' | 'on-site' | 'hybrid'
                          )
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locationTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <Label htmlFor={`industry-${index}`}>Industry</Label>
                    <Select
                      value={experience.industry}
                      onValueChange={(value) => updateExperience(index, 'industry', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                      <Input
                        id={`start-date-${index}`}
                        type="month"
                        value={experience.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`end-date-${index}`}>End Date</Label>
                      <Input
                        id={`end-date-${index}`}
                        type="month"
                        value={experience.endDate}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        placeholder="Leave empty if current"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={experience.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={addExperience}
              variant="outline"
              className="w-full flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Experience</span>
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
