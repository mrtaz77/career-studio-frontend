import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { PortfolioEducation } from '@/types/portfolio';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface EducationSectionProps {
  data: PortfolioEducation[];
  onChange: (data: PortfolioEducation[]) => void;
}

export const EducationSection = ({ data, onChange }: EducationSectionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const addEducation = () => {
    const newEducation: PortfolioEducation = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    onChange([...data, newEducation]);
    setOpenItems([...openItems, newEducation.id!]);
  };

  const updateEducation = (id: string, field: keyof PortfolioEducation, value: string) => {
    const updated = data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu));
    onChange(updated);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
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
            <GraduationCap className="h-5 w-5" />
            Education ({data.length})
          </CardTitle>
          <Button onClick={addEducation} className="bg-jobathon-600 hover:bg-jobathon-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No education added yet</p>
            <p className="text-sm">Click &quot;Add Education&quot; to get started</p>
          </div>
        ) : (
          data.map((education) => (
            <Collapsible
              key={education.id}
              open={openItems.includes(education.id!)}
              onOpenChange={() => toggleItem(education.id!)}
            >
              <div className="border border-gray-200 rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {openItems.includes(education.id!) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div>
                        <h4 className="font-medium">{education.degree || 'New Education'}</h4>
                        <p className="text-sm text-gray-600">
                          {education.institution && `${education.institution} • `}
                          {education.endDate || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEducation(education.id!);
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
                        <Label htmlFor={`degree-${education.id}`}>Degree *</Label>
                        <Input
                          id={`degree-${education.id}`}
                          value={education.degree}
                          onChange={(e) => updateEducation(education.id!, 'degree', e.target.value)}
                          placeholder="Bachelor of Science"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`institution-${education.id}`}>Institution *</Label>
                        <Input
                          id={`institution-${education.id}`}
                          value={education.institution}
                          onChange={(e) =>
                            updateEducation(education.id!, 'institution', e.target.value)
                          }
                          placeholder="University Name"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`location-${education.id}`}>Location</Label>
                      <Input
                        id={`location-${education.id}`}
                        value={education.location}
                        onChange={(e) => updateEducation(education.id!, 'location', e.target.value)}
                        placeholder="City, State"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`startDate-${education.id}`}>Start Date *</Label>
                        <Input
                          id={`startDate-${education.id}`}
                          type="month"
                          value={education.startDate}
                          onChange={(e) =>
                            updateEducation(education.id!, 'startDate', e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`endDate-${education.id}`}>End Date</Label>
                        <Input
                          id={`endDate-${education.id}`}
                          type="month"
                          value={education.endDate}
                          onChange={(e) =>
                            updateEducation(education.id!, 'endDate', e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`gpa-${education.id}`}>GPA (Optional)</Label>
                        <Input
                          id={`gpa-${education.id}`}
                          value={education.gpa || ''}
                          onChange={(e) => updateEducation(education.id!, 'gpa', e.target.value)}
                          placeholder="3.8"
                          className="mt-1"
                        />
                      </div>
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
