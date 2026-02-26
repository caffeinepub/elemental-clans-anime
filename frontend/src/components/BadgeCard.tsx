import React from 'react';
import { Lock } from 'lucide-react';
import type { Badge } from '../data/badges';
import { clans } from '../data/clans';

interface BadgeCardProps {
  badge: Badge;
  locked: boolean;
  size?: 'sm' | 'md';
}

function getGlowStyle(badge: Badge, locked: boolean): React.CSSProperties {
  if (locked) return {};

  if (badge.category === 'rare') {
    return {
      boxShadow: '0 0 20px rgba(224,64,251,0.4), 0 0 40px rgba(224,64,251,0.15)',
      border: '1px solid rgba(224,64,251,0.5)',
    };
  }

  if (badge.category === 'clan' && badge.requiredClanId) {
    const clan = clans.find(c => c.id === badge.requiredClanId);
    if (clan) {
      return {
        boxShadow: `0 0 20px rgba(${clan.glowColorRgb},0.4), 0 0 40px rgba(${clan.glowColorRgb},0.15)`,
        border: `1px solid rgba(${clan.glowColorRgb},0.5)`,
      };
    }
  }

  if (badge.category === 'character' && badge.requiredCharacterId) {
    // Use golden glow for character badges
    return {
      boxShadow: '0 0 20px rgba(245,200,66,0.4), 0 0 40px rgba(245,200,66,0.15)',
      border: '1px solid rgba(245,200,66,0.5)',
    };
  }

  return {
    boxShadow: '0 0 20px rgba(245,200,66,0.3), 0 0 40px rgba(245,200,66,0.1)',
    border: '1px solid rgba(245,200,66,0.4)',
  };
}

function getIconBgStyle(badge: Badge, locked: boolean): React.CSSProperties {
  if (locked) {
    return { background: 'rgba(255,255,255,0.04)' };
  }

  if (badge.category === 'rare') {
    return {
      background: 'radial-gradient(circle, rgba(224,64,251,0.2) 0%, rgba(10,10,25,0.8) 100%)',
    };
  }

  if (badge.category === 'clan' && badge.requiredClanId) {
    const clan = clans.find(c => c.id === badge.requiredClanId);
    if (clan) {
      return {
        background: `radial-gradient(circle, rgba(${clan.glowColorRgb},0.2) 0%, rgba(10,10,25,0.8) 100%)`,
      };
    }
  }

  return {
    background: 'radial-gradient(circle, rgba(245,200,66,0.2) 0%, rgba(10,10,25,0.8) 100%)',
  };
}

export default function BadgeCard({ badge, locked, size = 'md' }: BadgeCardProps) {
  const glowStyle = getGlowStyle(badge, locked);
  const iconBgStyle = getIconBgStyle(badge, locked);

  const isSmall = size === 'sm';

  return (
    <div
      className={`relative rounded-xl transition-all duration-300 ${
        locked ? 'opacity-40 grayscale' : 'hover:scale-105'
      } ${isSmall ? 'p-3' : 'p-4'}`}
      style={{
        background: locked
          ? 'rgba(255,255,255,0.03)'
          : badge.category === 'rare'
          ? 'rgba(224,64,251,0.06)'
          : 'rgba(255,255,255,0.04)',
        border: locked ? '1px solid rgba(255,255,255,0.08)' : undefined,
        ...(!locked ? glowStyle : {}),
      }}
    >
      {/* Lock overlay */}
      {locked && (
        <div className="absolute top-2 right-2 z-10">
          <Lock className="w-3 h-3 text-white/30" />
        </div>
      )}

      {/* Rare shimmer effect */}
      {!locked && badge.category === 'rare' && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none badge-rare-shimmer"
          style={{
            background:
              'linear-gradient(135deg, rgba(224,64,251,0.08) 0%, transparent 50%, rgba(224,64,251,0.05) 100%)',
          }}
        />
      )}

      <div className={`flex flex-col items-center text-center gap-${isSmall ? '2' : '3'}`}>
        {/* Icon */}
        <div
          className={`${isSmall ? 'w-10 h-10 text-xl' : 'w-14 h-14 text-3xl'} rounded-full flex items-center justify-center flex-shrink-0`}
          style={iconBgStyle}
        >
          <span role="img" aria-label={badge.name}>
            {badge.icon}
          </span>
        </div>

        {/* Name */}
        <div>
          <p
            className={`font-cinzel font-bold text-white leading-tight ${isSmall ? 'text-xs' : 'text-sm'}`}
            style={
              !locked && badge.category === 'rare'
                ? { textShadow: '0 0 12px rgba(224,64,251,0.6)' }
                : !locked
                ? { textShadow: '0 0 12px rgba(245,200,66,0.4)' }
                : {}
            }
          >
            {badge.name}
          </p>

          {/* Tagline */}
          <p
            className={`font-rajdhani mt-1 leading-snug ${isSmall ? 'text-xs' : 'text-xs'} ${
              locked ? 'text-white/20' : 'text-white/60'
            }`}
          >
            {locked ? '???' : badge.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
