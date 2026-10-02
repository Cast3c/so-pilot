import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to put your socials on autopilot?
        </h2>
        <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
          Start for free
        </Link>
      </div>
    </section>
  );
}
