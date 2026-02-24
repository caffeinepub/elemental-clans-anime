import { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon } from 'lucide-react';

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
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
        </div>
      </div>
    </nav>
  );
}
