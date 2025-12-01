// Button for creating a new shader
import { Button } from '../ui/button';

interface NewShaderButtonProps {
  onClick: () => void;
}

export function NewShaderButton({ onClick }: NewShaderButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 py-1 text-sm font-light text-foreground bg-transparent hover:text-foreground-highlighted hover:bg-background-highlighted focus:outline-none rounded-md"
      onClick={onClick}
    >
      New
    </Button>
  );
}
