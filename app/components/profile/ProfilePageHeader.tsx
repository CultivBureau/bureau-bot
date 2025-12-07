'use client';

import { memo } from 'react';

export const ProfilePageHeader = memo(function ProfilePageHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-hero-text">Profile</h1>
      <p className="mt-1 text-sm text-hero-subtext">Manage your account settings</p>
    </div>
  );
});

