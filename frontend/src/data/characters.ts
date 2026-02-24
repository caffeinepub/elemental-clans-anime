import { clans } from './clans';

export interface Character {
  id: string;
  name: string;
  clanId: string;
  role: string;
  title: string;
  bio: string;
  initials: string;
}

const getClan = (id: string) => clans.find(c => c.id === id)!;

export const characters: Character[] = [
  {
    id: 'kael',
    name: 'Kael Dawnstrider',
    clanId: 'sun',
    role: 'Protagonist',
    title: 'The Chosen Radiant',
    bio: 'A young warrior who awakens with the power of all seven elements, Kael must unite the warring clans before an ancient darkness consumes the world.',
    initials: 'KD',
  },
  {
    id: 'lyra',
    name: 'Lyra Moonshadow',
    clanId: 'moon',
    role: 'Ally',
    title: 'Phantom Blade of the Night',
    bio: 'A master assassin from the Moon Clan who operates in the shadows. Her loyalty is as mysterious as the moonlight she commands.',
    initials: 'LM',
  },
  {
    id: 'zephyr',
    name: 'Zephyr Stormcaller',
    clanId: 'lightning',
    role: 'Rival',
    title: 'Thunder General',
    bio: 'The fearsome general of the Lightning Clan, Zephyr believes strength alone determines the right to rule. He sees Kael as both a threat and a worthy opponent.',
    initials: 'ZS',
  },
  {
    id: 'terra',
    name: 'Terra Ironbark',
    clanId: 'earth',
    role: 'Mentor',
    title: 'Elder of the Ancient Grove',
    bio: 'The oldest living warrior of the Earth Clan, Terra has witnessed the rise and fall of empires. She guides Kael with wisdom forged over centuries.',
    initials: 'TI',
  },
  {
    id: 'ember',
    name: 'Ember Ashveil',
    clanId: 'fire',
    role: 'Antagonist',
    title: 'The Undying Flame',
    bio: 'A Fire Clan warlord consumed by vengeance, Ember seeks to reignite the ancient war between clans and burn the world to forge it anew.',
    initials: 'EA',
  },
  {
    id: 'marina',
    name: 'Marina Tidesong',
    clanId: 'water',
    role: 'Healer',
    title: 'Oracle of the Deep',
    bio: 'A gifted healer and seer from the Water Clan, Marina can read the currents of fate. Her visions of the coming darkness set the story in motion.',
    initials: 'MT',
  },
];

export { getClan };
