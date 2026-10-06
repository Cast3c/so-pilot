"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh({ intervalMs }: { intervalMs: number }) {
    const router = useRouter();

    useEffect(() => {
        if (intervalMs <= 0) return;

        const id = setInterval(() => {
            if (document.visibilityState === "visible") router.refresh();
        }, intervalMs);

        return () => clearInterval(id);
    }, [intervalMs, router]);

    return null;
}
