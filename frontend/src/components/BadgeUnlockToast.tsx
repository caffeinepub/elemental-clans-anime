import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Badge } from '../data/badges';
import { clans } from '../data/clans';

interface BadgeUnlockToastProps {
  badge: Badge;
  onDismiss: () => void;
  index?: number;
}

function getToastAccentColor(badge: Badge): { rgb: string; hex: string } {
  if (badge.category === 'rare') {
    return { rgb: '224,64,251', hex: '#e040fb' };
  }
  if (badge.category === 'clan' && badge.requiredClanId) {
    const clan = clans.find(c => c.id === badge.requiredClanId);
    if (clan) return { rgb: clan.glowColorRgb, hex: clan.glowColor };
  }
  // Character badges → golden
  return { rgb: '245,200,66', hex: '#f5c842' };
}

export default function BadgeUnlockToast({ badge, onDismiss, index = 0 }: BadgeUnlockToastProps) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const accent = getToastAccentColor(badge);
  const isRare = badge.category === 'rare';

  useEffect(() => {
    // Stagger entrance by index
    const enterTimer = setTimeout(() => setVisible(true), index * 200);
    // Auto-dismiss after 5s
    const dismissTimer = setTimeout(() => handleDismiss(), 5000 + index * 200);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(), 400);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-400 ${
        visible && !leaving
          ? 'opacity-100 translate-x-0'
          : leaving
          ? 'opacity-0 translate-x-full'
          : 'opacity-0 translate-x-full'
      }`}
      style={{
        background: isRare
          ? 'rgba(20,10,30,0.97)'
          : 'rgba(12,12,28,0.97)',
        border: `1px solid rgba(${accent.rgb},0.5)`,
        boxShadow: isRare
          ? `0 0 30px rgba(${accent.rgb},0.4), 0 0 60px rgba(${accent.rgb},0.15), 0 8px 32px rgba(0,0,0,0.6)`
          : `0 0 20px rgba(${accent.rgb},0.3), 0 8px 24px rgba(0,0,0,0.5)`,
        width: '320px',
        transform: visible && !leaving ? 'translateX(0)' : 'translateX(100%)',
        transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${accent.rgb},0.9), transparent)`,
        }}
      />

      {/* Rare shimmer overlay */}
      {isRare && (
        <div
          className="absolute inset-0 pointer-events-none badge-rare-shimmer"
          style={{
            background: `linear-gradient(135deg, rgba(${accent.rgb},0.06) 0%, transparent 50%, rgba(${accent.rgb},0.04) 100%)`,
          }}
        />
      )}

      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
            isRare ? 'badge-rare-pulse' : ''
          }`}
          style={{
            background: `radial-gradient(circle, rgba(${accent.rgb},0.25) 0%, rgba(10,10,25,0.8) 100%)`,
            border: `1px solid rgba(${accent.rgb},0.4)`,
            boxShadow: `0 0 15px rgba(${accent.rgb},0.3)`,
          }}
        >
          <span role="img" aria-label={badge.name}>
            {badge.icon}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className="font-rajdhani text-xs tracking-widest uppercase mb-0.5"
            style={{ color: `rgba(${accent.rgb},0.8)` }}
          >
            {isRare ? '✨ RARE BADGE UNLOCKED' : 'BADGE UNLOCKED'}
          </p>
          <p
            className="font-cinzel text-sm font-bold text-white leading-tight"
            style={
              isRare
                ? { textShadow: `0 0 12px rgba(${accent.rgb},0.7)` }
                : { textShadow: `0 0 8px rgba(${accent.rgb},0.4)` }
            }
          >
            {badge.name}
          </p>
          <p className="font-rajdhani text-xs text-white/50 mt-0.5 leading-snug">
            {badge.tagline}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors mt-0.5"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="h-0.5 mx-4 mb-3 rounded-full overflow-hidden"
        style={{ background: `rgba(${accent.rgb},0.15)` }}
      >
        <div
          className="h-full rounded-full badge-toast-progress"
          style={{
            background: `rgba(${accent.rgb},0.6)`,
            animationDuration: `${5}s`,
          }}
        />
      </div>
    </div>
  );
}
