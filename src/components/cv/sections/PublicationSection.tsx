import { useState } from 'react';
import { Publication } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronRight, Plus, Trash2, Link } from 'lucide-react';

interface PublicationSectionProps {
  data: Publication[];
  onChange: (data: Publication[]) => void;
}

export const PublicationSection = ({ data, onChange }: PublicationSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const addPublication = () => {
    const newPublication: Publication = {
      id: null,
      title: '',
      journal: '',
      year: '',
      urls: [],
    };
    onChange([...data, newPublication]);
  };

  const updatePublication = (index: number, field: keyof Publication, value: any) => {
    const updatedPublications = [...data];
    if (field === 'urls') {
      updatedPublications[index] = { ...updatedPublications[index], urls: value };
    } else {
      updatedPublications[index] = { ...updatedPublications[index], [field]: value };
    }
    onChange(updatedPublications);
  };

  const removePublication = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addUrl = (publicationIndex: number) => {
    const updatedPublications = [...data];
    updatedPublications[publicationIndex].urls.push({
      label: '',
      url: '',
      source_type: 'project',
    });
    onChange(updatedPublications);
  };

  const updateUrl = (
    publicationIndex: number,
    urlIndex: number,
    field: 'label' | 'url',
    value: string
  ) => {
    const updatedPublications = [...data];
    updatedPublications[publicationIndex].urls[urlIndex][field] = value;
    onChange(updatedPublications);
  };

  const removeUrl = (publicationIndex: number, urlIndex: number) => {
    const updatedPublications = [...data];
    updatedPublications[publicationIndex].urls.splice(urlIndex, 1);
    onChange(updatedPublications);
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center justify-between">
              <span>Publications ({data.length})</span>
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
            {data.map((publication, index) => (
              <div key={publication.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Publication {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePublication(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor={`title-${index}`}>Title</Label>
                    <Input
                      id={`title-${index}`}
                      value={publication.title}
                      onChange={(e) => updatePublication(index, 'title', e.target.value)}
                      placeholder="Publication title"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`journal-${index}`}>Journal/Conference</Label>
                      <Input
                        id={`journal-${index}`}
                        value={publication.journal}
                        onChange={(e) => updatePublication(index, 'journal', e.target.value)}
                        placeholder="Journal or conference name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`year-${index}`}>Year</Label>
                      <Input
                        id={`year-${index}`}
                        value={publication.year}
                        onChange={(e) => updatePublication(index, 'year', e.target.value)}
                        placeholder="2024"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* URLs Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Links</Label>
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

                    {publication.urls.map((url, urlIndex) => (
                      <div key={urlIndex} className="flex items-center space-x-2">
                        <Input
                          value={url.label}
                          onChange={(e) => updateUrl(index, urlIndex, 'label', e.target.value)}
                          placeholder="Link label (e.g., DOI, PDF)"
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
              onClick={addPublication}
              variant="outline"
              className="w-full flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Publication</span>
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
