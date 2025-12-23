import { useState } from 'react';
import { Nav, Footer, type NavLink } from '@stealinglight/ui';
import { PostCard } from '../components/PostCard';
import { BlogPost } from '../types';
import postsData from '../data/posts.json';

const posts = postsData as BlogPost[];
const categories = ['All', ...new Set(posts.map((p) => p.category))];

const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="page-container">
      <Nav currentMode="security" links={navLinks} />

      <main className="main-content">
        <section className="blog-hero">
          <h1>Security Blog</h1>
          <p className="blog-subtitle">
            Insights, research, and guides on cybersecurity
          </p>
        </section>

        <section className="blog-content">
          <div className="blog-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="no-posts">
              <p>No posts found in this category.</p>
            </div>
          )}
        </section>
      </main>

      <Footer currentMode="security" />
    </div>
  );
}
