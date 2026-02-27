# Specification

## Summary
**Goal:** Allow admins to create multiple characters at once in the Admin Panel.

**Planned changes:**
- Add a bulk character creation API endpoint that accepts and persists an array of characters in a single call.
- Update the "Add Character" modal in CharactersPanel to support multiple character form entries, each with name, initials, clan, role, and bio fields.
- Add an "Add Another Character" button to append new blank character entries to the modal.
- Add a remove button per entry (disabled when only one entry remains).
- Submit all entries at once via the bulk backend method, refresh the character list on success, and display clear success/error feedback.

**User-visible outcome:** Admins can open the Add Character modal and fill in multiple characters at once, then save them all with a single submit action.
