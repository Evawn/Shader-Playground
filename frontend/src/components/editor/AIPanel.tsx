/**
 * Collapsible AI panel component for the shader editor.
 * Desktop: Slides in/out from the right side with width animation.
 * Mobile: Expands/collapses vertically with height animation.
 */

interface AIPanelProps {
  isOpen: boolean;
  isMobile?: boolean;
}

export function AIPanel({ isOpen, isMobile = false }: AIPanelProps) {
  if (isMobile) {
    return (
      <div
        className={`w-full border-none border-accent-shadow bg-background overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0 ${
          isOpen ? 'h-[70vh]' : 'h-0 border-none'
        }`}
      >
        <div className="h-[70vh] w-full">
          {/* Panel content goes here */}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full border-l-2 border-accent-shadow bg-background overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'w-[25vw]' : 'w-0 border-none'
      }`}
    >
      <div className="h-full w-[25vw]">
        {/* Panel content goes here */}
      </div>
    </div>
  );
}
