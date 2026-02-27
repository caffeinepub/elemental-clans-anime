export type ClanId = 'moon' | 'fire' | 'water' | 'sun' | 'balance';

export interface QuizAnswer {
  text: string;
  weights: Partial<Record<ClanId, number>>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'When facing a great challenge, your first instinct is to…',
    answers: [
      { text: 'Observe quietly and study the situation before acting.', weights: { moon: 3, water: 1 } },
      { text: 'Charge forward with full force and deal with consequences later.', weights: { fire: 3, sun: 1 } },
      { text: 'Devise a careful strategy and adapt as things unfold.', weights: { water: 3, moon: 1 } },
      { text: 'Rally others around you and lead the charge together.', weights: { sun: 3, fire: 1 } },
    ],
  },
  {
    id: 'q2',
    question: 'In a group, you naturally take the role of…',
    answers: [
      { text: 'The silent observer who notices what others miss.', weights: { moon: 3, water: 1 } },
      { text: 'The fierce warrior who protects the group at all costs.', weights: { fire: 3, sun: 1 } },
      { text: 'The strategist who plans three steps ahead.', weights: { water: 3, moon: 1 } },
      { text: 'The inspiring leader who keeps morale high.', weights: { sun: 3, fire: 1 } },
    ],
  },
  {
    id: 'q3',
    question: 'When conflict arises between people you care about, you…',
    answers: [
      { text: 'Step back and wait for the right moment to speak truth.', weights: { moon: 3, balance: 2 } },
      { text: 'Confront it head-on — you refuse to let it fester.', weights: { fire: 3, sun: 1 } },
      { text: 'Analyze both sides and find the most logical resolution.', weights: { water: 3, balance: 1 } },
      { text: 'Mediate with warmth and bring everyone together.', weights: { sun: 3, balance: 2 } },
    ],
  },
  {
    id: 'q4',
    question: 'Your greatest strength is your…',
    answers: [
      { text: 'Emotional depth and ability to read people.', weights: { moon: 3, water: 1 } },
      { text: 'Unbreakable will and raw determination.', weights: { fire: 3, sun: 1 } },
      { text: 'Intelligence and ability to adapt to any situation.', weights: { water: 3, moon: 1 } },
      { text: 'Charisma and ability to inspire those around you.', weights: { sun: 3, fire: 1 } },
    ],
  },
  {
    id: 'q5',
    question: 'The night sky calls to you. You see…',
    answers: [
      { text: 'The moon — a quiet guardian watching over all.', weights: { moon: 4 } },
      { text: 'A blazing meteor — power and passion streaking across the dark.', weights: { fire: 4 } },
      { text: 'The stars reflected in still water — infinite depth.', weights: { water: 4 } },
      { text: 'The rising sun on the horizon — a new dawn of hope.', weights: { sun: 4 } },
    ],
  },
  {
    id: 'q6',
    question: 'When you make a decision, you rely most on…',
    answers: [
      { text: 'Your gut feeling and emotional intuition.', weights: { moon: 3, water: 1 } },
      { text: 'Your instincts and passion in the moment.', weights: { fire: 3, sun: 1 } },
      { text: 'Cold logic and careful analysis of the facts.', weights: { water: 3, moon: 1 } },
      { text: 'Your values and what will benefit everyone.', weights: { sun: 3, balance: 1 } },
    ],
  },
  {
    id: 'q7',
    question: 'Your ideal environment to recharge is…',
    answers: [
      { text: 'A quiet moonlit forest, alone with your thoughts.', weights: { moon: 4, water: 1 } },
      { text: 'A roaring bonfire surrounded by loyal companions.', weights: { fire: 3, sun: 2 } },
      { text: 'A calm ocean shore, listening to the waves.', weights: { water: 4, moon: 1 } },
      { text: 'A sunlit hilltop overlooking a vast kingdom.', weights: { sun: 4, fire: 1 } },
    ],
  },
  {
    id: 'q8',
    question: 'An enemy stands before you. Your approach is…',
    answers: [
      { text: 'Wait and let them reveal their weakness first.', weights: { moon: 3, water: 2 } },
      { text: 'Strike first, strike hard — hesitation is defeat.', weights: { fire: 4, sun: 1 } },
      { text: 'Outmaneuver them with superior tactics and patience.', weights: { water: 3, moon: 2 } },
      { text: 'Give them one chance to stand down before acting.', weights: { sun: 3, balance: 2 } },
    ],
  },
  {
    id: 'q9',
    question: 'What do you value most in a companion?',
    answers: [
      { text: 'Loyalty and the ability to keep secrets.', weights: { moon: 3, water: 1 } },
      { text: 'Courage and the willingness to fight alongside you.', weights: { fire: 3, sun: 1 } },
      { text: 'Intelligence and the ability to think under pressure.', weights: { water: 3, moon: 1 } },
      { text: 'Kindness and the heart to protect the innocent.', weights: { sun: 3, balance: 1 } },
    ],
  },
  {
    id: 'q10',
    question: 'If you could possess one power, it would be…',
    answers: [
      { text: 'The ability to see hidden truths and pierce all illusions.', weights: { moon: 4, balance: 1 } },
      { text: 'Overwhelming strength that no force can withstand.', weights: { fire: 4, sun: 1 } },
      { text: 'The power to adapt and overcome any obstacle.', weights: { water: 4, balance: 1 } },
      { text: 'The ability to inspire and protect all those you love.', weights: { sun: 4, balance: 1 } },
    ],
  },
];
