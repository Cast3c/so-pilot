export type TargetStatus =
  | "scheduled"
  | "publishing"
  | "published"
  | "failed"
  | "cancelled";
export type PostStatus = TargetStatus | "draft" | "partial";

export function aggregatePostStatus(targets: TargetStatus[]): PostStatus {
  if (targets.length === 0) return "draft";

  const active = targets.filter((status) => status !== "cancelled");

  if (active.length === 0) return "cancelled";
  if (active.includes("publishing")) return "publishing";
  if (active.includes("scheduled")) return "scheduled";
  if (active.every((status) => status === "published")) return "published";
  if (active.every((status) => status === "failed")) return "failed";

  return "partial";
}
