// Button for navigating to the shader gallery
import { Button } from '../ui/button';

interface BrowseButtonProps {
  onClick: () => void;
}

export function BrowseButton({ onClick }: BrowseButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 py-1 text-sm font-light text-foreground bg-transparent hover:text-foreground-highlighted hover:bg-background-highlighted focus:outline-none rounded-md"
      onClick={onClick}
    >
      Browse
    </Button>
  );
}
