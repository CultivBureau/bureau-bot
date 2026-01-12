'use client';

import { User, Save, Loader2, Mail, Phone } from 'lucide-react';
import { User as UserType } from '../../types/auth';
import { Button } from '../landing/ui/button';

interface PersonalInfoCardProps {
  user: UserType;
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  isEditing: boolean;
  saving: boolean;
  onEdit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function PersonalInfoCard({
  user,
  formData,
  isEditing,
  saving,
  onEdit,
  onInputChange,
  onSubmit,
  onCancel,
}: PersonalInfoCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card/90 dark:bg-card/80 backdrop-blur-lg p-8 shadow-xl transition-colors">
      {/* Header Section with Status */}
      <div className="mb-7">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-card-foreground tracking-tight">Personal Information</h2>
          {!isEditing && (
            <Button
              onClick={onEdit}
              className="rounded-full px-5 py-2 font-semibold bg-primary text-primary-foreground shadow-md hover:bg-primary/80 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-colors"
              variant="default"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-7">
        <div className="grid gap-7 sm:grid-cols-2">
          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={onInputChange}
              disabled={!isEditing}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={onInputChange}
              disabled={!isEditing}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted disabled:cursor-not-allowed"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            disabled={!isEditing}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted disabled:cursor-not-allowed"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label htmlFor="phone_number" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={onInputChange}
            disabled={!isEditing}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-muted disabled:cursor-not-allowed"
            required
          />
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center gap-4 pt-5 border-t border-border">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full px-6 py-2.5 font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:bg-primary/90 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-colors"
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
              onClick={onCancel}
              disabled={saving}
              variant="outline"
              className="rounded-full px-6 py-2.5 font-semibold border-border text-foreground bg-transparent hover:bg-muted/70 dark:hover:bg-muted/40 transition-colors"
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

