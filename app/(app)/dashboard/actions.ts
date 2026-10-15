"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { cancelPublishTarget } from "@/lib/queue";
import { cancelPostTargets } from "@/lib/publish";

export async function cancelScheduledPost(formData: FormData) {
    const { userId } = await auth.protect();
    const id = Number(formData.get("id"));
    if(!Number.isInteger(id)) return;

    const [post] = await db
        .select({ id: posts.id })
        .from(posts)
        .where(and(eq(posts.id, id), eq(posts.userId, userId), eq(posts.status, "scheduled")));
    if(!post) return;

    const cancelledIds = await cancelPostTargets(post.id);
    await Promise.all(
        cancelledIds.map((cancelledId) => cancelPublishTarget(cancelledId))
    );

    revalidatePath("/dashboard");
    revalidatePath("/calendar");
}
