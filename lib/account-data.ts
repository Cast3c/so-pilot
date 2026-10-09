import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { posts, socialAccounts } from "@/db/schema";

async function findAccountIds(provider: string, externalId: string) {
  const rows = await db
    .select({ id: socialAccounts.id })
    .from(socialAccounts)
    .where(
      and(
        eq(socialAccounts.provider, provider),
        eq(socialAccounts.externalId, externalId)
      )
    );
  return rows.map((row) => row.id);
}

// The user removed the app: the tokens are no longer valid, so drop them.
export async function removeAccount(provider: string, externalId: string) {
  const ids = await findAccountIds(provider, externalId);
  if (ids.length === 0) return 0;
  await db.delete(socialAccounts).where(inArray(socialAccounts.id, ids));
  return ids.length;
}

// The user asked to delete their data: remove the account and its posts and media.
export async function deleteAccountData(provider: string, externalId: string) {
  const ids = await findAccountIds(provider, externalId);
  if (ids.length === 0) return 0;
  await db.delete(posts).where(inArray(posts.socialAccountId, ids));
  await db.delete(socialAccounts).where(inArray(socialAccounts.id, ids));
  return ids.length;
}
