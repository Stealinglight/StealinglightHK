/**
 * Types for Creative site
 */

export interface Project {
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  tags: string[];
  featured?: boolean;
  date: string;
}

export interface VideoAsset {
  url: string;
  posterUrl: string;
  title: string;
  duration?: string;
}
