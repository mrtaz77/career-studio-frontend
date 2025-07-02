import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cert_img } from '../utils/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Certificate {
  id: string;
  issued_date: string;
  issuer: string;
  link: string;
  title: string;
}

// New type for each row when adding
interface NewCertRow {
  title: string;
  issuer: string;
  issued_date: string;
  file: File | null;
}

export const CertificatesView = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  // ← CHANGED: separate state for multiple-new-certs
  const [newCerts, setNewCerts] = useState<NewCertRow[]>([]);

  // ← CHANGED: state for editing a single cert
  const [editForm, setEditForm] = useState<NewCertRow>({
    title: '',
    issuer: '',
    issued_date: '',
    file: null,
  });

  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const getIdToken = async () => (currentUser ? await currentUser.getIdToken() : null);

  const fetchCertificates = async () => {
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
        setCertificates(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ← CHANGED: handle file for *either* add-row or edit
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0] || null;
    if (editingCertificate) {
      setEditForm((f) => ({ ...f, file }));
    } else if (typeof index === 'number') {
      setNewCerts((rows) => {
        const copy = [...rows];
        copy[index] = { ...copy[index], file };
        return copy;
      });
    }
  };

  // ← CHANGED: open the modal for *adding* multiple
  const openAddDialog = () => {
    setNewCerts([{ title: '', issuer: '', issued_date: '', file: null }]);
    setEditingCertificate(null);
    setIsDialogOpen(true);
  };

  // ← CHANGED: open the modal for *editing* one
  const openEditDialog = (cert: Certificate) => {
    setEditForm({
      title: cert.title,
      issuer: cert.issuer,
      issued_date: cert.issued_date,
      file: null,
    });
    setEditingCertificate(cert);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    const idToken = await getIdToken();
    if (!idToken) return;

    if (editingCertificate) {
      // —— UPDATE FLOW (unchanged)
      const { title, issuer, issued_date, file } = editForm;
      if (!title && !issuer && !issued_date && !file) {
        toast({
          title: 'Error',
          description: 'No changes to save',
          variant: 'destructive',
        });
        return;
      }

      const form = new FormData();
      form.append('title', title);
      form.append('issuer', issuer);
      form.append('issued_date', issued_date);
      if (file) form.append('file', file);

      const res = await fetch(`${API_BASE_URL}/api/v1/certificate/${editingCertificate.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${idToken}` },
        body: form,
      });
      const result = await res.json();
      if (!res.ok) {
        toast({
          title: 'Error',
          description: result.detail || 'Update failed',
          variant: 'destructive',
        });
        return;
      }
      toast({ title: 'Updated successfully' });
    } else {
      // —— MULTI-ADD FLOW
      // ensure every row has a file
      for (let i = 0; i < newCerts.length; i++) {
        if (!newCerts[i].file) {
          toast({
            title: 'Error',
            description: `Please attach file for row ${i + 1}`,
            variant: 'destructive',
          });
          return;
        }
      }

      const form = new FormData();
      newCerts.forEach((row, idx) => {
        form.append(`title_${idx}`, row.title);
        form.append(`issuer_${idx}`, row.issuer);
        form.append(`issued_date_${idx}`, row.issued_date);
        form.append(`file_${idx}`, row.file as Blob);
      });

      const res = await fetch(`${API_BASE_URL}/api/v1/certificate/add`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
        body: form,
      });
      const result = await res.json();
      if (!res.ok) {
        toast({
          title: 'Error',
          description: result.detail || 'Add failed',
          variant: 'destructive',
        });
        return;
      }
      toast({ title: 'Certificates added successfully' });
    }

    // common teardown
    setIsDialogOpen(false);
    fetchCertificates();
  };

  const handleDelete = async (id: string) => {
    const idToken = await getIdToken();
    if (!idToken) return;
    const res = await fetch(`${API_BASE_URL}/api/v1/certificate/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (res.ok) {
      setCertificates((cs) => cs.filter((c) => c.id !== id));
      toast({ title: 'Deleted' });
    } else {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Certificates</CardTitle>
            <CardDescription>
              Manage your professional certificates and achievements
            </CardDescription>
          </div>
          <Button onClick={openAddDialog} className="bg-jobathon-600 hover:bg-jobathon-700">
            <Plus size={16} className="mr-1" /> Add Certificate(s)
          </Button>
        </div>
      </CardHeader>
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
              <div className="flex space-x-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(cert)}
                >
                  <Edit size={14} className="mr-1" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(cert.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCertificate ? 'Edit Certificate' : 'Add Certificate(s)'}
            </DialogTitle>
            <DialogDescription>
              {editingCertificate
                ? 'Update the certificate information below.'
                : 'Add one or more certificates to your profile.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editingCertificate ? (
              // —— EDIT FORM —— unchanged
              <>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Issuer</Label>
                  <Input
                    value={editForm.issuer}
                    onChange={(e) => setEditForm((f) => ({ ...f, issuer: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Issued Date</Label>
                  <Input
                    type="date"
                    value={editForm.issued_date}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        issued_date: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Upload File (PDF or image)</Label>
                  <Input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => handleFileChange(e)}
                  />
                </div>
              </>
            ) : (
              // —— MULTI-ADD FORM —— new
              <>
                {/* ─── Scrollable multi-add form ─── */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {newCerts.map((row, idx) => (
                    <div key={idx} className="border p-4 rounded space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Certificate #{idx + 1}</span>
                        {newCerts.length > 1 && (
                          <Button
                            variant="outline"
                            onClick={() => setNewCerts((rows) => rows.filter((_, i) => i !== idx))}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={row.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewCerts((rows) => {
                              const copy = [...rows];
                              copy[idx] = { ...copy[idx], title: val };
                              return copy;
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Label>Issuer</Label>
                        <Input
                          value={row.issuer}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewCerts((rows) => {
                              const copy = [...rows];
                              copy[idx] = { ...copy[idx], issuer: val };
                              return copy;
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Label>Issued Date</Label>
                        <Input
                          type="date"
                          value={row.issued_date}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewCerts((rows) => {
                              const copy = [...rows];
                              copy[idx] = { ...copy[idx], issued_date: val };
                              return copy;
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Label>Upload File (PDF)</Label>
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileChange(e, idx)}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      setNewCerts((rows) => [
                        ...rows,
                        { title: '', issuer: '', issued_date: '', file: null },
                      ])
                    }
                  >
                    <Plus size={14} className="mr-1" /> Add another
                  </Button>
                </div>
              </>
            )}
            <div className="pt-2">
              <Button onClick={handleSubmit} className="w-full">
                {editingCertificate ? 'Update' : 'Add'} Certificate
                {editingCertificate ? '' : '(s)'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
