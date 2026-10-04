"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";

export async function disconnectAccount(formData: FormData) {
  const { userId } = await auth.protect();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db
    .delete(socialAccounts)
    .where(and(eq(socialAccounts.id, id), eq(socialAccounts.userId, userId)));

  revalidatePath("/accounts");
}
