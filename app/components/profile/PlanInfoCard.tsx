'use client';

import { CreditCard, Calendar, Clock } from 'lucide-react';
import { User as UserType } from '../../types/auth';

interface PlanInfoCardProps {
  user: UserType;
}

export function PlanInfoCard({ user }: PlanInfoCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card/90 dark:bg-card/80 backdrop-blur-lg p-8 shadow-xl transition-colors">
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-2xl font-bold text-card-foreground flex items-center gap-2 tracking-tight">
          <CreditCard className="h-5 w-5" />
          Subscription Plan
        </h2>
      </div>

      <div className="space-y-5">
        {/* Plan Type */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-accent/80 dark:bg-accent/40 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-card-foreground">Plan Type</p>
              <p className="text-xs text-muted-foreground">Current subscription plan</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-card-foreground">
              {user.plan_type || 'No Plan'}
            </p>
            {!user.plan_type && (
              <p className="text-xs text-muted-foreground font-medium">Not subscribed</p>
            )}
          </div>
        </div>

        {/* Plan Start Date */}
        {user.plan_start_date && (
          <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-background/80 dark:bg-background/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-base font-semibold text-card-foreground">Start Date</p>
                <p className="text-xs text-muted-foreground">When your plan started</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-card-foreground">
                {new Date(user.plan_start_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}

        {/* Plan End Date */}
        {user.plan_end_date && (
          <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-background/80 dark:bg-background/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-base font-semibold text-card-foreground">End Date</p>
                <p className="text-xs text-muted-foreground">When your plan expires</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-card-foreground">
                {new Date(user.plan_end_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {new Date(user.plan_end_date) > new Date() && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold">
                  Active
                </p>
              )}
            </div>
          </div>
        )}

        {/* No Plan Message */}
        {!user.plan_type && !user.plan_start_date && !user.plan_end_date && (
          <div className="p-5 rounded-xl border border-border bg-muted/60 dark:bg-muted/40 text-center">
            <p className="text-base text-muted-foreground font-semibold">
              You don&apos;t have an active subscription plan.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Visit the Payment page to subscribe to a plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

