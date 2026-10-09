import { randomUUID } from "node:crypto";
import { parseSignedRequest } from "@/lib/meta";
import { deleteAccountData } from "@/lib/account-data";

export async function POST(request: Request) {
  const form = await request.formData();
  const data = parseSignedRequest(
    String(form.get("signed_request") ?? ""),
    process.env.THREADS_APP_SECRET!
  );

  if (!data?.user_id) {
    return Response.json({ error: "invalid_signed_request" }, { status: 400 });
  }

  await deleteAccountData("threads", String(data.user_id));

  const code = randomUUID();
  return Response.json({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/data-deletion?code=${code}`,
    confirmation_code: code,
  });
}
