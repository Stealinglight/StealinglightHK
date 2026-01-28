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
                Third-generation aerial photographer, American-born with extensive experience working
                across Asia as a freelance cinematographer and camera operator. Now based in Seattle,
                specializing in advanced camera platforms and aerial filming with expertise in drone
                cinematography, gimbal systems, and innovative creative techniques including bullet
                time, 360° video, and VFX.
              </p>
              <p>
                Accustomed to harsh environments and high-pressure production schedules with experience
                managing crews of 30+ people. Currently partner at BLNK Media, bullet-time operator
                with Splice Boys, and member of Troy's Team Action.
              </p>
              <p>
                Also certified Red Cross First Aid instructor with CPR/AED and crisis management
                training, bringing safety and professionalism to every production.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <h3 className="text-sm tracking-widest text-white/40 mb-6">CREDENTIALS</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  '3rd Generation Aerial Photographer',
                  'FAA Part 107 Certified',
                  'CAAC Registered Pilot',
                  'Red Cross First Aid Instructor',
                  'CPR/AED & Crisis Management',
                  'Partner at BLNK Media',
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
                  'DJI Inspire',
                  'Ronin Gimbal',
                  'MōVI Pro',
                  'After Effects',
                  'Nuke',
                  'Unreal Engine',
                  'DaVinci Resolve',
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
