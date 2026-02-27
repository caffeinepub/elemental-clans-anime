import type { ClanId } from './quizQuestions';

export interface ClanResultData {
  id: ClanId;
  name: string;
  description: string;
  symbol: string;
  iconPath: string;
  glowColor: string;
  glowColorRgb: string;
  tagline: string;
  isRare?: boolean;
}

export const clanResultData: Record<ClanId, ClanResultData> = {
  moon: {
    id: 'moon',
    name: 'Moon Clan',
    description: 'Calm, observant, emotionally strong, loyal to balance and truth.',
    symbol: '☽',
    iconPath: '/assets/generated/clan-moon.dim_256x256.png',
    glowColor: '#a8c8f0',
    glowColorRgb: '168, 200, 240',
    tagline: 'Children of the Eternal Night',
  },
  fire: {
    id: 'fire',
    name: 'Fire Clan',
    description: 'Passionate, brave, aggressive, natural leaders and fighters.',
    symbol: '🔥',
    iconPath: '/assets/generated/clan-fire.dim_256x256.png',
    glowColor: '#ff4500',
    glowColorRgb: '255, 69, 0',
    tagline: "Born from the World's Fury",
  },
  water: {
    id: 'water',
    name: 'Water Clan',
    description: 'Adaptive, intelligent, emotionally deep, strategic thinkers.',
    symbol: '🌊',
    iconPath: '/assets/generated/clan-water.dim_256x256.png',
    glowColor: '#00bfff',
    glowColorRgb: '0, 191, 255',
    tagline: 'Flowing Through All Things',
  },
  sun: {
    id: 'sun',
    name: 'Sun Clan',
    description: 'Charismatic, confident, inspiring, protective of others.',
    symbol: '☀',
    iconPath: '/assets/generated/clan-sun.dim_256x256.png',
    glowColor: '#f5c842',
    glowColorRgb: '245, 200, 66',
    tagline: 'Bearers of the Sacred Flame',
  },
  balance: {
    id: 'balance',
    name: 'Balance Clan',
    description: 'Rare individuals capable of understanding all sides and maintaining harmony.',
    symbol: '✦',
    iconPath: '/assets/generated/clan-balance.dim_256x256.png',
    glowColor: '#e040fb',
    glowColorRgb: '224, 64, 251',
    tagline: 'Keepers of the Cosmic Order',
    isRare: true,
  },
};
