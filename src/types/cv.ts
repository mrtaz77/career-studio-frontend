export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Education {
  id: string | null;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  honors: string;
}

export interface Experience {
  id: string | null;
  jobTitle: string;
  position: string;
  company: string;
  companyUrl: string;
  companyLogo: string;
  location: string;
  employmentType: string;
  locationType: 'remote' | 'on-site' | 'hybrid';
  industry: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Publication {
  id: string | null;
  title: string;
  journal: string;
  year: string;
  urls: Array<{
    label: string;
    url: string;
    source_type: 'project';
  }>;
}

export interface Skill {
  id: string | null;
  name: string;
  category: string;
}

export interface Project {
  id: string | null;
  name: string;
  description: string;
  technologies: Array<{
    name: string;
    id?: string;
  }>;
  urls: Array<{
    label: string;
    url: string;
    source_type: 'project';
  }>;
}

export interface SaveContent {
  title: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  publications: Publication[];
  technical_skills: Skill[];
  projects: Project[];
  education: Education[];
}

export interface CVData {
  cv_id: number;
  pdf_url: string;
  save_content: SaveContent;
}

export const defaultCVData: CVData = {
  cv_id: 0,
  pdf_url: '',
  save_content: {
    title: 'Professional CV',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    experiences: [],
    publications: [],
    technical_skills: [],
    projects: [],
    education: [],
  },
};
