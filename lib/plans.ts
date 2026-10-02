export const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to get started.",
    features: [
      "Up to 3 connected accounts",
      "10 scheduled posts per month",
      "Keyword auto replies",
    ],
    cta: "Start for free",
    highlighted: false,
    available: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$12",
    period: "per month",
    description: "For creators who post every day.",
    features: [
      "Unlimited connected accounts",
      "Unlimited scheduled posts",
      "AI-powered replies",
      "Priority support",
    ],
    cta: "Coming soon",
    highlighted: true,
    available: false,
  },
];
