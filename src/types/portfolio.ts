export interface PortfolioPersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  bio: string;
  img?: string;
}

export interface PortfolioExperience {
  id: string | null;
  title: string;
  company: string;
  companyUrl?: string;
  industry?: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface PortfolioProject {
  id: string | null;
  name: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
  featured: boolean;
}

export interface PortfolioSkill {
  id: string | null;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}
export interface PortfolioPublication {
  id: string | null;
  title: string;
  description: string;
  link: string;
  date: string;
  authors: string[];
}
export interface PortfolioEducation {
  id: string | null;
  degree: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa?: string;
  honors?: string;
}

export interface PortfolioCertificate {
  // id: string | null;
  // name: string;
  // issuer: string;
  // issueDate: string;
  // credentialUrl?: string;
  id: string;
  issued_date: string;
  issuer: string;
  link: string;
  title: string;
}

// export interface PortfolioSocialLink {
//   id: string | null;
//   platform: string;
//   url: string;
//   icon: string;
// }

export interface PortfolioTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  layout: 'minimal' | 'creative' | 'professional';
}

export interface PortfolioContent {
  personalInfo: PortfolioPersonalInfo;
  experiences: PortfolioExperience[];
  projects: PortfolioProject[];
  technical_skills: PortfolioSkill[];
  education: PortfolioEducation[];
  certificates: PortfolioCertificate[];
  publications: PortfolioPublication[];
}

export interface Portfolio {
  id: string | null;
  title: string;
  slug: string;
  theme: string;
  is_public: boolean;
  shareableUrl?: string;
  content: PortfolioContent;
  createdAt: string;
  updatedAt: string;
}

// Public experience interface that matches the backend PublicExperienceOut schema
export interface PublicExperience {
  job_title: string;
  position: string;
  company: string;
  company_url: string;
  company_logo: string;
  location: string;
  employment_type: string;
  location_type: string;
  industry: string;
  start_date: string;
  end_date: string;
  description: string;
  current?: boolean; // Add this for frontend compatibility
}

// Public portfolio interface that matches the backend PublicPortfolioOut schema
export interface PublicPortfolio {
  theme: string;
  title: string;
  is_public: boolean;
  bio: string;
  created_at: string;
  updated_at: string;
  published_url?: string;
  published_at?: string;
  experiences: PublicExperience[];
  publications: PortfolioPublication[];
  technical_skills: PortfolioSkill[];
  projects: PortfolioProject[];
  certificates: PortfolioCertificate[];
  education: PortfolioEducation[];

  user_profile: PortfolioPersonalInfo;
  feedbacks: any[]; // Define proper type if needed
}

export const defaultPortfolioContent: PortfolioContent = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    bio: '',
    img: '',
  },
  experiences: [],
  projects: [],
  technical_skills: [],
  education: [],
  certificates: [],
  publications: [],
};

export const portfolioTemplates: PortfolioTheme[] = [
  {
    id: 'classic',
    name: 'Classic Portfolio',
    description: 'Clean and professional design with a focus on content',
    preview: '/templates/classic-preview.png',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#000000',
      text: '#1e293b',
    },
    layout: 'professional',
  },

  {
    id: 'modern',
    name: 'Modern Portfolio',
    description: ' Creative design perfect for designers',
    preview: '/templates/modern-preview.png',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#06b6d4',
      background: '#000000',
      text: '#374151',
    },
    layout: 'creative',
  },
];
