// Button for creating a new shader
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Button } from '../ui/button';

interface NewShaderButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'className'> {
  onClick: () => void;
}

export const NewShaderButton = forwardRef<HTMLButtonElement, NewShaderButtonProps>(
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
        New
      </Button>
    );
  }
);

NewShaderButton.displayName = 'NewShaderButton';
