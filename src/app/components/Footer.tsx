import { Instagram, Film, Facebook, Twitter, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Social Media */}
          <div>
            <h3 className="text-sm tracking-widest mb-6 text-white/70">FOLLOW</h3>
            <div className="flex gap-4">
              <a
                href="https://vimeo.com/stealinglight"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Vimeo"
              >
                <Film className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com/stealinglight_productions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com/stealinglightpro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/stealinglight"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Partner Links */}
          <div>
            <h3 className="text-sm tracking-widest mb-6 text-white/70">PARTNERS</h3>
            <div className="space-y-3">
              <a
                href="https://blnk.media"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
              >
                BLNK Media
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://spliceboys.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
              >
                Splice Boys
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cross-link */}
          <div>
            <h3 className="text-sm tracking-widest mb-6 text-white/70">ALSO</h3>
            <a
              href="#"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
            >
              AI & Security Engineering →
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <div className="text-white/50 text-sm tracking-wider">
            © {currentYear} Stealinglight Productions. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}