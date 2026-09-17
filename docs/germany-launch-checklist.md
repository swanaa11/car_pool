# Germany Launch Checklist — Before Public Release

> LEGAL_REVIEW_REQUIRED — have a German attorney review all items marked.

- [ ] **Impressum** page created (required under §5 TMG)
- [ ] **Privacy Policy** reviewed (DSGVO) — data categories, legal bases, retention, rights, contact, DPO if needed
- [ ] **AGB / Terms** reviewed — cost-sharing vs taxi (PBefG), liability, cancellation
- [ ] **Cookie banner** implemented — granular consent for any non-essential cookies; functional cookies (session, locale) allowed without consent
- [ ] **Data processing agreement** with Supabase (and Vercel, Expo) — check their DPA / SCCs
- [ ] **Hosting region** — Supabase project in `eu-central-1` (Frankfurt), Vercel region `fra1` if possible
- [ ] **Account deletion** — user can delete account (sets `state=DELETED`, purges personal data per retention policy, keeps audit logs minimal)
- [ ] **Data export** — user can request JSON export of their data (`profiles`, `rides`, `bookings`, `messages`)
- [ ] **Age check** — 18+ or parental consent handling if applicable
- [ ] **Content moderation** — report/block flows tested, admin can suspend/ban, `audit_logs` retention defined
- [ ] **Insurance disclaimer** — clarify that ride insurance is driver's responsibility
- [ ] **Tax note** — cost-sharing limits (§1 PBefG, ~0.30 €/km) — inform drivers not to profit
- [ ] **Accessibility** — WCAG 2.1 AA (contrast, keyboard, screen reader) — Tailwind helps but manual audit needed
- [ ] **App Store** — privacy labels, data safety forms, screenshots in German + English
- [ ] **Support** — `support@carpool.de` monitored, response SLA defined
- [ ] **Incident plan** — how to handle data breach notification (72h to BfDI)
