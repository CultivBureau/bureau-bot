'use client';

import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';

interface User {
  id: string | number;
  name: string;
  email?: string;
}

interface UserSelectorProps {
  users: User[];
  selectedUserIds: string;
  onSelect: (userIds: string) => void;
  disabled?: boolean;
  loading?: boolean;
  prerequisiteMessage?: string;
}

export function UserSelector({
  users,
  selectedUserIds,
  onSelect,
  disabled = false,
  loading = false,
  prerequisiteMessage,
}: UserSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedUserIdsArray = useMemo(() => {
    return selectedUserIds ? selectedUserIds.split(',').filter(Boolean) : [];
  }, [selectedUserIds]);

  const selectedUsers = useMemo(() => {
    return users.filter(user => selectedUserIdsArray.includes(user.id.toString()));
  }, [users, selectedUserIdsArray]);

  useEffect(() => {
    if (!showDropdown && selectedUsers.length > 0) {
      setSearchTerm(selectedUsers.map(u => u.name).join(', '));
    } else if (!showDropdown) {
      setSearchTerm('');
    }
  }, [selectedUsers, showDropdown]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowerSearch) ||
      (user.email && user.email.toLowerCase().includes(lowerSearch))
    );
  }, [users, searchTerm]);

  const handleUserSelect = (user: User) => {
    const userIdStr = user.id.toString();
    const currentIds = selectedUserIdsArray;
    
    if (currentIds.includes(userIdStr)) {
      const updatedIds = currentIds.filter(id => id !== userIdStr);
      onSelect(updatedIds.join(','));
    } else {
      onSelect([...currentIds, userIdStr].join(','));
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveUser = (userId: string) => {
    const updatedIds = selectedUserIdsArray.filter(id => id !== userId);
    onSelect(updatedIds.join(','));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        Select Users
      </label>
      {prerequisiteMessage && (
        <p className="text-sm text-amber-600">{prerequisiteMessage}</p>
      )}
      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          value={showDropdown ? searchTerm : (selectedUsers.map(u => u.name).join(', ') || '')}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setShowDropdown(true);
            setSearchTerm('');
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowDropdown(false);
              setSearchTerm('');
            }, 200);
          }}
          placeholder="Click to see all users..."
          className={`w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground ${
            disabled ? 'cursor-not-allowed opacity-60' : ''
          }`}
        />
        {!disabled && showDropdown && (
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border-2 border-border bg-card">
            {filteredUsers.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                {loading ? 'Loading users...' : users.length === 0 ? 'No users available' : 'No users found'}
              </div>
            ) : (
              filteredUsers.map(user => {
                const isSelected = selectedUserIdsArray.includes(user.id.toString());
                return (
                  <div
                    key={user.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUserSelect(user);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`px-4 py-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      {user.email && (
                        <div className="text-xs mt-1 text-muted-foreground">
                          {user.email}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      {selectedUsers.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedUsers.map(user => (
            <div
              key={user.id}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-primary/30 bg-primary/20 text-primary"
            >
              <span className="text-sm font-medium">{user.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveUser(user.id.toString())}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

