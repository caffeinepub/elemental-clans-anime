export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const badges: Badge[] = [
  {
    id: 'first_login',
    name: 'First Steps',
    icon: '🌙',
    description: 'Logged in for the first time and joined the world of Aethoria.',
  },
  {
    id: 'clan_member',
    name: 'Clan Bound',
    icon: '⚔️',
    description: 'Matched with a clan and sworn allegiance to their cause.',
  },
  {
    id: 'episode_viewer',
    name: 'Episode Watcher',
    icon: '🎬',
    description: 'Watched at least one episode of Whispers of the White Moon.',
  },
  {
    id: 'lore_explorer',
    name: 'Lore Seeker',
    icon: '📜',
    description: 'Explored the world map and uncovered ancient lore.',
  },
  {
    id: 'gallery_contributor',
    name: 'Gallery Keeper',
    icon: '🖼️',
    description: 'Contributed to the gallery with fan art or concept submissions.',
  },
  {
    id: 'legendary_supporter',
    name: 'Legendary Supporter',
    icon: '✨',
    description: 'Supported the series and helped bring Aethoria to life.',
  },
  {
    id: 'character_matched',
    name: 'Soul Resonance',
    icon: '🔮',
    description: 'Discovered your matched character and forged a spiritual bond.',
  },
  {
    id: 'shadow_walker',
    name: 'Shadow Walker',
    icon: '🌑',
    description: 'Explored the darkest corners of the Whispers universe.',
  },
];
