'use client';

import { Code2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { CodeArtifact as CodeArtifactType } from '../../types/chat';

interface CodeArtifactProps {
  artifact: CodeArtifactType;
  onApply: (code: string) => void;
  isActive?: boolean;
  className?: string;
}

/**
 * Thumbnail-style clickable shader preview.
 * Displays a 4:3 thumbnail of the rendered shader.
 * Click to apply the code to the editor.
 */
export function CodeArtifact({ artifact, onApply, isActive, className }: CodeArtifactProps) {
  return (
    <div
      className={cn(
        'group relative cursor-pointer rounded-lg overflow-hidden',
        'transition-all duration-200 ease-out',
        'hover:scale-105 hover:shadow-lg',
        'active:scale-100',
        isActive
          ? 'ring-2 ring-accent ring-offset-2 ring-offset-background'
          : 'hover:ring-1 hover:ring-border/50',
        className
      )}
      onClick={() => onApply(artifact.code)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onApply(artifact.code);
        }
      }}
    >
      {/* 4:3 aspect ratio container */}
      <div className="aspect-[4/3] w-full">
        {artifact.thumbnail ? (
          <img
            src={artifact.thumbnail}
            alt={artifact.label}
            className="h-full w-full object-cover"
          />
        ) : (
          /* Fallback when no thumbnail */
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/50">
            <Code2 className="h-6 w-6 text-muted-foreground/60" />
            <span className="text-[10px] text-muted-foreground/60">{artifact.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
