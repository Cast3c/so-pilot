"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { posts, socialAccounts, postMedia } from "@/db/schema";
import { 
    publishToThreads,
    THREADS_MAX_CHARS,
} from "@/lib/providers/threads";

export type PublishState = { ok: boolean; message: string } | null;

export async function publishPost(
  _prev: PublishState,
  formData: FormData
): Promise<PublishState> {
  const { userId } = await auth.protect();

  const body = String(formData.get("body") ?? "").trim();
  const accountId = Number(formData.get("accountId"));

  const mediaUrl = String(formData.get("mediaUrl") ?? "");
  const mediaType = String(formData.get("mediaType") ?? "");
  const mediaFileId = String(formData.get("mediaFileId") ?? "");
  const media =
    mediaUrl &&
    (mediaType === "IMAGE" || mediaType === "VIDEO") &&
    mediaUrl.startsWith(process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!)
      ? { url: mediaUrl, type: mediaType as "IMAGE" | "VIDEO", fileId: mediaFileId }
      : null;

  if (!body && !media) return { ok: false, message: "Write something first." };
  if (body.length > THREADS_MAX_CHARS) {
    return { ok: false, message: `Maximum ${THREADS_MAX_CHARS} characters.` };
  }
  if (!Number.isInteger(accountId)) {
    return { ok: false, message: "Choose an account." };
  }

  const [account] = await db
    .select()
    .from(socialAccounts)
    .where(
      and(eq(socialAccounts.id, accountId), eq(socialAccounts.userId, userId))
    );
  if (!account) return { ok: false, message: "Account not found." };

  const [post] = await db
    .insert(posts)
    .values({ userId, body, status: "publishing", socialAccountId: account.id })
    .returning({ id: posts.id });

  if (media) {
    await db.insert(postMedia).values({
      postId: post.id,
      url: media.url,
      fileId: media.fileId,
      type: media.type,
    });
  }

  try {
    const externalId = await publishToThreads(account, body, media);
    await db
      .update(posts)
      .set({ status: "published", externalId })
      .where(eq(posts.id, post.id));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await db
      .update(posts)
      .set({ status: "failed", error: message })
      .where(eq(posts.id, post.id));
    return { ok: false, message };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: "Published to Threads." };
}
