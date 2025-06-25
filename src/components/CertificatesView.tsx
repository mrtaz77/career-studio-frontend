// import  React from 'react';
// import { useState, useEffect } from 'react';
// import {
//   Card, CardContent, CardDescription, CardHeader, CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Edit, Trash2, Plus } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { useAuth } from '@/context/AuthContext';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {cert_img} from '../utils/constants';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// interface Certificate {
//   id: string;
//   issued_date: string;
//   issuer: string;
//   link: string;
//   title: string;
// }

// export const CertificatesView = () => {
//   const [certificates, setCertificates] = useState<Certificate[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
//   const [formData, setFormData] = useState({ title: '', issuer: '', issued_date: '', file: null });

//   const { currentUser } = useAuth();
//   const { toast } = useToast();

//   useEffect(() => { fetchCertificates(); }, [certificates.length]);

//   const getIdToken = async () => currentUser ? await currentUser.getIdToken() : null;

//   const fetchCertificates = async () => {
//     try {
//       const idToken = await getIdToken();
//       if (!idToken) return;
//       const response = await fetch(`${API_BASE_URL}/api/v1/certificate`, {
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
//       });
//       if (response.ok) {
//         const data = await response.json();
//        // console.log('Fetched certificates:', data);
//         setCertificates(data);
//       }
//     } catch (err) { console.error(err); } finally { setLoading(false); }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFormData({ ...formData, file: e.target.files[0] });
//     }
//   };

//   const openAddDialog = () => {
//     setFormData({ title: '', issuer: '', issued_date: '', file: null });
//     setEditingCertificate(null);
//     setIsDialogOpen(true);
//   };

//   const openEditDialog = (cert: Certificate) => {
//     setFormData({ title: cert.title, issuer: cert.issuer, issued_date: cert.issued_date, file: cert.link });
//     setEditingCertificate(cert);
//     setIsDialogOpen(true);
//   };

//   const handleSubmit = async () => {
//     const idToken = await getIdToken();
//     if (!idToken) return;
//     const method = editingCertificate ? 'PATCH' : 'POST';
//     const endpoint = editingCertificate
//       ? `${API_BASE_URL}/api/v1/certificate/${editingCertificate.id}`
//       : `${API_BASE_URL}/api/v1/certificate/add`;

//     const body = new FormData();
//     body.append('title', formData.title);
//     body.append('issuer', formData.issuer);
//     body.append('issued_date', formData.issued_date);
//     if (formData.file) body.append('file', formData.file);

//     const response = await fetch(endpoint, {
//       method,
//       headers: { Authorization: `Bearer ${idToken}` },
//       body,
//     });

//     if (response.ok) {
//       await fetchCertificates();
//       setIsDialogOpen(false);
//       toast({ title: `Certificate ${editingCertificate ? 'updated' : 'added'}` });
//     } else {
//       toast({ title: 'Error', description: 'Failed to save certificate', variant: 'destructive' });
//     }
//   };

//   const handleDelete = async (id: string) => {
//     const idToken = await getIdToken();
//     if (!idToken) return;
//     const response = await fetch(`${API_BASE_URL}/api/v1/certificate/${id}`, {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
//     });
//     if (response.ok) {
//       setCertificates(certificates.filter(cert => cert.id !== id));
//       toast({ title: 'Certificate Deleted' });
//     } else {
//       toast({ title: 'Error', description: 'Failed to delete certificate', variant: 'destructive' });
//     }
//   };

//   if (loading) return <Card><CardHeader><CardTitle>Certificates</CardTitle><CardDescription>Loading...</CardDescription></CardHeader></Card>;

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <div>
//             <CardTitle>Certificates</CardTitle>
//             <CardDescription>Manage your professional certificates and achievements</CardDescription>
//           </div>
//           <Button onClick={openAddDialog} className="bg-jobathon-600 hover:bg-jobathon-700">
//             <Plus size={16} className="mr-1" /> Add Certificate
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {certificates.map(cert => (
//             <div key={cert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
//               <div className="flex flex-col h-full">
//                 <div className="mb-3">
//                   <a href={cert.link} target="_blank" rel="noopener noreferrer">
//                     <img src={cert_img} alt={cert.title} className="w-full h-32 object-cover rounded-md bg-gray-100" />
//                   </a>
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-medium text-sm mb-1 line-clamp-2">{cert.title}</h3>
//                   <p className="text-xs text-gray-500 mb-1">{cert.issuer}</p>
//                   <p className="text-xs text-gray-400">{cert.issued_date}</p>
//                 </div>
//                 <div className="flex space-x-2 mt-3">
//                   <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(cert)}>
//                     <Edit size={14} className="mr-1" /> Edit
//                   </Button>
//                   <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(cert.id)}>
//                     <Trash2 size={14} />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           ))}
// {/*
//           <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 cursor-pointer" onClick={openAddDialog}>
//             <div className="text-center">
//               <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
//                 <Plus size={24} className="text-gray-500" />
//               </div>
//               <p className="text-sm text-gray-500">Add Certificate</p>
//             </div>
//           </div> */}
//         </div>
//       </CardContent>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{editingCertificate ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label>Title</Label>
//               <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
//             </div>
//             <div>
//               <Label>Issuer</Label>
//               <Input value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} />
//             </div>
//             <div>
//               <Label>Issued Date</Label>
//               <Input type="date" value={formData.issued_date} onChange={e => setFormData({ ...formData, issued_date: e.target.value })} />
//             </div>
//             <div>
//               <Label>Upload File (PDF or Image)</Label>
//               <Input type="file" onChange={handleFileChange} />
//             </div>
//             <div className="pt-2">
//               <Button onClick={handleSubmit} className="w-full">{editingCertificate ? 'Update' : 'Add'} Certificate</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// };

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

export const CertificatesView = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    issuer: string;
    issued_date: string;
    file: File | null;
  }>({
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
      const response = await fetch(`${API_BASE_URL}/api/v1/certificate`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCertificates(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const openAddDialog = () => {
    setFormData({ title: '', issuer: '', issued_date: '', file: null });
    setEditingCertificate(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (cert: Certificate) => {
    setFormData({
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

    const method = editingCertificate ? 'PATCH' : 'POST';
    const endpoint = editingCertificate
      ? `${API_BASE_URL}/api/v1/certificate/${editingCertificate.id}`
      : `${API_BASE_URL}/api/v1/certificate/add`;

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('issuer', formData.issuer);
      form.append('issued_date', formData.issued_date);
      if (formData.file instanceof File) form.append('file', formData.file);

      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${idToken}` },
        body: form,
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          title: 'Error',
          description: result?.detail || 'Failed to save certificate',
          variant: 'destructive',
        });
        return;
      }

      await fetchCertificates();
      setIsDialogOpen(false);
      toast({ title: `Certificate ${editingCertificate ? 'updated' : 'added'} successfully` });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Unexpected error occurred.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    const idToken = await getIdToken();
    if (!idToken) return;
    const response = await fetch(`${API_BASE_URL}/api/v1/certificate/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
    });
    if (response.ok) {
      setCertificates(certificates.filter((cert) => cert.id !== id));
      toast({ title: 'Certificate Deleted' });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete certificate',
        variant: 'destructive',
      });
    }
  };

  if (loading)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );

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
            <Plus size={16} className="mr-1" /> Add Certificate
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
              <div className="flex flex-col h-full">
                <div className="mb-3">
                  <a href={cert.link} target="_blank" rel="noopener noreferrer">
                    <img
                      src={cert_img}
                      alt={cert.title}
                      className="w-full h-32 object-cover rounded-md bg-gray-100"
                    />
                  </a>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{cert.title}</h3>
                  <p className="text-xs text-gray-500 mb-1">{cert.issuer}</p>
                  <p className="text-xs text-gray-400">{cert.issued_date}</p>
                </div>
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
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCertificate ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Issuer</Label>
              <Input
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              />
            </div>
            <div>
              <Label>Issued Date</Label>
              <Input
                type="date"
                value={formData.issued_date}
                onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Upload File (PDF or Image)</Label>
              <Input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />
            </div>
            <div className="pt-2">
              <Button onClick={handleSubmit} className="w-full">
                {editingCertificate ? 'Update' : 'Add'} Certificate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
