import type { RefObject } from 'react';
import { UI_STRINGS } from '../constants/appConstants';
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
      <h2>{UI_STRINGS.SUCCESS.SUBMISSION_TITLE}</h2>
      <p>
        <strong>{UI_STRINGS.SUCCESS.MAKE}</strong> {result.make}
      </p>
      <p>
        <strong>{UI_STRINGS.SUCCESS.MODEL}</strong> {result.model}
      </p>
      <p>
        <strong>{UI_STRINGS.SUCCESS.BADGE}</strong> {result.badge}
      </p>
      <div className="resultContent">
        <strong>{UI_STRINGS.SUCCESS.LOGBOOK_CONTENTS}</strong>
        <pre>{result.logbookContent}</pre>
      </div>
      <button type="button" onClick={onReset} className="secondaryButton">
        {UI_STRINGS.BUTTONS.SUBMIT_ANOTHER}
      </button>
    </StatusMessage>
  );
}
