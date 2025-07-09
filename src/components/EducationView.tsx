// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Edit, Trash2, Plus, GraduationCap } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { useAuth } from '@/context/AuthContext';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// interface Education {
//   id: string;
//   institution: string;
//   degree: string;
//   field: string;
//   startDate: string;
//   endDate: string;
//   gpa?: string;
//   description?: string;
// }

// export const EducationView = () => {
//   const [educationList, setEducationList] = useState<Education[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { currentUser } = useAuth();
//   const { toast } = useToast();

//   // Fetch education on component mount
//   useEffect(() => {
//     fetchEducation();
//   }, []);

//   const getIdToken = async () => {
//     if (!currentUser) return null;
//     return await currentUser.getIdToken();
//   };

//   const fetchEducation = async () => {
//     try {
//       const idToken = await getIdToken();
//       if (!idToken) return;

//       const response = await fetch(`${API_BASE_URL}/api/v1/education`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${idToken}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setEducationList(data);
//       } else {
//         console.error('Failed to fetch education');
//       }
//     } catch (error) {
//       console.error('Error fetching education:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleAddNew = async () => {
//     try {
//       const idToken = await getIdToken();
//       if (!idToken) return;

//       // Sample data for adding new education
//       const newEducationData = {
//         institution: "New University",
//         degree: "Bachelor's Degree",
//         field: "Computer Science",
//         startDate: "2020",
//         endDate: "2024",
//         gpa: "3.5",
//         description: "Relevant coursework and achievements"
//       };

//       const response = await fetch(`${API_BASE_URL}/api/v1/education/add`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${idToken}`,
//         },
//         body: JSON.stringify(newEducationData),
//       });

//       if (response.ok) {
//         const newEducation = await response.json();
//         setEducationList([...educationList, newEducation]);
//         toast({
//           title: "Education Added",
//           description: "New education record has been added successfully.",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to add education record.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error('Error adding education:', error);
//       toast({
//         title: "Error",
//         description: "Failed to add education record.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleEdit = async (id: string) => {
//     try {
//       const idToken = await getIdToken();
//       if (!idToken) return;

//       // Sample data for updating education
//       const updateData = {
//         institution: "Updated University",
//         degree: "Updated Degree",
//         field: "Updated Field",
//         startDate: "2020",
//         endDate: "2024",
//         gpa: "3.8",
//         description: "Updated description"
//       };

//       const response = await fetch(`${API_BASE_URL}/api/v1/education/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${idToken}`,
//         },
//         body: JSON.stringify(updateData),
//       });

//       if (response.ok) {
//         const updatedEducation = await response.json();
//         setEducationList(educationList.map(edu =>
//           edu.id === id ? updatedEducation : edu
//         ));
//         toast({
//           title: "Education Updated",
//           description: "Education record has been updated successfully.",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to update education record.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error('Error updating education:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update education record.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       const idToken = await getIdToken();
//       if (!idToken) return;

//       const response = await fetch(`${API_BASE_URL}/api/v1/education/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${idToken}`,
//         },
//       });

//       if (response.ok) {
//         setEducationList(educationList.filter(edu => edu.id !== id));
//         toast({
//           title: "Education Deleted",
//           description: "Education record has been removed successfully.",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to delete education record.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error('Error deleting education:', error);
//       toast({
//         title: "Error",
//         description: "Failed to delete education record.",
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Education</CardTitle>
//           <CardDescription>Loading education records...</CardDescription>
//         </CardHeader>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <div>
//             <CardTitle>Education</CardTitle>
//             <CardDescription>Manage your educational background and qualifications</CardDescription>
//           </div>
//           <Button onClick={handleAddNew} className="bg-jobathon-600 hover:bg-jobathon-700">
//             <Plus size={16} className="mr-1" />
//             Add Education
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {educationList.map((education) => (
//             <div key={education.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between">
//                 <div className="flex space-x-3 flex-1">
//                   <div className="h-12 w-12 rounded-full bg-jobathon-100 flex items-center justify-center text-jobathon-700 flex-shrink-0">
//                     <GraduationCap size={20} />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-medium text-lg">{education.degree}</h3>
//                     <p className="text-gray-600">{education.field}</p>
//                     <p className="text-sm text-gray-500 mb-2">{education.institution}</p>
//                     <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
//                       <span>{education.startDate} - {education.endDate}</span>
//                       {education.gpa && <span>GPA: {education.gpa}</span>}
//                     </div>
//                     {education.description && (
//                       <p className="text-sm text-gray-600">{education.description}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex space-x-2 ml-4">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleEdit(education.id)}
//                   >
//                     <Edit size={14} className="mr-1" />
//                     Edit
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                     onClick={() => handleDelete(education.id)}
//                   >
//                     <Trash2 size={14} />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Add New Education Card */}
//           <div
//             className="border border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center hover:border-gray-400 cursor-pointer transition-colors"
//             onClick={handleAddNew}
//           >
//             <div className="text-center">
//               <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
//                 <Plus size={24} className="text-gray-500" />
//               </div>
//               <p className="text-sm text-gray-500">Add Education Record</p>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * What the API returns
 */
interface EducationApiResponse {
  id: string;
  institution: string;
  degree: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa?: number;
  honors?: string;
}

/**
 * What our UI uses
 */
interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export const EducationView = () => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    honors: '',
  });

  const getIdToken = async () => (currentUser ? await currentUser.getIdToken() : null);

  // Load list
  const fetchEducation = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/v1/education`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Fetch failed');

      const data = (await res.json()) as EducationApiResponse[];
      setEducationList(
        data.map((e) => ({
          id: e.id,
          institution: e.institution,
          degree: e.degree,
          location: e.location,
          startDate: e.start_date,
          endDate: e.end_date,
          gpa: e.gpa?.toString(),
          honors: e.honors,
        }))
      );
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Could not load education records.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  // Open Add vs. Edit
  const openAddModal = () => {
    setEditingEdu(null);
    setFormData({
      institution: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingEdu(edu);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      location: edu.location,
      startDate: edu.startDate?.slice(0, 10) || '',
      endDate: edu.endDate?.slice(0, 10) || '',
      gpa: edu.gpa || '',
      honors: edu.honors || '',
    });
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async () => {
    const token = await getIdToken();
    if (!token) return;

    // Build snake_case payload
    const payloadBase = {
      institution: formData.institution,
      degree: formData.degree,
      location: formData.location,
      start_date: new Date(formData.startDate).toISOString(),
      end_date: new Date(formData.endDate).toISOString(),
      gpa: formData.gpa ? parseFloat(formData.gpa) : undefined,
      honors: formData.honors,
    };

    try {
      if (editingEdu) {
        // EDIT
        const res = await fetch(`${API_BASE_URL}/api/v1/education/${editingEdu.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payloadBase),
        });
        if (!res.ok) throw new Error('Update failed');

        const updated = (await res.json()) as EducationApiResponse;
        const mapped = {
          id: updated.id,
          institution: updated.institution,
          degree: updated.degree,
          location: updated.location,
          startDate: updated.start_date,
          endDate: updated.end_date,
          gpa: updated.gpa?.toString(),
          honors: updated.honors,
        };
        setEducationList((prev) => prev.map((e) => (e.id === mapped.id ? mapped : e)));
        toast({ title: 'Updated', description: 'Record updated.' });
      } else {
        // ADD
        const res = await fetch(`${API_BASE_URL}/api/v1/education/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([payloadBase]),
        });
        if (!res.ok) throw new Error('Add failed');

        const result = await res.json();
        const arr = Array.isArray(result) ? result : [result];
        const mappedNew = (arr as EducationApiResponse[]).map((e) => ({
          id: e.id,
          institution: e.institution,
          degree: e.degree,
          location: e.location,
          startDate: e.start_date,
          endDate: e.end_date,
          gpa: e.gpa?.toString(),
          honors: e.honors,
        }));
        setEducationList((prev) => [...prev, ...mappedNew]);
        toast({ title: 'Added', description: 'Record added.' });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: editingEdu ? 'Failed to update record.' : 'Failed to add record.',
        variant: 'destructive',
      });
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    const token = await getIdToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/education/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Delete failed');
      setEducationList((prev) => prev.filter((e) => e.id !== id));
      toast({ title: 'Deleted', description: 'Record removed.' });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to delete record.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>Loading…</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Education</CardTitle>
              <CardDescription>Manage your educational background</CardDescription>
            </div>
            <Button onClick={openAddModal} className="bg-jobathon-600">
              <Plus size={16} className="mr-1" />
              Add Education
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {educationList.map((edu) => (
            <div
              key={edu.id}
              className="border rounded-lg p-4 flex justify-between items-start hover:shadow"
            >
              <div className="flex space-x-3">
                <div className="h-12 w-12 rounded-full bg-jobathon-100 flex items-center justify-center">
                  <GraduationCap size={20} className="text-jobathon-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.location}</p>
                  <p className="text-sm text-gray-500 mb-1">{edu.institution}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    {edu.startDate?.slice(0, 10) || 'N/A'} to {edu.endDate?.slice(0, 10) || 'N/A'}{' '}
                    {edu.gpa && <span>· GPA: {edu.gpa}</span>}
                  </p>
                  {edu.honors && <p className="text-sm text-gray-600">{edu.honors}</p>}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(edu)}>
                  <Edit size={14} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(edu.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}

          {/* dashed “Add” card */}
          {/* <div
            key="add-education-record"
            className="border border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center hover:border-gray-400 cursor-pointer transition-colors"
            onClick={openAddModal}
          >
            <Plus size={24} className="text-gray-500" />
            <span className="ml-2 text-gray-500">Add Education Record</span>
          </div> */}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEdu ? 'Edit Education' : 'Add Education'}</DialogTitle>
            <DialogDescription>
              {editingEdu
                ? 'Update your education record below.'
                : 'Fill in your education details.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    institution: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => setFormData((f) => ({ ...f, degree: e.target.value }))}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="gpa">GPA</Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                value={formData.gpa}
                onChange={(e) => setFormData((f) => ({ ...f, gpa: e.target.value }))}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="honors">Honors / Description</Label>
              <Textarea
                id="honors"
                rows={2}
                value={formData.honors}
                onChange={(e) => setFormData((f) => ({ ...f, honors: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{editingEdu ? 'Save Changes' : 'Add Education'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
