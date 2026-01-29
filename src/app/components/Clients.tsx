import { motion } from 'motion/react';

const clients = [
  { name: 'Tencent', logo: '/logos/tencent.svg' },
  { name: 'Intel', logo: '/logos/intel.svg' },
  { name: 'Lenovo', logo: '/logos/lenovo.svg' },
  { name: 'Burton', logo: '/logos/burton.svg' },
  { name: 'Toyota', logo: '/logos/toyota.svg' },
  { name: 'Volkswagen', logo: '/logos/volkswagen.svg' },
  { name: 'Audi', logo: '/logos/audi.svg' },
];

export function Clients() {
  return (
    <section className="py-16 md:py-24 bg-cinematic-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-sm tracking-widest text-white/40">TRUSTED BY</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-12 md:gap-y-8"
        >
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-8 md:h-10 w-auto text-white/30 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
