import { motion } from 'motion/react';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 tracking-wider">GET IN TOUCH</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Let's collaborate on your next project. Reach out to discuss how we can bring your
            vision to life.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <div className="text-center p-6">
            <Mail className="w-8 h-8 mx-auto mb-4 text-neutral-700" />
            <h3 className="text-sm tracking-wider mb-2">EMAIL</h3>
            <a
              href="mailto:chris@stealinglight.hk"
              className="text-neutral-600 hover:text-black transition-colors"
            >
              chris@stealinglight.hk
            </a>
          </div>

          <div className="text-center p-6">
            <Phone className="w-8 h-8 mx-auto mb-4 text-neutral-700" />
            <h3 className="text-sm tracking-wider mb-2">PHONE</h3>
            <a
              href="tel:+12023308455"
              className="text-neutral-600 hover:text-black transition-colors"
            >
              +1 (202) 330-8455
            </a>
          </div>

          <div className="text-center p-6">
            <MapPin className="w-8 h-8 mx-auto mb-4 text-neutral-700" />
            <h3 className="text-sm tracking-wider mb-2">LOCATION</h3>
            <p className="text-neutral-600">Seattle, Washington</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border border-neutral-200 p-8 md:p-12"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm tracking-wider mb-2">
                  NAME
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm tracking-wider mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm tracking-wider mb-2">
                SUBJECT
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                placeholder="Project inquiry"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm tracking-wider mb-2">
                MESSAGE
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black text-white py-4 hover:bg-neutral-800 transition-colors tracking-wider"
            >
              SEND MESSAGE
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}