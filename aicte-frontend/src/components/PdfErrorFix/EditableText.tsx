import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";

interface EditableTextProps {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isEditing: boolean;
  onTextChange: (newText: string) => void;
}

export const EditableText: React.FC<EditableTextProps> = ({
  text,
  x,
  y,
  width,
  height,
  isEditing,
  onTextChange,
}) => {
  const [editedText, setEditedText] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (!isEditing) {
    return null;
  }

  return (
    <div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <Input
        ref={inputRef}
        value={editedText}
        onChange={(e) => {
          setEditedText(e.target.value);
          onTextChange(e.target.value);
        }}
        className="h-full p-0 border-none bg-transparent hover:bg-blue-50 focus:bg-blue-50"
      />
    </div>
  );
};