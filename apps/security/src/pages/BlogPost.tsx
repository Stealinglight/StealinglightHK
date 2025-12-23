import { useParams, Link } from 'react-router-dom';
import { Nav, Footer, Button, type NavLink } from '@stealinglight/ui';
import { BlogPost as BlogPostType } from '../types';
import postsData from '../data/posts.json';

const posts = postsData as BlogPostType[];

const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="page-container">
        <Nav currentMode="security" links={navLinks} />
        <main className="main-content">
          <div className="not-found">
            <h1>Post Not Found</h1>
            <p>The article you&apos;re looking for doesn&apos;t exist.</p>
            <Button variant="secondary" as="a" href="/blog">
              Back to Blog
            </Button>
          </div>
        </main>
        <Footer currentMode="security" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Nav currentMode="security" links={navLinks} />

      <main className="main-content">
        <article className="blog-post">
          <header className="post-header">
            <Link to="/blog" className="back-link">← Back to Blog</Link>
            <div className="post-meta">
              <span className="post-category">{post.category}</span>
              <span className="post-date">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="post-read-time">{post.readTime} min read</span>
            </div>
            <h1 className="post-title">{post.title}</h1>
            <p className="post-excerpt">{post.excerpt}</p>
          </header>

          <div className="post-content">
            {/* Simple markdown-like rendering */}
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={index}>
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d+\. /)) {
                const items = paragraph.split('\n').filter(line => line.match(/^\d+\. /));
                return (
                  <ol key={index}>
                    {items.map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\. /, '')}</li>
                    ))}
                  </ol>
                );
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </div>

          <footer className="post-footer">
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="post-tag">#{tag}</span>
              ))}
            </div>
            <div className="post-author">
              <span>Written by {post.author}</span>
            </div>
          </footer>
        </article>

        <section className="post-cta">
          <div className="container">
            <h3>Need Security Help?</h3>
            <p>Let&apos;s discuss how we can help secure your organization.</p>
            <Button variant="security" as="a" href="/contact">
              Get in Touch
            </Button>
          </div>
        </section>
      </main>

      <Footer currentMode="security" />
    </div>
  );
}
