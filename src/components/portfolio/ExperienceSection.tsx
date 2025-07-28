import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Briefcase, Calendar, MapPin } from 'lucide-react';
import { PortfolioExperience } from '@/types/portfolio';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ExperienceSectionProps {
  data: PortfolioExperience[];
  onChange: (data: PortfolioExperience[]) => void;
}

export const ExperienceSection = ({ data, onChange }: ExperienceSectionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const addExperience = () => {
    const newExperience: PortfolioExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    };
    onChange([...data, newExperience]);
    setOpenItems([...openItems, newExperience.id!]);
  };

  const updateExperience = (id: string, field: keyof PortfolioExperience, value: any) => {
    const updated = data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp));
    onChange(updated);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
    setOpenItems(openItems.filter((item) => item !== id));
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Experience ({data.length})
          </CardTitle>
          <Button onClick={addExperience} className="bg-jobathon-600 hover:bg-jobathon-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No work experience added yet</p>
            <p className="text-sm">Click "Add Experience" to get started</p>
          </div>
        ) : (
          data.map((experience) => (
            <Collapsible
              key={experience.id}
              open={openItems.includes(experience.id!)}
              onOpenChange={() => toggleItem(experience.id!)}
            >
              <div className="border border-gray-200 rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {openItems.includes(experience.id!) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div>
                        <h4 className="font-medium">{experience.title || 'New Position'}</h4>
                        <p className="text-sm text-gray-600">
                          {experience.company && `${experience.company} • `}
                          {experience.current ? 'Current' : experience.endDate || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExperience(experience.id!);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`title-${experience.id}`}>Job Title *</Label>
                        <Input
                          id={`title-${experience.id}`}
                          value={experience.title}
                          onChange={(e) =>
                            updateExperience(experience.id!, 'title', e.target.value)
                          }
                          placeholder="Software Engineer"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`company-${experience.id}`}>Company *</Label>
                        <Input
                          id={`company-${experience.id}`}
                          value={experience.company}
                          onChange={(e) =>
                            updateExperience(experience.id!, 'company', e.target.value)
                          }
                          placeholder="Tech Corp"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`location-${experience.id}`}>Location</Label>
                      <Input
                        id={`location-${experience.id}`}
                        value={experience.location}
                        onChange={(e) =>
                          updateExperience(experience.id!, 'location', e.target.value)
                        }
                        placeholder="San Francisco, CA"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`startDate-${experience.id}`}>Start Date *</Label>
                        <Input
                          id={`startDate-${experience.id}`}
                          type="month"
                          value={experience.startDate}
                          onChange={(e) =>
                            updateExperience(experience.id!, 'startDate', e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
                        <Input
                          id={`endDate-${experience.id}`}
                          type="month"
                          value={experience.endDate}
                          onChange={(e) =>
                            updateExperience(experience.id!, 'endDate', e.target.value)
                          }
                          disabled={experience.current}
                          className="mt-1"
                        />
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch
                            id={`current-${experience.id}`}
                            checked={experience.current}
                            onCheckedChange={(checked) => {
                              updateExperience(experience.id!, 'current', checked);
                              if (checked) {
                                updateExperience(experience.id!, 'endDate', '');
                              }
                            }}
                          />
                          <Label htmlFor={`current-${experience.id}`} className="text-sm">
                            I currently work here
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`description-${experience.id}`}>Job Description</Label>
                      <Textarea
                        id={`description-${experience.id}`}
                        value={experience.description}
                        onChange={(e) =>
                          updateExperience(experience.id!, 'description', e.target.value)
                        }
                        placeholder="Describe your role, responsibilities, and key achievements..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))
        )}
      </CardContent>
    </Card>
  );
};
