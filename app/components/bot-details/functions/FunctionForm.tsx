'use client';

import { useState } from 'react';
import { Button } from '../../landing/ui/button';
import { Input } from '../../landing/ui/input';
import { Textarea } from '../../landing/ui/textarea';
import { Label } from '../../landing/ui/label';
import { X } from 'lucide-react';

interface FunctionFormData {
  name: string;
  description: string;
  code?: string;
}

interface FunctionFormProps {
  initialData?: FunctionFormData;
  onSave: (data: FunctionFormData) => void;
  onCancel: () => void;
  saving?: boolean;
}

export function FunctionForm({
  initialData,
  onSave,
  onCancel,
  saving = false,
}: FunctionFormProps) {
  const [formData, setFormData] = useState<FunctionFormData>(
    initialData || {
      name: '',
      description: '',
      code: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Function Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={saving}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          disabled={saving}
        />
      </div>
      <div>
        <Label htmlFor="code">Function Code</Label>
        <Textarea
          id="code"
          value={formData.code || ''}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          rows={8}
          className="font-mono text-sm"
          disabled={saving}
          placeholder="// Function implementation"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !formData.name}>
          {saving ? 'Saving...' : 'Save Function'}
        </Button>
      </div>
    </form>
  );
}

