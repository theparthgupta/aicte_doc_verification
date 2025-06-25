import React from 'react';
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Edit2, Save } from 'lucide-react';

interface PdfControlsProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
}

const PdfControls: React.FC<PdfControlsProps> = ({
  isEditing,
  onToggleEdit,
  onSave,
}) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Toggle
        pressed={isEditing}
        onPressedChange={onToggleEdit}
        aria-label="Toggle edit mode"
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Edit Mode
      </Toggle>
      {isEditing && (
        <Button onClick={onSave} variant="outline" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      )}
    </div>
  );
};

export {PdfControls}