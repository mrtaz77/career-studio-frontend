import { Education } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash } from 'lucide-react';

interface EducationFormProps {
  data: Education;
  onChange: (data: Education) => void;
  onRemove: () => void;
}

export const EducationForm = ({ data, onChange, onRemove }: EducationFormProps) => {
  const handleChange = (field: keyof Education, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{data.degree || 'New Education'}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`degree-${data.id}`}>Degree</Label>
            <Input
              id={`degree-${data.id}`}
              value={data.degree}
              onChange={(e) => handleChange('degree', e.target.value)}
              placeholder="Bachelor of Science"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`institution-${data.id}`}>Institution</Label>
            <Input
              id={`institution-${data.id}`}
              value={data.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
              placeholder="University Name"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`location-${data.id}`}>Location</Label>
          <Input
            id={`location-${data.id}`}
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City, State"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`start-date-${data.id}`}>Start Date</Label>
            <Input
              id={`start-date-${data.id}`}
              type="date"
              value={data.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`end-date-${data.id}`}>End Date</Label>
            <Input
              id={`end-date-${data.id}`}
              type="date"
              value={data.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`gpa-${data.id}`}>GPA</Label>
            <Input
              id={`gpa-${data.id}`}
              value={data.gpa}
              onChange={(e) => handleChange('gpa', e.target.value)}
              placeholder="3.8"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`honors-${data.id}`}>Honors</Label>
            <Input
              id={`honors-${data.id}`}
              value={data.honors}
              onChange={(e) => handleChange('honors', e.target.value)}
              placeholder="Magna Cum Laude"
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
