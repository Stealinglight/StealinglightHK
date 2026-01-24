import { motion } from 'motion/react';
import { useState } from 'react';
import { Play } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Commercial Aerial',
    category: 'Drone Cinematography',
    image:
      'https://images.unsplash.com/photo-1668883738061-e46019b0b9fe?auto=format&fit=crop&w=800&q=80',
    description: 'High-end aerial cinematography for commercial and documentary productions',
  },
  {
    id: 2,
    title: 'Dynamic Movement',
    category: 'Gimbal & Steadycam',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    description: 'Fluid tracking shots and seamless camera movement for film and commercials',
  },
  {
    id: 3,
    title: 'Time Freeze',
    category: 'Bullet Time',
    image:
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    description: 'Innovative bullet time techniques for events, commercials, and music videos',
  },
  {
    id: 4,
    title: 'Immersive 360',
    category: '360° & VR Content',
    image:
      'https://images.unsplash.com/photo-1619677453024-4a667157c568?auto=format&fit=crop&w=800&q=80',
    description: '360-degree video production and immersive VR experiences',
  },
];

export function Portfolio() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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

        {/* Featured Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 relative overflow-hidden aspect-video group cursor-pointer rounded-lg"
        >
          <img
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=80"
            alt="Featured project"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-cinematic-black/50 group-hover:bg-cinematic-black/60 transition-all duration-300" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full bg-cinematic-amber/90 flex items-center justify-center mb-6 group-hover:bg-cinematic-amber transition-all duration-300"
            >
              <Play className="w-8 h-8 ml-1 text-cinematic-black" fill="currentColor" />
            </motion.div>
            <span className="text-white/60 text-sm tracking-widest mb-3">FEATURED PROJECT</span>
            <h3 className="text-white mb-3 text-2xl md:text-3xl">Cinematic Showreel</h3>
            <p className="text-white/60 max-w-2xl text-sm md:text-base">
              A compilation of compelling work showcasing visual storytelling across various mediums
            </p>
          </div>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative overflow-hidden cursor-pointer aspect-[4/3] rounded-lg"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Default overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black/80 via-cinematic-black/20 to-transparent" />

              {/* Hover overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                className="absolute inset-0 bg-cinematic-black/80 flex flex-col items-center justify-center p-8 text-center"
              >
                <span className="text-cinematic-amber text-sm tracking-widest mb-2">
                  {project.category}
                </span>
                <h3 className="text-white mb-4">{project.title}</h3>
                <p className="text-white/60 text-sm">{project.description}</p>
              </motion.div>

              {/* Bottom info (visible when not hovered) */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 ${
                  hoveredId === project.id ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span className="text-cinematic-amber text-xs tracking-widest">
                  {project.category}
                </span>
                <h4 className="text-white text-lg mt-1">{project.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
