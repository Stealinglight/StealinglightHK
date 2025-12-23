import { Link } from 'react-router-dom';
import { BlogPost } from '../types';

interface PostCardProps {
  post: BlogPost;
}

/**
 * Blog post card for listing pages
 */
export function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <Link to={`/blog/${post.slug}`} className="post-card-link">
        <div className="post-card-meta">
          <span className="post-card-category">{post.category}</span>
          <span className="post-card-date">{new Date(post.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}</span>
        </div>
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <div className="post-card-footer">
          <span className="post-card-read-time">{post.readTime} min read</span>
          <span className="post-card-arrow">→</span>
        </div>
      </Link>
    </article>
  );
}
