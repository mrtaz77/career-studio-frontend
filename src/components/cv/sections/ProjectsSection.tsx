import { useState } from 'react';
import { Project } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronRight, Plus, Trash2, Link, Code } from 'lucide-react';

interface ProjectsSectionProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export const ProjectsSection = ({ data, onChange }: ProjectsSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const addProject = () => {
    const newProject: Project = {
      id: null,
      name: '',
      description: '',
      technologies: [],
      urls: [],
    };
    onChange([...data, newProject]);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updatedProjects = [...data];
    if (field === 'technologies' || field === 'urls') {
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    } else {
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    }
    onChange(updatedProjects);
  };

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addTechnology = (projectIndex: number) => {
    const updatedProjects = [...data];
    const newTechnology = {
      id: null,
      name: '',
    };
    updatedProjects[projectIndex].technologies.push(newTechnology);
    onChange(updatedProjects);
  };

  const updateTechnology = (projectIndex: number, techIndex: number, value: string) => {
    const updatedProjects = [...data];
    updatedProjects[projectIndex].technologies[techIndex].name = value;
    onChange(updatedProjects);
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const updatedProjects = [...data];
    updatedProjects[projectIndex].technologies.splice(techIndex, 1);
    onChange(updatedProjects);
  };

  const addUrl = (projectIndex: number) => {
    const updatedProjects = [...data];
    updatedProjects[projectIndex].urls.push({
      label: '',
      url: '',
      source_type: 'project',
    });
    onChange(updatedProjects);
  };

  const updateUrl = (
    projectIndex: number,
    urlIndex: number,
    field: 'label' | 'url',
    value: string
  ) => {
    const updatedProjects = [...data];
    updatedProjects[projectIndex].urls[urlIndex][field] = value;
    onChange(updatedProjects);
  };

  const removeUrl = (projectIndex: number, urlIndex: number) => {
    const updatedProjects = [...data];
    updatedProjects[projectIndex].urls.splice(urlIndex, 1);
    onChange(updatedProjects);
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center justify-between">
              <span>Projects ({data.length})</span>
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
            {data.map((project, index) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`project-name-${index}`}>Project Name</Label>
                    <Input
                      id={`project-name-${index}`}
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      placeholder="Project name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`project-description-${index}`}>Description</Label>
                    <Textarea
                      id={`project-description-${index}`}
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      placeholder="Describe your project, technologies used, and your role..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {/* Technologies Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Technologies Used</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTechnology(index)}
                        className="flex items-center space-x-1"
                      >
                        <Code className="h-3 w-3" />
                        <span>Add Technology</span>
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <div
                          key={tech.id}
                          className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
                        >
                          <Input
                            value={tech.name}
                            onChange={(e) => updateTechnology(index, techIndex, e.target.value)}
                            placeholder="Tech name"
                            className="w-24 h-6 text-sm border-0 bg-transparent p-0 focus:ring-0"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTechnology(index, techIndex)}
                            className="h-4 w-4 p-0 text-blue-600 hover:text-blue-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* URLs Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Project Links</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addUrl(index)}
                        className="flex items-center space-x-1"
                      >
                        <Link className="h-3 w-3" />
                        <span>Add Link</span>
                      </Button>
                    </div>

                    {project.urls.map((url, urlIndex) => (
                      <div key={urlIndex} className="flex items-center space-x-2">
                        <Input
                          value={url.label}
                          onChange={(e) => updateUrl(index, urlIndex, 'label', e.target.value)}
                          placeholder="Link label (e.g., Live Demo, GitHub)"
                          className="flex-1"
                        />
                        <Input
                          value={url.url}
                          onChange={(e) => updateUrl(index, urlIndex, 'url', e.target.value)}
                          placeholder="https://..."
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeUrl(index, urlIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={addProject}
              variant="outline"
              className="w-full flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
