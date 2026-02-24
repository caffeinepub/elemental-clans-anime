import { useGetAllNewsEntries } from '../hooks/useQueries';
import type { NewsCategory } from '../backend';
import { useStaggeredFadeIn } from '../hooks/useStaggeredFadeIn';
import { Calendar } from 'lucide-react';

function categoryLabel(cat: NewsCategory): string {
  const c = cat as unknown as string;
  if (c === 'DevLog') return 'Dev Log';
  if (c === 'EpisodeAnnouncement') return 'Episode Announcement';
  if (c === 'SeasonUpdate') return 'Season Update';
  return String(c);
}

type DisplayCategory = 'Dev Log' | 'Episode Announcement' | 'Season Update';

function CategoryBadge({ category }: { category: NewsCategory }) {
  const label = categoryLabel(category) as DisplayCategory;
  const styles: Record<DisplayCategory, string> = {
    'Dev Log': 'border-moon-blue/40 bg-moon-blue/10 text-moon-blue',
    'Episode Announcement': 'border-gold/40 bg-gold/10 text-gold',
    'Season Update': 'border-mystic/40 bg-mystic/10 text-mystic',
  };
  const cls = styles[label] ?? 'border-silver/40 bg-silver/10 text-silver';
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-sm text-xs font-rajdhani font-semibold tracking-widest uppercase border ${cls}`}>
      {label}
    </span>
  );
}

export default function News() {
  const { data: entries = [], isLoading } = useGetAllNewsEntries();
  const sorted = [...entries].sort((a, b) => Number(b.date) - Number(a.date));
  const { setRef, visible } = useStaggeredFadeIn(sorted.length, 100);

  return (
    <section id="news" className="relative py-24 overflow-hidden news-bg">
      {/* Glowing divider top */}
      <div className="glow-divider-gold mb-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="font-rajdhani text-xs tracking-[0.4em] uppercase text-gold/70 mb-3">Latest Updates</p>
          <h2
            className="font-cinzel text-4xl sm:text-5xl font-bold text-white"
            style={{ textShadow: '0 0 20px rgba(251,191,36,0.5), 0 0 40px rgba(251,191,36,0.2)' }}
          >
            News & Dev Log
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* News cards */}
        {!isLoading && (
          <div className="space-y-6">
            {sorted.map((entry, i) => {
              const dateMs = Number(entry.date) / 1_000_000;
              const dateStr = new Date(dateMs).toISOString().split('T')[0];
              return (
                <article
                  key={entry.id}
                  ref={setRef(i) as (el: HTMLElement | null) => void}
                  className={`news-card group transition-all duration-700 ${
                    visible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <CategoryBadge category={entry.category} />
                    <div className="flex items-center gap-1.5 text-silver/40">
                      <Calendar className="w-3 h-3" />
                      <span className="font-rajdhani text-xs">{dateStr}</span>
                    </div>
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-white mb-2 group-hover:text-moon-blue transition-colors duration-300">
                    {entry.title}
                  </h3>
                  <p className="font-rajdhani text-sm text-silver/70 leading-relaxed">{entry.body}</p>
                </article>
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
