import { UI_STRINGS } from '../constants/appConstants';

export interface QuickSelectOption {
  label: string;
  make: string;
  model: string;
  badge: string;
}

interface QuickSelectProps {
  options: QuickSelectOption[];
  onSelect: (option: QuickSelectOption) => void;
}

export function QuickSelect({ options, onSelect }: QuickSelectProps) {
  return (
    <section aria-labelledby="quick-select-heading" className="quickSelectSection">
      <h2 id="quick-select-heading">{UI_STRINGS.QUICK_SELECT_HEADING}</h2>
      <div className="quickSelectButtons">
        {options.map((option) => (
          <button
            type="button"
            key={option.label}
            className="quickSelectButton"
            onClick={() => onSelect(option)}
            aria-label={`Quick select ${option.label}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
