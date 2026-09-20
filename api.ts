// PCSP Assistant Pro — Neon Function backend for cloud draft storage.
//
// Replaces Supabase's PostgREST + row-level security: the browser used to
// query Postgres directly with RLS enforcing per-user access. Here the
// Function's Postgres connection is a plain application role (no RLS), so
// this file IS the authorization boundary — every route verifies the
// caller's Neon Auth JWT and scopes every query to that verified user id.
import { Hono } from "hono";
import { Pool } from "pg";
import { attachDatabasePool } from "@neon/functions";
import { createRemoteJWKSet, jwtVerify } from "jose";

const pool = new Pool({ connectionString: process.env.DATABASE_URL!, max: 5 });
attachDatabasePool(pool);

const jwks = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));
const issuer = new URL(process.env.NEON_AUTH_BASE_URL!).origin;

function corsHeaders(request: Request): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    Vary: "Origin",
  };
}

type Variables = { userId: string };
const app = new Hono<{ Variables: Variables }>();

app.get("/", (c) => c.text("PCSP Assistant Pro — Neon Function API"));
app.options("*", (c) => new Response(null, { status: 204, headers: corsHeaders(c.req.raw) }));

app.use("*", async (c, next) => {
  const auth = c.req.header("authorization");
  if (!auth?.toLowerCase().startsWith("bearer ")) {
    return c.text("Unauthorized", 401, corsHeaders(c.req.raw));
  }
  try {
    const { payload } = await jwtVerify(auth.slice(7), jwks, { issuer });
    if (!payload.sub) return c.text("Unauthorized", 401, corsHeaders(c.req.raw));
    c.set("userId", payload.sub);
  } catch {
    return c.text("Unauthorized", 401, corsHeaders(c.req.raw));
  }
  await next();
  for (const [key, value] of Object.entries(corsHeaders(c.req.raw))) {
    c.res.headers.set(key, value);
  }
});

// "drafts" and "completed-plans" share identical CRUD shape — only the
// backing table (and its expiry-vs-permanent semantics, enforced elsewhere)
// differs. See supabase_schema.sql's old comments for why the two tables
// exist; this Function only needs to know their names.
const ROUTES: Record<string, string> = {
  drafts: "drafts",
  "completed-plans": "completed_plans",
};

for (const [route, tableName] of Object.entries(ROUTES)) {
  app.get(`/${route}`, async (c) => {
    const { rows } = await pool.query(
      `select id, data, updated_at from ${tableName} where user_id = $1 order by updated_at desc limit 20`,
      [c.get("userId")],
    );
    return c.json(rows);
  });

  app.get(`/${route}/:id`, async (c) => {
    const { rows } = await pool.query(
      `select id, data from ${tableName} where id = $1 and user_id = $2`,
      [c.req.param("id"), c.get("userId")],
    );
    if (rows.length === 0) return c.text("Not found", 404);
    return c.json(rows[0]);
  });

  app.post(`/${route}`, async (c) => {
    const body = await c.req.json<{ data?: string }>();
    if (typeof body.data !== "string") return c.text("Bad request", 400);
    const { rows } = await pool.query(
      `insert into ${tableName} (user_id, data) values ($1, $2) returning id`,
      [c.get("userId"), body.data],
    );
    return c.json(rows[0], 201);
  });

  app.patch(`/${route}/:id`, async (c) => {
    const body = await c.req.json<{ data?: string }>();
    if (typeof body.data !== "string") return c.text("Bad request", 400);
    const { rowCount } = await pool.query(
      `update ${tableName} set data = $1, updated_at = now() where id = $2 and user_id = $3`,
      [body.data, c.req.param("id"), c.get("userId")],
    );
    if (rowCount === 0) return c.text("Not found", 404);
    return c.body(null, 204);
  });
}

export default app;
