import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, User, Shield, Sword, Star, Edit3, Save, X, Loader2, Lock, Trophy } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useGetUnlockedBadges } from '../hooks/useQueries';
import { clans } from '../data/clans';
import { characters } from '../data/characters';
import { badges, characterBadges, clanBadges, rareBadges } from '../data/badges';
import BadgeCard from '../components/BadgeCard';
import type { UserProfileView } from '../backend';

// ── Clan theme helper ─────────────────────────────────────────────────────────
function getClanTheme(clanId?: string | null) {
  if (!clanId) {
    return {
      glowColor: '#a8c8f0',
      glowColorRgb: '168, 200, 240',
      gradient: 'linear-gradient(135deg, rgba(10,10,25,0.98) 0%, rgba(20,25,50,0.95) 100%)',
      cardBg: 'rgba(15,15,35,0.85)',
      name: null,
      symbol: '✦',
      iconPath: null,
    };
  }
  const clan = clans.find(c => c.id === clanId);
  if (!clan) {
    return {
      glowColor: '#a8c8f0',
      glowColorRgb: '168, 200, 240',
      gradient: 'linear-gradient(135deg, rgba(10,10,25,0.98) 0%, rgba(20,25,50,0.95) 100%)',
      cardBg: 'rgba(15,15,35,0.85)',
      name: null,
      symbol: '✦',
      iconPath: null,
    };
  }
  const r = parseInt(clan.glowColor.slice(1, 3), 16);
  const g = parseInt(clan.glowColor.slice(3, 5), 16);
  const b = parseInt(clan.glowColor.slice(5, 7), 16);
  return {
    glowColor: clan.glowColor,
    glowColorRgb: clan.glowColorRgb,
    gradient: `linear-gradient(135deg, rgba(${r},${g},${b},0.12) 0%, rgba(10,10,25,0.98) 50%, rgba(${r},${g},${b},0.08) 100%)`,
    cardBg: `rgba(${r},${g},${b},0.06)`,
    name: clan.name,
    symbol: clan.symbol,
    iconPath: clan.iconPath,
  };
}

// ── Avatar component ──────────────────────────────────────────────────────────
function ProfileAvatar({
  avatarUrl,
  username,
  glowColor,
  glowColorRgb,
  size = 'lg',
}: {
  avatarUrl: string;
  username: string;
  glowColor: string;
  glowColorRgb: string;
  size?: 'lg' | 'sm';
}) {
  const [imgError, setImgError] = useState(false);
  const initials = username
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const sizeClass = size === 'lg' ? 'w-32 h-32 md:w-40 md:h-40 text-3xl' : 'w-16 h-16 text-lg';

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-cinzel font-bold text-white relative overflow-hidden flex-shrink-0`}
      style={{
        background: `radial-gradient(circle at 30% 30%, rgba(${glowColorRgb},0.3), rgba(10,10,25,0.9))`,
        border: `2px solid rgba(${glowColorRgb},0.5)`,
        boxShadow: `0 0 30px rgba(${glowColorRgb},0.4), 0 0 60px rgba(${glowColorRgb},0.15)`,
      }}
    >
      {avatarUrl && !imgError ? (
        <img
          src={avatarUrl}
          alt={username}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImgError(true)}
        />
      ) : (
        <span style={{ color: glowColor, textShadow: `0 0 20px ${glowColor}` }}>
          {initials}
        </span>
      )}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(${glowColorRgb},0.15) 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({
  profile,
  onClose,
  onSave,
  isSaving,
}: {
  profile: UserProfileView;
  onClose: () => void;
  onSave: (updated: UserProfileView) => void;
  isSaving: boolean;
}) {
  const [username, setUsername] = useState(profile.username);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [matchedClanId, setMatchedClanId] = useState(profile.matchedClanId ?? '');
  const [matchedCharacterId, setMatchedCharacterId] = useState(profile.matchedCharacterId ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      username: username.trim() || profile.username,
      avatarUrl: avatarUrl.trim(),
      matchedClanId: matchedClanId || undefined,
      matchedCharacterId: matchedCharacterId || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-xl p-6 relative"
        style={{
          background: 'rgba(12,12,28,0.98)',
          border: '1px solid rgba(168,200,240,0.2)',
          boxShadow: '0 0 40px rgba(168,200,240,0.1)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-cinzel text-lg font-bold text-white mb-6 tracking-widest">
          EDIT PROFILE
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-rajdhani text-xs text-white/40 tracking-widest uppercase mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-rajdhani text-sm focus:outline-none focus:border-moon-blue/50 transition-colors"
              placeholder="Your warrior name..."
              maxLength={32}
            />
          </div>

          <div>
            <label className="block font-rajdhani text-xs text-white/40 tracking-widest uppercase mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-rajdhani text-sm focus:outline-none focus:border-moon-blue/50 transition-colors"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block font-rajdhani text-xs text-white/40 tracking-widest uppercase mb-1">
              Matched Clan
            </label>
            <select
              value={matchedClanId}
              onChange={e => setMatchedClanId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-rajdhani text-sm focus:outline-none focus:border-moon-blue/50 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <option value="">— No Clan —</option>
              {clans.map(c => (
                <option key={c.id} value={c.id} style={{ background: '#0d0d1a' }}>
                  {c.symbol} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-rajdhani text-xs text-white/40 tracking-widest uppercase mb-1">
              Matched Character
            </label>
            <select
              value={matchedCharacterId}
              onChange={e => setMatchedCharacterId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-rajdhani text-sm focus:outline-none focus:border-moon-blue/50 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <option value="">— No Character —</option>
              {characters.map(c => (
                <option key={c.id} value={c.id} style={{ background: '#0d0d1a' }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg font-rajdhani text-sm font-semibold tracking-widest text-white/50 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2 rounded-lg font-rajdhani text-sm font-semibold tracking-widest text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(79,195,247,0.3), rgba(79,195,247,0.15))',
                border: '1px solid rgba(79,195,247,0.4)',
                boxShadow: isSaving ? 'none' : '0 0 15px rgba(79,195,247,0.2)',
              }}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Badge Section ─────────────────────────────────────────────────────────────
function BadgesSection({ unlockedIds }: { unlockedIds: string[] }) {
  const unlockedSet = new Set(unlockedIds);
  const totalUnlocked = unlockedIds.filter(id => badges.find(b => b.id === id)).length;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Section header */}
      <div
        className="h-0.5 w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(245,200,66,0.6), transparent)',
        }}
      />
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-400/70" />
            <h2 className="font-cinzel text-lg font-bold text-white tracking-widest">
              BADGES
            </h2>
          </div>
          <span className="font-rajdhani text-xs tracking-widest text-white/40">
            {totalUnlocked} / {badges.length} UNLOCKED
          </span>
        </div>

        {/* ── Character Match Badges ─────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">⭐</span>
            <h3 className="font-cinzel text-xs font-bold text-white/70 tracking-widest uppercase">
              Character Match
            </h3>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {characterBadges.map(badge => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                locked={!unlockedSet.has(badge.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Clan Loyalty Badges ────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">🌌</span>
            <h3 className="font-cinzel text-xs font-bold text-white/70 tracking-widest uppercase">
              Clan Loyalty
            </h3>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {clanBadges.map(badge => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                locked={!unlockedSet.has(badge.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Rare / Secret Badges ──────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">👑</span>
            <h3 className="font-cinzel text-xs font-bold text-white/70 tracking-widest uppercase">
              Rare &amp; Secret
            </h3>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {rareBadges.map(badge => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                locked={!unlockedSet.has(badge.id)}
                size="md"
              />
            ))}
          </div>
          <p className="font-rajdhani text-xs text-white/25 text-center mt-4 tracking-wide">
            Rare badges are unlocked through special quiz outcomes. Can you find them all?
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main ProfilePage ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: profile, isLoading, isFetched } = useGetCallerUserProfile();
  const { data: unlockedBadgeIds = [] } = useGetUnlockedBadges();
  const saveProfile = useSaveCallerUserProfile();
  const [editOpen, setEditOpen] = useState(false);

  const clanId = profile?.matchedClanId ?? null;
  const theme = getClanTheme(clanId);

  const matchedClan = clanId ? clans.find(c => c.id === clanId) : null;
  const matchedCharacter = profile?.matchedCharacterId
    ? characters.find(c => c.id === profile.matchedCharacterId)
    : null;

  const handleSave = async (updated: UserProfileView) => {
    await saveProfile.mutateAsync(updated);
    setEditOpen(false);
  };

  // ── Not authenticated ──────────────────────────────────────────────────────
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
            boxShadow: '0 0 40px rgba(168,200,240,0.08)',
          }}
        >
          <div
            className="w-16 h-16 rounded-full bg-moon-blue/10 flex items-center justify-center mx-auto mb-4"
            style={{ border: '1px solid rgba(79,195,247,0.3)' }}
          >
            <User className="w-8 h-8 text-moon-blue" />
          </div>
          <h2 className="font-cinzel text-xl font-bold text-white mb-2 tracking-widest">
            WARRIOR PROFILE
          </h2>
          <p className="font-rajdhani text-white/50 text-sm mb-6 leading-relaxed">
            You must be logged in to view your profile. Join the world of Aethoria and claim your clan.
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

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading || !isFetched) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #07070f 0%, #0d0d1a 100%)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-moon-blue animate-spin" />
          <p className="font-rajdhani text-white/40 tracking-widest text-sm">LOADING PROFILE...</p>
        </div>
      </div>
    );
  }

  // ── No profile yet ─────────────────────────────────────────────────────────
  if (!profile) {
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
            boxShadow: '0 0 40px rgba(168,200,240,0.08)',
          }}
        >
          <div className="text-5xl mb-4">⚔️</div>
          <h2 className="font-cinzel text-xl font-bold text-white mb-2 tracking-widest">
            BEGIN YOUR JOURNEY
          </h2>
          <p className="font-rajdhani text-white/50 text-sm mb-6 leading-relaxed">
            Your warrior profile has not been created yet. Set up your identity and choose your clan.
          </p>
          <button
            onClick={() => {
              saveProfile.mutate({
                username: 'Warrior',
                avatarUrl: '',
                matchedClanId: undefined,
                matchedCharacterId: undefined,
                unlockedBadges: [],
              });
            }}
            disabled={saveProfile.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-rajdhani text-sm font-semibold tracking-widest text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(79,195,247,0.3), rgba(79,195,247,0.15))',
              border: '1px solid rgba(79,195,247,0.4)',
              boxShadow: '0 0 20px rgba(79,195,247,0.2)',
            }}
          >
            {saveProfile.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Star className="w-4 h-4" />
            )}
            CREATE PROFILE
          </button>
        </div>
      </div>
    );
  }

  // ── Full profile view ──────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen relative"
      style={{ background: theme.gradient }}
    >
      {/* Ambient glow orb */}
      <div
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(${theme.glowColorRgb},0.06) 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Back nav */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-rajdhani text-xs font-semibold tracking-widest text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          BACK TO HOME
        </Link>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-16 space-y-8">

        {/* ── Character Card ─────────────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: theme.cardBg,
            border: `1px solid rgba(${theme.glowColorRgb},0.25)`,
            boxShadow: `0 0 40px rgba(${theme.glowColorRgb},0.12), 0 4px 24px rgba(0,0,0,0.5)`,
          }}
        >
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(${theme.glowColorRgb},0.8), transparent)`,
            }}
          />

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">

              {/* Avatar */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <ProfileAvatar
                  avatarUrl={profile.avatarUrl}
                  username={profile.username}
                  glowColor={theme.glowColor}
                  glowColorRgb={theme.glowColorRgb}
                />
                {matchedClan && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{
                      background: `rgba(${theme.glowColorRgb},0.12)`,
                      border: `1px solid rgba(${theme.glowColorRgb},0.3)`,
                    }}
                  >
                    <span className="text-sm">{matchedClan.symbol}</span>
                    <span
                      className="font-rajdhani text-xs font-semibold tracking-widest"
                      style={{ color: theme.glowColor }}
                    >
                      {matchedClan.element.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* User details */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <div>
                    <p className="font-rajdhani text-xs tracking-widest text-white/40 uppercase mb-1">
                      Warrior Name
                    </p>
                    <h1
                      className="font-cinzel text-2xl md:text-3xl font-bold text-white"
                      style={{ textShadow: `0 0 30px rgba(${theme.glowColorRgb},0.5)` }}
                    >
                      {profile.username}
                    </h1>
                  </div>
                  <button
                    onClick={() => setEditOpen(true)}
                    className="self-center md:self-start flex items-center gap-2 px-4 py-2 rounded-lg font-rajdhani text-xs font-semibold tracking-widest text-white/60 hover:text-white transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    EDIT
                  </button>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                  {matchedClan && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" style={{ color: theme.glowColor }} />
                      <span className="font-rajdhani text-sm text-white/70">
                        {matchedClan.name}
                      </span>
                    </div>
                  )}
                  {matchedCharacter && (
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4" style={{ color: theme.glowColor }} />
                      <span className="font-rajdhani text-sm text-white/70">
                        {matchedCharacter.name}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400/60" />
                    <span className="font-rajdhani text-sm text-white/70">
                      {unlockedBadgeIds.length} Badge{unlockedBadgeIds.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Clan tagline */}
                {matchedClan && (
                  <p
                    className="font-cinzel text-xs tracking-widest italic"
                    style={{ color: `rgba(${theme.glowColorRgb},0.6)` }}
                  >
                    "{matchedClan.tagline}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Character bio card ─────────────────────────────────────────── */}
        {matchedCharacter && (
          <div
            className="rounded-xl p-5"
            style={{
              background: `rgba(${theme.glowColorRgb},0.04)`,
              border: `1px solid rgba(${theme.glowColorRgb},0.15)`,
            }}
          >
            <p className="font-rajdhani text-xs tracking-widest text-white/40 uppercase mb-2">
              Matched Character
            </p>
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-cinzel font-bold text-sm flex-shrink-0"
                style={{
                  background: `rgba(${theme.glowColorRgb},0.15)`,
                  border: `1px solid rgba(${theme.glowColorRgb},0.3)`,
                  color: theme.glowColor,
                }}
              >
                {matchedCharacter.initials}
              </div>
              <div>
                <p className="font-cinzel text-sm font-bold text-white mb-0.5">
                  {matchedCharacter.name}
                </p>
                <p
                  className="font-rajdhani text-xs tracking-widest mb-2"
                  style={{ color: `rgba(${theme.glowColorRgb},0.7)` }}
                >
                  {matchedCharacter.title}
                </p>
                <p className="font-rajdhani text-sm text-white/60 leading-relaxed">
                  {matchedCharacter.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Badges Section ─────────────────────────────────────────────── */}
        <BadgesSection unlockedIds={unlockedBadgeIds} />

      </main>

      {/* Edit modal */}
      {editOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
          isSaving={saveProfile.isPending}
        />
      )}
    </div>
  );
}
