import { useEffect, useRef, useState } from 'react';
import { useParticles } from '../hooks/useParticles';

export default function Hero() {
  const canvasRef = useParticles();
  const heroRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTitleVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 10;
      hero.style.setProperty('--parallax-x', `${x}px`);
      hero.style.setProperty('--parallax-y', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Layer 1: Deep radial gradient base */}
      <div className="absolute inset-0 hero-gradient-base" />

      {/* Layer 2: Hero banner image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(/assets/generated/hero-banner.dim_1920x1080.png)',
          transform: 'translate(var(--parallax-x, 0px), var(--parallax-y, 0px)) scale(1.05)',
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Layer 3: Noise/grain texture overlay */}
      <div className="absolute inset-0 hero-noise-overlay" />

      {/* Layer 4: Scanline overlay */}
      <div className="absolute inset-0 scanline-overlay opacity-20" />

      {/* Layer 5: Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2 }}
      />

      {/* Cinematic letterbox bars */}
      <div className="letterbox-top" />
      <div className="letterbox-bottom" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div
          className={`mb-6 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '0ms' }}
        >
          <span className="font-rajdhani text-xs tracking-[0.4em] uppercase text-moon-blue/80 border border-moon-blue/30 px-4 py-1.5 rounded-sm">
            An Original Anime Series
          </span>
        </div>

        {/* Main title line 1 */}
        <h1
          className={`font-cinzel font-black text-5xl sm:text-7xl lg:text-8xl leading-none tracking-wider text-white mb-2 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
          style={{
            transitionDelay: '150ms',
            textShadow: '0 0 40px rgba(79,195,247,0.4), 0 0 80px rgba(79,195,247,0.15)',
          }}
        >
          WHISPERS OF
        </h1>

        {/* Main title line 2 */}
        <h1
          className={`font-cinzel font-black text-5xl sm:text-7xl lg:text-8xl leading-none tracking-wider mb-8 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
          style={{
            transitionDelay: '300ms',
            background: 'linear-gradient(135deg, #ffffff 0%, #4fc3f7 40%, #fbbf24 70%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(79,195,247,0.5))',
          }}
        >
          THE WHITE MOON
        </h1>

        {/* Tagline */}
        <p
          className={`font-rajdhani text-lg sm:text-xl text-silver/80 tracking-widest mb-10 max-w-2xl mx-auto transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '450ms' }}
        >
          Seven clans. One prophecy. The fate of the world written in moonlight.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <button
            onClick={() => handleScroll('about')}
            className="cta-primary font-rajdhani font-bold text-sm tracking-widest uppercase px-8 py-3"
          >
            Explore the World
          </button>
          <button
            onClick={() => handleScroll('episodes')}
            className="cta-secondary font-rajdhani font-bold text-sm tracking-widest uppercase px-8 py-3"
          >
            Watch Episodes
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-10 transition-all duration-700 ${
          titleVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '900ms' }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-rajdhani text-xs tracking-widest uppercase text-silver/40">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-moon-blue/60 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
