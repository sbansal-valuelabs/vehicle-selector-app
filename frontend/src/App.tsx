import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { uploadVehicle } from './services/vehicleService';
import { useVehicleData } from './hooks/useVehicleData';
import { useVehicleSelection } from './hooks/useVehicleSelection';
import { QuickSelect, type QuickSelectOption } from './components/QuickSelect';
import { VehicleForm } from './components/VehicleForm';
import { SubmissionResult as SubmissionResultView } from './components/SubmissionResult';
import { StatusMessage } from './components/StatusMessage';
import type { SubmissionResult } from './types/vehicle';
import './App.css';

const QUICK_SELECT_OPTIONS: QuickSelectOption[] = [
  { label: 'Tesla Model 3 Performance', make: 'Tesla', model: 'Model 3', badge: 'Performance' },
  { label: 'Ford Ranger Raptor', make: 'Ford', model: 'Ranger', badge: 'Raptor' },
];

function App() {
  const {
    selection,
    fileInputRef,
    resetSelection,
    updateSelection,
    quickSelect,
    validateSelection,
  } = useVehicleSelection();
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { vehicleData, isLoading: isLoadingVehicles, error: loadError } = useVehicleData();
  const statusRef = useRef<HTMLDivElement>(null);

  const { make, model, badge } = selection;
  const makes = useMemo(() => Object.keys(vehicleData), [vehicleData]);
  const models = useMemo(() => (make ? Object.keys(vehicleData[make] ?? {}) : []), [make, vehicleData]);
  const badges = useMemo(() => (make && model ? vehicleData[make][model] ?? [] : []), [make, model, vehicleData]);

  useEffect(() => {
    if (!statusRef.current) {
      return;
    }

    statusRef.current.focus();

    if (result) {
      window.scrollTo?.({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formError || loadError) {
      if (typeof statusRef.current.scrollIntoView === 'function') {
        statusRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [result, formError, loadError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateSelection(selection);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    setResult(null);
    setFormError(null);

    const logbook = fileInputRef.current?.files?.[0];

    try {
      setResult(await uploadVehicle({ make, model, badge, logbook }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = Boolean(badge) && !isSubmitting;
  const noVehiclesLoaded = !isLoadingVehicles && makes.length === 0;

  if (isLoadingVehicles) {
    return (
      <main className="appContainer">
        <h1>Select Your Vehicle</h1>
        <p>Loading vehicle data…</p>
        {loadError ? (
          <StatusMessage ref={statusRef} type="error">
            <strong>Error:</strong> {loadError}
          </StatusMessage>
        ) : null}
      </main>
    );
  }

  if (noVehiclesLoaded) {
    return (
      <main className="appContainer">
        <h1>Select Your Vehicle</h1>
        <StatusMessage ref={statusRef} type="error">
          <strong>Error:</strong> {loadError ?? 'Unable to load vehicle data. Please refresh to try again.'}
        </StatusMessage>
      </main>
    );
  }

  return (
    <main className="appContainer">
      <h1>Select Your Vehicle</h1>

      {!result ? (
        <>
          <QuickSelect options={QUICK_SELECT_OPTIONS} onSelect={quickSelect} />
          <VehicleForm
            selection={selection}
            makes={makes}
            models={models}
            badges={badges}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
            onChange={updateSelection}
            onSubmit={handleSubmit}
            fileInputRef={fileInputRef}
          />
          {formError ? (
            <StatusMessage ref={statusRef} type="error">
              <strong>Error:</strong> {formError}
            </StatusMessage>
          ) : null}
        </>
      ) : (
        <SubmissionResultView result={result} onReset={() => {
          setResult(null);
          setFormError(null);
          resetSelection();
        }} statusRef={statusRef} />
      )}
    </main>
  );
}

export default App;
