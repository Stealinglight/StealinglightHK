import { motion } from 'motion/react';
import { Plane, Focus, Globe, WandSparkles } from 'lucide-react';

const services = [
  {
    icon: Plane,
    title: 'Aerial Drone Cinematography',
    description:
      'Professional aerial cinematography for commercials, documentaries, and film productions with CAAC and FAA Part 107 certification',
  },
  {
    icon: Focus,
    title: 'Gimbal & Steadycam',
    description:
      'Expert camera operation with Ronin and MōVI Pro gimbal systems for fluid tracking shots and dynamic movement',
  },
  {
    icon: Globe,
    title: 'Specialty Techniques',
    description:
      'Cutting-edge creative solutions including bullet time, 360° video, projection mapping, and immersive VR experiences',
  },
  {
    icon: WandSparkles,
    title: 'VFX & Post-Production',
    description:
      'Advanced visual effects, color grading with DaVinci Resolve, and compositing with After Effects and Nuke',
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-cinematic-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-white mb-4">Services</h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Comprehensive filmmaking and cinematography services tailored to your vision
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 bg-cinematic-black/50 border border-white/5 hover:border-cinematic-amber/30 transition-all duration-500 group rounded-lg"
              >
                <div className="w-14 h-14 rounded-lg bg-cinematic-amber/10 flex items-center justify-center mb-6 group-hover:bg-cinematic-amber/20 transition-colors duration-500">
                  <Icon className="w-7 h-7 text-cinematic-amber" />
                </div>
                <h3 className="text-white mb-4 text-xl">{service.title}</h3>
                <p className="text-white/50 leading-relaxed">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
