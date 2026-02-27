import { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, User, Sparkles, Mail } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Story', href: '#about' },
  { label: 'Characters', href: '#characters' },
  { label: 'Clans', href: '#clans' },
  { label: 'World Map', href: '#world-map' },
  { label: 'Episodes', href: '#episodes' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'News', href: '#news' },
];

const sectionIds = ['home', 'about', 'characters', 'clans', 'world-map', 'episodes', 'gallery', 'news'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3, rootMargin: '-60px 0px -40% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    const activeIndex = navLinks.findIndex(l => l.href === `#${activeSection}`);
    const activeEl = navLinksRef.current[activeIndex];
    const indicator = indicatorRef.current;
    if (activeEl && indicator) {
      indicator.style.left = `${activeEl.offsetLeft}px`;
      indicator.style.width = `${activeEl.offsetWidth}px`;
    }
  }, [activeSection]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleQuizClick = () => {
    navigate({ to: '/quiz' });
    setMenuOpen(false);
  };

  const handleContactClick = () => {
    navigate({ to: '/contact' });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'navbar-scrolled backdrop-blur-xl border-b border-moon-blue/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#home"
            onClick={e => handleNavClick(e, '#home')}
            className="flex items-center gap-2 group"
          >
            <Moon className="w-5 h-5 text-moon-blue group-hover:text-gold transition-colors duration-300" />
            <span className="font-cinzel text-sm font-bold tracking-widest text-white logo-shimmer">
              WHISPERS OF THE WHITE MOON
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 relative">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                ref={el => { navLinksRef.current[i] = el; }}
                href={link.href}
                onClick={e => handleNavClick(e, link.href)}
                className={`px-3 py-2 text-xs font-rajdhani font-semibold tracking-widest uppercase transition-colors duration-300 ${
                  activeSection === link.href.replace('#', '')
                    ? 'text-moon-blue'
                    : 'text-silver/70 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}

            {/* Take the Quiz link */}
            <button
              onClick={handleQuizClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-rajdhani font-semibold tracking-widest uppercase transition-all duration-300 rounded-md ml-1"
              style={{
                background: 'rgba(168,200,240,0.08)',
                border: '1px solid rgba(168,200,240,0.25)',
                color: '#a8c8f0',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,200,240,0.15)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,200,240,0.5)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 12px rgba(168,200,240,0.25)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,200,240,0.08)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,200,240,0.25)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <Sparkles className="w-3 h-3" />
              Quiz
            </button>

            {/* Contact link */}
            <button
              onClick={handleContactClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-rajdhani font-semibold tracking-widest uppercase transition-all duration-300 rounded-md ml-1"
              style={{
                background: 'rgba(251,191,36,0.06)',
                border: '1px solid rgba(251,191,36,0.2)',
                color: 'oklch(0.82 0.12 60)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,191,36,0.12)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(251,191,36,0.45)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 12px rgba(251,191,36,0.2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,191,36,0.06)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(251,191,36,0.2)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <Mail className="w-3 h-3" />
              Contact
            </button>

            {/* Profile link — authenticated only */}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-rajdhani font-semibold tracking-widest uppercase transition-colors duration-300 text-silver/70 hover:text-moon-blue"
              >
                <User className="w-3.5 h-3.5" />
                Profile
              </Link>
            )}

            {/* Sliding underline indicator */}
            <div
              ref={indicatorRef}
              className="absolute bottom-0 h-0.5 bg-moon-blue transition-all duration-300 ease-out"
              style={{
                boxShadow: '0 0 8px 2px rgba(79,195,247,0.7)',
              }}
            />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-silver hover:text-white transition-colors p-2"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden mobile-menu-glass overflow-hidden transition-all duration-400 ease-in-out ${
          menuOpen ? 'max-h-[36rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => handleNavClick(e, link.href)}
              className={`px-3 py-2 text-sm font-rajdhani font-semibold tracking-widest uppercase transition-colors duration-200 rounded ${
                activeSection === link.href.replace('#', '')
                  ? 'text-moon-blue bg-moon-blue/10'
                  : 'text-silver/80 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* Take the Quiz — mobile */}
          <button
            onClick={handleQuizClick}
            className="flex items-center gap-2 px-3 py-2 text-sm font-rajdhani font-semibold tracking-widest uppercase transition-colors duration-200 rounded text-left"
            style={{
              background: 'rgba(168,200,240,0.08)',
              border: '1px solid rgba(168,200,240,0.2)',
              color: '#a8c8f0',
            }}
          >
            <Sparkles className="w-4 h-4" />
            Take the Quiz
          </button>

          {/* Contact — mobile */}
          <button
            onClick={handleContactClick}
            className="flex items-center gap-2 px-3 py-2 text-sm font-rajdhani font-semibold tracking-widest uppercase transition-colors duration-200 rounded text-left"
            style={{
              background: 'rgba(251,191,36,0.06)',
              border: '1px solid rgba(251,191,36,0.2)',
              color: 'oklch(0.82 0.12 60)',
            }}
          >
            <Mail className="w-4 h-4" />
            Contact
          </button>

          {/* Profile link in mobile menu — authenticated only */}
          {isAuthenticated && (
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-rajdhani font-semibold tracking-widest uppercase transition-colors duration-200 rounded text-moon-blue bg-moon-blue/10 hover:bg-moon-blue/15"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
