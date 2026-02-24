export type NewsCategory = 'Dev Log' | 'Episode Announcement' | 'Season Update';

export interface NewsEntry {
  id: number;
  title: string;
  date: string;
  category: NewsCategory;
  body: string;
}

export const newsEntries: NewsEntry[] = [
  {
    id: 1,
    title: 'Episode 4 "The Lightning Tribunal" — Release Window Confirmed',
    date: '2026-02-18',
    category: 'Episode Announcement',
    body:
      'We are thrilled to announce that Episode 4 is entering final review and will be released in the coming weeks. The Lightning Tribunal arc has been one of the most ambitious sequences we\'ve animated — expect jaw-dropping storm choreography and a pivotal character moment for Kael. Stay tuned for the exact drop date.',
  },
  {
    id: 2,
    title: 'Dev Log #7 — Animation Pipeline Update',
    date: '2026-02-05',
    category: 'Dev Log',
    body:
      'This month we overhauled our elemental effects pipeline. Fire, water, and lightning particles are now rendered with a new layered compositing system that gives each clan\'s power a truly distinct visual signature. Episodes 5 through 8 will benefit enormously from this upgrade. We\'ve also brought on two new background artists to help realize the Earth Clan\'s underground stronghold.',
  },
  {
    id: 3,
    title: 'Season 1 Full Episode Count Locked In',
    date: '2026-01-20',
    category: 'Season Update',
    body:
      'Season 1 of Whispers Of The White Moon will consist of 8 episodes, with the finale running at feature length (42 minutes). The story arc is fully scripted and storyboarded. We are committed to delivering a complete, satisfying first season before moving into production on Season 2.',
  },
  {
    id: 4,
    title: 'Dev Log #6 — Voice Cast Recording Begins',
    date: '2026-01-08',
    category: 'Dev Log',
    body:
      'Recording sessions for the main cast are officially underway! The voice direction sessions for Episodes 1–3 are complete, and we\'re already blown away by the performances. We can\'t wait for you to hear the world of the seven clans come to life. More casting announcements will follow as we progress through production.',
  },
  {
    id: 5,
    title: 'Episodes 1–3 Now Available — Season 1 Has Begun',
    date: '2025-12-15',
    category: 'Episode Announcement',
    body:
      'The wait is over. The first three episodes of Whispers Of The White Moon are now live. Begin the journey with Kael as the White Moon rises, the Sun Clan\'s forge burns, and the tides of betrayal crash against the ancient pact. Watch, share, and join the community — the legend has begun.',
  },
];
