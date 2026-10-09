import { parseSignedRequest } from "@/lib/meta";
import { removeAccount } from "@/lib/account-data";

export async function POST(request: Request) {
  const form = await request.formData();
  const data = parseSignedRequest(
    String(form.get("signed_request") ?? ""),
    process.env.THREADS_APP_SECRET!
  );

  if (!data?.user_id) {
    return Response.json({ error: "invalid_signed_request" }, { status: 400 });
  }

  await removeAccount("threads", String(data.user_id));
  return new Response(null, { status: 200 });
}
