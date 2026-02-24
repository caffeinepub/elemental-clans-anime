import { clans } from '../data/clans';
import { useStaggeredFadeIn } from '../hooks/useStaggeredFadeIn';

export default function Clans() {
  const { setRef, visible } = useStaggeredFadeIn(clans.length, 100);

  return (
    <section id="clans" className="relative py-24 overflow-hidden clans-bg">
      {/* Glowing divider top */}
      <div className="glow-divider-gold mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-gold/70 mb-3">The Factions</p>
          <h2
            className="font-cinzel text-4xl sm:text-5xl font-bold text-white"
            style={{ textShadow: '0 0 20px rgba(251,191,36,0.5), 0 0 40px rgba(251,191,36,0.2)' }}
          >
            The Seven Clans
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Clan grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {clans.map((clan, i) => (
            <div
              key={clan.id}
              ref={setRef(i) as (el: HTMLDivElement | null) => void}
              className={`clan-card group relative transition-all duration-700 ${
                visible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                boxShadow: `0 0 15px 2px rgba(${clan.glowColorRgb},0.15), 0 4px 20px rgba(0,0,0,0.5)`,
                transitionDelay: `${i * 100}ms`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px 6px rgba(${clan.glowColorRgb},0.8), 0 8px 30px rgba(0,0,0,0.6)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 15px 2px rgba(${clan.glowColorRgb},0.15), 0 4px 20px rgba(0,0,0,0.5)`;
              }}
            >
              {/* Clan emblem */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-300"
                  style={{
                    borderColor: `rgba(${clan.glowColorRgb},0.5)`,
                    boxShadow: `0 0 20px rgba(${clan.glowColorRgb},0.3)`,
                  }}
                >
                  <img
                    src={clan.iconPath}
                    alt={`${clan.name} clan emblem`}
                    className="w-full h-full object-cover clan-pulse"
                  />
                </div>
              </div>

              {/* Clan info */}
              <div className="text-center">
                <div
                  className="font-rajdhani text-xs tracking-widest uppercase mb-1"
                  style={{ color: clan.glowColor }}
                >
                  {clan.element}
                </div>
                <h3 className="font-cinzel text-lg font-bold text-white mb-1">{clan.name}</h3>
                <p className="font-rajdhani text-xs italic text-silver/50 mb-3">"{clan.tagline}"</p>
                <p className="font-rajdhani text-sm text-silver/70 leading-relaxed">{clan.description}</p>
              </div>

              {/* Symbol */}
              <div
                className="absolute top-3 right-3 text-lg opacity-30 group-hover:opacity-70 transition-opacity duration-300"
                style={{ color: clan.glowColor }}
              >
                {clan.symbol}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Glowing divider bottom */}
      <div className="glow-divider mt-24" />
    </section>
  );
}
