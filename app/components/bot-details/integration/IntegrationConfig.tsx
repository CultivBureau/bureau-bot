'use client';

import { useState } from 'react';
import { Button } from '../../landing/ui/button';
import { Input } from '../../landing/ui/input';
import { Label } from '../../landing/ui/label';
import { X } from 'lucide-react';

interface IntegrationConfigData {
  [key: string]: string;
}

interface IntegrationConfigProps {
  integrationName: string;
  fields: Array<{ key: string; label: string; type?: string; required?: boolean }>;
  initialData?: IntegrationConfigData;
  onSave: (data: IntegrationConfigData) => void;
  onCancel: () => void;
  saving?: boolean;
}

export function IntegrationConfig({
  integrationName,
  fields,
  initialData,
  onSave,
  onCancel,
  saving = false,
}: IntegrationConfigProps) {
  const [formData, setFormData] = useState<IntegrationConfigData>(
    initialData || {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Configure {integrationName}
        </h3>
      </div>
      {fields.map((field) => (
        <div key={field.key}>
          <Label htmlFor={field.key}>
            {field.label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id={field.key}
            type={field.type || 'text'}
            value={formData[field.key] || ''}
            onChange={(e) =>
              setFormData({ ...formData, [field.key]: e.target.value })
            }
            required={field.required}
            disabled={saving}
          />
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </form>
  );
}

