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
Saved drafts sync to a Supabase project so a case manager can log in from any
computer and pick up where they left off. To enable it:

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run [`supabase_schema.sql`](supabase_schema.sql) once — it creates the `drafts` table and the row-level-security policies that keep each user's drafts private to them.
3. In Project Settings → API, copy the Project URL and `anon public` key into [`config.js`](config.js).
4. By default Supabase requires users to confirm their email before their first sign-in works.

**How PHI is protected:** plan data is encrypted in the browser (AES-GCM, key
derived from the user's account password) before it is sent to Supabase —
the server only ever stores ciphertext it cannot read. Row-level security
additionally ensures one user's database rows are never visible to another
user's account.

**Before real client data touches this:** moving drafts off-device is a
change to this app's HIPAA posture. Do not enable this for production PHI
until your privacy/security officer has approved the architecture and a
Business Associate Agreement is signed with the hosting provider (Supabase
offers a BAA on its paid Team plan). Until then, use this only with test
data, or keep using the local `.pcsp` export/import flow for real plans.

---

**DTE Solutions LLC // Senior Systems Engineering**
