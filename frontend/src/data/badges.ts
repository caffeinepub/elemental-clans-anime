export type BadgeCategory = 'character' | 'clan' | 'rare';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  category: BadgeCategory;
  // For character match badges
  requiredCharacterId?: string;
  // For clan loyalty badges
  requiredClanId?: string;
  // For rare/secret badges
  unlockRule?: 'eclipse_soul' | 'stormheart' | 'wild_card' | 'balance_king';
}

export const badges: Badge[] = [
  // ── Character Match Badges ─────────────────────────────────────────────────
  {
    id: 'shadow_seer',
    name: 'Shadow Seer',
    icon: '🌑',
    tagline: 'Master of hidden truths.',
    description: 'Unlocked by matching Haruna — a soul who sees what others cannot.',
    category: 'character',
    requiredCharacterId: 'haruna',
  },
  {
    id: 'wrath_guardian',
    name: 'Wrath Guardian',
    icon: '🔥',
    tagline: 'Power fueled by loyalty.',
    description: 'Unlocked by matching Raizen — fierce protector of those they love.',
    category: 'character',
    requiredCharacterId: 'raizen',
  },
  {
    id: 'memory_keeper',
    name: 'Memory Keeper',
    icon: '🌊',
    tagline: 'Protector of emotional tides.',
    description: 'Unlocked by matching Selene — guardian of the heart\'s deepest currents.',
    category: 'character',
    requiredCharacterId: 'selene',
  },
  {
    id: 'royal_strategist',
    name: 'Royal Strategist',
    icon: '☀️',
    tagline: 'Guiding light in chaos.',
    description: 'Unlocked by matching Valerinon — the mind that shapes destiny.',
    category: 'character',
    requiredCharacterId: 'valerinon',
  },
  {
    id: 'balance_king',
    name: 'Balance King',
    icon: '⚖️',
    tagline: 'Harmony above all.',
    description: 'Unlocked by achieving a rare perfect balance across all traits.',
    category: 'character',
    unlockRule: 'balance_king',
  },

  // ── Clan Loyalty Badges ────────────────────────────────────────────────────
  {
    id: 'moon_clan_initiate',
    name: 'Moon Clan Initiate',
    icon: '🌑',
    tagline: 'Children of the Eternal Night.',
    description: 'Sworn to the Moon Clan — master of shadow and illusion.',
    category: 'clan',
    requiredClanId: 'moon',
  },
  {
    id: 'flame_clan_vanguard',
    name: 'Flame Clan Vanguard',
    icon: '🔥',
    tagline: 'Born from the World\'s Fury.',
    description: 'Sworn to the Fire Clan — fierce and untameable warrior of flame.',
    category: 'clan',
    requiredClanId: 'fire',
  },
  {
    id: 'water_clan_guardian',
    name: 'Water Clan Guardian',
    icon: '🌊',
    tagline: 'Flowing Through All Things.',
    description: 'Sworn to the Water Clan — fluid protector of the tidal realm.',
    category: 'clan',
    requiredClanId: 'water',
  },
  {
    id: 'sun_clan_noble',
    name: 'Sun Clan Noble',
    icon: '☀️',
    tagline: 'Bearers of the Sacred Flame.',
    description: 'Sworn to the Sun Clan — radiant champion of light and justice.',
    category: 'clan',
    requiredClanId: 'sun',
  },
  {
    id: 'balance_clan_chosen',
    name: 'Balance Clan Chosen',
    icon: '✦',
    tagline: 'Keepers of the Cosmic Order.',
    description: 'Sworn to the Balance Clan — rare guardian of prismatic harmony.',
    category: 'clan',
    requiredClanId: 'balance',
  },

  // ── Rare / Secret Badges ───────────────────────────────────────────────────
  {
    id: 'eclipse_soul',
    name: 'Eclipse Soul',
    icon: '🌘',
    tagline: 'Where light and shadow become one.',
    description: 'Unlocked when both Sun and Moon traits burn equally bright within you.',
    category: 'rare',
    unlockRule: 'eclipse_soul',
  },
  {
    id: 'stormheart',
    name: 'Stormheart',
    icon: '🌊🔥',
    tagline: 'The tempest that cannot be tamed.',
    description: 'Unlocked when Water and Flame traits surge together in perfect storm.',
    category: 'rare',
    unlockRule: 'stormheart',
  },
  {
    id: 'wild_card_spirit',
    name: 'Wild Card Spirit',
    icon: '🎭',
    tagline: 'Bound by nothing, shaped by everything.',
    description: 'Unlocked when your answers are evenly spread across all elements.',
    category: 'rare',
    unlockRule: 'wild_card',
  },
];

// Helper: get badge by id
export function getBadgeById(id: string): Badge | undefined {
  return badges.find(b => b.id === id);
}

// Grouped exports for convenience
export const characterBadges = badges.filter(b => b.category === 'character');
export const clanBadges = badges.filter(b => b.category === 'clan');
export const rareBadges = badges.filter(b => b.category === 'rare');
