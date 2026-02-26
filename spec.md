# Specification

## Summary
**Goal:** Implement a full badge system for Whispers Of The White Moon, allowing users to earn, store, and view badges based on their quiz results.

**Planned changes:**
- Extend the backend `UserProfile` type to store a list of unlocked badge IDs, and add `unlockBadge(badgeId)` and `getUnlockedBadges()` backend functions
- Add `useUnlockBadge` mutation hook and `useGetUnlockedBadges` query hook in `useQueries.ts`
- Define all 13 badges in `frontend/src/data/badges.ts` with id, name, icon (emoji), tagline, category, and unlock condition metadata — covering Character Match (Shadow Seer, Wrath Guardian, Memory Keeper, Royal Strategist, Balance King), Clan Loyalty (Moon Clan Initiate, Flame Clan Vanguard, Water Clan Guardian, Sun Clan Noble, Balance Clan Chosen), and Rare/Secret (Eclipse Soul, Stormheart, Wild Card Spirit)
- After quiz completion, evaluate and trigger badge unlocks based on: matched character, matched/majority clan, trait score combinations (Eclipse Soul = high Sun+Moon, Stormheart = high Water+Flame, Wild Card Spirit = evenly spread scores, Balance King = perfect balance)
- Display a Badges section on the Profile page with three sub-sections (Character Match, Clan Loyalty, Rare & Secret); unlocked badges show with full color and themed/golden glow, locked badges appear dimmed with a lock overlay
- Show a toast/notification for each newly unlocked badge after quiz completion, with a more dramatic animation for rare badges

**User-visible outcome:** After completing the quiz, authenticated users automatically earn badges based on their results and see celebratory notifications. All 13 badges are visible on the profile page, with locked badges shown in a dimmed state to encourage retaking the quiz.
