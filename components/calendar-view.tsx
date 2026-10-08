"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CalendarPost = {
  id: number;
  body: string;
  status: string;
  accountName: string | null;
  at: string;
};

const statusDot: Record<string, string> = {
  scheduled: "bg-blue-500",
  published: "bg-green-500",
  publishing: "bg-amber-500",
  failed: "bg-red-500",
  draft: "bg-gray-400",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_PER_DAY = 3;

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function CalendarView({
  month,
  posts,
}: {
  month: string;
  posts: CalendarPost[];
}) {
  const hydrated = useHydrated();

  const current = parse(month, "yyyy-MM", new Date());
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(current), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(current), { weekStartsOn: 1 }),
  });

  const postsByDay = new Map<string, CalendarPost[]>();
  if (hydrated) {
    for (const post of posts) {
      const key = format(new Date(post.at), "yyyy-MM-dd");
      postsByDay.set(key, [...(postsByDay.get(key) ?? []), post]);
    }
  }

  const prev = format(addMonths(current, -1), "yyyy-MM");
  const next = format(addMonths(current, 1), "yyyy-MM");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{format(current, "MMMM yyyy")}</h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/calendar?month=${prev}`}
            className={buttonVariants({ variant: "outline", size: "icon" })}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </Link>
          <Link href="/calendar" className={buttonVariants({ variant: "outline" })}>
            Today
          </Link>
          <Link
            href={`/calendar?month=${next}`}
            className={buttonVariants({ variant: "outline", size: "icon" })}
            aria-label="Next month"
          >
            <ChevronRight />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px] overflow-hidden rounded-lg border">
          <div className="grid grid-cols-7 border-b bg-muted/40 text-xs font-medium text-muted-foreground">
            {WEEKDAYS.map((day) => (
              <div key={day} className="px-2 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const dayPosts = postsByDay.get(key) ?? [];
              const today = hydrated && isToday(day);

              return (
                <div
                  key={key}
                  className={cn(
                    "min-h-28 border-b border-r p-1.5 text-sm",
                    !isSameMonth(day, current) && "bg-muted/30 text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "mb-1 inline-flex size-6 items-center justify-center rounded-full text-xs",
                      today && "bg-primary font-bold text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  <ul className="flex flex-col gap-1">
                    {dayPosts.slice(0, MAX_PER_DAY).map((post) => (
                      <li
                        key={post.id}
                        title={post.body}
                        className="flex items-center gap-1 truncate rounded bg-muted px-1.5 py-0.5 text-xs"
                      >
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            statusDot[post.status] ?? "bg-gray-400"
                          )}
                        />
                        <span className="shrink-0 text-muted-foreground">
                          {format(new Date(post.at), "HH:mm")}
                        </span>
                        <span className="truncate">{post.body || "(media)"}</span>
                      </li>
                    ))}
                    {dayPosts.length > MAX_PER_DAY && (
                      <li className="px-1.5 text-xs text-muted-foreground">
                        +{dayPosts.length - MAX_PER_DAY} more
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
