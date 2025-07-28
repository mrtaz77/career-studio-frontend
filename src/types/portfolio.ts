export interface PortfolioPersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  summary: string;
  avatar?: string;
}

export interface PortfolioExperience {
  id: string | null;
  title: string;
  company: string;
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

export interface PortfolioEducation {
  id: string | null;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface PortfolioCertificate {
  id: string | null;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface PortfolioSocialLink {
  id: string | null;
  platform: string;
  url: string;
  icon: string;
}

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
  skills: PortfolioSkill[];
  education: PortfolioEducation[];
  certificates: PortfolioCertificate[];
  socialLinks: PortfolioSocialLink[];
}

export interface Portfolio {
  id: string | null;
  title: string;
  slug: string;
  theme: string;
  published: boolean;
  shareableUrl?: string;
  content: PortfolioContent;
  createdAt: string;
  updatedAt: string;
}

export const defaultPortfolioContent: PortfolioContent = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    summary: '',
    avatar: '',
  },
  experiences: [],
  projects: [],
  skills: [],
  education: [],
  certificates: [],
  socialLinks: [],
};

export const portfolioTemplates: PortfolioTheme[] = [
  {
    id: 'tamim',
    name: 'Tamim Portfolio',
    description: 'Clean and professional design with a focus on content',
    preview: '/templates/tamim-preview.png',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1e293b',
    },
    layout: 'professional',
  },
  {
    id: 'mahir',
    name: 'Mahir Academic',
    description: 'Academic-focused template with research highlights',
    preview: '/templates/mahir-preview.png',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#dc2626',
      background: '#f9fafb',
      text: '#111827',
    },
    layout: 'minimal',
  },
  {
    id: 'mushtari',
    name: 'Mushtari Creative',
    description: 'Creative and colorful design perfect for designers',
    preview: '/templates/mushtari-preview.png',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#06b6d4',
      background: '#fefefe',
      text: '#374151',
    },
    layout: 'creative',
  },
];
