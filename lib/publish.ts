import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { postMedia, posts, socialAccounts } from "@/db/schema";
import { getProvider, type ProviderId } from "./providers";

export async function publishPostById(postId: number) {
    const [post] = await db.select().from(posts).where(eq(posts.id, postId));
    if(!post) return;
    if(post.status === "published") return;
    if(post.status === "cancelled") return;

    if(!post.socialAccountId) {
        throw new Error("The post has no connected account.");
    }

    const [account] = await db
        .select()
        .from(socialAccounts)
        .where(eq(socialAccounts.id, post.socialAccountId));
    if (!account) throw new Error("Account not found.");

    const [media] = await db 
        .select()
        .from(postMedia)
        .where(eq(postMedia.postId, postId))
        .orderBy(asc(postMedia.position))
        .limit(1);

    await db
        .update(posts)
        .set({ status: "publishing" })
        .where(eq(posts.id, postId));
    
    const provider = getProvider(account.provider as ProviderId);
    const { externalId } = await provider.publish(account, {
        text: post.body,
        media: media ? [{ url: media.url, type: media.type as "IMAGE" | "VIDEO" }] : []
    });

    await db 
        .update(posts)
        .set({ status: "published", externalId, error: null })
        .where(eq(posts.id, postId));
}

export async function markPostFailed(postId: number, message:string) {
    await db
        .update(posts)
        .set({ status: "failed", error: message })
        .where(eq(posts.id, postId));
}

