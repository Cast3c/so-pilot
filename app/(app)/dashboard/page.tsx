import { auth } from "@clerk/nextjs/server";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { postMedia, posts, socialAccounts } from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";

export default async function DashboardPage() {
    const { userId } = await auth.protect();
  
    const rows = await db
        .select({
            id: posts.id,
            body: posts.body,
            status: posts.status,
            error: posts.error,
            createdAt: posts.createdAt,
            accountName: socialAccounts.displayName,
            accountAvatar: socialAccounts.avatarUrl,
            provider: socialAccounts.provider,
        })
        .from(posts)
        .leftJoin(socialAccounts, eq(posts.socialAccountId, socialAccounts.id))
        .where(eq(posts.userId, userId))
        .orderBy(desc(posts.createdAt));

    const media = rows.length
        ? await db
            .select()
            .from(postMedia)
            .where(inArray(postMedia.postId, rows.map((row) => row.id)))
        : [];

    const mediaByPost = new Map(media.map((item) => [item.postId, item]));

    return (
      <main className="mx-auto max-w-2xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Posts</h1>
          <a href="/compose" className={buttonVariants()}>
            New post
          </a>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-8">
            <p className="text-muted-foreground">
              You have not published anything yet.
            </p>
            <a
              href="/compose"
              className={buttonVariants({ variant: "outline" })}
            >
              Create your first post
            </a>
          </div>
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