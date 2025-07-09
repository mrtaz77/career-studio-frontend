import { useState } from 'react';
import { Education } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { EducationForm } from '../forms/EducationForm';

interface EducationSectionProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export const EducationSection = ({ data, onChange }: EducationSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const addEducation = () => {
    const newEducation: Education = {
      id: null,
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
    };
    onChange([...data, newEducation]);
  };

  const updateEducation = (id: string, updatedEducation: Education) => {
    onChange(data.map((edu) => (edu.id === id ? updatedEducation : edu)));
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center justify-between">
              <span>Education ({data.length})</span>
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
          <CardContent className="space-y-4">
            {data.map((education) => (
              <EducationForm
                key={education.id}
                data={education}
                onChange={(updatedEdu) => updateEducation(education.id, updatedEdu)}
                onRemove={() => removeEducation(education.id)}
              />
            ))}

            <Button
              onClick={addEducation}
              variant="outline"
              className="w-full flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Education</span>
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
