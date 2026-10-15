import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { postMedia, posts, postTargets, socialAccounts } from "@/db/schema";
import { getProvider, type ProviderId } from "./providers";
import { aggregatePostStatus, type TargetStatus } from "./post-status";

export async function publishTargetById(targetId: number) {
    const [target] = await db.select()
        .from(postTargets)
        .where(eq(postTargets.id, targetId));
    if(!target) return;
    if(target.status === "published" || target.status === "cancelled") return;
    if(!target.socialAccountId){
        throw new Error("The account for this post was disconnected.")
    }

    const [account] = await db.select()
        .from(socialAccounts)
        .where(eq(socialAccounts.id, target.socialAccountId))
    if(!account) throw new Error("Account not found")

    const [post] = await db.select()
        .from(posts)
        .where(eq(posts.id, target.postId))
    if(!post) return;

    const [media] = await db 
        .select()
        .from(postMedia)
        .where(eq(postMedia.postId, target.postId))
        .orderBy(asc(postMedia.position))
        .limit(1);

    await db.update(postTargets).set({
        status: "publishing"
    }).where(eq(postTargets.id, targetId));
    await refreshPostStatus(target.postId);

    const provider = getProvider(account.provider as ProviderId);
    const { externalId } = await provider.publish(account,{
        text: post.body,
        media: media ? [{ url: media.url, type: media.type as "IMAGE" | "VIDEO" }] : []
    })

    await db.update(postTargets).set({
        status: "published",
        externalId,
        error: null,
        publishedAt: new Date(),
    }).where(eq(postTargets.id, targetId));

    await refreshPostStatus(target.postId);
}

async function refreshPostStatus(postId: number) {
    const targets = await db
        .select({ status: postTargets.status })
        .from(postTargets)
        .where(eq(postTargets.postId, postId));

    const status = aggregatePostStatus(targets.map((t) => t.status as TargetStatus));
    await db.update(posts).set({ status }).where(eq(posts.id, postId));
}

export async function markTargetFailed(targetId: number, message: string) {
    const [target] = await db.select()
        .from(postTargets)
        .where(eq(postTargets.id, targetId));
    if (!target) return; 

    await db
        .update(postTargets)
        .set({ status: "failed", error: message })
        .where(eq(postTargets.id, targetId))
    
    await refreshPostStatus(target.postId);
}

export async function cancelPostTargets(postId: number) {
    const cancelled =  await db
        .update(postTargets)
        .set({ status: "cancelled" })
        .where(and(eq(postTargets.postId, postId), eq(postTargets.status, "scheduled")))
        .returning({ id: postTargets.id });
    
    await refreshPostStatus(postId);

    return cancelled.map((target) => target.id);    
}
