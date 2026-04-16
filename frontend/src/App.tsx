import React, { useEffect, useState, useRef } from 'react';
import { fetchVehicleData, type VehicleData, uploadVehicle, type SubmissionResult } from './services/vehicleService';

import './App.css';
import { FormField } from './components/FormField';
import { StatusMessage } from './components/StatusMessage';

function App() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [badge, setBadge] = useState('');
  const [vehicleData, setVehicleData] = useState<VehicleData>({});
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const resetSelection = () => {
    setMake('');
    setModel('');
    setBadge('');
    setResult(null);
    setError(null);
  };

  useEffect(() => {
    if (result) {
      // Page switched to success view — scroll to very top so the user sees it
      window.scrollTo?.({ top: 0, behavior: 'smooth' });
    } else if (error) {
      // Same-page error — scroll down to the inline error message
      if (resultRef.current && typeof resultRef.current.scrollIntoView === 'function') {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    if (resultRef.current) {
      resultRef.current.focus();
    }
  }, [result, error]);

  useEffect(() => {
    const loadVehicleData = async () => {
      setIsLoadingVehicles(true);
      try {
        const data = await fetchVehicleData();
        setVehicleData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load vehicle data.');
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    loadVehicleData();
  }, []);

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMake(e.target.value);
    setModel('');
    setBadge('');
    setResult(null);
    setError(null);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value);
    setBadge('');
    setResult(null);
    setError(null);
  };

  const handleBadgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBadge(e.target.value);
    setResult(null);
    setError(null);
  };

  const quickSelect = (qMake: string, qModel: string, qBadge: string) => {
    setMake(qMake);
    setModel(qModel);
    setBadge(qBadge);
    setResult(null);
    setError(null);
  };

  const validateForm = () => {
    if (!make) return 'Please select a make.';
    if (!model) return 'Please select a model.';
    if (!badge) return 'Please select a badge.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setResult(null);
    setError(null);

    const logbookFile = fileInputRef.current?.files?.[0] ?? undefined;

    try {
      const data = await uploadVehicle({
        make,
        model,
        badge,
        logbook: logbookFile,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const makes = Object.keys(vehicleData);
  const models = make ? Object.keys(vehicleData[make] || {}) : [];
  const badges = make && model ? vehicleData[make][model] || [] : [];

  if (isLoadingVehicles) {
    return (
      <main className="appContainer">
        <h1>Select Your Vehicle</h1>
        <p>Loading vehicle data…</p>
        {error && (
          <StatusMessage ref={resultRef} type="error">
            <strong>Error:</strong> {error}
          </StatusMessage>
        )}
      </main>
    );
  }

  if (!isLoadingVehicles && makes.length === 0) {
    return (
      <main className="appContainer">
        <h1>Select Your Vehicle</h1>
        <StatusMessage ref={resultRef} type="error">
          <strong>Error:</strong> {error ?? 'Unable to load vehicle data. Please refresh to try again.'}
        </StatusMessage>
      </main>
    );
  }

  return (
    <main className="appContainer">
      <h1>Select Your Vehicle</h1>

      {!result ? (
        <>
          <section aria-labelledby="quick-select-heading" className="quickSelectSection">
            <h3 id="quick-select-heading">Quick Select</h3>
            <button type="button" className="quickSelectButton" onClick={() => quickSelect('Tesla', 'Model 3', 'Performance')}>
              Tesla Model 3 Performance
            </button>
            <button type="button" className="quickSelectButton" onClick={() => quickSelect('Ford', 'Ranger', 'Raptor')}>
              Ford Ranger Raptor
            </button>
          </section>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <FormField id="make" label="Make:">
              <select id="make" name="make" value={make} onChange={handleMakeChange} required className="formControl">
                <option value="">-- Select Make --</option>
                {Object.keys(vehicleData).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </FormField>

            <FormField id="model" label="Model:">
              <select id="model" name="model" value={model} onChange={handleModelChange} disabled={!make} required className="formControl">
                <option value="">-- Select Model --</option>
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </FormField>

            <FormField id="badge" label="Badge:">
              <select id="badge" name="badge" value={badge} onChange={handleBadgeChange} disabled={!model} required className="formControl">
                <option value="">-- Select Badge --</option>
                {badges.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </FormField>

            {badge && (
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
            )}

            <button type="submit" disabled={!badge || isSubmitting} className="submitButton">
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
          </form>

          {error && (
            <StatusMessage ref={resultRef} type="error">
              <strong>Error:</strong> {error}
            </StatusMessage>
          )}
        </>
      ) : (
        <StatusMessage ref={resultRef} type="success">
          <h2>Submission Successful</h2>
          <p><strong>Make:</strong> {result.make}</p>
          <p><strong>Model:</strong> {result.model}</p>
          <p><strong>Badge:</strong> {result.badge}</p>
          <div className="resultContent">
            <strong>Logbook Contents:</strong>
            <pre>
              {result.logbookContent}
            </pre>
          </div>
          <button
            onClick={resetSelection}
            className="secondaryButton"
          >
            Submit Another Vehicle
          </button>
        </StatusMessage>
      )}
    </main>
  );
}

export default App;
