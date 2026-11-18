# Security Specification — Udonpittayanukoon Christmas Grand Prix 2026

## 1. Data Invariants
1. **Identity Integrity**: Every document in `/registrations/{registrationId}` and `/public_entries/{entryId}` must store `ownerUid == request.auth.uid` on creation, and `ownerUid` is immutable thereafter.
2. **Email Verification Mandate**: Standard writes require `request.auth != null && request.auth.token.email_verified == true`.
3. **PII Isolation (Split Collection)**: Private fields (`contactInfo` phone number, `studentId`, `submissionUrl`) live exclusively in `/registrations/{registrationId}` and can only be read (`get` or `list`) by `ownerUid` or `isAdmin()`. Public Starting Grid summaries live in `/public_entries/{entryId}` with zero PII.
4. **Atomic Sync**: Creating or deleting a `/registrations/{id}` document must atomically create or delete `/public_entries/{id}` in the same `writeBatch` (`existsAfter` / `!existsAfter`).
5. **Division Constraint Integrity**: `drawing-painting` and `cover-dance` must always use `division == 'open'`. Split competitions (`singing-contest`, `christmas-card`, `speech`, `english-quiz`) must use `division in ['junior', 'senior']`.
6. **Temporal Integrity & Immutability**: `createdAt == request.time` on creation and immutable on updates.
7. **Admin Privilege Protection**: Only the bootstrapped department admin (`fldudonpit@gmail.com` with `email_verified == true`) can create or remove `/admins/{adminUid}` entries. Regular users cannot self-assign admin roles.
8. **Size & Type Bounds**: Every string and array (`teamMembersList.size() <= 10`) is strictly bounded.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Write**: Create `/registrations/reg1` with `request.auth == null` -> `PERMISSION_DENIED`.
2. **Unverified Email Spoof**: Create `/registrations/reg1` with `email: 'fldudonpit@gmail.com', email_verified: false` -> `PERMISSION_DENIED`.
3. **Owner UID Spoofing**: Create `/registrations/reg1` as `uid: 'userA'` with `ownerUid: 'userB'` -> `PERMISSION_DENIED`.
4. **Ghost Field / Shadow Key Injection**: Create `/registrations/reg1` including extra field `isAdmin: true` or `verified: true` -> `PERMISSION_DENIED`.
5. **PII Blanket Read Attempt**: User A calls `get` or `list` on `/registrations` without `where('ownerUid', '==', 'userA')` -> `PERMISSION_DENIED`.
6. **Orphaned Registration (Missing Atomic Public Entry)**: Create `/registrations/reg1` without matching `/public_entries/reg1` in the batch -> `PERMISSION_DENIED`.
7. **ID Poisoning**: Create `/registrations/bad$id/with/../../junk` or 200-char ID -> `PERMISSION_DENIED`.
8. **Invalid Division for Cover Dance**: Create `/registrations/reg1` with `competitionId: 'cover-dance', division: 'junior'` -> `PERMISSION_DENIED`.
9. **Oversized Team Array**: Create `/registrations/reg1` with `teamMembersList` having 11 items -> `PERMISSION_DENIED`.
10. **Client Timestamp Forgery**: Create `/registrations/reg1` with backdated `createdAt` not equal to `request.time` -> `PERMISSION_DENIED`.
11. **Self-Admin Escalation**: Non-admin user writes `/admins/{theirUid}` -> `PERMISSION_DENIED`.
12. **Cross-User Deletion**: User A attempts to delete User B's registration `/registrations/regB` -> `PERMISSION_DENIED`.
