# Specification

## Summary
**Goal:** Connect the Contact and Fan Mail submission forms to the Admin Panel with persistent storage, status tracking, and admin management capabilities.

**Planned changes:**
- Add a `status` field (`#new`, `#read`, `#replied`) to the `ContactMessage` and `FanMail` backend types, defaulting to `#new` on creation
- Add admin-gated backend endpoints to retrieve, update status, and delete ContactMessages and FanMail entries
- Store ContactMessage and FanMail data in stable variables to survive canister upgrades
- Create a migration to add `status = #new` to any existing stored entries without data loss
- Add React Query hooks for fetching, updating status, and deleting contact messages and fan mail entries
- Create a `ContactMessagesPanel` component displaying sender name, email, message content, date/time, and color-coded status badge (amber = New, blue = Read, green = Replied) with status change and delete actions
- Create a `FanMailPanel` component with the same columns, status badges, and admin actions
- Integrate both panels into the `AdminDashboard` sidebar as new navigation items ("Contact Messages" and "Fan Mail") with a badge showing the count of unread (New) entries

**User-visible outcome:** Admins can view all submitted contact form messages and fan mail in the Admin Panel, change their status (New → Read → Replied), and delete entries. Message counts for unread items appear as badges in the sidebar. All data persists across page refreshes and canister upgrades.
