import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, FolderOpen, X } from 'lucide-react';
import { PortfolioProject } from '@/types/portfolio';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ProjectsSectionProps {
  data: PortfolioProject[];
  onChange: (data: PortfolioProject[]) => void;
}

export const ProjectsSection = ({ data, onChange }: ProjectsSectionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [newTech, setNewTech] = useState<{ [key: string]: string }>({});

  const addProject = () => {
    const newProject: PortfolioProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
      image: '',
      featured: false,
    };
    onChange([...(data || []), newProject]);
    setOpenItems([...openItems, newProject.id!]);
  };

  const updateProject = (
    id: string,
    field: keyof PortfolioProject,
    value: string | boolean | string[]
  ) => {
    const updated = (data || []).map((project) =>
      project.id === id ? { ...project, [field]: value } : project
    );
    onChange(updated);
  };

  const removeProject = (id: string) => {
    onChange((data || []).filter((project) => project.id !== id));
    setOpenItems(openItems.filter((item) => item !== id));
  };

  const addTechnology = (projectId: string) => {
    const tech = newTech[projectId]?.trim();
    if (!tech) return;

    const project = (data || []).find((p) => p.id === projectId);
    if (project && !project.technologies.includes(tech)) {
      updateProject(projectId, 'technologies', [...project.technologies, tech]);
    }
    setNewTech({ ...newTech, [projectId]: '' });
  };

  const removeTechnology = (projectId: string, tech: string) => {
    const project = (data || []).find((p) => p.id === projectId);
    if (project) {
      updateProject(
        projectId,
        'technologies',
        project.technologies.filter((t) => t !== tech)
      );
    }
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
            <FolderOpen className="h-5 w-5" />
            Projects ({data?.length})
          </CardTitle>
          <Button onClick={addProject} className="bg-jobathon-600 hover:bg-jobathon-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No projects added yet</p>
            <p className="text-sm">Click &quot;Add Project&quot; to showcase your work</p>
          </div>
        ) : (
          data?.map((project) => (
            <Collapsible
              key={project.id}
              open={openItems.includes(project.id!)}
              onOpenChange={() => toggleItem(project.id!)}
            >
              <div className="border border-gray-200 rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {openItems.includes(project.id!) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{project.name || 'New Project'}</h4>
                          {project.featured && (
                            <Badge variant="secondary" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.technologies.slice(0, 3).join(', ')}
                          {project.technologies.length > 3 && '...'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProject(project.id!);
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
                        <Label htmlFor={`name-${project.id}`}>Project Name *</Label>
                        <Input
                          id={`name-${project.id}`}
                          value={project.name}
                          onChange={(e) => updateProject(project.id!, 'name', e.target.value)}
                          placeholder="My Awesome Project"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`image-${project.id}`}>Project Image URL</Label>
                        <Input
                          id={`image-${project.id}`}
                          value={project.image || ''}
                          onChange={(e) => updateProject(project.id!, 'image', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`description-${project.id}`}>Description *</Label>
                      <Textarea
                        id={`description-${project.id}`}
                        value={project.description}
                        onChange={(e) => updateProject(project.id!, 'description', e.target.value)}
                        placeholder="Describe your project, its purpose, and key features..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`liveUrl-${project.id}`}>Live Demo URL</Label>
                        <Input
                          id={`liveUrl-${project.id}`}
                          value={project.liveUrl || ''}
                          onChange={(e) => updateProject(project.id!, 'liveUrl', e.target.value)}
                          placeholder="https://myproject.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`githubUrl-${project.id}`}>GitHub URL</Label>
                        <Input
                          id={`githubUrl-${project.id}`}
                          value={project.githubUrl || ''}
                          onChange={(e) => updateProject(project.id!, 'githubUrl', e.target.value)}
                          placeholder="https://github.com/user/repo"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <Label>Technologies Used</Label>
                      <div className="mt-2 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tech}
                              <button
                                onClick={() => removeTechnology(project.id!, tech)}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newTech[project.id!] || ''}
                            onChange={(e) =>
                              setNewTech({ ...newTech, [project.id!]: e.target.value })
                            }
                            placeholder="Add technology (e.g., React, Node.js)"
                            onKeyPress={(e) => e.key === 'Enter' && addTechnology(project.id!)}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addTechnology(project.id!)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Featured toggle */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`featured-${project.id}`}
                        checked={project.featured}
                        onCheckedChange={(checked) =>
                          updateProject(project.id!, 'featured', checked)
                        }
                      />
                      <Label htmlFor={`featured-${project.id}`} className="text-sm">
                        Mark as featured project
                      </Label>
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
