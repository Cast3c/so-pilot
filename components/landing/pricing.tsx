import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { plans } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 border-t py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(plan.highlighted && "ring-2 ring-red-500")}
            >
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <p className="pt-2">
                  <span className="text-4xl font-black">{plan.price}</span>{" "}
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <ul className="flex flex-col gap-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-4 text-red-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.available ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({ size: "lg" })}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "pointer-events-none opacity-60"
                    )}
                  >
                    {plan.cta}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
