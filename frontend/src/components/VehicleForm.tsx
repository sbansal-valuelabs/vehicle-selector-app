import type { FormEvent, RefObject } from 'react';
import { FormField } from './FormField';
import type { Selection } from '../hooks/useVehicleSelection';

interface VehicleFormProps {
  selection: Selection;
  makes: string[];
  models: string[];
  badges: string[];
  isSubmitting: boolean;
  canSubmit: boolean;
  onChange: (field: keyof Selection, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function VehicleForm({
  selection,
  makes,
  models,
  badges,
  isSubmitting,
  canSubmit,
  onChange,
  onSubmit,
  fileInputRef,
}: VehicleFormProps) {
  const { make, model, badge } = selection;

  return (
    <form onSubmit={onSubmit} className="vehicleForm" noValidate>
      <FormField id="make" label="Make:">
        <select id="make" name="make" value={make} onChange={(event) => onChange('make', event.target.value)} required className="formControl">
          <option value="">-- Select Make --</option>
          {makes.map((makeOption) => (
            <option key={makeOption} value={makeOption}>
              {makeOption}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="model" label="Model:">
        <select
          id="model"
          name="model"
          value={model}
          onChange={(event) => onChange('model', event.target.value)}
          disabled={!make}
          required
          className="formControl"
        >
          <option value="">-- Select Model --</option>
          {models.map((modelOption) => (
            <option key={modelOption} value={modelOption}>
              {modelOption}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="badge" label="Badge:">
        <select
          id="badge"
          name="badge"
          value={badge}
          onChange={(event) => onChange('badge', event.target.value)}
          disabled={!model}
          required
          className="formControl"
        >
          <option value="">-- Select Badge --</option>
          {badges.map((badgeOption) => (
            <option key={badgeOption} value={badgeOption}>
              {badgeOption}
            </option>
          ))}
        </select>
      </FormField>

      {badge ? (
        <FormField id="logbook" label="Upload Logbook (Plain Text .txt):">
          <input
            id="logbook"
            type="file"
            name="logbook"
            accept=".txt, text/plain"
            ref={fileInputRef}
            className="fileInput"
          />
        </FormField>
      ) : null}

      <div className="formActions">
        <button type="submit" disabled={!canSubmit} className="submitButton">
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
