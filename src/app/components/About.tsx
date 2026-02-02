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
                Third-generation aerial photographer. Over 8 years working as a freelance cinematographer and camera operator across Asia, collaborating with brands like Tencent, Intel, Lenovo, Burton, Toyota, Volkswagen, and Audi.
              </p>
              <p>
                My specialization lies in advanced camera platforms | aerial systems, gimbals, and dynamic rigs that capture movement in ways traditional setups cannot. CAAC and FAA Part 107 certified pilot with experience in challenging environments, from remote mountain locations to high-pressure studio shoots.
              </p>
              <p>
                Co-founded <a href="https://www.blnk.media/" target="_blank" rel="noopener noreferrer" className="text-cinematic-amber hover:text-cinematic-amber-light transition-colors">BLNK Media</a> in Shanghai, serving as Producer / Director of Photography for commercial productions. Also worked as a bullet-time operator with <a href="http://spliceboys.tv/" target="_blank" rel="noopener noreferrer" className="text-cinematic-amber hover:text-cinematic-amber-light transition-colors">Splice Boys</a>, pushing the boundaries of immersive capture.
              </p>
              <p>
                Certified Red Cross First Aid instructor with CPR/AED and crisis management training. Essential credentials for remote adventure shoots and small crew productions in demanding locations.
              </p>
              <p>
                Based in Seattle. Available for commercial, documentary, and adventure projects worldwide.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <h3 className="text-sm tracking-widest text-white/40 mb-6">CREDENTIALS</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  '8 Years Experience Across Asia',
                  'CAAC Registered Pilot',
                  'FAA Part 107 Certified',
                  'Red Cross First Aid Instructor',
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
                  'ShotOver',
                  'Gimbal',
                  'Steadycam',
                  'Vehicle Rigs',
                  'Bullet Time',
                  '360° Video',
                  'VR',
                  'After Effects',
                  'DaVinci Resolve',
                  'Unreal Engine',
                  'Nuke',
                  'Insta360',
                  'Broadcast',
                  'LiveStream',
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
