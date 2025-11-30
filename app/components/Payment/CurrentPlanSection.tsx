'use client';

import { CreditCard, Check, Calendar } from 'lucide-react';
import { User } from '../../types/auth';

interface CurrentPlanSectionProps {
  user: User;
}

export function CurrentPlanSection({ user }: CurrentPlanSectionProps) {
  const hasActivePlan = user.plan_type !== null;

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/70 backdrop-blur-sm p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">Current Plan</h2>
          </div>
          
          {hasActivePlan ? (
            <>
              <div className="mb-4">
                <p className="text-2xl font-bold text-card-foreground">
                  {user.plan_type}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {user.plan_start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Started: {new Date(user.plan_start_date).toLocaleDateString()}</span>
                  </div>
                )}
                {user.plan_end_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Renews: {new Date(user.plan_end_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mt-4">
              <p className="text-muted-foreground">You don't have an active subscription plan.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Select a plan below to get started.
              </p>
            </div>
          )}
        </div>
        
        {hasActivePlan && (
          <div className="flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            Active
          </div>
        )}
      </div>
    </div>
  );
}

