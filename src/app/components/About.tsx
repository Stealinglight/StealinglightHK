import { motion } from 'motion/react';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-cinematic-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[3/4] overflow-hidden rounded-lg"
          >
            <img
              src="https://d2fc83sck42gx7.cloudfront.net/images/chris-mcmillon-profile.jpg"
              alt="Chris McMillon"
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black/40 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-white mb-6">About Me</h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                Seattle-based cinematographer and camera operator specializing in aerial and
                movement-driven storytelling. Third-generation aerial photographer with years of
                production experience across Asia and the US, spanning branded content, documentary,
                and commercial work.
              </p>
              <p>
                Experienced operating advanced camera platforms including aerial platforms, cinema drones,
                gimbals, and specialty rigs. Comfortable leading crews, coordinating
                logistics and safety, and delivering under tight schedules in demanding environments.
              </p>
              <p>
                Background includes building and leading a production team and collaborating with
                global brands. FAA Part 107 certified and safety-forward on set (First Aid / CPR / AED).
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <h3 className="text-sm tracking-widest text-white/40 mb-6">CREDENTIALS</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Third-generation aerial photographer',
                  'FAA Part 107 (UAS)',
                  'Cinema drone & FPV operator',
                  'Gimbal & specialty rig operator',
                  'Crew leadership & production coordination',
                  'First Aid / CPR / AED',
                ].map((credential) => (
                  <div key={credential} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cinematic-amber rounded-full" />
                    <span className="text-sm text-white/60">{credential}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <h3 className="text-sm tracking-widest text-white/40 mb-6">SPECIALTIES & TOOLS</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Cinema Drone',
                  'FPV',
                  'Ronin Gimbal',
                  'MōVI Pro',
                  'Vehicle Rigs',
                  'Bullet Time',
                  '360° Video',
                  'After Effects',
                  'DaVinci Resolve',
                  'Unreal Engine',
                  'Nuke',
                  'Insta360',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 border border-white/10 text-sm text-white/60 hover:border-cinematic-amber/50 hover:text-white/80 transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
