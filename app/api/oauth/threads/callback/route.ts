import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { encrypt } from "@/lib/crypto";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

function backToAccounts(params: Record<string, string>) {
    const url = new URL("/accounts", APP_URL);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }
    const response = NextResponse.redirect(url);
    response.cookies.delete("threads_oauth_state");
    return response;
}

export async function GET(request: NextRequest) {
    const { userId } = await auth.protect();

    const params = request.nextUrl.searchParams;
    const code = params.get("code");
    const state = params.get("state");
    const savedState = request.cookies.get("threads_oauth_state")?.value;

    if(params.get("error")) return backToAccounts({ error: "denied" });
    if(!code || !state || state !== savedState) {
        return backToAccounts({ error: "invalid_state" });
    }

    // Reemplazar el code con un token de corta duracion 
    const shortRes = await fetch("https://graph.threads.net/oauth/access_token", {
        method: "POST",
        body: new URLSearchParams({
            client_id: process.env.THREADS_APP_ID!,
            client_secret: process.env.THREADS_APP_SECRET!,
            grant_type: "authorization_code",
            redirect_uri: `${APP_URL}/api/oauth/threads/callback`,
            code,
        }),
    });
    if(!shortRes.ok) return backToAccounts({ error: "token_exchange" })
    
    const short = (await shortRes.json()) as { access_token: string };

    // Cambiar el token de corta duracion por uno de larga duracion
    const longUrl = new URL("https://graph.threads.net/access_token");
    longUrl.searchParams.set("grant_type", "th_exchange_token");
    longUrl.searchParams.set("client_secret", process.env.THREADS_APP_SECRET!);
    longUrl.searchParams.set("access_token", short.access_token);
    const longRes = await fetch(longUrl);
    const long = (await longRes.json() as {
        access_token: string;
        expires_in: number;
    });

    // Pedir datos del perfil
    const meUrl = new URL("https://graph.threads.net/v1.0/me");
    meUrl.searchParams.set("fields", "id,username,threads_profile_picture_url");
    meUrl.searchParams.set("access_token", long.access_token);
    const meRes = await fetch(meUrl);
    if(!meRes.ok) return backToAccounts({ error: "profile" });
    const me = await meRes.json() as {
        id: string;
        username: string;
        threads_profile_picture_url?: string;
    };

    // Guardar la cuenta con el token en la base de datos
    const values ={
        userId,
        provider: "threads",
        externalId: me.id,
        displayName: me.username,
        avatarUrl: me.threads_profile_picture_url ?? null,
        accessToken: encrypt(long.access_token),
        expiresAt: new Date(Date.now() + long.expires_in * 1000),
        status: "active",
    };

    await db
        .insert(socialAccounts)
        .values(values)
        .onConflictDoUpdate({
            target: [
                socialAccounts.userId,
                socialAccounts.provider,
                socialAccounts.externalId
            ], 
            set: {
                displayName: values.displayName,
                avatarUrl: values.avatarUrl,
                accessToken: values.accessToken,
                expiresAt: values.expiresAt,
                status: "active"
            },
        });

        return backToAccounts({ connected: "threads" });
}