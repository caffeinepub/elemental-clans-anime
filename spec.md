# Specification

## Summary
**Goal:** Add an Internet Identity login/logout button inline next to the Gallery section heading.

**Planned changes:**
- In `Gallery.tsx`, import and use the existing `useInternetIdentity` hook to get authentication state and login/logout methods.
- Render a "Login" button next to the Gallery heading when unauthenticated, and a "Logout" button when authenticated.
- Style the button with the site's dark glassmorphism aesthetic: semi-transparent dark background, moon blue (`#4fc3f7`) border glow, Cinzel or Rajdhani font, and a hover pulse/glow animation.
- Position the button inline to the right of the "Gallery" title without disrupting the existing heading layout.

**User-visible outcome:** Users can log in or log out via Internet Identity directly from the Gallery section heading area.
