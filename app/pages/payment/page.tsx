'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { CurrentPlanSection } from '../../components/Payment/CurrentPlanSection';
import { PaymentTransactionsTable } from '../../components/Payment/PaymentTransactionsTable';
import { userService } from '../../services/user';
import { User } from '../../types/auth';
import { useAppSelector } from '../../store/hooks';
import { LoadingState } from '../../components/dashboard/LoadingState';

export default function PaymentPage() {
  const decodedToken = useAppSelector((state) => state.auth.decodedToken);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <LoadingState message="Loading payment information..." />;
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
        />

        {/* Payment Transactions Table */}
        <PaymentTransactionsTable />
      </div>
    </DashboardLayout>
  );
}

