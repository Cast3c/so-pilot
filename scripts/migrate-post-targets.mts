// Fase A2: rellena post_targets con los posts que ya tienen cuenta asociada.
// Uso:  node --env-file=.env.local --import tsx scripts/migrate-post-targets.mts          (simulación)
//       node --env-file=.env.local --import tsx scripts/migrate-post-targets.mts --apply  (escribe)
// Es idempotente: ON CONFLICT ... DO NOTHING, así que volver a ejecutarlo no duplica nada.

import { neon } from "@neondatabase/serverless";

const apply = process.argv.includes("--apply");
const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

const [before] = await sql`select count(*)::int as n from post_targets`;
const byStatus = await sql`
  select status, count(*)::int as n
  from posts
  where social_account_id is not null
  group by status
  order by status`;
const [withoutAccount] = await sql`
  select count(*)::int as n from posts where social_account_id is null`;

console.log("Posts con cuenta, por estado:", byStatus);
console.log("Posts sin cuenta (no se migran):", withoutAccount.n);
console.log("Destinos existentes antes:", before.n);

if (!apply) {
  console.log("\nSimulación: no se escribió nada. Vuelve a ejecutar con --apply para migrar.");
  process.exit(0);
}

await sql`
  insert into post_targets (post_id, social_account_id, provider, status, external_id, error)
  select p.id, p.social_account_id, sa.provider, p.status, p.external_id, p.error
  from posts p
  join social_accounts sa on sa.id = p.social_account_id
  where p.status <> 'draft'
  on conflict (post_id, social_account_id) do nothing`;

// Verificación: cada post con cuenta debe tener su destino, y no debe haber duplicados.
const [missing] = await sql`
  select count(*)::int as n
  from posts p
  left join post_targets t on t.post_id = p.id and t.social_account_id = p.social_account_id
  where p.social_account_id is not null and p.status <> 'draft' and t.id is null`;
const [after] = await sql`select count(*)::int as n from post_targets`;

console.log("Destinos después:", after.n);
console.log("Posts con cuenta sin destino (debe ser 0):", missing.n);
