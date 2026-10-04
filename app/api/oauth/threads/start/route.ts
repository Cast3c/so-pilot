import { randomBytes } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  await auth.protect();

  const state = randomBytes(16).toString("hex");

  const url = new URL("https://threads.net/oauth/authorize");
  url.searchParams.set("client_id", process.env.THREADS_APP_ID!);
  url.searchParams.set(
    "redirect_uri",
    `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/threads/callback`,
  );
  url.searchParams.set(
    "scope",
    "threads_basic,threads_content_publish,threads_manage_replies,threads_read_replies",
  );
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.cookies.set("threads_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
