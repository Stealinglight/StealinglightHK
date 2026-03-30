import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { featuredVideo, gridVideos } from '../config/videos';
import { useInView } from '../../hooks/useInView';

function LazyVideo({
  project,
  isHovered,
  onHover,
  onLeave,
  onClick,
  index,
}: {
  project: (typeof gridVideos)[number];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  index: number;
}) {
  const { ref, isInView } = useInView({ rootMargin: '200px' });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer aspect-video rounded-lg"
    >
      <div ref={ref} className="absolute inset-0">
        {/* Thumbnail always visible as base layer */}
        <img
          src={project.posterUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Video mounts only when scrolled into view */}
        {isInView && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            poster={project.posterUrl}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
      </div>

      {/* Default overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black/80 via-cinematic-black/20 to-transparent" />

      {/* Play button on hover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-16 h-16 rounded-full bg-cinematic-amber/90 flex items-center justify-center">
          <Play className="w-6 h-6 ml-1 text-cinematic-black" fill="currentColor" />
        </div>
      </motion.div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-cinematic-amber text-xs tracking-widest">{project.category}</span>
            <h4 className="text-white text-lg mt-1">{project.title}</h4>
          </div>
          <span className="text-white/50 text-sm">{project.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function Portfolio() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<typeof featuredVideo | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideo = (video: typeof featuredVideo) => {
    setActiveVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setActiveVideo(null);
    document.body.style.overflow = '';
  };

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-cinematic-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-white mb-4">Selected Work</h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            A curated collection of projects showcasing visual storytelling across various mediums
          </p>
        </motion.div>

        {/* Featured Video - always mounts eagerly (no lazy loading) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onClick={() => openVideo(featuredVideo)}
          className="mb-16 relative overflow-hidden aspect-video group cursor-pointer rounded-lg"
        >
          <video
            src={featuredVideo.videoUrl}
            poster={featuredVideo.posterUrl}
            muted
            loop
            playsInline
            preload="none"
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-cinematic-black/50 group-hover:bg-cinematic-black/40 transition-all duration-300" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full bg-cinematic-amber/90 flex items-center justify-center mb-6 group-hover:bg-cinematic-amber transition-all duration-300"
            >
              <Play className="w-8 h-8 ml-1 text-cinematic-black" fill="currentColor" />
            </motion.div>
            <span className="text-white/60 text-sm tracking-widest mb-3">FEATURED PROJECT</span>
            <h3 className="text-white mb-3 text-2xl md:text-3xl">{featuredVideo.title}</h3>
            <p className="text-white/60 max-w-2xl text-sm md:text-base">
              {featuredVideo.description}
            </p>
            <span className="text-cinematic-amber text-sm mt-4">{featuredVideo.duration}</span>
          </div>
        </motion.div>

        {/* Project Grid - lazy-loaded via IntersectionObserver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gridVideos.map((project, index) => (
            <LazyVideo
              key={project.id}
              project={project}
              isHovered={hoveredId === project.id}
              onHover={() => setHoveredId(project.id)}
              onLeave={() => setHoveredId(null)}
              onClick={() => openVideo(project)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-cinematic-black/95 p-4"
          onClick={closeVideo}
        >
          <button
            onClick={closeVideo}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Close video"
          >
            <X className="w-8 h-8" />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={activeVideo.videoUrl}
              controls
              autoPlay
              className="w-full aspect-video rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl">{activeVideo.title}</h3>
              <p className="text-white/60 mt-2">{activeVideo.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
