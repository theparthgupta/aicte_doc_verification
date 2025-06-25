import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface EditableOverlayProps {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onTextChange: (newText: string) => void;
  onSave: () => void;
}

export const EditableOverlay: React.FC<EditableOverlayProps> = ({
  text,
  x,
  y,
  width,
  height,
  onTextChange,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = `${height}px`;
    }
  }, [isEditing, height]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onTextChange(editedText);
    onSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  return (
    <div
      className="absolute group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        minHeight: `${height}px`,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <Textarea
          ref={textareaRef}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-0 resize-none border border-blue-400 bg-white/90 backdrop-blur-sm"
          style={{
            fontSize: 'inherit',
            lineHeight: 'inherit',
            fontFamily: 'inherit',
          }}
        />
      ) : (
        <div 
          className="w-full h-full cursor-text group-hover:bg-blue-50/20 transition-colors duration-200"
          style={{ minHeight: `${height}px` }}
        >
          {editedText}
        </div>
      )}
    </div>
  );
};