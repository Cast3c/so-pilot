import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { disconnectAccount } from "./actions";

const messages: Record<string, string> = {
  denied: "You cancelled the connection.",
  invalid_state: "The request could not be verified. Please try again.",
  token_exchange: "We could not complete the connection with Threads.",
  long_token: "We could not get a long-lived token.",
  profile: "We could not read your Threads profile.",
};

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; connected?: string }>;
}) {
  const { userId } = await auth.protect();
  const { error, connected } = await searchParams;

  const accounts = await db
    .select({
      id: socialAccounts.id,
      provider: socialAccounts.provider,
      displayName: socialAccounts.displayName,
      avatarUrl: socialAccounts.avatarUrl,
      status: socialAccounts.status,
    })
    .from(socialAccounts)
    .where(eq(socialAccounts.userId, userId))
    .orderBy(desc(socialAccounts.createdAt));

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <a
          href="/api/oauth/threads/start"
          className={buttonVariants()}
        >
          Connect Threads
        </a>
      </div>

      {connected && (
        <Alert className="mb-4">
          <AlertDescription>Account connected successfully.</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {messages[error] ?? "Something went wrong."}
          </AlertDescription>
        </Alert>
      )}

      {accounts.length === 0 ? (
        <p className="text-muted-foreground">No accounts connected yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="flex items-center gap-3 rounded-md border p-4"
            >
              <Avatar>
                {account.avatarUrl && <AvatarImage src={account.avatarUrl} />}
                <AvatarFallback>
                  {account.displayName?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">@{account.displayName}</p>
                <p className="text-sm capitalize text-muted-foreground">
                  {account.provider}
                </p>
              </div>
              <Badge variant="secondary">{account.status}</Badge>
              <form action={disconnectAccount}>
                <input type="hidden" name="id" value={account.id} />
                <Button type="submit" variant="outline">
                  Disconnect
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
