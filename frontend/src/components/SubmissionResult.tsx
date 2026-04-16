import type { RefObject } from 'react';
import type { SubmissionResult as SubmissionResultType } from '../types/vehicle';
import { StatusMessage } from './StatusMessage';

interface SubmissionResultProps {
  result: SubmissionResultType;
  onReset: () => void;
  statusRef: RefObject<HTMLDivElement | null>;
}

export function SubmissionResult({ result, onReset, statusRef }: SubmissionResultProps) {
  return (
    <StatusMessage ref={statusRef} type="success">
      <h2>Submission Successful</h2>
      <p>
        <strong>Make:</strong> {result.make}
      </p>
      <p>
        <strong>Model:</strong> {result.model}
      </p>
      <p>
        <strong>Badge:</strong> {result.badge}
      </p>
      <div className="resultContent">
        <strong>Logbook Contents:</strong>
        <pre>{result.logbookContent}</pre>
      </div>
      <button type="button" onClick={onReset} className="secondaryButton">
        Submit Another Vehicle
      </button>
    </StatusMessage>
  );
}
