'use client';

import { DashboardLayout } from '../../../components/dashboard/DashboardLayout';
import { PersonalInfoCard } from '../../../components/profile/PersonalInfoCard';
import { ProfilePageHeader } from '../../../components/profile/ProfilePageHeader';
import { ProfileAlerts } from '../../../components/profile/ProfileAlerts';
import { useProfile } from '../../../components/profile/hooks/useProfile';
import { LoadingState } from '../../../components/dashboard/LoadingState';

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
    return <LoadingState message="Loading profile..." />;
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
      </div>
    </DashboardLayout>
  );
}
