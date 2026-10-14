import { decrypt } from "@/lib/crypto";
import type { SocialProvider } from "./types";
import { ProviderError, type ErrorClass } from "./errors";

const GRAPH = "https://graph.threads.net/v1.0";

export const THREADS_MAX_CHARS = 500;

function classifyHttpStatus(status: number): ErrorClass {
  if(status === 401 || status === 403) {
    return "auth";
  }

  if(status === 400 || status === 422) {
    return "validation";
  }

  if(status === 429) {
    return "rate_limit";
  }

  return "unknown";
}

async function graphPost(path: string, params: Record<string, string>) {
    const res = await fetch(`${GRAPH}${path}`, {
        method: "POST",
        body: new URLSearchParams(params),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const e = data?.error;
      console.error(
        "Threads API error:",
        path,
        res.status,
        e?.code,
        e?.error_subcode,
        e?.message,
      );
      throw new ProviderError(
        classifyHttpStatus(res.status), e?.message, data
      );
    }

    return data as { id: string };
}

async function graphGet(path: string, params: Record<string, string>) {
  const url = new URL(`${GRAPH}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ProviderError(
      classifyHttpStatus(res.status), data?.error?.message ?? `Threads API error (${res.status})`,data
    );
  }
  return data;
}

async function waitUntilReady(creationId: string, token: string) {
  for (let i = 0; i < 20; i++) {
    const data = (await graphGet(`/${creationId}`, {
      fields: "status,error_message",
      access_token: token,
    })) as { status: string; error_message?: string };

    if (data.status === "FINISHED") return;
    if (data.status === "ERROR" || data.status === "EXPIRED") {
      throw new ProviderError(
        "unknown", data.error_message ?? `Media processing ${data.status}, data`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new ProviderError("transient", "Media processing timed out.");
}

export async function publishToThreads(
    account: { externalId: string; accessToken: string },
    text: string,
    media?: { url: string; type: "IMAGE" | "VIDEO" } | null
) {
    const token = decrypt(account.accessToken);

    const params: Record<string, string> = {
        media_type: media?.type ?? "TEXT",
        text,
        access_token: token
    };
    if (media?.type === "IMAGE") params.image_url = media.url;
    if (media?.type === "VIDEO") params.video_url = media.url;

    // Crear el contenedor
    const container = await  graphPost(`/${account.externalId}/threads`, params);
    if (media) await waitUntilReady(container.id, token);

    // Publicar el contenedor
    const published = await graphPost(`/${account.externalId}/threads_publish`, {
        creation_id: container.id,
        access_token: token,
    })

    return published.id;
}

export const threadsProvider: SocialProvider = {
  capabilities: {
    id: "threads",
    label: "Threads",
    maxTextLength: THREADS_MAX_CHARS,
    media: {
      allowed: ["IMAGE", "VIDEO"], required: false, maxItems: 1
    },
  },
  async publish(account, input) {
    const externalId = await publishToThreads(
      account, input.text, input.media[0] ?? null 
    )

    return { externalId }
  }
}
