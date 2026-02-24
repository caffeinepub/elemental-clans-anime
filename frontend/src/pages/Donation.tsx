import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Heart } from 'lucide-react';

interface SupporterTier {
  emoji: string;
  name: string;
  priceRange: string;
  perks: string[];
  glowColor: string;
  borderColor: string;
  badgeColor: string;
}

const SUPPORTER_TIERS: SupporterTier[] = [
  {
    emoji: '🌑',
    name: 'Moon Clan Supporter',
    priceRange: '$1 – $5',
    perks: ['Official Moon Clan Supporter title'],
    glowColor: 'rgba(79, 195, 247, 0.25)',
    borderColor: 'rgba(79, 195, 247, 0.45)',
    badgeColor: 'oklch(0.72 0.14 220)',
  },
  {
    emoji: '🔥',
    name: 'Flame Warrior Supporter',
    priceRange: '$6 – $15',
    perks: [
      'Everything from Moon Clan tier',
      'Quicker contact responses',
      'Official Fire Clan Supporter title',
    ],
    glowColor: 'rgba(251, 113, 33, 0.22)',
    borderColor: 'rgba(251, 113, 33, 0.5)',
    badgeColor: 'oklch(0.7 0.2 40)',
  },
  {
    emoji: '🌊',
    name: 'Water Guardian Supporter',
    priceRange: '$16 – $30',
    perks: [
      'User-Name secretly added to Anime',
      'Official Water Clan Supporter title',
    ],
    glowColor: 'rgba(34, 211, 238, 0.2)',
    borderColor: 'rgba(34, 211, 238, 0.45)',
    badgeColor: 'oklch(0.75 0.15 200)',
  },
  {
    emoji: '☀️',
    name: 'Royal Sun Supporter',
    priceRange: '$31 – $75',
    perks: [
      'Everything from previous tiers',
      'User-Name listed in episode credits (Supporter Section)',
      'Added to anime (own Character)',
    ],
    glowColor: 'rgba(251, 191, 36, 0.22)',
    borderColor: 'rgba(251, 191, 36, 0.5)',
    badgeColor: 'oklch(0.82 0.18 80)',
  },
  {
    emoji: '👑',
    name: 'Legendary Balance Supporter',
    priceRange: '$76+',
    perks: [
      'Everything from previous tiers',
      'Special thank-you message from the creator team',
      'Chance to have an important Anime character',
      'Ultimate supporter recognition',
    ],
    glowColor: 'rgba(251, 191, 36, 0.3)',
    borderColor: 'rgba(251, 191, 36, 0.65)',
    badgeColor: 'oklch(0.88 0.2 70)',
  },
];

export default function Donation() {
  const navigate = useNavigate();

  return (
    <div
      className="donation-page min-h-screen flex flex-col items-center px-4 py-12 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/generated/thanks.dim_1320x880.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for legibility */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(10, 10, 15, 0.55)' }}
      />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-lg mt-auto mb-0">
        <div
          className="rounded-2xl p-8 md:p-12 text-center"
          style={{
            background: 'oklch(0.12 0.03 260 / 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid oklch(0.7 0.15 60 / 0.35)',
            boxShadow:
              '0 0 40px oklch(0.7 0.15 60 / 0.12), 0 8px 32px oklch(0 0 0 / 0.6), inset 0 1px 0 oklch(0.9 0.1 60 / 0.1)',
          }}
        >
          {/* Moon icon */}
          <div className="text-6xl mb-4 leading-none select-none">🌙</div>

          {/* Heading */}
          <h1
            className="font-cinzel text-2xl md:text-3xl font-bold mb-4 leading-tight"
            style={{
              color: 'oklch(0.92 0.12 60)',
              textShadow: '0 0 20px oklch(0.8 0.15 60 / 0.5)',
            }}
          >
            Support Whispers Of The White Moon
          </h1>

          {/* Gold divider */}
          <div
            className="mx-auto mb-6 h-px w-32"
            style={{
              background:
                'linear-gradient(to right, transparent, oklch(0.75 0.15 60), transparent)',
            }}
          />

          {/* Subheading */}
          <p
            className="font-rajdhani text-base md:text-lg leading-relaxed mb-8"
            style={{ color: 'oklch(0.78 0.05 260)' }}
          >
            Help bring the story, animation, and characters to life.
            <br className="hidden sm:block" />
            Every donation helps support development, voice acting, art, and
            future episodes.
          </p>

          {/* Cash App section */}
          <div
            className="rounded-xl p-6 mb-8"
            style={{
              background: 'oklch(0.09 0.03 260 / 0.8)',
              border: '1px solid oklch(0.65 0.12 60 / 0.4)',
              boxShadow: '0 0 20px oklch(0.65 0.12 60 / 0.08)',
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🔥</span>
              <h2
                className="font-cinzel text-lg font-semibold"
                style={{ color: 'oklch(0.88 0.1 60)' }}
              >
                Donate Via Cash App
              </h2>
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💵</span>
              <p
                className="font-cinzel text-3xl md:text-4xl font-bold tracking-wider select-all cursor-text"
                style={{
                  color: 'oklch(0.92 0.18 145)',
                  textShadow:
                    '0 0 16px oklch(0.75 0.2 145 / 0.6), 0 0 32px oklch(0.65 0.18 145 / 0.3)',
                }}
              >
                $WOTWM
              </p>
            </div>

            <p
              className="font-rajdhani text-sm mt-3"
              style={{ color: 'oklch(0.6 0.04 260)' }}
            >
              Tap the handle above to select &amp; copy
            </p>
          </div>

          {/* Heart note */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Heart
              size={16}
              style={{ color: 'oklch(0.65 0.2 15)' }}
              fill="oklch(0.65 0.2 15)"
            />
            <p
              className="font-rajdhani text-sm"
              style={{ color: 'oklch(0.6 0.04 260)' }}
            >
              Every contribution, big or small, means the world to us.
            </p>
            <Heart
              size={16}
              style={{ color: 'oklch(0.65 0.2 15)' }}
              fill="oklch(0.65 0.2 15)"
            />
          </div>

          {/* Return button */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto min-w-[220px] px-10 py-4 rounded-xl font-cinzel font-bold text-lg text-white transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, oklch(0.55 0.22 250) 0%, oklch(0.45 0.25 240) 100%)',
              boxShadow:
                '0 0 24px oklch(0.55 0.22 250 / 0.6), 0 4px 16px oklch(0.45 0.25 240 / 0.5), inset 0 1px 0 oklch(0.9 0.1 250 / 0.2)',
              border: '1px solid oklch(0.65 0.2 250 / 0.5)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 0 36px oklch(0.6 0.25 250 / 0.8), 0 6px 24px oklch(0.5 0.28 240 / 0.6), inset 0 1px 0 oklch(0.9 0.1 250 / 0.2)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 0 24px oklch(0.55 0.22 250 / 0.6), 0 4px 16px oklch(0.45 0.25 240 / 0.5), inset 0 1px 0 oklch(0.9 0.1 250 / 0.2)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            <ArrowLeft size={20} />
            Return to Website
          </button>
        </div>
      </div>

      {/* ── Supporter Rewards Section ── */}
      <div className="relative z-10 w-full max-w-4xl mt-10 mb-auto">
        {/* Section heading */}
        <div className="text-center mb-8">
          <h2
            className="font-cinzel text-2xl md:text-3xl font-bold tracking-wide"
            style={{
              color: 'oklch(0.92 0.18 70)',
              textShadow:
                '0 0 18px oklch(0.8 0.2 70 / 0.65), 0 0 40px oklch(0.7 0.18 60 / 0.35)',
            }}
          >
            ✦ Supporter Rewards ✦
          </h2>
          <div
            className="mx-auto mt-3 h-px w-48"
            style={{
              background:
                'linear-gradient(to right, transparent, oklch(0.75 0.18 70), transparent)',
            }}
          />
          <p
            className="font-rajdhani text-base mt-3"
            style={{ color: 'oklch(0.72 0.05 260)' }}
          >
            Choose your tier and become part of the legend.
          </p>
        </div>

        {/* Tier cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUPPORTER_TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TierCard({ tier }: { tier: SupporterTier }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 transition-transform duration-200 hover:-translate-y-1"
      style={{
        background: 'oklch(0.11 0.03 260 / 0.75)',
        backdropFilter: 'blur(18px)',
        border: `1px solid ${tier.borderColor}`,
        boxShadow: `0 0 24px ${tier.glowColor}, 0 6px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Emoji + tier name */}
      <div className="flex flex-col items-center text-center gap-2">
        <span className="text-4xl leading-none select-none">{tier.emoji}</span>
        <h3
          className="font-cinzel text-base font-bold leading-snug"
          style={{
            color: tier.badgeColor,
            textShadow: `0 0 12px ${tier.glowColor}`,
          }}
        >
          {tier.name}
        </h3>
        {/* Price badge */}
        <span
          className="font-cinzel text-sm font-semibold px-3 py-1 rounded-full"
          style={{
            background: `${tier.glowColor}`,
            border: `1px solid ${tier.borderColor}`,
            color: tier.badgeColor,
          }}
        >
          {tier.priceRange}
        </span>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${tier.borderColor}, transparent)`,
        }}
      />

      {/* Perks list */}
      <ul className="flex flex-col gap-2">
        {tier.perks.map((perk) => (
          <li
            key={perk}
            className="font-rajdhani text-sm flex items-start gap-2 leading-snug"
            style={{ color: 'oklch(0.82 0.04 260)' }}
          >
            <span
              className="mt-0.5 shrink-0 text-xs"
              style={{ color: tier.badgeColor }}
            >
              ◆
            </span>
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}
