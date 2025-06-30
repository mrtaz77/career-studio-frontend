import { useState, useEffect, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Download } from 'lucide-react';

interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
}

interface CVEditorProps {
  open: boolean;
  onClose: () => void;
}

export const CVEditor = ({ open, onClose }: CVEditorProps) => {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    summary: '',
    experience: [{ title: '', company: '', duration: '', description: '' }],
    education: [{ degree: '', institution: '', year: '' }],
    skills: [''],
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load existing CV data on mount
  useEffect(() => {
    const savedCV = localStorage.getItem('cvData');
    if (savedCV) {
      try {
        setCvData(JSON.parse(savedCV));
      } catch (error) {
        console.error('Error loading CV data:', error);
      }
    }
  }, [open]);

  // Auto-save function
  const saveCV = useCallback(async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('cvData', JSON.stringify(cvData));
      setLastSaved(new Date());
      console.log('CV auto-saved at:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error saving CV:', error);
    } finally {
      setIsSaving(false);
    }
  }, [cvData]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      saveCV();
    }, 10000);

    return () => clearInterval(interval);
  }, [saveCV, open]);

  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }));
  };

  const addExperience = () => {
    setCvData((prev) => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }],
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }));
  };

  const addEducation = () => {
    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }],
    }));
  };

  const updateSkills = (index: number, value: string) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
    }));
  };

  const addSkill = () => {
    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, ''],
    }));
  };

  const downloadCV = () => {
    // Create a simple HTML CV template
    const cvHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CV - ${cvData.personalInfo.name}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .section { margin: 20px 0; }
            .section h2 { color: #333; border-bottom: 1px solid #ccc; }
            
            .experience-item { margin: 10px 0; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${cvData.personalInfo.name}</h1>
            <p>${cvData.personalInfo.email} | ${cvData.personalInfo.phone}</p>
            <p>${cvData.personalInfo.address}</p>
          </div>
          
          <div class="section">
            <h2>Professional Summary</h2>
            <p>${cvData.summary}</p>
          </div>
          
          <div class="section">
            <h2>Experience</h2>
            ${cvData.experience
              .map(
                (exp) => `
              <div class="experience-item">
                <h3>${exp.title} at ${exp.company}</h3>
                <p><strong>${exp.duration}</strong></p>
                <p>${exp.description}</p>
              </div>
            `
              )
              .join('')}
          </div>
          
          <div class="section">
            <h2>Education</h2>
            ${cvData.education
              .map(
                (edu) => `
              <div class="education-item">
                <h3>${edu.degree}</h3>
                <p>${edu.institution} - ${edu.year}</p>
              </div>
            `
              )
              .join('')}
          </div>
          
          <div class="section">
            <h2>Skills</h2>
            <div class="skills">
              ${cvData.skills
                .filter((skill) => skill.trim())
                .map(
                  (skill) => `
                <span class="skill">${skill}</span>
              `
                )
                .join('')}
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([cvHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV-${cvData.personalInfo.name || 'Resume'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'CV Downloaded',
      description: 'Your CV has been downloaded as an HTML file.',
      variant: 'default',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="
          fixed inset-x-0 bottom-0      /* span full width at bottom */
          h-3/4   sm:h-[80vh]              /* control height */
          rounded-t-2xl                 /* round only the top corners */
          bg-white p-6 overflow-y-auto  /* your existing styles */
        "
      >
        <SheetHeader>
          <SheetTitle>Edit CV</SheetTitle>
          <SheetDescription>
            Make changes to your CV. Auto-saves every 10 seconds.
            {lastSaved && (
              <span className="text-green-600 text-sm block">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={cvData.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={cvData.personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Professional Summary</h3>
            <Textarea
              value={cvData.summary}
              onChange={(e) => setCvData((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="Write a brief summary of your professional background..."
              rows={4}
            />
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Experience</h3>
              <Button onClick={addExperience} variant="outline" size="sm">
                Add Experience
              </Button>
            </div>
            {cvData.experience.map((exp, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      placeholder="Software Developer"
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="Tech Corp"
                    />
                  </div>
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={exp.duration}
                    onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    placeholder="Jan 2020 - Present"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          {/* <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Education</h3>
              <Button onClick={addEducation} variant="outline" size="sm">
                Add Education
              </Button>
            </div>
            {cvData.education.map((edu, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Bachelor of Science in Computer Science"
                    />
                  </div>
                  <div>
                    <Label>Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="University of Technology"
                    />
                  </div>
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={edu.year}
                    onChange={(e) => updateEducation(index, 'year', e.target.value)}
                    placeholder="2020"
                  />
                </div>
              </div>
            ))}
          </div> */}

          {/* Skills */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Skills</h3>
              <Button onClick={addSkill} variant="outline" size="sm">
                Add Skill
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cvData.skills.map((skill, index) => (
                <Input
                  key={index}
                  value={skill}
                  onChange={(e) => updateSkills(index, e.target.value)}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6">
            <Button onClick={saveCV} disabled={isSaving} className="flex items-center gap-2">
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Now'}
            </Button>
            <Button onClick={downloadCV} variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Download CV
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// import { useState, useEffect, useCallback } from 'react';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from '@/components/ui/sheet';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/hooks/use-toast';
// import { Save, Zap, Download } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

// interface Experience {
//   job_title: string;
//   position: string;
//   company: string;
//   company_url: string;
//   company_logo: string;
//   location: string;
//   employment_type: string;
//   location_type: string;
//   industry: string;
//   start_date: string;
//   end_date: string;
//   description: string;
// }

// interface PublicationURL {
//   id: number | null;
//   label: string;
//   url: string;
//   source_type: 'publication';
// }

// interface Publication {
//   title: string;
//   journal: string;
//   year: number;
//   urls: PublicationURL[];
// }

// interface TechnicalSkill {
//   name: string;
//   category: string;
// }

// interface Technology {
//   technology: string;
// }

// interface ProjectURL {
//   label: string;
//   url: string;
//   source_type: 'project';
// }

// interface Project {
//   name: string;
//   description: string;
//   technologies: Technology[];
//   urls: ProjectURL[];
// }

// interface DraftData {
//   experiences: Experience[];
//   publications: Publication[];
//   technical_skills: TechnicalSkill[];
//   projects: Project[];
// }

// interface CVEditorProps {
//   open: boolean;
//   onClose: () => void;
//   cvId: number | null;
// }

// export const CVEditor = ({ open, onClose, cvId }: CVEditorProps) => {
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const { currentUser } = useAuth();
//   const { toast } = useToast();
//   const [draftData, setDraftData] = useState<DraftData>({
//     experiences: [],
//     publications: [],
//     technical_skills: [],
//     projects: [],
//   });
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);

//   // 1️⃣ Fetch existing CV data
//   const fetchCv = useCallback(async () => {
//     if (!cvId || !currentUser) return;
//     try {
//       const idToken = await currentUser.getIdToken();
//       const res = await fetch(
//         `${API_BASE_URL}/api/v1/cv/${cvId}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${idToken}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error('Could not load CV');
//       const data = await res.json();
//       setDraftData({
//         experiences: data.experiences || [],
//         publications: data.publications || [],
//         technical_skills: data.technical_skills || [],
//         projects: data.projects || [],
//       });
//     } catch (err) {
//       console.error(err);
//       toast({ title: 'Error', description: 'Failed loading CV.', variant: 'destructive' });
//     }
//   }, [cvId, currentUser, toast]);

//   useEffect(() => {
//     if (open) fetchCv();
//   }, [open, fetchCv]);

//   // 2️⃣ Autosave every 10 seconds
//   useEffect(() => {
//     if (!open || !cvId || !currentUser) return;
//     const interval = setInterval(async () => {
//       try {
//         const idToken = await currentUser.getIdToken();
//         await fetch(
//           `${API_BASE_URL}/api/v1/cv/autosave`,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${idToken}`,
//             },
//             body: JSON.stringify({
//               cv_id: cvId,
//               draft_data: draftData,
//             }),
//           }
//         );
//         setLastSaved(new Date());
//       } catch (err) {
//         console.error('Auto-save failed', err);
//       }
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [open, cvId, draftData, currentUser]);

//   // 3️⃣ Manual Save
//   const handleSave = async () => {
//     if (!cvId || !currentUser) return;
//     setIsSaving(true);
//     try {
//       const idToken = await currentUser.getIdToken();
//       await fetch(
//         `${API_BASE_URL}/api/v1/cv/save`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${idToken}`,
//           },
//           body: JSON.stringify({
//             cv_id: cvId,
//             content: draftData,
//             pdf_url: null,
//           }),
//         }
//       );
//       setLastSaved(new Date());
//       toast({ title: 'Saved', description: 'Your CV was saved.' });
//     } catch (err) {
//       console.error(err);
//       toast({ title: 'Error', description: 'Save failed.', variant: 'destructive' });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // 4️⃣ Generate PDF
//   const handleGenerate = async () => {
//     if (!cvId || !currentUser) return;
//     setIsGenerating(true);
//     try {
//       const idToken = await currentUser.getIdToken();
//       const res = await fetch(
//         `${API_BASE_URL}/api/v1/cv/generate`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${idToken}`,
//           },
//           body: JSON.stringify({
//             cv_id: cvId,
//             draft_data: draftData,
//             force_regenerate: true,
//           }),
//         }
//       );
//       if (!res.ok) throw new Error('Generate failed');
//       toast({ title: 'Generated', description: 'Your CV PDF is ready.' });
//     } catch (err) {
//       console.error(err);
//       toast({ title: 'Error', description: 'Generate failed.', variant: 'destructive' });
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // 🛠️ Handlers to keep draftData in sync
//   const updateExperience = (i: number, field: keyof Experience, val: string) => {
//     setDraftData(d => ({
//       ...d,
//       experiences: d.experiences.map((e, idx) =>
//         idx === i ? { ...e, [field]: val } : e
//       ),
//     }));
//   };
//   const addExperience = () => {
//     setDraftData(d => ({
//       ...d,
//       experiences: [
//         ...d.experiences,
//         {
//           job_title: '',
//           position: '',
//           company: '',
//           company_url: '',
//           company_logo: '',
//           location: '',
//           employment_type: '',
//           location_type: '',
//           industry: '',
//           start_date: '',
//           end_date: '',
//           description: '',
//         },
//       ],
//     }));
//   };

//   const updatePublication = (i: number, field: keyof Publication, val: any) => {
//     setDraftData(d => ({
//       ...d,
//       publications: d.publications.map((p, idx) =>
//         idx === i ? { ...p, [field]: val } : p
//       ),
//     }));
//   };
//   const addPublication = () => {
//     setDraftData(d => ({
//       ...d,
//       publications: [
//         ...d.publications,
//         { title: '', journal: '', year: new Date().getFullYear(), urls: [] },
//       ],
//     }));
//   };
//   const updatePublicationUrl = (pi: number, ui: number, field: keyof PublicationURL, val: any) => {
//     setDraftData(d => ({
//       ...d,
//       publications: d.publications.map((p, idx) => {
//         if (idx !== pi) return p;
//         return {
//           ...p,
//           urls: p.urls.map((u, j) =>
//             j === ui ? { ...u, [field]: val } : u
//           ),
//         };
//       }),
//     }));
//   };
//   const addPublicationUrl = (pi: number) => {
//     setDraftData(d => ({
//       ...d,
//       publications: d.publications.map((p, idx) =>
//         idx === pi
//           ? {
//               ...p,
//               urls: [
//                 ...p.urls,
//                 { id: null, label: '', url: '', source_type: 'publication' },
//               ],
//             }
//           : p
//       ),
//     }));
//   };

//   const updateTechnicalSkill = (i: number, field: keyof TechnicalSkill, val: string) => {
//     setDraftData(d => ({
//       ...d,
//       technical_skills: d.technical_skills.map((s, idx) =>
//         idx === i ? { ...s, [field]: val } : s
//       ),
//     }));
//   };
//   const addTechnicalSkill = () => {
//     setDraftData(d => ({
//       ...d,
//       technical_skills: [...d.technical_skills, { name: '', category: '' }],
//     }));
//   };

//   const updateProject = (i: number, field: keyof Project, val: any) => {
//     setDraftData(d => ({
//       ...d,
//       projects: d.projects.map((pr, idx) =>
//         idx === i ? { ...pr, [field]: val } : pr
//       ),
//     }));
//   };
//   const addProject = () => {
//     setDraftData(d => ({
//       ...d,
//       projects: [...d.projects, { name: '', description: '', technologies: [], urls: [] }],
//     }));
//   };
//   const updateProjectTech = (pi: number, ti: number, val: string) => {
//     setDraftData(d => ({
//       ...d,
//       projects: d.projects.map((pr, idx) => {
//         if (idx !== pi) return pr;
//         return {
//           ...pr,
//           technologies: pr.technologies.map((t, j) =>
//             j === ti ? { technology: val } : t
//           ),
//         };
//       }),
//     }));
//   };
//   const addProjectTech = (pi: number) => {
//     setDraftData(d => ({
//       ...d,
//       projects: d.projects.map((pr, idx) =>
//         idx === pi
//           ? { ...pr, technologies: [...pr.technologies, { technology: '' }] }
//           : pr
//       ),
//     }));
//   };
//   const updateProjectUrl = (pi: number, ui: number, val: string) => {
//     setDraftData(d => ({
//       ...d,
//       projects: d.projects.map((pr, idx) => {
//         if (idx !== pi) return pr;
//         return {
//           ...pr,
//           urls: pr.urls.map((u, j) =>
//             j === ui ? { ...u, url: val } : u
//           ),
//         };
//       }),
//     }));
//   };
//   const addProjectUrl = (pi: number) => {
//     setDraftData(d => ({
//       ...d,
//       projects: d.projects.map((pr, idx) =>
//         idx === pi
//           ? {
//               ...pr,
//               urls: [
//                 ...pr.urls,
//                 { label: '', url: '', source_type: 'project' },
//               ],
//             }
//           : pr
//       ),
//     }));
//   };

//   // Download fallback as HTML
//   const downloadCV = () => {
//     const html = `<!DOCTYPE html><html><body><h1>Your CV</h1></body></html>`;
//     const blob = new Blob([html], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `cv-${cvId}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     toast({ title: 'Downloaded', description: 'HTML version saved.' });
//   };

//   return (
//     <Sheet open={open} onOpenChange={onClose}>
//       <SheetContent
//         side="bottom"
//         className="fixed inset-x-0 bottom-0 h-3/4 sm:h-[80vh] rounded-t-2xl bg-white p-6 overflow-y-auto"
//       >
//         <SheetHeader>
//           <SheetTitle>Edit CV</SheetTitle>
//           <SheetDescription>
//             Auto-saving every 10s.
//             {lastSaved && (
//               <span className="text-green-600 text-sm block">
//                 Last saved: {lastSaved.toLocaleTimeString()}
//               </span>
//             )}
//           </SheetDescription>
//         </SheetHeader>

//         <div className="space-y-6 py-6">
//           {/* Experiences */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium">Experiences</h3>
//               <Button onClick={addExperience} variant="outline" size="sm">
//                 Add Experience
//               </Button>
//             </div>
//             {draftData.experiences.map((exp, i) => (
//               <div key={i} className="border p-4 rounded-lg space-y-3">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   <Input
//                     placeholder="Job Title"
//                     value={exp.job_title}
//                     onChange={e => updateExperience(i, 'job_title', e.target.value)}
//                   />
//                   <Input
//                     placeholder="Position"
//                     value={exp.position}
//                     onChange={e => updateExperience(i, 'position', e.target.value)}
//                   />
//                 </div>
//                 <Input
//                   placeholder="Company"
//                   value={exp.company}
//                   onChange={e => updateExperience(i, 'company', e.target.value)}
//                 />
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   <Input
//                     placeholder="Company URL"
//                     value={exp.company_url}
//                     onChange={e => updateExperience(i, 'company_url', e.target.value)}
//                   />
//                   <Input
//                     placeholder="Company Logo URL"
//                     value={exp.company_logo}
//                     onChange={e => updateExperience(i, 'company_logo', e.target.value)}
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                   <Input
//                     placeholder="Location"
//                     value={exp.location}
//                     onChange={e => updateExperience(i, 'location', e.target.value)}
//                   />
//                   <Input
//                     placeholder="Employment Type"
//                     value={exp.employment_type}
//                     onChange={e => updateExperience(i, 'employment_type', e.target.value)}
//                   />
//                   <Input
//                     placeholder="Location Type"
//                     value={exp.location_type}
//                     onChange={e => updateExperience(i, 'location_type', e.target.value)}
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                   <Input
//                     placeholder="Industry"
//                     value={exp.industry}
//                     onChange={e => updateExperience(i, 'industry', e.target.value)}
//                   />
//                   <Input
//                     type="date"
//                     placeholder="Start Date"
//                     value={exp.start_date}
//                     onChange={e => updateExperience(i, 'start_date', e.target.value)}
//                   />
//                   <Input
//                     type="date"
//                     placeholder="End Date"
//                     value={exp.end_date}
//                     onChange={e => updateExperience(i, 'end_date', e.target.value)}
//                   />
//                 </div>
//                 <Textarea
//                   rows={3}
//                   placeholder="Description"
//                   value={exp.description}
//                   onChange={e => updateExperience(i, 'description', e.target.value)}
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Publications */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium">Publications</h3>
//               <Button onClick={addPublication} variant="outline" size="sm">
//                 Add Publication
//               </Button>
//             </div>
//             {draftData.publications.map((pub, i) => (
//               <div key={i} className="border p-4 rounded-lg space-y-3">
//                 <Input
//                   placeholder="Title"
//                   value={pub.title}
//                   onChange={e => updatePublication(i, 'title', e.target.value)}
//                 />
//                 <Input
//                   placeholder="Journal"
//                   value={pub.journal}
//                   onChange={e => updatePublication(i, 'journal', e.target.value)}
//                 />
//                 <Input
//                   type="number"
//                   placeholder="Year"
//                   value={pub.year}
//                   onChange={e => updatePublication(i, 'year', Number(e.target.value))}
//                 />
//                 <div className="space-y-2">
//                   {pub.urls.map((u, ui) => (
//                     <div key={ui} className="flex gap-2">
//                       <Input
//                         placeholder="Label"
//                         value={u.label}
//                         onChange={e => updatePublicationUrl(i, ui, 'label', e.target.value)}
//                       />
//                       <Input
//                         placeholder="URL"
//                         value={u.url}
//                         onChange={e => updatePublicationUrl(i, ui, 'url', e.target.value)}
//                       />
//                     </div>
//                   ))}
//                   <Button onClick={() => addPublicationUrl(i)} variant="outline" size="sm">
//                     Add URL
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Technical Skills */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium">Technical Skills</h3>
//               <Button onClick={addTechnicalSkill} variant="outline" size="sm">
//                 Add Skill
//               </Button>
//             </div>
//             {draftData.technical_skills.map((s, i) => (
//               <div key={i} className="flex gap-2">
//                 <Input
//                   placeholder="Name"
//                   value={s.name}
//                   onChange={e => updateTechnicalSkill(i, 'name', e.target.value)}
//                 />
//                 <Input
//                   placeholder="Category"
//                   value={s.category}
//                   onChange={e => updateTechnicalSkill(i, 'category', e.target.value)}
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Projects */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium">Projects</h3>
//               <Button onClick={addProject} variant="outline" size="sm">
//                 Add Project
//               </Button>
//             </div>
//             {draftData.projects.map((pr, i) => (
//               <div key={i} className="border p-4 rounded-lg space-y-3">
//                 <Input
//                   placeholder="Project Name"
//                   value={pr.name}
//                   onChange={e => updateProject(i, 'name', e.target.value)}
//                 />
//                 <Textarea
//                   rows={3}
//                   placeholder="Description"
//                   value={pr.description}
//                   onChange={e => updateProject(i, 'description', e.target.value)}
//                 />
//                 <div className="space-y-2">
//                   <h4 className="font-medium">Technologies</h4>
//                   {pr.technologies.map((t, ti) => (
//                     <Input
//                       key={ti}
//                       placeholder="Technology"
//                       value={t.technology}
//                       onChange={e => updateProjectTech(i, ti, e.target.value)}
//                     />
//                   ))}
//                   <Button onClick={() => addProjectTech(i)} variant="outline" size="sm">
//                     Add Technology
//                   </Button>
//                 </div>
//                 <div className="space-y-2">
//                   <h4 className="font-medium">URLs</h4>
//                   {pr.urls.map((u, ui) => (
//                     <Input
//                       key={ui}
//                       placeholder="URL"
//                       value={u.url}
//                       onChange={e => updateProjectUrl(i, ui, e.target.value)}
//                     />
//                   ))}
//                   <Button onClick={() => addProjectUrl(i)} variant="outline" size="sm">
//                     Add URL
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Actions */}
//           <div className="flex space-x-3 pt-6">
//             <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
//               <Save size={16} /> {isSaving ? 'Saving…' : 'Save Now'}
//             </Button>
//             <Button onClick={handleGenerate} disabled={isGenerating} className="flex items-center gap-2">
//               <Zap size={16} /> {isGenerating ? 'Generating…' : 'Generate PDF'}
//             </Button>
//             <Button variant="outline" onClick={downloadCV} className="flex items-center gap-2">
//               <Download size={16} /> Download HTML
//             </Button>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// };
