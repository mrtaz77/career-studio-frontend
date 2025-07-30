/* eslint-disable prettier/prettier */
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { PortfolioEducation } from '@/types/portfolio';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface EducationSectionProps {
  data: PortfolioEducation[];
  onChange: (data: PortfolioEducation[]) => void;
  color?: string; // Optional color prop for background
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const EducationSection = ({ data, onChange, color }: EducationSectionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [educationList, setEducationList] = useState<PortfolioEducation[]>([]);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  // const addEducation = () => {
  //   const newEducation: PortfolioEducation = {
  //     id: Date.now().toString(),
  //     degree: '',
  //     institution: '',
  //     location: '',
  //     startDate: '',
  //     endDate: '',
  //     gpa: '',
  //   };
  //   onChange([...data, newEducation]);
  //   setOpenItems([...openItems, newEducation.id!]);
  // };

  // const updateEducation = (id: string, field: keyof PortfolioEducation, value: string) => {
  //   const updated = data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu));
  //   onChange(updated);
  // };

  // const removeEducation = (id: string) => {
  //   onChange(data.filter((edu) => edu.id !== id));
  //   setOpenItems(openItems.filter((item) => item !== id));
  // };

  const getIdToken = async () => (currentUser ? await currentUser.getIdToken() : null);

  // Load list
  const fetchEducation = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/v1/education`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Fetch failed');

      const data = (await res.json()) as PortfolioEducation[];
      setEducationList(
        data.map((e) => ({
          id: e.id,
          institution: e.institution,
          degree: e.degree,
          location: e.location,
          start_date: e.start_date,
          end_date: e.end_date,
          gpa: e.gpa?.toString(),
          honors: e.honors,
        }))
      );
      setOpenItems(data.map((e) => e.id!));
      onChange(data);
      console.log('Education data loaded:', data);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Could not load education records.',
        variant: 'destructive',
      });
    } finally {
      // setLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader style={{ backgroundColor: color }}>
        <div className="flex items-center justify-between text-white">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education ({educationList.length})
          </CardTitle>
          {/* <Button onClick={addEducation} className="bg-jobathon-600 hover:bg-jobathon-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button> */}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {educationList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No education added yet</p>
            <p className="text-sm">Click &quot;Add Education&quot; to get started</p>
          </div>
        ) : (
          <CardContent className="space-y-4">
            {educationList.map((edu) => (
              <div
                key={edu.id}
                className="border rounded-lg p-4 flex justify-between items-start hover:shadow"
              >
                <div className="flex space-x-3">
                  <div className="h-12 w-12 rounded-full bg-jobathon-100 flex items-center justify-center">
                    <GraduationCap size={20} className="text-jobathon-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.location}</p>
                    <p className="text-sm text-gray-500 mb-1">{edu.institution}</p>
                    <p className="text-sm text-gray-500 mb-1">
                      {edu.start_date?.slice(0, 10) || 'N/A'} to{' '}
                      {edu.end_date?.slice(0, 10) || 'N/A'}{' '}
                      {edu.gpa && <span>· GPA: {edu.gpa}</span>}
                    </p>
                    {edu.honors && <p className="text-sm text-gray-600">{edu.honors}</p>}
                  </div>
                </div>
                {/* <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(edu)}>
                  <Edit size={14} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(edu.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div> */}
              </div>
            ))}
          </CardContent>
        )}
      </CardContent>
    </Card>
  );
};
