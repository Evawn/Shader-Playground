/**
 * Shader title dropdown with context-sensitive actions
 * Shows different options based on shader state (new/saved) and ownership
 * Supports inline rename editing
 */
import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Dropdown } from '../ui/Dropdown';
import type { DropdownOption } from '../ui/Dropdown';
import { Save, GitBranchPlus, Trash2, PencilLine } from 'lucide-react';

interface TitleDropdownProps {
  title: string;
  creatorUsername?: string;
  isSavedShader: boolean;
  isOwner: boolean;
  hasUnsavedChanges?: boolean;
  onSaveAs: () => void;
  onRename: (newName: string) => void;
  onClone: () => void;
  onDelete: () => void;
}

export function TitleDropdown({
  title,
  creatorUsername,
  isSavedShader,
  isOwner,
  hasUnsavedChanges = false,
  onSaveAs,
  onRename,
  onClone,
  onDelete,
}: TitleDropdownProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update edit value when title changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditValue(title);
    }
  }, [title, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Handle starting inline rename
  const handleStartRename = () => {
    setEditValue(title);
    setIsEditing(true);
  };

  // Handle finishing rename
  const handleFinishRename = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== title) {
      onRename(trimmedValue);
    }
    setIsEditing(false);
  };

  // Handle key events for rename input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFinishRename();
    } else if (e.key === 'Escape') {
      setEditValue(title);
      setIsEditing(false);
    }
  };

  // Compute display title with creator name if available
  const displayTitle = creatorUsername ? `${title} - by ${creatorUsername}` : title;

  // Dynamic dropdown options based on shader state and ownership
  const dropdownOptions: DropdownOption[] = useMemo(() => {
    // New shader - show "Save as..."
    if (!isSavedShader) {
      return [
        {
          text: 'Save as...',
          callback: onSaveAs,
          icon: Save
        }
      ];
    }

    // Saved shader owned by user - show rename, clone, delete
    if (isOwner) {
      return [
        {
          text: 'Rename',
          callback: handleStartRename,
          icon: PencilLine
        },
        {
          text: 'Clone',
          callback: onClone,
          icon: GitBranchPlus
        },
        {
          text: 'Delete',
          callback: onDelete,
          icon: Trash2
        }
      ];
    }

    // Saved shader NOT owned by user - show clone only
    return [
      {
        text: 'Clone',
        callback: onClone,
        icon: GitBranchPlus
      }
    ];
  }, [isSavedShader, isOwner, onSaveAs, onClone, onDelete]);

  // Inline editing mode
  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5 bg-background-editor rounded-xl px-3 py-1">
        {hasUnsavedChanges && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
            title="Unsaved changes"
          />
        )}
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleFinishRename}
          className="bg-transparent text-sm font-light text-foreground outline-none border-none min-w-[100px] max-w-[200px]"
          style={{ width: `${Math.max(100, editValue.length * 7)}px` }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-background-editor rounded-xl px-3 py-1">
      {hasUnsavedChanges && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
          title="Unsaved changes"
        />
      )}
      <Dropdown options={dropdownOptions}>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto justify-start max-w-full px-0 py-0 text-foreground bg-transparent hover:text-accent hover:bg-transparent focus:outline-none"
          style={{ outline: 'none', border: 'none' }}
        >
          <span className="text-sm font-light truncate">{displayTitle}</span>
        </Button>
      </Dropdown>
    </div>
  );
}
