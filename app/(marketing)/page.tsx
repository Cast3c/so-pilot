import Link from "next/link";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";


export default function LandingPage() {
  return (
    <>
      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-24 text-center">
        <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
          Plan, publish and reply from one place
        </span>

        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
          Your social media,{" "}
          <span className="bg-linear-to-br from-red-700 to-red-500 bg-clip-text text-transparent">
            on autopilot
          </span>
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground">
          Connect your accounts, write once, schedule everywhere, and let
          keyword-based replies handle your comments.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
            Start for free <ArrowRight />
          </Link>
          <a
            href="#features"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            See features
          </a>
        </div>
      </section>
      <Features />
      <HowItWorks />
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}
