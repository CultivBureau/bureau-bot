'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Save, Loader2, Mail, Phone, UserCircle, Calendar, Shield, CreditCard, Clock } from 'lucide-react';
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout';
import { userService } from '../../../services/user';
import { User as UserType } from '../../../types/auth';
import { useAppSelector } from '../../../store/hooks';
import { Button } from '../../../components/landing/ui/button';

export default function ProfilePage() {
  const router = useRouter();
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
      <div className="max-w-4xl mx-auto">

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

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <UserCircle className="h-12 w-12" />
                </div>
                <h2 className="text-xl font-semibold text-card-foreground">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                
                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className={user.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {user.is_active ? 'Active Account' : 'Inactive Account'}
                    </span>
                  </div>
                  {user.plan_type && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Plan: {user.plan_type}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Member since {new Date(user.created_on).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">Personal Information</h2>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="rounded-full"
                    variant="outline"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="text-sm font-medium text-card-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      First Name
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:cursor-not-allowed"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="text-sm font-medium text-card-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-card-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:cursor-not-allowed"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phone_number" className="text-sm font-medium text-card-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:cursor-not-allowed"
                    required
                  />
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      variant="outline"
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </div>

            {/* Plan Information */}
            <div className="mt-6 rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Plan
                </h2>
              </div>

              <div className="space-y-4">
                {/* Plan Type */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Plan Type</p>
                      <p className="text-xs text-muted-foreground">Current subscription plan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-card-foreground">
                      {user.plan_type || 'No Plan'}
                    </p>
                    {!user.plan_type && (
                      <p className="text-xs text-muted-foreground">Not subscribed</p>
                    )}
                  </div>
                </div>

                {/* Plan Start Date */}
                {user.plan_start_date && (
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">Start Date</p>
                        <p className="text-xs text-muted-foreground">When your plan started</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-card-foreground">
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
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">End Date</p>
                        <p className="text-xs text-muted-foreground">When your plan expires</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-card-foreground">
                        {new Date(user.plan_end_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {new Date(user.plan_end_date) > new Date() && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Active
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* No Plan Message */}
                {!user.plan_type && !user.plan_start_date && !user.plan_end_date && (
                  <div className="p-4 rounded-lg border border-border bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground">
                      You don't have an active subscription plan.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Visit the Payment page to subscribe to a plan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

