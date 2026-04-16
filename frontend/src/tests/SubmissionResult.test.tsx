import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SubmissionResult } from '../components/SubmissionResult';

const result = {
  make: 'Ford',
  model: 'Ranger',
  badge: 'Raptor',
  logbookContent: 'Service record text.',
};

describe('SubmissionResult', () => {
  it('renders the success summary and reset button', () => {
    render(<SubmissionResult result={result} onReset={vi.fn()} statusRef={{ current: null }} />);

    expect(screen.getByText(/submission successful/i)).toBeInTheDocument();
    expect(screen.getByText(/Ford/)).toBeInTheDocument();
    expect(screen.getByText(/Service record text./)).toBeInTheDocument();
  });

  it('calls onReset when the button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(<SubmissionResult result={result} onReset={onReset} statusRef={{ current: null }} />);

    await user.click(screen.getByRole('button', { name: /submit another vehicle/i }));

    expect(onReset).toHaveBeenCalled();
  });
});
