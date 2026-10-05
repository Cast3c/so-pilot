import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  published: { label: "Published", variant: "secondary", className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" },
  failed: { label: "Failed", variant: "destructive" },
  publishing: { label: "Publishing...", variant: "secondary" },
  scheduled: { label: "Scheduled", variant: "outline" },
  draft: { label: "Draft", variant: "outline" },
};

type PostCardProps = {
  body: string;
  status: string;
  error: string | null;
  createdAt: Date;
  accountName: string | null;
  accountAvatar: string | null;
  provider: string | null;
  media: { url: string; type: string } | null;
};

export function PostCard({ body, status, error, createdAt, accountName, accountAvatar, provider, media }: PostCardProps) {
  const style = statusStyles[status] ?? { label: status, variant: "outline" as const };

  return (
    <li className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Avatar>
          {accountAvatar && <AvatarImage src={accountAvatar} />}
          <AvatarFallback>{accountName?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {accountName ? `@${accountName}` : "Disconnected account"}
          </p>
          <p className="text-xs capitalize text-muted-foreground">{provider ?? "-"}</p>
        </div>
        <Badge variant={style.variant} className={style.className}>
          {style.label}
        </Badge>
      </div>

      <div className="flex gap-3">
        {media && (
          media.type === "IMAGE" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.url} alt="" className="size-20 shrink-0 rounded-md border object-cover" />
          ) : (
            <video src={media.url} muted className="size-20 shrink-0 rounded-md border object-cover" />
          )
        )}
        <p className="line-clamp-4 whitespace-pre-wrap text-sm">
          {body || <span className="text-muted-foreground">(media only)</span>}
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground" title={createdAt.toLocaleString()}>
        {formatDistanceToNow(createdAt, { addSuffix: true })}
      </p>
    </li>
  );
}
