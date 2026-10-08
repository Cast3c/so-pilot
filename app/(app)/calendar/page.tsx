import { auth } from "@clerk/nextjs/server";
import { and, asc, between, eq, isNotNull, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { posts, socialAccounts } from "@/db/schema";
import { CalendarView } from "@/components/calendar-view";

const DAY_MS = 24 * 60 * 60 * 1000;

function resolveMonth(param?: string) {
  const match = param?.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
  if(match) return { year: Number(match[1]), month: Number(match[2])};
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { userId } = await auth.protect();
  const { month: monthParam } = await searchParams

  const { year, month } = resolveMonth(monthParam);
  const start = new Date(Date.UTC(year, month -1, 1) - 7 * DAY_MS);
  const end = new Date(Date.UTC(year, month, 1) + 7 * DAY_MS);

  const rows = await db
    .select({
      id: posts.id,
      body: posts.body,
      status: posts.status,
      scheduledAt: posts.createdAt,
      createdAt: posts.createdAt,
      accountName: socialAccounts.displayName,
    })
    .from(posts)
    .leftJoin(socialAccounts, eq(posts.socialAccountId, socialAccounts.id))
    .where(
      and(
        eq(posts.userId, userId),
        or(
          and(isNotNull(posts.scheduledAt), between(posts.scheduledAt, start, end)),
          and(isNull(posts.scheduledAt), between(posts.createdAt, start, end))
        )
      )
    )
    .orderBy(asc(posts.scheduledAt));

  const items = rows.map((row) => ({
    id: row.id,
    body: row.body,
    status: row.status,
    accountName: row.accountName,
    at: (row.scheduledAt ?? row.createdAt).toISOString(),
  }));

  const monthValue = `${year}-${String(month).padStart(2, "0")}`;

  return (
    <main>
      <CalendarView month={monthValue} posts={items} />
    </main>
  )
}
