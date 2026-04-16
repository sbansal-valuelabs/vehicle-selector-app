import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { VehicleForm } from '../components/VehicleForm';

const defaultProps = {
  selection: { make: '', model: '', badge: '' },
  makes: ['Ford', 'Tesla'],
  models: ['Ranger', 'Mustang'],
  badges: ['Raptor', 'Wildtrak'],
  isSubmitting: false,
  canSubmit: true,
  onChange: vi.fn(),
  onSubmit: vi.fn(),
  fileInputRef: { current: null },
};

describe('VehicleForm', () => {
  it('renders all select controls and submit button', () => {
    render(<VehicleForm {...defaultProps} />);

    expect(screen.getByLabelText('Make:')).toBeInTheDocument();
    expect(screen.getByLabelText('Model:')).toBeInTheDocument();
    expect(screen.getByLabelText('Badge:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('disables model and badge selects when selection is incomplete', () => {
    render(<VehicleForm {...defaultProps} />);

    expect(screen.getByLabelText('Model:')).toBeDisabled();
    expect(screen.getByLabelText('Badge:')).toBeDisabled();
  });

  it('shows the logbook upload when a badge is selected', () => {
    render(<VehicleForm {...defaultProps} selection={{ make: 'Ford', model: 'Ranger', badge: 'Raptor' }} />);

    expect(screen.getByLabelText(/upload logbook/i)).toBeInTheDocument();
  });

  it('calls onChange when selects are changed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<VehicleForm {...defaultProps} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText('Make:'), 'Tesla');

    expect(onChange).toHaveBeenCalledWith('make', 'Tesla');
  });

  it('calls onSubmit when the form is submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());

    render(<VehicleForm {...defaultProps} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalled();
  });
});
