# PCSP Assistant Pro
**Tagline:** Deterministic Documentation Engine for Healthcare Compliance.

## Executive Summary
PCSP Assistant Pro is a HIPAA-compliant documentation system engineered for Missouri DMH agencies. It automates the generation of Person-Centered Support Plans with clinical precision and audit-ready output.

## Core Architecture
- **Frontend:** Next.js 14, React 18
- **Security:** AES-GCM 256-bit Encryption
- **UI:** High-Density Component Library

## Key Features
- **Audit Resilience Engine:** Hardened against 87% DMH compliance thresholds.
- **Deterministic Logic:** Zero-latency generation of state-mandated PCSP nodes.
- **Secure PHI Protocol:** End-to-end encryption for all protected health information.

## Compliance Standards
- **HIPAA:** Protected Health Information (PHI) isolation protocols.
- **Audit-Ready:** Automated matching for EVV (Electronic Visit Verification) and HRST Attestation.

## Cloud Draft Sync — Setup
Saved drafts sync to a Neon project so a case manager can log in from any
computer and pick up where they left off. To enable it:

1. Create a project at [neon.com](https://neon.com) and link it: `neon link --project-id <id> --branch <branch>`.
2. Run [`neon_schema.sql`](neon_schema.sql) once against the linked branch's `DATABASE_URL` — it creates the `drafts` and `completed_plans` tables.
3. `neon deploy` — this applies [`neon.ts`](neon.ts) (Neon Auth + the `api` Function defined in [`api.ts`](api.ts)) and deploys the Function that serves drafts/completed plans.
4. Copy `NEON_AUTH_BASE_URL` and `NEON_FUNCTION_API_BASE_URL` from the pulled `.env.local` into [`config.js`](config.js).

**How PHI is protected:** plan data is encrypted in the browser (AES-GCM, key
derived from the user's account password) before it is sent to Neon — the
server only ever stores ciphertext it cannot read. Unlike the previous
Supabase setup, there's no client-facing row-level security here: the
`api.ts` Function verifies each request's Neon Auth session and scopes every
query to that verified user id, so one user's rows are never reachable from
another user's account.

**Before real client data touches this:** moving drafts off-device is a
change to this app's HIPAA posture. Do not enable this for production PHI
until your privacy/security officer has approved the architecture and a
Business Associate Agreement is signed with the hosting provider. Until
then, use this only with test data, or keep using the local `.pcsp`
export/import flow for real plans.

---

**DTE Solutions LLC // Senior Systems Engineering**
