# Specification

## Summary
**Goal:** Add a player profile page with clan-based theming, a badge system, and backend profile persistence for the Whispers Of The White Moon app.

**Planned changes:**
- Extend the backend (main.mo) to store and retrieve user profile data (username, avatar URL, clan ID, character ID, unlocked badge IDs) per Internet Identity principal using stable storage
- Add `useGetProfile` and `useUpdateProfile` React Query hooks in `useQueries.ts` for reading and updating the authenticated user's profile
- Create a `/profile` route and `ProfilePage` component with a character card layout (avatar left, user details right on desktop; stacked on mobile)
- Implement dynamic clan-based theming on the profile page using clan colors from `frontend/src/data/clans.ts` (background gradient, borders, glows, highlights)
- Add a badge section below the character card showing only unlocked badges from a static list of at least 6 defined badges; locked badges are fully hidden; empty state shown when none are unlocked
- Add a "Profile" navigation link to the Navbar that is only visible to authenticated users, linking to `/profile`

**User-visible outcome:** Authenticated users can visit their profile page, which displays their username, matched clan and character in a styled character card, applies their clan's color theme throughout the page, and shows any badges they have unlocked. A profile link appears in the navbar when logged in.
