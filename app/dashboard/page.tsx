import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { createPost } from "./actions";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const { userId } = await auth.protect();

    const myPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, userId))
        .orderBy(desc(posts.createdAt));

    return (
        <main className="mx-auto max-w-xl p-8">
            <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
            
            <form action={createPost} className="flex flex-col gap-3">
                <textarea 
                name="body" 
                rows={4}
                required
                placeholder="Que quieres publicar?"
                className="rounded-md border p-3"
                />
                <Button type="submit">Guardar post</Button>
            </form>

            <ul className="mt-8 flex flex-col gap-3">
                {myPosts.map((post) => (
                    <li key={post.id} className="rounded-md border p-4">
                        <p>{post.body}</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {post.status} - {post.createdAt.toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </main>
    )
}