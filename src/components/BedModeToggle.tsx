import { JSX } from 'preact';

interface BedModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function BedModeToggle({ enabled, onToggle }: BedModeToggleProps): JSX.Element {
  return (
    <button
      onClick={onToggle}
      className={`
        px-4 py-2 rounded-lg font-semibold transition-all
        ${enabled 
          ? 'bg-purple-600 text-white' 
          : 'bg-dark-accent text-gray-300 hover:bg-dark-accent/80'
        }
      `}
      aria-label="Toggle bed mode"
    >
      {enabled ? '💤 Bed Mode ON' : '💤 Bed Mode'}
    </button>
  );
}

