/* eslint-disable prettier/prettier */
import { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '../ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Award, ExternalLink } from 'lucide-react';
import { PortfolioCertificate } from '@/types/portfolio';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { on } from 'events';
import { set } from 'date-fns';

interface CertificatesSectionProps {
  data: PortfolioCertificate[];
  onChange: (data: PortfolioCertificate[]) => void;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const CertificatesSection = ({ data, onChange }: CertificatesSectionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<PortfolioCertificate[]>([]);

  // const addCertificate = () => {
  //   const newCertificate: PortfolioCertificate = {
  //     id: Date.now().toString(),
  //     name: '',
  //     issuer: '',
  //     issueDate: '',
  //     credentialUrl: '',
  //   };
  //   onChange([...data, newCertificate]);
  //   setOpenItems([...openItems, newCertificate.id!]);
  // };

  const { currentUser } = useAuth();
  const { toast } = useToast();

  const getIdToken = useCallback(async () => {
    return currentUser ? await currentUser.getIdToken() : null;
  }, [currentUser]);

  const fetchCertificates = useCallback(async () => {
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      const res = await fetch(`${API_BASE_URL}/api/v1/certificate`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
        //console.log('Certificates fetched successfully:',await res.json());

        //  console.log('Certificates fetched successfully:', data);
        setOpenItems(data.map((cert) => cert.id!));
        onChange(data);
      }
    } catch (_err) {
      // console.error(_err); // Silenced for production
    } finally {
      //setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

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
            Certificates ({certificates.length})
          </CardTitle>
          {/* <Button onClick={addCertificate} className="bg-jobathon-600 hover:bg-jobathon-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Certificate
          </Button>
        */}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {certificates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No certificates added yet</p>
            <p className="text-sm">
              Click &quot;Add Certificate&quot; to showcase your achievements
            </p>
          </div>
        ) : (
          certificates.map((certificate) => (
            <Collapsible
              key={certificate.id}
              open={openItems.includes(certificate.id!)}
              onOpenChange={() => toggleItem(certificate.id!)}
            >
              {/* <div className="border border-gray-200 rounded-lg">
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
              </div> */}
              <CardContent>
                {/* ... existing list rendering ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="border rounded p-4 hover:shadow">
                      <embed
                        src={cert.link}
                        type="application/pdf"
                        width="100%"
                        height="200px"
                        className="rounded bg-gray-100 mb-2"
                      />
                      <div className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(cert.link, '_blank')}
                        >
                          View PDF
                        </Button>
                      </div>

                      <h3 className="font-medium text-sm mb-1 line-clamp-2">{cert.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">{cert.issuer}</p>
                      <p className="text-xs text-gray-400">{cert.issued_date}</p>
                      <div className="flex space-x-2 mt-3"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Collapsible>
          ))
        )}
      </CardContent>
    </Card>
  );
};
