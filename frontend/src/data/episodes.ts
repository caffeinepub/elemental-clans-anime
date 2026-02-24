export type ReleaseStatus = 'Released' | 'Coming Soon' | 'In Production';

export interface Episode {
  id: number;
  number: number;
  title: string;
  summary: string;
  releaseStatus: ReleaseStatus;
  duration?: string;
}

export const season1Episodes: Episode[] = [
  {
    id: 1,
    number: 1,
    title: 'The White Moon Rises',
    summary:
      'A mysterious celestial event awakens dormant powers across the seven elemental clans. Young Kael of the Moon Clan witnesses the prophecy etched in starlight for the first time.',
    releaseStatus: 'Released',
    duration: '24 min',
  },
  {
    id: 2,
    number: 2,
    title: 'Embers of the Sun Clan',
    summary:
      'The Sun Clan\'s sacred forge is sabotaged, igniting tensions with the Fire Clan. Kael travels to the scorched highlands seeking answers — and finds an unlikely ally.',
    releaseStatus: 'Released',
    duration: '26 min',
  },
  {
    id: 3,
    number: 3,
    title: 'Tides of Betrayal',
    summary:
      'A Water Clan elder reveals a hidden truth about the ancient pact between clans. As alliances fracture, the ocean itself begins to stir with unnatural fury.',
    releaseStatus: 'Released',
    duration: '25 min',
  },
  {
    id: 4,
    number: 4,
    title: 'The Lightning Tribunal',
    summary:
      'Summoned before the Lightning Clan\'s council, Kael must prove his innocence in a trial by storm. Every second counts as the sky crackles with judgment.',
    releaseStatus: 'Coming Soon',
    duration: '27 min',
  },
  {
    id: 5,
    number: 5,
    title: 'Roots of the Earth',
    summary:
      'Deep beneath the mountain stronghold of the Earth Clan, an ancient seal begins to crack. The ground trembles with the weight of a forgotten war.',
    releaseStatus: 'Coming Soon',
    duration: '24 min',
  },
  {
    id: 6,
    number: 6,
    title: 'The Balance Keeper\'s Lament',
    summary:
      'The last surviving Balance Keeper emerges from exile with a dire warning. The seven clans must unite — or face an extinction that transcends elemental power.',
    releaseStatus: 'In Production',
    duration: '28 min',
  },
  {
    id: 7,
    number: 7,
    title: 'Whispers in the Dark',
    summary:
      'Shadows move between clan borders as a nameless force begins to consume elemental energy. Kael hears the White Moon\'s whisper for the first time — and it speaks of sacrifice.',
    releaseStatus: 'In Production',
    duration: '26 min',
  },
  {
    id: 8,
    number: 8,
    title: 'The Convergence',
    summary:
      'Season finale. All seven clans converge at the sacred Nexus as the prophecy reaches its breaking point. The fate of the elemental world hangs on a single choice.',
    releaseStatus: 'In Production',
    duration: '42 min',
  },
];
