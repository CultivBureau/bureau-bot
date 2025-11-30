export interface PricingPlan {
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  popular: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for small teams and trial",
    features: [
      "Up to 5 team members",
      "Productivity reports",
      "3 months data retention"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
    popular: false
  },
  {
    name: "Essential",
    monthlyPrice: 5,
    yearlyPrice: 60,
    description: "Great for growing teams",
    features: [
      "Up to 50 member teams",
      "Productivity reports",
      "18 months data retention"
    ],
    buttonText: "Get Started",
    buttonVariant: "default",
    popular: true
  },
  {
    name: "Business",
    monthlyPrice: 14,
    yearlyPrice: 168,
    description: "For larger organizations",
    features: [
      "Unlimited team members",
      "Productivity reports",
      "3 year data retention",
      "SSO Login"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    popular: false
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "Custom solutions for large teams",
    features: [
      "All Business features",
      "Custom branding",
      "On-premises deployment",
      "Custom integrations"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    popular: false
  }
];

