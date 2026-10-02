import Link from "next/link";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="bg-linear-to-br from-red-700 to-red-500 bg-clip-text text-xl font-black text-transparent"
          >
            So-Pilot
          </Link>

          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton>
                <button className={buttonVariants({ variant: "ghost" })}>
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className={buttonVariants()}>Get started</button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" className={buttonVariants()}>
                Dashboard
              </Link>
            </Show>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} So-Pilot
      </footer>
    </div>
  );
}
