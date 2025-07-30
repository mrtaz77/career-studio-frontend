/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, BookOpen, ExternalLink, Users } from 'lucide-react';
import { PortfolioPublication } from '@/types/portfolio';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PublicationsSectionProps {
  data: PortfolioPublication[];
  onChange: (data: PortfolioPublication[]) => void;
}

export const PublicationsSection = ({ data, onChange }: PublicationsSectionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [publications, setPublications] = useState<PortfolioPublication[]>(data || []);

  // Update local state when data prop changes
  useEffect(() => {
    setPublications(data || []);
    if (data && data.length > 0) {
      setOpenItems(data.map((pub) => pub.id!));
    }
  }, [data]);

  const addPublication = () => {
    const newPublication: PortfolioPublication = {
      id: Date.now().toString(),
      title: '',
      description: '',
      link: '',
      date: '',
      authors: [''],
    };
    const updatedPublications = [...publications, newPublication];
    setPublications(updatedPublications);
    onChange(updatedPublications);
    setOpenItems([...openItems, newPublication.id!]);
  };

  const updatePublication = (
    id: string,
    field: keyof PortfolioPublication,
    value: string | string[]
  ) => {
    const updated = publications.map((pub) => (pub.id === id ? { ...pub, [field]: value } : pub));
    setPublications(updated);
    onChange(updated);
  };

  const removePublication = (id: string) => {
    const filtered = publications.filter((pub) => pub.id !== id);
    setPublications(filtered);
    onChange(filtered);
    setOpenItems(openItems.filter((item) => item !== id));
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const updateAuthors = (id: string, authorIndex: number, value: string) => {
    const publication = publications.find((pub) => pub.id === id);
    if (!publication) return;

    const updatedAuthors = [...publication.authors];
    updatedAuthors[authorIndex] = value;
    updatePublication(id, 'authors', updatedAuthors);
  };

  const addAuthor = (id: string) => {
    const publication = publications.find((pub) => pub.id === id);
    if (!publication) return;

    const updatedAuthors = [...publication.authors, ''];
    updatePublication(id, 'authors', updatedAuthors);
  };

  const removeAuthor = (id: string, authorIndex: number) => {
    const publication = publications.find((pub) => pub.id === id);
    if (!publication || publication.authors.length <= 1) return;

    const updatedAuthors = publication.authors.filter((_, index) => index !== authorIndex);
    updatePublication(id, 'authors', updatedAuthors);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Publications ({publications.length})
          </CardTitle>
          <Button onClick={addPublication} className="bg-jobathon-600 hover:bg-jobathon-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Publication
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {publications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No publications added yet</p>
            <p className="text-sm">
              Click &quot;Add Publication&quot; to showcase your research and articles
            </p>
          </div>
        ) : (
          publications.map((publication) => (
            <Collapsible
              key={publication.id}
              open={openItems.includes(publication.id!)}
              onOpenChange={() => toggleItem(publication.id!)}
            >
              <div className="border border-gray-200 rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {openItems.includes(publication.id!) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{publication.title || 'New Publication'}</h4>
                        <p className="text-sm text-gray-600">
                          {publication.authors.filter((author) => author.trim()).join(', ') ||
                            'No authors specified'}{' '}
                          •{publication.date || 'Date not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {publication.link && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(publication.link, '_blank');
                          }}
                          className="text-jobathon-600 hover:text-jobathon-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePublication(publication.id!);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`title-${publication.id}`}>Publication Title *</Label>
                        <Input
                          id={`title-${publication.id}`}
                          value={publication.title}
                          onChange={(e) =>
                            updatePublication(publication.id!, 'title', e.target.value)
                          }
                          placeholder="Machine Learning in Healthcare: A Comprehensive Review"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`date-${publication.id}`}>Publication Date *</Label>
                        <Input
                          id={`date-${publication.id}`}
                          type="date"
                          value={publication.date}
                          onChange={(e) =>
                            updatePublication(publication.id!, 'date', e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`description-${publication.id}`}>Description</Label>
                      <Textarea
                        id={`description-${publication.id}`}
                        value={publication.description}
                        onChange={(e) =>
                          updatePublication(publication.id!, 'description', e.target.value)
                        }
                        placeholder="Brief description of the publication, research findings, or key contributions..."
                        className="mt-1 min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`link-${publication.id}`}>Publication URL</Label>
                      <Input
                        id={`link-${publication.id}`}
                        value={publication.link}
                        onChange={(e) => updatePublication(publication.id!, 'link', e.target.value)}
                        placeholder="https://journal.example.com/article/123 or DOI link"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Authors *</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addAuthor(publication.id!)}
                          className="text-jobathon-600 hover:text-jobathon-700"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Add Author
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {publication.authors.map((author, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={author}
                              onChange={(e) =>
                                updateAuthors(publication.id!, index, e.target.value)
                              }
                              placeholder={`Author ${index + 1} name`}
                              className="flex-1"
                            />
                            {publication.authors.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAuthor(publication.id!, index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
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
