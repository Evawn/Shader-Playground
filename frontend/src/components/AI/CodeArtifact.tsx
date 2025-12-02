'use client';

import { useState } from 'react';
import { Code2, Expand } from 'lucide-react';
import { Button } from '../ui/button';
import { CodeBlock, CodeBlockCopyButton } from '../ui/shadcn-io/ai/code-block';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { cn } from '../../utils/cn';
import type { CodeArtifact as CodeArtifactType } from '../../types/chat';

interface CodeArtifactProps {
  artifact: CodeArtifactType;
  onApply: (code: string) => void;
  className?: string;
}

/**
 * Thumbnail-style clickable code preview
 * Shows a compact preview of code with hover actions
 * Future: will show rendered frame thumbnail
 */
export function CodeArtifact({ artifact, onApply, className }: CodeArtifactProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get first few lines for preview
  const previewLines = artifact.code.split('\n').slice(0, 4).join('\n');
  const hasMoreLines = artifact.code.split('\n').length > 4;

  return (
    <>
      <div
        className={cn(
          'group relative cursor-pointer rounded-lg border border-border/50 bg-muted/30 p-2 transition-colors hover:bg-muted/50',
          className
        )}
        onClick={() => setIsDialogOpen(true)}
      >
        {/* Label */}
        <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Code2 className="h-3 w-3" />
          <span>{artifact.label}</span>
        </div>

        {/* Thumbnail preview - first few lines of code, truncated */}
        <pre className="line-clamp-4 overflow-hidden text-[10px] leading-tight text-muted-foreground/80 font-mono">
          {previewLines}
          {hasMoreLines && '...'}
        </pre>

        {/* Hover overlay with actions */}
        <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 rounded-b-lg bg-gradient-to-t from-background/90 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            className="h-6 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onApply(artifact.code);
            }}
          >
            Apply
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setIsDialogOpen(true);
            }}
          >
            <Expand className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Full code dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              {artifact.label}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <CodeBlock code={artifact.code} language="glsl" showLineNumbers>
              <CodeBlockCopyButton />
            </CodeBlock>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onApply(artifact.code);
                setIsDialogOpen(false);
              }}
            >
              Apply to Editor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
