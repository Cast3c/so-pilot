import {
  CalendarDays,
  Clock,
  Eye,
  ImagePlus,
  MessageCircle,
  Share2,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Share2,
    title: "Publish everywhere",
    description: "Write one post and send it to every connected network at once.",
  },
  {
    icon: Clock,
    title: "Schedule ahead",
    description: "Pick a date and time and we publish it for you, on time.",
  },
  {
    icon: CalendarDays,
    title: "Visual calendar",
    description: "See everything you have scheduled in one place and move it around.",
  },
  {
    icon: ImagePlus,
    title: "Media uploads",
    description: "Attach images and videos once and reuse them across platforms.",
  },
  {
    icon: MessageCircle,
    title: "Auto replies",
    description: "Answer comments automatically based on the keywords you choose.",
  },
  {
    icon: Eye,
    title: "Per-network previews",
    description: "Check how your post looks on each platform before it goes out.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to run your socials
          </h2>
          <p className="mt-3 text-muted-foreground">
            One workspace to plan, publish and reply.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="mb-2 size-6 text-red-600" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
