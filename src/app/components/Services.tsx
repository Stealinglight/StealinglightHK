import { motion } from 'motion/react';
import { Plane, Focus, Globe, WandSparkles } from 'lucide-react';

const services = [
  {
    icon: Plane,
    title: 'Aerial Drone Cinematography',
    description: 'Professional aerial cinematography for commercials, documentaries, and film productions with CAAC and FAA Part 107 certification',
  },
  {
    icon: Focus,
    title: 'Gimbal & Steadycam',
    description: 'Expert camera operation with Ronin and MōVI Pro gimbal systems for fluid tracking shots and dynamic movement',
  },
  {
    icon: Globe,
    title: 'Specialty Techniques',
    description: 'Cutting-edge creative solutions including bullet time, 360° video, projection mapping, and immersive VR experiences',
  },
  {
    icon: WandSparkles,
    title: 'VFX & Post-Production',
    description: 'Advanced visual effects, color grading with DaVinci Resolve, and compositing with After Effects and Nuke',
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-32 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 tracking-wider">SERVICES</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Comprehensive filmmaking and cinematography services tailored to your vision
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 border border-white/10 hover:border-white/30 transition-all duration-300 group"
              >
                <Icon className="w-12 h-12 mb-6 text-white/70 group-hover:text-white transition-colors" />
                <h3 className="mb-4">{service.title}</h3>
                <p className="text-white/70">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}