import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { useVehicleSelection } from '../hooks/useVehicleSelection';

function TestHarness() {
  const { selection, fileInputRef, resetSelection, updateSelection, quickSelect, validateSelection } = useVehicleSelection();
  const [validationMessage, setValidationMessage] = useState('');

  return (
    <div>
      <span data-testid="make">{selection.make}</span>
      <span data-testid="model">{selection.model}</span>
      <span data-testid="badge">{selection.badge}</span>
      <button onClick={() => updateSelection('make', 'Tesla')}>set make</button>
      <button onClick={() => updateSelection('model', 'Model 3')}>set model</button>
      <button onClick={() => updateSelection('badge', 'Performance')}>set badge</button>
      <button onClick={() => quickSelect({ make: 'Ford', model: 'Ranger', badge: 'Raptor' })}>quick select</button>
      <button onClick={resetSelection}>reset</button>
      <button onClick={() => setValidationMessage(validateSelection(selection) ?? 'ok')}>validate</button>
      <span data-testid="validate">{validationMessage}</span>
      <input ref={fileInputRef} type="file" aria-label="logbook" />
    </div>
  );
}

describe('useVehicleSelection', () => {
  it('updates each selection field', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    await user.click(screen.getByText('set make'));
    expect(screen.getByTestId('make')).toHaveTextContent('Tesla');

    await user.click(screen.getByText('set model'));
    expect(screen.getByTestId('model')).toHaveTextContent('Model 3');

    await user.click(screen.getByText('set badge'));
    expect(screen.getByTestId('badge')).toHaveTextContent('Performance');
  });

  it('quick selects all values', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    await user.click(screen.getByText('quick select'));
    expect(screen.getByTestId('make')).toHaveTextContent('Ford');
    expect(screen.getByTestId('model')).toHaveTextContent('Ranger');
    expect(screen.getByTestId('badge')).toHaveTextContent('Raptor');
  });

  it('resets the selection values', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    await user.click(screen.getByText('set make'));
    await user.click(screen.getByText('set model'));
    await user.click(screen.getByText('set badge'));
    await user.click(screen.getByText('reset'));

    expect(screen.getByTestId('make')).toHaveTextContent('');
    expect(screen.getByTestId('model')).toHaveTextContent('');
    expect(screen.getByTestId('badge')).toHaveTextContent('');
  });

  it('validates selection state', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    await user.click(screen.getByText('validate'));
    expect(screen.getByTestId('validate')).toHaveTextContent('Please select a make.');
  });
});
