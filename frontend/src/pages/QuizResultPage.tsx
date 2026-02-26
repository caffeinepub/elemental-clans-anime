import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RefreshCw, User, Trophy } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useUnlockBadge, useGetUnlockedBadges } from '../hooks/useQueries';
import { useBadgeUnlockLogic } from '../hooks/useBadgeUnlockLogic';
import { badges, getBadgeById } from '../data/badges';
import { clans } from '../data/clans';
import { characters } from '../data/characters';
import BadgeUnlockToast from '../components/BadgeUnlockToast';
import type { Badge } from '../data/badges';

// ── Demo quiz result (in a real app this would come from quiz state/params) ───
// For now we derive from the user's saved profile data
function useQuizResult() {
  const { data: profile } = useGetCallerUserProfile();
  return {
    matchedCharacterId: profile?.matchedCharacterId ?? undefined,
    matchedClanId: profile?.matchedClanId ?? undefined,
    // Demo trait scores based on matched clan
    traitScores: profile?.matchedClanId
      ? buildTraitScoresFromClan(profile.matchedClanId)
      : undefined,
  };
}

function buildTraitScoresFromClan(clanId: string) {
  const base = { moon: 40, sun: 40, fire: 40, water: 40, lightning: 40, earth: 40, balance: 40 };
  const boosts: Record<string, Partial<typeof base>> = {
    moon: { moon: 85 },
    sun: { sun: 85 },
    fire: { fire: 85 },
    water: { water: 85 },
    lightning: { lightning: 85 },
    earth: { earth: 85 },
    balance: { moon: 72, sun: 72, fire: 72, water: 72, lightning: 72, earth: 72, balance: 72 },
  };
  return { ...base, ...(boosts[clanId] ?? {}) };
}

// ── Main QuizResultPage ───────────────────────────────────────────────────────
export default function QuizResultPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const navigate = useNavigate();

  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { data: alreadyUnlocked = [] } = useGetUnlockedBadges();
  const unlockBadge = useUnlockBadge();

  const quizResult = useQuizResult();
  const earnedBadgeIds = useBadgeUnlockLogic(quizResult);

  const [toasts, setToasts] = useState<Badge[]>([]);
  const hasProcessed = useRef(false);

  const matchedClan = quizResult.matchedClanId
    ? clans.find(c => c.id === quizResult.matchedClanId)
    : null;
  const matchedCharacter = quizResult.matchedCharacterId
    ? characters.find(c => c.id === quizResult.matchedCharacterId)
    : null;

  // Unlock newly earned badges and show toasts
  useEffect(() => {
    if (!isAuthenticated || !profile || hasProcessed.current) return;
    if (earnedBadgeIds.length === 0) return;

    hasProcessed.current = true;

    const newBadges: Badge[] = [];

    earnedBadgeIds.forEach(badgeId => {
      if (!alreadyUnlocked.includes(badgeId)) {
        const badge = getBadgeById(badgeId);
        if (badge) {
          newBadges.push(badge);
          // Fire and forget — ignore "already unlocked" errors gracefully
          unlockBadge.mutate(badgeId);
        }
      }
    });

    if (newBadges.length > 0) {
      setToasts(newBadges);
    }
  }, [isAuthenticated, profile, earnedBadgeIds, alreadyUnlocked]);

  const dismissToast = (badgeId: string) => {
    setToasts(prev => prev.filter(b => b.id !== badgeId));
  };

  const glowColorRgb = matchedClan?.glowColorRgb ?? '168, 200, 240';
  const glowColor = matchedClan?.glowColor ?? '#a8c8f0';

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: 'linear-gradient(180deg, #07070f 0%, #0d0d1a 100%)' }}
      >
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center"
          style={{
            background: 'rgba(15,15,35,0.9)',
            border: '1px solid rgba(168,200,240,0.15)',
          }}
        >
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="font-cinzel text-xl font-bold text-white mb-2 tracking-widest">
            QUIZ RESULTS
          </h2>
          <p className="font-rajdhani text-white/50 text-sm mb-6">
            Log in to save your results and earn badges.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-rajdhani text-sm font-semibold tracking-widest text-moon-blue hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `linear-gradient(135deg, rgba(${glowColorRgb},0.1) 0%, rgba(7,7,15,1) 40%, rgba(${glowColorRgb},0.06) 100%)`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(${glowColorRgb},0.08) 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Toast stack */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 items-end">
        {toasts.map((badge, i) => (
          <BadgeUnlockToast
            key={badge.id}
            badge={badge}
            index={i}
            onDismiss={() => dismissToast(badge.id)}
          />
        ))}
      </div>

      {/* Back nav */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-rajdhani text-xs font-semibold tracking-widest text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          BACK TO HOME
        </Link>
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="font-rajdhani text-xs tracking-widest uppercase mb-2"
            style={{ color: `rgba(${glowColorRgb},0.7)` }}
          >
            Your Soul Has Spoken
          </p>
          <h1
            className="font-cinzel text-3xl md:text-4xl font-bold text-white"
            style={{ textShadow: `0 0 40px rgba(${glowColorRgb},0.5)` }}
          >
            QUIZ RESULTS
          </h1>
        </div>

        {/* Result Card */}
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{
            background: `rgba(${glowColorRgb},0.05)`,
            border: `1px solid rgba(${glowColorRgb},0.3)`,
            boxShadow: `0 0 40px rgba(${glowColorRgb},0.12)`,
          }}
        >
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(${glowColorRgb},0.8), transparent)`,
            }}
          />

          <div className="p-6 md:p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            ) : matchedClan ? (
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Clan icon */}
                <div className="flex-shrink-0 text-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: `radial-gradient(circle, rgba(${glowColorRgb},0.25) 0%, rgba(10,10,25,0.9) 100%)`,
                      border: `2px solid rgba(${glowColorRgb},0.5)`,
                      boxShadow: `0 0 30px rgba(${glowColorRgb},0.4)`,
                    }}
                  >
                    <img
                      src={matchedClan.iconPath}
                      alt={matchedClan.name}
                      className="w-14 h-14 object-contain"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <span
                    className="font-rajdhani text-xs tracking-widest uppercase font-semibold"
                    style={{ color: glowColor }}
                  >
                    {matchedClan.element}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 text-center md:text-left">
                  <p className="font-rajdhani text-xs tracking-widest text-white/40 uppercase mb-1">
                    Your Clan
                  </p>
                  <h2
                    className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-2"
                    style={{ textShadow: `0 0 20px rgba(${glowColorRgb},0.5)` }}
                  >
                    {matchedClan.name}
                  </h2>
                  <p className="font-rajdhani text-sm text-white/60 leading-relaxed mb-4">
                    {matchedClan.description}
                  </p>
                  <p
                    className="font-cinzel text-xs tracking-widest italic"
                    style={{ color: `rgba(${glowColorRgb},0.7)` }}
                  >
                    "{matchedClan.tagline}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">⚔️</div>
                <p className="font-cinzel text-lg text-white mb-2">No Result Yet</p>
                <p className="font-rajdhani text-sm text-white/50">
                  Complete the quiz to discover your clan and earn badges.
                </p>
              </div>
            )}

            {/* Matched character */}
            {matchedCharacter && (
              <div
                className="mt-6 pt-6 flex items-center gap-4"
                style={{ borderTop: `1px solid rgba(${glowColorRgb},0.15)` }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-cinzel font-bold text-sm flex-shrink-0"
                  style={{
                    background: `rgba(${glowColorRgb},0.15)`,
                    border: `1px solid rgba(${glowColorRgb},0.3)`,
                    color: glowColor,
                  }}
                >
                  {matchedCharacter.initials}
                </div>
                <div>
                  <p className="font-rajdhani text-xs tracking-widest text-white/40 uppercase">
                    Matched Character
                  </p>
                  <p className="font-cinzel text-sm font-bold text-white">
                    {matchedCharacter.name}
                  </p>
                  <p className="font-rajdhani text-xs text-white/50">{matchedCharacter.title}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Earned Badges Preview */}
        {earnedBadgeIds.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5" style={{ color: glowColor }} />
              <h3 className="font-cinzel text-sm font-bold text-white tracking-widest">
                BADGES EARNED THIS SESSION
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {earnedBadgeIds.map(id => {
                const badge = getBadgeById(id);
                if (!badge) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid rgba(${glowColorRgb},0.3)`,
                    }}
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <div>
                      <p className="font-cinzel text-xs font-bold text-white">{badge.name}</p>
                      <p className="font-rajdhani text-xs text-white/40">{badge.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/profile"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-rajdhani text-sm font-semibold tracking-widest text-white transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, rgba(${glowColorRgb},0.25), rgba(${glowColorRgb},0.1))`,
              border: `1px solid rgba(${glowColorRgb},0.4)`,
              boxShadow: `0 0 20px rgba(${glowColorRgb},0.2)`,
            }}
          >
            <User className="w-4 h-4" />
            VIEW FULL PROFILE
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-rajdhani text-sm font-semibold tracking-widest text-white/60 hover:text-white transition-all"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            RETAKE QUIZ
          </Link>
        </div>
      </main>
    </div>
  );
}
