import type { ClanId } from '../data/quizQuestions';

export type ClanScores = Record<ClanId, number>;

export interface ScoringResult {
  winnerClanId: ClanId;
  isBalanceClanUnlock: boolean;
  scores: ClanScores;
}

// Threshold: top 4 clans must be within this % of the highest score to be "even"
const EVENNESS_THRESHOLD = 0.25; // 25% max difference relative to highest score
// Probability of triggering Balance Clan when scores are even
const BALANCE_TRIGGER_PROBABILITY = 0.08; // 8%

/**
 * Determines the winning clan from accumulated scores.
 * If the top 4 clan scores are sufficiently even, applies an 8% chance
 * to trigger the rare Balance Clan result.
 */
export function calculateClanResult(scores: ClanScores): ScoringResult {
  const mainClans: ClanId[] = ['moon', 'fire', 'water', 'sun'];

  // Find the highest score among main clans
  const mainScores = mainClans.map(id => scores[id]);
  const maxScore = Math.max(...mainScores);

  if (maxScore === 0) {
    return { winnerClanId: 'moon', isBalanceClanUnlock: false, scores };
  }

  // Check evenness: all main clan scores within threshold of the max
  const minMainScore = Math.min(...mainScores);
  const diff = maxScore - minMainScore;
  const isEven = diff / maxScore <= EVENNESS_THRESHOLD;

  // Apply Balance Clan probability if scores are even
  if (isEven && Math.random() < BALANCE_TRIGGER_PROBABILITY) {
    return { winnerClanId: 'balance', isBalanceClanUnlock: true, scores };
  }

  // Otherwise return the clan with the highest score
  let winnerClanId: ClanId = 'moon';
  let highestScore = -1;
  for (const id of mainClans) {
    if (scores[id] > highestScore) {
      highestScore = scores[id];
      winnerClanId = id;
    }
  }

  return { winnerClanId, isBalanceClanUnlock: false, scores };
}

/**
 * Converts quiz answer weights into normalized trait scores (0–100).
 */
export function normalizeScores(rawScores: ClanScores): ClanScores {
  const values = Object.values(rawScores);
  const max = Math.max(...values, 1);
  return {
    moon: Math.round((rawScores.moon / max) * 100),
    fire: Math.round((rawScores.fire / max) * 100),
    water: Math.round((rawScores.water / max) * 100),
    sun: Math.round((rawScores.sun / max) * 100),
    balance: Math.round((rawScores.balance / max) * 100),
  };
}
