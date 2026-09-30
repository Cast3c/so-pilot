"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { posts } from "@/db/schema";

export async function createPost(formData: FormData) {
    const { userId } = await auth.protect();

    const body = String(formData.get("body") ?? "" ).trim();
    if(!body) return;
    
    await db.insert(posts).values({ userId, body });
    revalidatePath("/dashboard");
}