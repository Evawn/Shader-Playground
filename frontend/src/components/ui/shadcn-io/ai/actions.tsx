'use client';

import { Button } from '../../../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/shadcn-ui/components/ui/tooltip';
import { cn } from '@repo/shadcn-ui/lib/utils';
import type { ComponentProps } from 'react';

export type ActionsProps = ComponentProps<'div'>;

export const Actions = ({ className, children, ...props }: ActionsProps) => (
  <div className={cn('flex items-center gap-1', className)} {...(props as any)}>
    {children}
  </div>
);

export type ActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  label?: string;
};

export const Action = ({
  tooltip,
  tooltipSide = 'bottom',
  children,
  label,
  className,
  variant = 'ghost',
  size = 'icon',
  ...props
}: ActionProps) => {
  const button = (
    <Button
      className={cn(
        'size-6 p-1.5 text-muted-foreground hover:text-foreground hover:bg-background-highlighted',
        className
      )}
      size={size}
      type="button"
      variant={variant}
      {...(props as any)}
    >
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};
