'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout';
import { userService } from '../../../services/user';
import { User as UserType } from '../../../types/auth';
import { useAppSelector } from '../../../store/hooks';
import { PersonalInfoCard } from '../../../components/profile/PersonalInfoCard';
import { PlanInfoCard } from '../../../components/profile/PlanInfoCard';

export default function ProfilePage() {
  const decodedToken = useAppSelector((state) => state.auth.decodedToken);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });

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
        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          phone_number: userData.phone_number,
        });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      
      const updatedUser = await userService.updateUser(user.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        email: formData.email,
      });

      setUser(updatedUser);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
      });
    }
    setIsEditing(false);
    setError(null);
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
      <div className="w-full mt-10">

        {/* Success Display */}
        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-600 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Information Container */}
          <PersonalInfoCard
            user={user}
            formData={formData}
            isEditing={isEditing}
            saving={saving}
            onEdit={() => setIsEditing(true)}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />

          {/* Plan Information Container */}
          <PlanInfoCard user={user} />
        </div>
      </div>
    </DashboardLayout>
  );
}

