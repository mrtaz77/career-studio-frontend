import { useState } from 'react';
import { Skill } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';

interface SkillsSectionProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
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

export const SkillsSection = ({ data, onChange }: SkillsSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Programming Languages');

  const addSkill = () => {
    if (newSkillName.trim()) {
      const newSkill: Skill = {
        id: null,
        name: newSkillName.trim(),
        category: newSkillCategory,
      };
      onChange([...data, newSkill]);
      setNewSkillName('');
      setNewSkillCategory('Programming Languages');
    }
  };

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    const updatedSkills = [...data];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    onChange(updatedSkills);
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const groupedSkills = data.reduce(
    (acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center justify-between">
              <span>Skills ({data.length})</span>
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
            {/* Add New Skill Form */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-gray-900">Add New Skill</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input
                    id="skill-name"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g., React, Python, AWS"
                    className="mt-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSkillName.trim()) {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="skill-category">Category</Label>
                  <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue>{newSkillCategory}</SelectValue>
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
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={addSkill}
                  variant="outline"
                  className="flex-1 flex items-center space-x-2"
                  disabled={!newSkillName.trim()}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Skill</span>
                </Button>
              </div>
            </div>

            {/* Skills by Category */}
            {Object.keys(groupedSkills).length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Your Skills</h4>

                {Object.entries(groupedSkills).map(([category, skills]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-700 mb-3 flex items-center justify-between">
                      <span>{category}</span>
                      <span className="text-sm text-gray-500 font-normal">
                        {skills.length} skill{skills.length !== 1 ? 's' : ''}
                      </span>
                    </h5>
                    <div className="space-y-3">
                      {skills.map((skill, index) => {
                        const globalIndex = data.findIndex((s) => s.id === skill.id);
                        return (
                          <div
                            key={skill.id}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <Input
                              value={skill.name}
                              onChange={(e) => updateSkill(globalIndex, 'name', e.target.value)}
                              placeholder="Skill name"
                              className="flex-1"
                            />
                            <Select
                              value={skill.category}
                              onValueChange={(value) => updateSkill(globalIndex, 'category', value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {skillCategories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSkill(globalIndex)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
