import { useRef, useEffect, useState } from 'react';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';
import { BookOpen, Swords, Star } from 'lucide-react';

const pillars = [
  {
    icon: BookOpen,
    title: 'The World',
    desc: 'A realm where elemental forces shape civilization, and ancient pacts between clans maintain a fragile peace.',
  },
  {
    icon: Swords,
    title: 'The Conflict',
    desc: 'When the White Moon rises, old alliances shatter. Seven clans must choose between power and survival.',
  },
  {
    icon: Star,
    title: 'The Prophecy',
    desc: 'One child born under the eclipse carries the power to unite or destroy the elemental world forever.',
  },
];

const paragraphs = [
  'In a world where the moon governs the flow of elemental energy, seven ancient clans have maintained an uneasy peace for centuries. Each clan commands a different force of nature — fire, water, earth, lightning, wind, shadow, and the mysterious balance between them all.',
  'But when a rare celestial event known as the White Moon Eclipse approaches, the ancient prophecy awakens. A child born under its light will possess the power of all seven elements — and the clans will stop at nothing to claim that power for themselves.',
  'Follow Kael, a young outcast from the Moon Clan, as he discovers his true heritage and navigates a world on the brink of war. Friendships will be forged, betrayals will cut deep, and the fate of the elemental world hangs in the balance.',
];

function SlideInParagraph({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(false);
  const fromLeft = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVisible(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={`font-rajdhani text-lg text-silver/80 leading-relaxed transition-all duration-700 ease-out ${
        visible
          ? 'opacity-100 translate-x-0'
          : fromLeft
          ? 'opacity-0 -translate-x-12'
          : 'opacity-0 translate-x-12'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {text}
    </p>
  );
}

export default function About() {
  const { ref: sectionRef, isVisible } = useScrollFadeIn();

  return (
    <section
      id="about"
      className="relative py-24 overflow-hidden about-bg"
    >
      {/* Glowing divider top */}
      <div className="glow-divider mb-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div
          ref={sectionRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-moon-blue/70 mb-3">The Story</p>
          <h2
            className="font-cinzel text-4xl sm:text-5xl font-bold text-white"
            style={{ textShadow: '0 0 20px rgba(79,195,247,0.5), 0 0 40px rgba(79,195,247,0.2)' }}
          >
            A World in Shadow
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-moon-blue to-transparent" />
        </div>

        {/* Story text */}
        <div className="max-w-3xl mx-auto mb-20 space-y-6">
          {paragraphs.map((p, i) => (
            <SlideInParagraph key={i} text={p} index={i} />
          ))}
        </div>

        {/* Story pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`pillar-card group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${300 + i * 150}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded bg-moon-blue/10 border border-moon-blue/20 group-hover:border-moon-blue/50 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-moon-blue" />
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-white">{pillar.title}</h3>
                </div>
                <p className="font-rajdhani text-silver/70 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Glowing divider bottom */}
      <div className="glow-divider mt-24" />
    </section>
  );
}
