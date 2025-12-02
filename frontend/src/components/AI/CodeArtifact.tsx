'use client';

import { Code2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { CodeArtifact as CodeArtifactType } from '../../types/chat';

interface CodeArtifactProps {
  artifact: CodeArtifactType;
  onApply: (code: string) => void;
  className?: string;
}

/**
 * Thumbnail-style clickable shader preview.
 * Displays a 4:3 thumbnail of the rendered shader.
 * Click to apply the code to the editor.
 */
export function CodeArtifact({ artifact, onApply, className }: CodeArtifactProps) {
  return (
    <div
      className={cn(
        'group relative cursor-pointer rounded-lg border border-border/50 bg-muted/30 overflow-hidden transition-all hover:border-border hover:shadow-sm active:scale-[0.98]',
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
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
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
