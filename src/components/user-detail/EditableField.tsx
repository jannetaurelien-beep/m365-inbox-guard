import { useState } from 'react';
import { Check, X, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave?: (value: string) => void;
  className?: string;
  editable?: boolean;
}

export function EditableField({ label, value, onSave, className, editable = true }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className={cn("group relative", className)}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {isEditing ? (
        <div className="flex items-center gap-1.5">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            className="h-8 text-sm"
            autoFocus
          />
          <button onClick={handleSave} className="p-1 rounded hover:bg-primary/10 text-primary">
            <Check className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleCancel} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <p className={cn("text-sm font-medium", !value && "text-muted-foreground/50 italic")}>
            {value || '—'}
          </p>
          {editable && (
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
            >
              <Pencil className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
