import type { FormEvent, RefObject } from 'react';
import { FormField } from './FormField';
import { UI_STRINGS } from '../constants/appConstants';
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
      <FormField id="make" label={UI_STRINGS.FORM_LABELS.MAKE}>
        <select id="make" name="make" value={make} onChange={(event) => onChange('make', event.target.value)} required className="formControl">
          <option value="">{UI_STRINGS.FORM_PLACEHOLDERS.SELECT_MAKE}</option>
          {makes.map((makeOption) => (
            <option key={makeOption} value={makeOption}>
              {makeOption}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="model" label={UI_STRINGS.FORM_LABELS.MODEL}>
        <select
          id="model"
          name="model"
          value={model}
          onChange={(event) => onChange('model', event.target.value)}
          disabled={!make}
          required
          className="formControl"
        >
          <option value="">{UI_STRINGS.FORM_PLACEHOLDERS.SELECT_MODEL}</option>
          {models.map((modelOption) => (
            <option key={modelOption} value={modelOption}>
              {modelOption}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="badge" label={UI_STRINGS.FORM_LABELS.BADGE}>
        <select
          id="badge"
          name="badge"
          value={badge}
          onChange={(event) => onChange('badge', event.target.value)}
          disabled={!model}
          required
          className="formControl"
        >
          <option value="">{UI_STRINGS.FORM_PLACEHOLDERS.SELECT_BADGE}</option>
          {badges.map((badgeOption) => (
            <option key={badgeOption} value={badgeOption}>
              {badgeOption}
            </option>
          ))}
        </select>
      </FormField>

      {badge ? (
        <FormField id="logbook" label={UI_STRINGS.FORM_LABELS.LOGBOOK}>
          <input
            id="logbook"
            type="file"
            name="logbook"
            accept={UI_STRINGS.FILE_TYPES.ACCEPT}
            ref={fileInputRef}
            className="fileInput"
          />
        </FormField>
      ) : null}

      <div className="formActions">
        <button type="submit" disabled={!canSubmit} className="submitButton">
          {isSubmitting ? UI_STRINGS.BUTTONS.SUBMITTING : UI_STRINGS.BUTTONS.SUBMIT}
        </button>
      </div>
    </form>
  );
}
