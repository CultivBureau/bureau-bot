'use client';

import { Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout';
import { PersonalInfoCard } from '../../../components/profile/PersonalInfoCard';
import { PlanInfoCard } from '../../../components/profile/PlanInfoCard';
import { ProfilePageHeader } from '../../../components/profile/ProfilePageHeader';
import { ProfileAlerts } from '../../../components/profile/ProfileAlerts';
import { useProfile } from '../../../components/profile/hooks/useProfile';

export default function ProfilePage() {
  const {
    user,
    loading,
    saving,
    error,
    success,
    isEditing,
    formData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleEdit,
  } = useProfile();

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
      <div className="w-full mt-10">
        <ProfilePageHeader />

        <ProfileAlerts success={success} error={error} />

        <div className="grid gap-6 lg:grid-cols-2">
          <PersonalInfoCard
            user={user}
            formData={formData}
            isEditing={isEditing}
            saving={saving}
            onEdit={handleEdit}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />

          <PlanInfoCard user={user} />
        </div>
      </div>
    </DashboardLayout>
  );
}
