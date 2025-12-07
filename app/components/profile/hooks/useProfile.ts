import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../../services/user';
import { useAppSelector } from '../../../store/hooks';
import type { User } from '../../../types/auth';
import type { ProfileFormData } from '../../../utils/profile/validators';

export function useProfile() {
  const decodedToken = useAppSelector((state) => state.auth.decodedToken);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });

  const fetchUser = useCallback(async () => {
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
  }, [decodedToken]);

  useEffect(() => {
    if (decodedToken?.user_id) {
      fetchUser();
    }
  }, [decodedToken, fetchUser]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [user, formData]);

  const handleCancel = useCallback(() => {
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
  }, [user]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  return {
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
  };
}

