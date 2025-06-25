import React, { useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';

interface HighlightProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  comment: string;
  onTextChange: (newText: string) => void;
}

export const PdfHighlight: React.FC<HighlightProps> = ({
  x,
  y,
  width,
  height,
  text,
  comment,
  onTextChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onTextChange(editedText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(text);
    setIsEditing(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="absolute cursor-pointer"
          style={{
            left: `${x}px`,
            top: `${y + height + 4}px`,
            width: `${width}px`,
            height: '2px',
            background: 'linear-gradient(to right, #ef4444 50%, transparent 50%)',
            backgroundSize: '8px 2px',
            opacity: 0.8,
            transition: 'opacity 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onDoubleClick={() => setIsEditing(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  ref={inputRef}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium leading-none">{text}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{comment}</p>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};