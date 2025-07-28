import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Award, ExternalLink } from 'lucide-react';
import { PortfolioCertificate } from '@/types/portfolio';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CertificatesSectionProps {
  data: PortfolioCertificate[];
  onChange: (data: PortfolioCertificate[]) => void;
}

export const CertificatesSection = ({ data, onChange }: CertificatesSectionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const addCertificate = () => {
    const newCertificate: PortfolioCertificate = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
    };
    onChange([...data, newCertificate]);
    setOpenItems([...openItems, newCertificate.id!]);
  };

  const updateCertificate = (id: string, field: keyof PortfolioCertificate, value: string) => {
    const updated = data.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert));
    onChange(updated);
  };

  const removeCertificate = (id: string) => {
    onChange(data.filter((cert) => cert.id !== id));
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
            <Award className="h-5 w-5" />
            Certificates ({data.length})
          </CardTitle>
          <Button onClick={addCertificate} className="bg-jobathon-600 hover:bg-jobathon-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Certificate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No certificates added yet</p>
            <p className="text-sm">
              Click &quot;Add Certificate&quot; to showcase your achievements
            </p>
          </div>
        ) : (
          data.map((certificate) => (
            <Collapsible
              key={certificate.id}
              open={openItems.includes(certificate.id!)}
              onOpenChange={() => toggleItem(certificate.id!)}
            >
              <div className="border border-gray-200 rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {openItems.includes(certificate.id!) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{certificate.name || 'New Certificate'}</h4>
                        <p className="text-sm text-gray-600">
                          {certificate.issuer && `${certificate.issuer} • `}
                          {certificate.issueDate || 'Date not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {certificate.credentialUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(certificate.credentialUrl, '_blank');
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
                          removeCertificate(certificate.id!);
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
                        <Label htmlFor={`name-${certificate.id}`}>Certificate Name *</Label>
                        <Input
                          id={`name-${certificate.id}`}
                          value={certificate.name}
                          onChange={(e) =>
                            updateCertificate(certificate.id!, 'name', e.target.value)
                          }
                          placeholder="AWS Certified Solutions Architect"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`issuer-${certificate.id}`}>Issuing Organization *</Label>
                        <Input
                          id={`issuer-${certificate.id}`}
                          value={certificate.issuer}
                          onChange={(e) =>
                            updateCertificate(certificate.id!, 'issuer', e.target.value)
                          }
                          placeholder="Amazon Web Services"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`issueDate-${certificate.id}`}>Issue Date *</Label>
                        <Input
                          id={`issueDate-${certificate.id}`}
                          type="month"
                          value={certificate.issueDate}
                          onChange={(e) =>
                            updateCertificate(certificate.id!, 'issueDate', e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`credentialUrl-${certificate.id}`}>Credential URL</Label>
                        <Input
                          id={`credentialUrl-${certificate.id}`}
                          value={certificate.credentialUrl || ''}
                          onChange={(e) =>
                            updateCertificate(certificate.id!, 'credentialUrl', e.target.value)
                          }
                          placeholder="https://credentials.example.com/verify/123"
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
