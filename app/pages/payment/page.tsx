'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { CurrentPlanSection } from '../../components/Payment/CurrentPlanSection';
import { PricingPlansList } from '../../components/Payment/PricingPlansList';
import { PaymentTransactionsTable } from '../../components/Payment/PaymentTransactionsTable';
import { userService } from '../../services/user';
import { User } from '../../types/auth';
import { useAppSelector } from '../../store/hooks';
import { Loader2 } from 'lucide-react';

export default function PaymentPage() {
  const decodedToken = useAppSelector((state) => state.auth.decodedToken);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = decodedToken?.user_id as string;
        
        if (!userId) {
          throw new Error('User ID not found. Please log in again.');
        }

        const userData = await userService.getUserById(userId);
        setUser(userData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (decodedToken?.user_id) {
      fetchUser();
    }
  }, [decodedToken]);

  const handleSelectPlan = (planName: string) => {
    // TODO: Implement payment processing
    console.log('Selected plan:', planName);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
          {error || 'User profile not found'}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">

        {/* Error Display */}
        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {/* Current Plan Section */}
        <CurrentPlanSection 
          user={user} 
          showPlans={showPlans}
          onTogglePlans={() => setShowPlans(!showPlans)}
        />

        {/* Pricing Plans List - Collapsible */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showPlans 
            ? 'max-h-[2000px] opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 -translate-y-4'
        }`}>
          <PricingPlansList
            currentPlanName={user.plan_type}
            onSelectPlan={handleSelectPlan}
          />
        </div>

        {/* Payment Transactions Table */}
        <PaymentTransactionsTable />
      </div>
    </DashboardLayout>
  );
}

