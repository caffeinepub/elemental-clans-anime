import { useGetAllCharacters } from '../hooks/useQueries';
import { clans } from '../data/clans';
import { useStaggeredFadeIn } from '../hooks/useStaggeredFadeIn';

export default function Characters() {
  const { data: characters = [], isLoading } = useGetAllCharacters();
  const { setRef, visible } = useStaggeredFadeIn(characters.length, 100);

  return (
    <section id="characters" className="relative py-24 overflow-hidden characters-bg">
      {/* Glowing divider top */}
      <div className="glow-divider-gold mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-moon-blue/70 mb-3">The Cast</p>
          <h2
            className="font-cinzel text-4xl sm:text-5xl font-bold text-white"
            style={{ textShadow: '0 0 20px rgba(79,195,247,0.5), 0 0 40px rgba(79,195,247,0.2)' }}
          >
            Characters
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-moon-blue to-transparent" />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-moon-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Character grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char, i) => {
              // char.clan is the clanId in backend type
              const clan = clans.find(c => c.id === char.clan);
              const glowColor = clan?.glowColor ?? '#4fc3f7';
              const glowColorRgb = clan?.glowColorRgb ?? '79, 195, 247';

              return (
                <div
                  key={char.id}
                  ref={setRef(i) as (el: HTMLDivElement | null) => void}
                  className={`character-card group transition-all duration-700 ${
                    visible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    boxShadow: `0 0 15px 2px rgba(${glowColorRgb},0.15), 0 4px 20px rgba(0,0,0,0.5)`,
                    transitionDelay: `${i * 100}ms`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px 6px rgba(${glowColorRgb},0.7), 0 8px 30px rgba(0,0,0,0.6)`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 15px 2px rgba(${glowColorRgb},0.15), 0 4px 20px rgba(0,0,0,0.5)`;
                  }}
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-cinzel font-bold border-2 flex-shrink-0"
                      style={{
                        borderColor: glowColor,
                        background: `radial-gradient(circle, rgba(${glowColorRgb},0.2) 0%, rgba(0,0,0,0.6) 100%)`,
                        boxShadow: `0 0 12px rgba(${glowColorRgb},0.4)`,
                        color: glowColor,
                      }}
                    >
                      {char.initials}
                    </div>
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-white">{char.name}</h3>
                      <p className="font-rajdhani text-xs tracking-widest uppercase" style={{ color: glowColor }}>
                        {char.role}
                      </p>
                    </div>
                  </div>

                  <p className="font-rajdhani text-sm text-silver/70 leading-relaxed mb-4">{char.bio}</p>

                  {/* Clan badge */}
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-rajdhani font-semibold tracking-widest uppercase border"
                    style={{
                      borderColor: `rgba(${glowColorRgb},0.4)`,
                      background: `rgba(${glowColorRgb},0.08)`,
                      color: glowColor,
                    }}
                  >
                    <span>{clan?.symbol ?? '◆'}</span>
                    <span>{clan?.name ?? char.clan}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Glowing divider bottom */}
      <div className="glow-divider mt-24" />
    </section>
  );
}
