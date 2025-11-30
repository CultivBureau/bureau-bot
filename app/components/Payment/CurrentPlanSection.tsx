'use client';

import { CreditCard, Check, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { User } from '../../types/auth';
import { Button } from '../landing/ui/button';

interface CurrentPlanSectionProps {
  user: User;
  showPlans: boolean;
  onTogglePlans: () => void;
}

export function CurrentPlanSection({ user, showPlans, onTogglePlans }: CurrentPlanSectionProps) {
  const hasActivePlan = user.plan_type !== null;

  return (
    <div className="rounded-3xl border border-primary/20 bg-card/90 dark:bg-card/80 backdrop-blur-lg p-8 shadow-xl transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-4 flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-card-foreground tracking-tight">Current Plan</h2>
          </div>
          
          {hasActivePlan ? (
            <>
              <div className="mb-5">
                <p className="text-3xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {user.plan_type}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                {user.plan_start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Started: {new Date(user.plan_start_date).toLocaleDateString()}</span>
                  </div>
                )}
                {user.plan_end_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Renews: {new Date(user.plan_end_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mt-4">
              <p className="text-lg text-muted-foreground font-medium">You don&apos;t have an active subscription plan.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Choose a plan to unlock all features and start your journey.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-3">
          {hasActivePlan && (
            <div className="flex items-center gap-2 rounded-full bg-green-500/15 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              Active
            </div>
          )}
          <Button
            onClick={onTogglePlans}
            className="rounded-full px-6 py-2.5 font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:bg-primary/90 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all flex items-center gap-2"
          >
            {hasActivePlan ? 'Your Plan' : 'See Plans'}
            {showPlans ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

