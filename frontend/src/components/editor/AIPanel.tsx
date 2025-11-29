/**
 * Collapsible AI panel component for the shader editor.
 * Slides in/out from the right side with CSS animation.
 */

interface AIPanelProps {
  isOpen: boolean;
}

export function AIPanel({ isOpen }: AIPanelProps) {
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
