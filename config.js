// ── CLOUD SYNC CONFIGURATION ──
// Fill these in after linking a Neon project (see neon_schema.sql for the
// one-time schema setup, and api.ts for the deployed Function that serves
// drafts/completed plans):
//   1. `neon link --project-id <id> --branch <branch>`, then `neon deploy`.
//   2. Copy NEON_AUTH_BASE_URL and NEON_FUNCTION_API_BASE_URL from the
//      pulled .env.local into the values below.
// Both values are safe to publish in client-side code — they're just
// endpoint URLs. Access control is enforced server-side: Neon Auth issues
// the session, and api.ts verifies that session's JWT on every request.
const NEON_AUTH_BASE_URL = "https://ep-nameless-tree-b5ij027m.neonauth.c-7.us-east-2.aws.neon.tech/neondb/auth";
const NEON_FUNCTION_API_BASE_URL = "https://br-green-river-b5k7rttb-api.compute.c-7.us-east-2.aws.neon.tech";
