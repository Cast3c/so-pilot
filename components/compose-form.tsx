"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { publishPost, type PublishState } from "@/app/(app)/compose/actions";
import { THREADS_MAX_CHARS } from "@/lib/providers/threads";
import { upload } from "@imagekit/next";

type Account = { id: number; displayName: string | null; provider: string };
type Media = { url: string; fileId: string; type: "IMAGE" | "VIDEO" };
const MAX_SIZE_MB = 25;

export function ComposeForm({ accounts }: { accounts: Account[] }) {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<Media | null>(null);
  const [state, action, pending] = useActionState<PublishState, FormData>(
    async (prev, formData) => {
      const result = await publishPost(prev, formData);
      if (result?.ok) {
        setText("");
        setMedia(null);
      };
      return result;
    },
    null,
  );

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  


  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const safeName = file?.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "media";
    const extension = file?.name.split(".").pop()?.toLowerCase() ?? "jpg";
    event.target.value = "";
    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`The file must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      const authRes = await fetch("/api/imagekit-auth");
      if (!authRes.ok) throw new Error("Could not authorize the upload.");
      const { token, expire, signature, publicKey } = await authRes.json();

      const result = await upload({
        file,
        fileName: `${safeName}.${extension}`,
        token,
        expire,
        signature,
        publicKey,
        folder: "/so-pilot",
      });
      if (!result.url) throw new Error("The upload failed.");

      setMedia({
        url: result.url,
        fileId: result.fileId ?? "",
        type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
      });
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "The upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <select
        name="accountId"
        required
        className="rounded-md border bg-background p-2"
      >
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            @{account.displayName} ({account.provider})
          </option>
        ))}
      </select>

      <textarea
        name="body"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What do you want to say?"
        className="rounded-md border bg-background p-3"
      />

      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/jpeg,image/png,video/mp4,video/quicktime"
          onChange={handleFile}
          disabled={uploading}
          className="text-sm"
        />
        {uploading && (
          <p className="text-sm text-muted-foreground">Uploading...</p>
        )}
        {uploadError && (
          <p className="text-sm text-destructive">{uploadError}</p>
        )}

        {media && (
          <div className="flex flex-col items-start gap-2">
            {media.type === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.url}
                alt=""
                className="max-h-64 rounded-md border"
              />
            ) : (
              <video
                src={media.url}
                controls
                className="max-h-64 rounded-md border"
              />
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setMedia(null)}
            >
              Remove
            </Button>
            <input type="hidden" name="mediaUrl" value={media.url} />
            <input type="hidden" name="mediaType" value={media.type} />
            <input type="hidden" name="mediaFileId" value={media.fileId} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span
          className={
            text.length > THREADS_MAX_CHARS
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {text.length}/{THREADS_MAX_CHARS}
        </span>
        <Button type="submit" disabled={pending}>
          {pending ? "Publishing..." : "Publish"}
        </Button>
      </div>

      {state && (
        <p className={state.ok ? "text-green-600" : "text-destructive"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
