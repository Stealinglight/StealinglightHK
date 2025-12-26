import { motion } from 'motion/react';

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[3/4] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1739296385104-f9e3087897f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtbWFrZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjY2NDgzNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Filmmaker portrait"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-6 tracking-wider">ABOUT ME</h2>
            <div className="space-y-4 text-neutral-700">
              <p>
                Third-generation aerial photographer, American-born with 8 years experience working 
                across Asia as a freelance cinematographer and camera operator. Specializing in 
                advanced camera platforms and aerial filming with expertise in drone cinematography, 
                gimbal systems, and innovative creative techniques including bullet time, 360° video, 
                and VFX.
              </p>
              <p>
                Accustomed to harsh environments and high-pressure production schedules with experience 
                managing crews of 30+ people. Currently partner at BLNK Media, bullet-time operator 
                with Splice Boys, and member of Troy's Team Action.
              </p>
              <p>
                Also certified Red Cross First Aid instructor with CPR/AED and crisis management training, 
                bringing safety and professionalism to every production.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-300">
              <h3 className="text-sm tracking-widest text-neutral-500 mb-4">CREDENTIALS</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-neutral-700">• 3rd Generation Aerial Photographer</p>
                  <p className="text-sm text-neutral-700">• 8 Years Working in Asia</p>
                  <p className="text-sm text-neutral-700">• CAAC Registered Pilot</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-700">• FAA Part 107 Certified</p>
                  <p className="text-sm text-neutral-700">• Red Cross First Aid Instructor</p>
                  <p className="text-sm text-neutral-700">• CPR/AED & Crisis Management</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-300">
              <h3 className="text-sm tracking-widest text-neutral-500 mb-4">SPECIALTIES & TOOLS</h3>
              <div className="flex flex-wrap gap-3">
                {['DJI Inspire', 'Ronin Gimbal', 'MōVI Pro', 'After Effects', 'Nuke', 'Unreal Engine', 'DaVinci Resolve', 'Insta360'].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 border border-neutral-300 text-sm text-neutral-700"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}