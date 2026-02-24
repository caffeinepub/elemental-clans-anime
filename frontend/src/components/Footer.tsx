import { SiX, SiInstagram, SiYoutube, SiDiscord } from 'react-icons/si';
import { Lock } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

const socialLinks = [
  { icon: SiX, label: 'X (Twitter)', href: '#' },
  { icon: SiInstagram, label: 'Instagram', href: '#' },
  { icon: SiYoutube, label: 'YouTube', href: '#' },
  { icon: SiDiscord, label: 'Discord', href: '#' },
];

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Story', href: '#story' },
  { label: 'Characters', href: '#characters' },
  { label: 'Clans', href: '#clans' },
  { label: 'Episodes', href: '#episodes' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'News / Updates', href: '#news' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { ref, isVisible } = useScrollFadeIn();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin } = useIsCallerAdmin();

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const showAdminLink = isAuthenticated && isAdmin === true;

  return (
    <footer
      ref={ref as React.RefObject<HTMLElement>}
      className={`relative overflow-hidden fade-in-section ${isVisible ? 'visible' : ''}`}
      style={{
        background: 'linear-gradient(180deg, #0d0d1a 0%, #07070f 100%)',
        borderTop: '1px solid rgba(79, 195, 247, 0.1)',
      }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-moon-blue/30 to-transparent" />

      {/* Background pattern */}
      <div className="absolute inset-0 bg-hex-pattern opacity-[0.02]" />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-dark-purple/50 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fiery-gold to-moon-blue flex items-center justify-center shadow-glow-gold">
                <span className="text-void text-xs font-black font-cinzel">W</span>
              </div>
              <span className="font-cinzel text-sm font-bold text-white tracking-widest leading-tight">
                WHISPERS OF THE{' '}
                <span className="text-fiery-gold text-glow-gold">WHITE MOON</span>
              </span>
            </div>
            <p className="font-rajdhani text-silver/50 text-sm leading-relaxed max-w-xs">
              An epic anime series where seven elemental clans clash in a battle for the fate of Aethoria.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-moon-blue tracking-widest uppercase mb-4 text-glow-moon">
              Navigate
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="font-rajdhani text-sm text-silver/50 hover:text-moon-blue transition-all duration-300 tracking-wider relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-moon-blue transition-all duration-300 group-hover:w-full" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-fiery-gold tracking-widest uppercase mb-4 text-glow-gold">
              Follow the Journey
            </h4>
            <div className="flex items-center gap-3 mb-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-sm flex items-center justify-center text-silver/50 transition-all duration-300 hover:text-moon-blue hover:shadow-glow-moon"
                  style={{
                    background: 'rgba(7, 7, 15, 0.6)',
                    border: '1px solid rgba(79, 195, 247, 0.12)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(79, 195, 247, 0.5)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(79, 195, 247, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(79, 195, 247, 0.12)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(7, 7, 15, 0.6)';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="font-rajdhani text-silver/40 text-xs tracking-wider">
              Join the community. Shape the legend.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-rajdhani text-silver/30 text-xs tracking-wider">
            © {year} Whispers Of The White Moon. All rights reserved.
          </p>

          {showAdminLink && (
            <Link
              to="/admin"
              className="flex items-center gap-1 font-rajdhani text-xs tracking-wider text-silver/20 hover:text-moon-blue/60 transition-all duration-300 group"
              aria-label="Admin panel"
            >
              <Lock className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <span>Admin</span>
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
