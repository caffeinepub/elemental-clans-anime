export interface Clan {
  id: string;
  name: string;
  element: string;
  description: string;
  glowColor: string;
  glowColorRgb: string;
  iconPath: string;
  symbol: string;
  tagline: string;
}

export const clans: Clan[] = [
  {
    id: 'moon',
    name: 'Moon Clan',
    element: 'Lunar',
    description: 'Masters of illusion and shadow, the Moon Clan draws power from the eternal night sky. Their warriors move like moonlight — silent, ethereal, and impossible to grasp.',
    glowColor: '#a8c8f0',
    glowColorRgb: '168, 200, 240',
    iconPath: '/assets/generated/clan-moon.dim_256x256.png',
    symbol: '☽',
    tagline: 'Children of the Eternal Night',
  },
  {
    id: 'sun',
    name: 'Sun Clan',
    element: 'Solar',
    description: 'Radiant warriors who channel the blazing power of the sun itself. The Sun Clan brings light to darkness and warmth to the coldest hearts — or scorching judgment to their enemies.',
    glowColor: '#f5c842',
    glowColorRgb: '245, 200, 66',
    iconPath: '/assets/generated/clan-sun.dim_256x256.png',
    symbol: '☀',
    tagline: 'Bearers of the Sacred Flame',
  },
  {
    id: 'fire',
    name: 'Fire Clan',
    element: 'Inferno',
    description: 'Fierce and untameable, the Fire Clan embodies raw destructive power and passionate will. Their warriors burn with an inner flame that no force in the world can extinguish.',
    glowColor: '#ff4500',
    glowColorRgb: '255, 69, 0',
    iconPath: '/assets/generated/clan-fire.dim_256x256.png',
    symbol: '🔥',
    tagline: 'Born from the World\'s Fury',
  },
  {
    id: 'water',
    name: 'Water Clan',
    element: 'Tidal',
    description: 'Fluid and adaptable, the Water Clan flows around every obstacle and erodes the mightiest stone. Their healers and warriors alike command the tides of fate itself.',
    glowColor: '#00bfff',
    glowColorRgb: '0, 191, 255',
    iconPath: '/assets/generated/clan-water.dim_256x256.png',
    symbol: '🌊',
    tagline: 'Flowing Through All Things',
  },
  {
    id: 'lightning',
    name: 'Lightning Clan',
    element: 'Storm',
    description: 'Swift as a thunderbolt and twice as deadly, the Lightning Clan strikes before their enemies can react. They harness the raw energy of storms to fuel their devastating power.',
    glowColor: '#9b59ff',
    glowColorRgb: '155, 89, 255',
    iconPath: '/assets/generated/clan-lightning.dim_256x256.png',
    symbol: '⚡',
    tagline: 'Riders of the Eternal Storm',
  },
  {
    id: 'earth',
    name: 'Earth Clan',
    element: 'Terra',
    description: 'Steadfast and immovable, the Earth Clan draws strength from the ancient roots of the world. Their warriors are living fortresses, and their connection to nature is unbreakable.',
    glowColor: '#4caf50',
    glowColorRgb: '76, 175, 80',
    iconPath: '/assets/generated/clan-earth.dim_256x256.png',
    symbol: '🌿',
    tagline: 'Rooted in Ancient Power',
  },
  {
    id: 'balance',
    name: 'Balance Clan',
    element: 'Prismatic',
    description: 'The rarest and most enigmatic of all clans, the Balance Clan wields fragments of every element in perfect harmony. They are the guardians of the cosmic order — and its most dangerous enforcers.',
    glowColor: '#e040fb',
    glowColorRgb: '224, 64, 251',
    iconPath: '/assets/generated/clan-balance.dim_256x256.png',
    symbol: '✦',
    tagline: 'Keepers of the Cosmic Order',
  },
];
