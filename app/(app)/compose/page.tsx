import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { ComposeForm } from "@/components/compose-form";
import { buttonVariants } from "@/components/ui/button";

export default async function ComposePage() {
  const { userId } = await auth.protect();

  const accounts = await db
    .select({
      id: socialAccounts.id,
      displayName: socialAccounts.displayName,
      provider: socialAccounts.provider,
    })
    .from(socialAccounts)
    .where(eq(socialAccounts.userId, userId));

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Compose</h1>

      {accounts.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-muted-foreground">
            Connect an account before publishing.
          </p>
          <a href="/accounts" className={buttonVariants()}>
            Go to Accounts
          </a>
        </div>
      ) : (
        <ComposeForm accounts={accounts} />
      )}
    </main>
  );
}
