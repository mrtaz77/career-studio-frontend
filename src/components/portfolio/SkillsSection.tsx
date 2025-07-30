import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Award, X } from 'lucide-react';
import { PortfolioSkill } from '@/types/portfolio';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SkillsSectionProps {
  data: PortfolioSkill[];
  onChange: (data: PortfolioSkill[]) => void;
}

const skillCategories = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Databases',
  'Cloud & DevOps',
  'Design & UI/UX',
  'Project Management',
  'Soft Skills',
  'Other',
];

const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export const SkillsSection = ({ data, onChange }: SkillsSectionProps) => {
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    level: 'intermediate' as const,
  });

  const addSkill = () => {
    if (!newSkill.name.trim() || !newSkill.category) return;

    const skill: PortfolioSkill = {
      id: Date.now().toString(),
      name: newSkill.name.trim(),
      category: newSkill.category,
      level: newSkill.level,
    };

    onChange([...(data || []), skill]);
    setNewSkill({ name: '', category: '', level: 'intermediate' });
  };

  const removeSkill = (id: string) => {
    onChange((data || []).filter((skill) => skill.id !== id));
  };

  const updateSkill = (id: string, field: keyof PortfolioSkill, value: string) => {
    const updated = (data || []).map((skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    onChange(updated);
  };

  const groupedSkills =
    data?.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      },
      {} as Record<string, PortfolioSkill[]>
    ) || {};

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-gray-100 text-gray-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-green-100 text-green-800';
      case 'expert':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Skills ({data?.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Skill */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium mb-4">Add New Skill</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Input
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="Skill name"
              />
            </div>
            <div>
              <Select
                value={newSkill.category}
                onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={newSkill.level}
                onValueChange={(value) => setNewSkill({ ...newSkill, level: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                onClick={addSkill}
                className="w-full bg-jobathon-600 hover:bg-jobathon-700"
                disabled={!newSkill.name.trim() || !newSkill.category}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Skills Display */}
        {data?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No skills added yet</p>
            <p className="text-sm">Add your first skill using the form above</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category}>
                <h4 className="font-medium text-lg mb-3">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="relative group">
                      <Badge variant="secondary" className={`${getLevelColor(skill.level)} pr-8`}>
                        <span>{skill.name}</span>
                        <button
                          onClick={() => removeSkill(skill.id!)}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3 hover:text-red-600" />
                        </button>
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
