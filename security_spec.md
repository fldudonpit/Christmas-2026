# Security Specification — Udonpittayanukoon Christmas Grand Prix 2026

## 1. Data Invariants
1. **Write-Only Student Submission with Strict Admin-Only Read**: Students may submit new registrations to `/registrations/{registrationId}` without login, and ALL reads (`get`, `list`), updates, and deletes across registrations are **strictly denied to non-admins**. No public registration list or public count collection is readable by visitors.
2. **Admin Verification Mandate**: Reading registrations, viewing applicant lists, exporting CSVs, updating registrations, and deleting registrations require an authenticated admin matching either the verified department Google account (`request.auth.token.email_verified == true && request.auth.token.email == 'fldudonpit@gmail.com'`), the exact bootstrapped Firebase Console admin UID (`csyH359tc1QBUyu3cAzsfS0sIvE2`), or an `/admins/{uid}` document (with `allow list` restricted to token/UID-only `isBootstrappedAdmin()` to avoid DB lookup costs). Unverified emails are never trusted for admin access.
3. **Legacy Collection Lockdown**: Any legacy `/public_entries/{entryId}` documents are locked down to admin-only read/delete (`create` and `update` disabled).
4. **Division Constraint Integrity**: `drawing-painting` and `cover-dance` must always use `division == 'open'`. Split competitions (`singing-contest`, `christmas-card`, `speech`, `english-quiz`) must use `division in ['junior', 'senior']`.
5. **Temporal Integrity & Immutability**: `createdAt == request.time` on creation and immutable on updates.
6. **Admin Privilege Protection**: Only bootstrapped admins (`fldudonpit@gmail.com` with `email_verified == true` or UID `csyH359tc1QBUyu3cAzsfS0sIvE2`) can create or remove `/admins/{adminUid}` entries. Regular users cannot self-assign admin roles.
7. **Size & Type Bounds**: Every string, ID (`^[a-zA-Z0-9_\-]+$`, max 128), and array (`teamMembersList.size() <= 10`) is strictly bounded.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Non-Admin Registration Read Attempt**: Unauthenticated user or signed-in non-admin calls `get` or `list` on `/registrations` -> `PERMISSION_DENIED`.
2. **Legacy Public Grid Read Attempt**: Unauthenticated user calls `get` or `list` on `/public_entries` -> `PERMISSION_DENIED`.
3. **Unverified Admin Email Spoof**: Signed-in user with `email: 'fldudonpit@gmail.com', email_verified: false` tries to `list` or `delete` `/registrations` -> `PERMISSION_DENIED`.
4. **Ghost Field / Shadow Key Injection**: Create `/registrations/reg1` including extra field `isAdmin: true` or `verified: true` -> `PERMISSION_DENIED`.
5. **ID Poisoning**: Create `/registrations/bad$id/with/../../junk` or 200-char ID -> `PERMISSION_DENIED`.
6. **Invalid Division for Cover Dance**: Create `/registrations/reg1` with `competitionId: 'cover-dance', division: 'junior'` -> `PERMISSION_DENIED`.
7. **Invalid Grade Level**: Create `/registrations/reg1` with `gradeLevel: 'P.6'` -> `PERMISSION_DENIED`.
8. **Oversized Team Array**: Create `/registrations/reg1` with `teamMembersList` having 11 items -> `PERMISSION_DENIED`.
9. **Client Timestamp Forgery**: Create `/registrations/reg1` with backdated `createdAt` not equal to `request.time` -> `PERMISSION_DENIED`.
10. **Self-Admin Escalation**: Non-admin user writes `/admins/{theirUid}` -> `PERMISSION_DENIED`.
11. **Non-Admin Update/Delete Attempt**: Unauthenticated user or regular student attempts `update` or `delete` on `/registrations/reg1` -> `PERMISSION_DENIED`.
12. **Public Entry Injection Attempt**: Any user attempts `create` on `/public_entries/reg1` -> `PERMISSION_DENIED`.
