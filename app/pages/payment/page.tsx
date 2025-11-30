'use client';

import { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { CreditCard, Check, X, Calendar, DollarSign } from 'lucide-react';

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Mock payment data - Replace with actual API call
  const currentPlan: PaymentPlan = {
    id: '1',
    name: 'Professional',
    price: 49.99,
    period: 'monthly',
    features: [
      'Up to 10 bots',
      'Unlimited conversations',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
    ],
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-02-01',
  };

  const availablePlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 19.99,
      period: 'monthly',
      features: [
        'Up to 3 bots',
        '1,000 conversations/month',
        'Email support',
        'Basic analytics',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 49.99,
      period: 'monthly',
      features: [
        'Up to 10 bots',
        'Unlimited conversations',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 149.99,
      period: 'monthly',
      features: [
        'Unlimited bots',
        'Unlimited conversations',
        '24/7 dedicated support',
        'Custom analytics dashboard',
        'All integrations',
        'Custom AI models',
        'SLA guarantee',
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // TODO: Implement payment processing
    console.log('Selected plan:', planId);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-hero-text">Payment & Plans</h1>
          <p className="mt-1 text-sm text-hero-subtext">Manage your subscription and billing</p>
        </div>

        {/* Current Plan */}
        <div className="rounded-2xl border border-primary/20 bg-card/70 backdrop-blur-sm p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-card-foreground">Current Plan</h2>
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold text-card-foreground">
                  ${currentPlan.price}
                  <span className="text-base font-normal text-muted-foreground">/{currentPlan.period}</span>
                </p>
                <p className="text-lg font-medium text-card-foreground">{currentPlan.name}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Started: {new Date(currentPlan.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Renews: {new Date(currentPlan.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              Active
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-hero-text">Available Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {availablePlans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlan.id.toLowerCase();
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-6 shadow-sm transition ${
                    isCurrentPlan
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-card/70 backdrop-blur-sm hover:shadow-md'
                  }`}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-card-foreground">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-card-foreground">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrentPlan}
                    className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isCurrentPlan
                        ? 'cursor-not-allowed bg-muted text-muted-foreground'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment History Section */}
        <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-hero-text">Payment History</h2>
          <div className="space-y-4">
            {/* Mock payment history */}
            {[
              { date: '2024-01-01', amount: 49.99, status: 'paid', invoice: 'INV-001' },
              { date: '2023-12-01', amount: 49.99, status: 'paid', invoice: 'INV-002' },
              { date: '2023-11-01', amount: 49.99, status: 'paid', invoice: 'INV-003' },
            ].map((payment, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">${payment.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString()} • {payment.invoice}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400">
                  <Check className="h-4 w-4" />
                  {payment.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

