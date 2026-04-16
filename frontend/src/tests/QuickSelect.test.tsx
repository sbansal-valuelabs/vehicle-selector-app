import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { QuickSelect } from '../components/QuickSelect';

const options = [
  { label: 'Tesla Model 3 Performance', make: 'Tesla', model: 'Model 3', badge: 'Performance' },
  { label: 'Ford Ranger Raptor', make: 'Ford', model: 'Ranger', badge: 'Raptor' },
];

describe('QuickSelect', () => {
  it('renders a button for each option', () => {
    render(<QuickSelect options={options} onSelect={vi.fn()} />);

    expect(screen.getByRole('button', { name: /Tesla Model 3 Performance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ford Ranger Raptor/i })).toBeInTheDocument();
  });

  it('calls onSelect with the selected option', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<QuickSelect options={options} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: /Ford Ranger Raptor/i }));

    expect(onSelect).toHaveBeenCalledWith(options[1]);
  });
});
