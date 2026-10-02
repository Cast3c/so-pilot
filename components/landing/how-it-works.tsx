const steps = [
  {
    title: "Connect your accounts",
    description: "Link Instagram, Threads and YouTube with a few clicks.",
  },
  {
    title: "Write and schedule",
    description: "Create your post, choose the networks and pick the time.",
  },
  {
    title: "Let it run",
    description: "We publish on schedule and reply to comments for you.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>

        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col items-center text-center">
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mb-1 font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
