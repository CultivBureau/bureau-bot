'use client';

import { useState } from 'react';
import { Button } from '../landing/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../landing/ui/card';
import { Badge } from '../landing/ui/badge';
import { Check } from 'lucide-react';

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: [
      'Up to 5 projects',
      '10GB storage',
      'Basic support',
      'Standard templates',
      'Email notifications',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    description: 'Ideal for growing teams and businesses',
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      'Unlimited projects',
      '100GB storage',
      'Priority support',
      'Premium templates',
      'Advanced analytics',
      'Team collaboration',
      'Custom integrations',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      'Everything in Professional',
      'Unlimited storage',
      '24/7 dedicated support',
      'Custom development',
      'Advanced security',
      'SSO integration',
      'API access',
      'White-label options',
    ],
    popular: false,
  },
];

interface PricingPlansListProps {
  currentPlanName?: string | null;
  onSelectPlan?: (planName: string) => void;
}

export function PricingPlansList({ currentPlanName, onSelectPlan }: PricingPlansListProps) {
  const [isYearly, setIsYearly] = useState(false);

  const handleSelectPlan = (planName: string) => {
    if (onSelectPlan) {
      onSelectPlan(planName);
    }
  };

  return (
    <div>
      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {pricingPlans.map((plan, index) => {
          const isCurrentPlan = currentPlanName?.toLowerCase() === plan.name.toLowerCase();
          return (
            <Card
              key={plan.name}
              className={`relative flex flex-col h-[600px] ${
                plan.popular ? 'border-primary shadow-lg scale-105' : ''
              } ${isCurrentPlan ? 'border-primary/30 bg-primary/5' : ''}`}
            >
              {plan.popular && (
                <Badge
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                  aria-label="Most popular plan"
                >
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-balance">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                  {isYearly && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ${Math.round(plan.yearlyPrice / 12)}/month billed annually
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  disabled={isCurrentPlan}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
}

