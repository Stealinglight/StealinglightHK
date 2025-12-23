/**
 * Security App Types
 */

/** Blog post metadata */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readTime: number;
  featured?: boolean;
}

/** Service offering */
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  cta?: string;
}

/** Certification or credential */
export interface Certification {
  name: string;
  issuer: string;
  year: number;
  logo?: string;
}

/** Tool or technology */
export interface Tool {
  name: string;
  category: string;
  description?: string;
}
