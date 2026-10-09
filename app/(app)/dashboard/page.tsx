import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { postMedia, posts, socialAccounts } from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { AutoRefresh } from "@/components/auto-refresh";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "failed", label: "Failed" },
  { value: "publishing", label: "Publishing" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Draft" },
  { value: "cancelled", label: "Cancelled" }
] as const;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { userId } = await auth.protect();
  const { status } = await searchParams;
  const activeFilter = FILTERS.find((f) => f.value === status)?.value ?? "all";

  const rows = await db
    .select({
      id: posts.id,
      body: posts.body,
      status: posts.status,
      error: posts.error,
      createdAt: posts.createdAt,
      scheduledAt: posts.scheduledAt,
      accountName: socialAccounts.displayName,
      accountAvatar: socialAccounts.avatarUrl,
      provider: socialAccounts.provider,
    })
    .from(posts)
    .leftJoin(socialAccounts, eq(posts.socialAccountId, socialAccounts.id))
    .where(
      and(
        eq(posts.userId, userId),
        activeFilter === "all" ? undefined : eq(posts.status, activeFilter),
      ),
    )
    .orderBy(desc(posts.createdAt));

  const media = rows.length
    ? await db
        .select()
        .from(postMedia)
        .where(
          inArray(
            postMedia.postId,
            rows.map((row) => row.id),
          ),
        )
    : [];

  const mediaByPost = new Map(media.map((item) => [item.postId, item]));
  const hasPublishing = rows.some((row) => row.status === "publishing");
  const hasScheduled = rows.some((row) => row.status === "scheduled");
  const refreshInterval = hasPublishing ? 3000 : hasScheduled ? 15000 : 0;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <AutoRefresh intervalMs={refreshInterval} />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts</h1>
        <a href="/compose" className={buttonVariants()}>
          New post
        </a>
      </div>

      <nav className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "all"
                ? "/dashboard"
                : `/dashboard?status=${filter.value}`
            }
            className={buttonVariants({
              variant: activeFilter === filter.value ? "default" : "outline",
              size: "sm",
            })}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        activeFilter === "all" ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-8">
          <p className="text-muted-foreground">
            You have not published anything yet.
          </p>
          <a href="/compose" className={buttonVariants({ variant: "outline" })}>
            Create your first post
          </a>
        </div>
        ) : (
            <p className="text-muted-foreground">No posts with this status.</p>
        )
        
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => (
            <PostCard
              key={row.id}
              {...row}
              media={mediaByPost.get(row.id) ?? null}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
