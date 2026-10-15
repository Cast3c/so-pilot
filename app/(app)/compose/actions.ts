"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { posts, socialAccounts, postMedia, postTargets } from "@/db/schema";
import { THREADS_MAX_CHARS } from "@/lib/providers/threads";
import { markTargetFailed, publishTargetById } from "@/lib/publish";
import  { schedulePublishTarget } from "@/lib/queue";

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

  const scheduledAtRaw = String(formData.get("scheduledAt") ?? "");
  let runAt: Date | null = null;
  if (scheduledAtRaw) {
    runAt = new Date(scheduledAtRaw);
    if (
      Number.isNaN(runAt.getTime()) ||
      runAt.getTime() < Date.now() + 60_000
    ) {
      return {
        ok: false,
        message: "Pick a date at least one minute in the future.",
      };
    }
  }

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
    .values({ 
      userId, 
      body, 
      status: runAt ? "scheduled" : "publishing",
      scheduledAt: runAt, 
      socialAccountId: account.id })
    .returning({ id: posts.id });

  if (media) {
    await db.insert(postMedia).values({
      postId: post.id,
      url: media.url,
      fileId: media.fileId,
      type: media.type,
    });
  }


  const [target] = await db
    .insert(postTargets)
    .values({
      postId: post.id,
      socialAccountId: account.id,
      provider: account.provider,
      status: runAt ? "scheduled" : "publishing",
    })
    .returning({ id: postTargets.id })

  if (runAt) {
    try {
      await Promise.race([
        schedulePublishTarget(target.id, runAt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Queue timeout")), 5000),
        ),
      ]);
    } catch {
      await markTargetFailed(target.id, "Scheduling is not available right now.");
      return {
        ok: false,
        message:
          "Scheduling is not available right now. Please try again later.",
      };
    }
    revalidatePath("/dashboard");
    return { ok: true, message: "Post scheduled." };
  }

  try {
    await publishTargetById(target.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await markTargetFailed(target.id, message);
    return { ok: false, message };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: "Published to Threads." };
}
