"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { cancelPublish } from "@/lib/queue";

export async function cancelScheduledPost(formData: FormData) {
    const { userId } = await auth.protect();
    const id = Number(formData.get("id"));
    if(!Number.isInteger(id)) return;

    const [post] = await db
        .update(posts)
        .set({ status: "cancelled" })
        .where(
            and(
                eq(posts.id, id),
                eq(posts.userId, userId),
                eq(posts.status, "scheduled")
            )
        )
        .returning({ id: posts.id });

    if(!post) return;

    await cancelPublish(post.id);
    revalidatePath("/dashboard");
    revalidatePath("/calendar");
}
