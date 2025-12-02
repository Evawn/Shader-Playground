// Button for navigating to the shader gallery
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Button } from '../ui/button';

interface BrowseButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'className'> {
  onClick: () => void;
}

export const BrowseButton = forwardRef<HTMLButtonElement, BrowseButtonProps>(
  ({ onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        className="h-7 px-2 py-1 text-sm font-light text-foreground bg-transparent hover:text-foreground-highlighted hover:bg-background-highlighted focus:outline-none rounded-md"
        onClick={onClick}
        {...props}
      >
        Browse
      </Button>
    );
  }
);

BrowseButton.displayName = 'BrowseButton';
