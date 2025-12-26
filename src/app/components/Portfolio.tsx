import { motion } from 'motion/react';
import { useState } from 'react';
import { Play } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Commercial Aerial',
    category: 'Drone Cinematography',
    image: 'https://images.unsplash.com/photo-1668883738061-e46019b0b9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMGFlcmlhbCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2NjU3NTcxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'High-end aerial cinematography for commercial and documentary productions',
  },
  {
    id: 2,
    title: 'Dynamic Movement',
    category: 'Gimbal & Steadycam',
    image: 'https://images.unsplash.com/photo-1760782926423-50ee782ef076?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaW1iYWwlMjBjYW1lcmElMjBmaWxtaW5nfGVufDF8fHx8MTc2NjY0OTM0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Fluid tracking shots and seamless camera movement for film and commercials',
  },
  {
    id: 3,
    title: 'Time Freeze',
    category: 'Bullet Time',
    image: 'https://images.unsplash.com/photo-1729760859254-6e01411e1782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0aW9uJTIwbWFwcGluZyUyMGxpZ2h0fGVufDF8fHx8MTc2NjY0OTM0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Innovative bullet time techniques for events, commercials, and music videos',
  },
  {
    id: 4,
    title: 'Immersive 360',
    category: '360° & VR Content',
    image: 'https://images.unsplash.com/photo-1619677453024-4a667157c568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzNjAlMjBjYW1lcmElMjBpbW1lcnNpdmV8ZW58MXx8fHwxNzY2NjQ5MzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '360-degree video production and immersive VR experiences',
  },
];

export function Portfolio() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 tracking-wider">SELECTED WORK</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            A curated collection of projects showcasing my passion for visual storytelling
          </p>
        </motion.div>

        {/* Featured Video */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 relative overflow-hidden aspect-video group cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1762028895582-1d0b4c3822c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwcmVlbCUyMGNpbmVtYXRpY3xlbnwxfHx8fDE3NjY2NDg5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Featured project"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-6 group-hover:bg-white/10 transition-all duration-300"
            >
              <Play className="w-8 h-8 ml-1" fill="white" />
            </motion.div>
            <span className="text-white/90 text-sm tracking-widest mb-3">FEATURED PROJECT</span>
            <h3 className="text-white mb-3 text-3xl md:text-4xl">Cinematic Showreel 2024</h3>
            <p className="text-white/80 max-w-2xl">
              A compilation of my most compelling work, showcasing the breadth and depth of visual storytelling across various mediums
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative overflow-hidden cursor-pointer aspect-[4/3]"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-8 text-center"
              >
                <span className="text-white/70 text-sm tracking-widest mb-2">
                  {project.category}
                </span>
                <h3 className="text-white mb-4">{project.title}</h3>
                <p className="text-white/80 text-sm">{project.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}