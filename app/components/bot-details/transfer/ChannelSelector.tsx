'use client';

import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';

interface Channel {
  id: string | number;
  name: string;
  code?: string;
}

interface ChannelSelectorProps {
  channels: Channel[];
  selectedChannelIds: number[];
  onSelect: (channelIds: number[]) => void;
  disabled?: boolean;
  loading?: boolean;
  prerequisiteMessage?: string;
}

export function ChannelSelector({
  channels,
  selectedChannelIds,
  onSelect,
  disabled = false,
  loading = false,
  prerequisiteMessage,
}: ChannelSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedChannels = useMemo(() => {
    return channels.filter(c => selectedChannelIds.includes(Number(c.id)));
  }, [selectedChannelIds, channels]);

  useEffect(() => {
    if (!showDropdown && selectedChannels.length > 0) {
      setSearchTerm(selectedChannels.map(c => c.name).join(', '));
    } else if (!showDropdown) {
      setSearchTerm('');
    }
  }, [selectedChannels, showDropdown]);

  const filteredChannels = useMemo(() => {
    if (!searchTerm.trim()) return channels;
    const lowerSearch = searchTerm.toLowerCase();
    return channels.filter(channel =>
      channel.name.toLowerCase().includes(lowerSearch) ||
      (channel.code && channel.code.toLowerCase().includes(lowerSearch))
    );
  }, [channels, searchTerm]);

  const handleChannelSelect = (channel: Channel) => {
    const channelId = Number(channel.id);
    const currentIds = selectedChannelIds;
    
    if (currentIds.includes(channelId)) {
      const updatedIds = currentIds.filter(id => id !== channelId);
      onSelect(updatedIds);
    } else {
      onSelect([...currentIds, channelId]);
    }
    // Keep dropdown open for multiple selections
    setSearchTerm('');
    // Don't close dropdown - allow multiple selections
  };

  const handleRemoveChannel = (channelId: number) => {
    const updatedIds = selectedChannelIds.filter(id => id !== channelId);
    onSelect(updatedIds);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-card-foreground">
        Select Channels <span className="text-xs text-muted-foreground font-normal">(Multiple selection allowed)</span>
      </label>
      {prerequisiteMessage && (
        <p className="text-sm text-amber-600">{prerequisiteMessage}</p>
      )}
      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          value={showDropdown ? searchTerm : (selectedChannels.map(c => c.name).join(', ') || '')}
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
          placeholder="Click to select multiple channels..."
          className={`w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground ${
            disabled ? 'cursor-not-allowed opacity-60' : ''
          }`}
        />
        {!disabled && showDropdown && (
          <div className="absolute z-50 w-full mt-1 rounded-lg border-2 border-border bg-card shadow-lg">
            <div className="max-h-60 overflow-auto">
              {filteredChannels.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">
                  {loading ? 'Loading channels...' : channels.length === 0 ? 'No channels available' : 'No channels found'}
                </div>
              ) : (
                filteredChannels.map(channel => {
                const isSelected = selectedChannelIds.includes(Number(channel.id));
                return (
                  <div
                    key={channel.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleChannelSelect(channel);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`px-4 py-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{channel.name}</div>
                      {channel.code && (
                        <div className="text-xs mt-1 text-muted-foreground">
                          Code: {channel.code}
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
            {filteredChannels.length > 0 && (
              <div className="border-t border-border p-2 bg-secondary/30">
                <button
                  type="button"
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Done selecting ({selectedChannels.length} selected)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {selectedChannels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedChannels.map(channel => (
            <div
              key={channel.id}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-primary/30 bg-primary/20 text-primary"
            >
              <span className="text-sm font-medium">{channel.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveChannel(Number(channel.id))}
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

