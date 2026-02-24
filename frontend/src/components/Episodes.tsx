import { useGetAllEpisodes } from '../hooks/useQueries';
import type { EpisodeStatus } from '../backend';
import { useStaggeredFadeIn } from '../hooks/useStaggeredFadeIn';
import { Clock, Play, Loader } from 'lucide-react';

function statusLabel(status: EpisodeStatus): string {
  const s = status as unknown as string;
  if (s === 'Released') return 'Released';
  if (s === 'ComingSoon') return 'Coming Soon';
  return 'In Production';
}

function StatusBadge({ status }: { status: EpisodeStatus }) {
  const s = status as unknown as string;
  if (s === 'Released') {
    return (
      <span className="status-badge status-badge-released inline-flex items-center gap-1.5">
        <Play className="w-3 h-3" />
        Released
      </span>
    );
  }
  if (s === 'ComingSoon') {
    return (
      <span className="status-badge status-badge-soon inline-flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        Coming Soon
      </span>
    );
  }
  return (
    <span className="status-badge status-badge-production inline-flex items-center gap-1.5">
      <Loader className="w-3 h-3" />
      In Production
    </span>
  );
}

export default function Episodes() {
  const { data: episodes = [], isLoading } = useGetAllEpisodes();
  const sorted = [...episodes].sort((a, b) => Number(a.number) - Number(b.number));
  const { setRef, visible } = useStaggeredFadeIn(sorted.length, 100);

  return (
    <section id="episodes" className="relative py-24 overflow-hidden episodes-bg">
      {/* Glowing divider top */}
      <div className="glow-divider mb-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-gold/70 mb-3">Season 1</p>
          <h2
            className="font-cinzel text-4xl sm:text-5xl font-bold text-white"
            style={{ textShadow: '0 0 20px rgba(251,191,36,0.5), 0 0 40px rgba(251,191,36,0.2)' }}
          >
            Episodes
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-moon-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Episode list */}
        {!isLoading && (
          <div className="space-y-4">
            {sorted.map((ep, i) => (
              <div
                key={ep.id}
                ref={setRef(i) as (el: HTMLDivElement | null) => void}
                className={`episode-card group transition-all duration-700 ${
                  visible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Episode number */}
                  <div className="flex-shrink-0 w-12 h-12 rounded border border-moon-blue/30 bg-moon-blue/5 flex items-center justify-center">
                    <span className="font-cinzel text-sm font-bold text-moon-blue">
                      {String(ep.number).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Episode info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-cinzel text-base font-bold text-white">{ep.title}</h3>
                      <StatusBadge status={ep.status} />
                    </div>
                    <p className="font-rajdhani text-sm text-silver/70 leading-relaxed mb-2">{ep.summary}</p>
                    {ep.duration !== undefined && (
                      <div className="flex items-center gap-1.5 text-silver/40">
                        <Clock className="w-3 h-3" />
                        <span className="font-rajdhani text-xs">{String(ep.duration)} min</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Glowing divider bottom */}
      <div className="glow-divider mt-24" />
    </section>
  );
}
