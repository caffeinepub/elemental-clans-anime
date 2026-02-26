import { badges } from '../data/badges';

export interface TraitScores {
  moon: number;
  sun: number;
  fire: number;
  water: number;
  lightning?: number;
  earth?: number;
  balance?: number;
}

export interface QuizResult {
  matchedCharacterId?: string;
  matchedClanId?: string;
  traitScores?: TraitScores;
}

const RARE_THRESHOLD = 70; // percent
const WILD_CARD_MAX_DIFF = 15; // percent

/**
 * Evaluates which badges a user has earned based on quiz results.
 * Returns an array of badge IDs that should be unlocked.
 */
export function useBadgeUnlockLogic(result: QuizResult): string[] {
  const earned: string[] = [];

  // ── 1. Character Match Badges ──────────────────────────────────────────────
  if (result.matchedCharacterId) {
    const charBadge = badges.find(
      b => b.category === 'character' && b.requiredCharacterId === result.matchedCharacterId
    );
    if (charBadge) earned.push(charBadge.id);
  }

  // ── 2. Clan Loyalty Badges ─────────────────────────────────────────────────
  if (result.matchedClanId) {
    const clanBadge = badges.find(
      b => b.category === 'clan' && b.requiredClanId === result.matchedClanId
    );
    if (clanBadge) earned.push(clanBadge.id);
  }

  // ── 3. Rare / Secret Badges ────────────────────────────────────────────────
  if (result.traitScores) {
    const scores = result.traitScores;
    const allScores = Object.values(scores).filter((v): v is number => v !== undefined);

    if (allScores.length > 0) {
      const maxScore = Math.max(...allScores);
      const minScore = Math.min(...allScores);

      // Balance King: all trait scores are exactly equal (or within 1%)
      const isBalanceKing = maxScore - minScore <= 1;
      if (isBalanceKing) {
        const balanceKingBadge = badges.find(b => b.unlockRule === 'balance_king');
        if (balanceKingBadge) earned.push(balanceKingBadge.id);
      }

      // Eclipse Soul: both Sun and Moon traits above threshold
      const sunScore = scores.sun ?? 0;
      const moonScore = scores.moon ?? 0;
      if (sunScore >= RARE_THRESHOLD && moonScore >= RARE_THRESHOLD) {
        const eclipseBadge = badges.find(b => b.unlockRule === 'eclipse_soul');
        if (eclipseBadge) earned.push(eclipseBadge.id);
      }

      // Stormheart: both Water and Flame traits above threshold
      const waterScore = scores.water ?? 0;
      const fireScore = scores.fire ?? 0;
      if (waterScore >= RARE_THRESHOLD && fireScore >= RARE_THRESHOLD) {
        const stormBadge = badges.find(b => b.unlockRule === 'stormheart');
        if (stormBadge) earned.push(stormBadge.id);
      }

      // Wild Card Spirit: max - min difference within narrow range
      if (maxScore - minScore <= WILD_CARD_MAX_DIFF) {
        const wildCardBadge = badges.find(b => b.unlockRule === 'wild_card');
        if (wildCardBadge) earned.push(wildCardBadge.id);
      }
    }
  }

  // Deduplicate
  return [...new Set(earned)];
}
