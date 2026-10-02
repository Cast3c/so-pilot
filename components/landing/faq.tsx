import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Which social networks are supported?",
    answer:
      "We are starting with Instagram, Threads and YouTube. More networks will follow.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes. The Free plan has no time limit. Paid features will arrive later.",
  },
  {
    question: "Can I schedule posts for different networks at once?",
    answer:
      "Yes. Write the post once, pick the networks and the time, and we do the rest.",
  },
  {
    question: "How do automatic replies work?",
    answer:
      "You define keywords, and when a comment matches one, we reply with the message you set.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t bg-muted/40 py-24">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>

        <Accordion>
          {faqs.map((faq) => (
            <AccordionItem key={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
