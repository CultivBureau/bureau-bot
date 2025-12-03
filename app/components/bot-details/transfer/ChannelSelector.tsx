'use client';

import { useState, useEffect, useMemo } from 'react';

interface Channel {
  id: string | number;
  name: string;
  code?: string;
}

interface ChannelSelectorProps {
  channels: Channel[];
  selectedChannelId?: string;
  onSelect: (channelId: string) => void;
  disabled?: boolean;
  loading?: boolean;
  prerequisiteMessage?: string;
}

export function ChannelSelector({
  channels,
  selectedChannelId,
  onSelect,
  disabled = false,
  loading = false,
  prerequisiteMessage,
}: ChannelSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedChannel = useMemo(() => {
    if (!selectedChannelId) return null;
    return channels.find(c => c.id.toString() === selectedChannelId);
  }, [selectedChannelId, channels]);

  useEffect(() => {
    if (selectedChannel && !showDropdown) {
      setSearchTerm(selectedChannel.name);
    } else if (!selectedChannel && !showDropdown) {
      setSearchTerm('');
    }
  }, [selectedChannel, showDropdown]);

  const filteredChannels = useMemo(() => {
    if (!searchTerm.trim()) return channels;
    const lowerSearch = searchTerm.toLowerCase();
    return channels.filter(channel =>
      channel.name.toLowerCase().includes(lowerSearch) ||
      (channel.code && channel.code.toLowerCase().includes(lowerSearch))
    );
  }, [channels, searchTerm]);

  const handleSelect = (channel: Channel) => {
    onSelect(channel.id.toString());
    setSearchTerm(channel.name);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        Select Channels
      </label>
      {prerequisiteMessage && (
        <p className="text-sm text-amber-600">{prerequisiteMessage}</p>
      )}
      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          value={showDropdown ? searchTerm : (selectedChannel?.name || '')}
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
              if (selectedChannel) {
                setSearchTerm(selectedChannel.name);
              } else {
                setSearchTerm('');
              }
            }, 200);
          }}
          placeholder="Click to see all channels..."
          className={`w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground ${
            disabled ? 'cursor-not-allowed opacity-60' : ''
          }`}
        />
        {!disabled && showDropdown && (
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border-2 border-border bg-card">
            {filteredChannels.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                {loading ? 'Loading channels...' : channels.length === 0 ? 'No channels available' : 'No channels found'}
              </div>
            ) : (
              filteredChannels.map(channel => {
                const isSelected = selectedChannelId === channel.id.toString();
                return (
                  <div
                    key={channel.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(channel);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`px-4 py-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <div className="font-medium">{channel.name}</div>
                    {channel.code && (
                      <div className="text-xs mt-1 text-muted-foreground">
                        Code: {channel.code}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

