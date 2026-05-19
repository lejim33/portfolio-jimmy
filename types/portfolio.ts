export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ProjectStat {
  value: string;
  label: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface ProjectUpdateItem {
  title: string;
  description: string;
  images?: string[];
}

export interface ProjectUpdate {
  date: string;
  title: string;
  items: ProjectUpdateItem[];
}

export interface ProjectDetail {
  fullDescription: string;
  images: string[];
  context: string;
  tools: string[];
  results: string;
  link: string;
  color: string;
  challenge: string;
  solution: string;
  role: string;
  duration: string;
  stats: ProjectStat[];
  process: ProcessStep[];
  testimonial: Testimonial | null;
  updates?: ProjectUpdate[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  tags: string[];
  date: string;
  client: string;
  featured: boolean;
  published?: boolean;
  detail: ProjectDetail;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Value {
  icon: string;
  title: string;
  description: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  subtitle: string;
  type: "education" | "work";
}

export interface TranslationsEn {
  hero?: Partial<{
    greeting: string;
    title: string;
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  }>;
  projects?: {
    sectionTitle?: string;
    sectionSubtitle?: string;
  };
  about?: Partial<{
    sectionTitle: string;
    bio: string;
    formation: string;
    alternance: string;
  }>;
  contact?: Partial<{
    sectionTitle: string;
    subtitle: string;
  }>;
  navbar?: {
    ctaLabel?: string;
  };
}

export interface PortfolioData {
  meta: {
    siteTitle: string;
    siteDescription: string;
    favicon: string;
    ogImage: string;
    lang: string;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontHeading: string;
    fontBody: string;
    borderRadius: string;
    animationSpeed: string;
  };
  navbar: {
    logo: string;
    links: NavLink[];
    ctaLabel: string;
    ctaHref: string;
  };
  hero: {
    greeting: string;
    name: string;
    title: string;
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    backgroundType: string;
    backgroundValue: string;
    avatar: string;
    socialLinks: SocialLink[];
    stats: HeroStat[];
  };
  projects: {
    sectionTitle: string;
    sectionSubtitle: string;
    layout: string;
    items: Project[];
  };
  about: {
    sectionTitle: string;
    bio: string;
    photo: string;
    formation: string;
    alternance: string;
    skills: SkillCategory[];
    skillLevels?: Record<string, number>;
    timeline?: TimelineEntry[];
    values: Value[];
    cvFile: string;
    stats: HeroStat[];
  };
  contact: {
    sectionTitle: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    formEnabled: boolean;
    formFields: string[];
    socialLinks: SocialLink[];
    availabilityTitle: string;
    availabilitySubtitle: string;
    availabilityStatus: string;
    availabilityVisible: boolean;
  };
  footer: {
    text: string;
    links: NavLink[];
  };
  sectionOrder?: string[];
  maintenanceMode?: boolean;
  translations?: { en?: TranslationsEn };
  analytics?: Record<string, number>;
}
