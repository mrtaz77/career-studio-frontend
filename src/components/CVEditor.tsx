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
