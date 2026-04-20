import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the window fetch and browser scroll behavior
window.fetch = vi.fn();
window.scrollTo = vi.fn();

const vehicleDataResponse = {
  Ford: {
    Ranger: ['Raptor', 'Raptor X', 'Wildtrak'],
    Falcon: ['XR6', 'XR6 LPI', 'XR8', 'SR'],
    Fiesta: ['ST', 'Zetec'],
  },
  BMW: {
    '130d': ['xDrive 26d', 'xDrive 30d'],
    '240i': ['xDrive 30d', 'xDrive 50d'],
    '320e': ['xDrive 75d', 'xDrive 80d', 'xDrive 85d'],
  },
  Tesla: {
    'Model 3': ['Standard', 'Performance', 'Long Range'],
    'Model S': ['Long Range', 'Plaid'],
    'Model X': ['Long Range', 'Plaid'],
  },
};

const mockVehicleDataFetch = () => {
  (window.fetch as Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => vehicleDataResponse,
  });
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial form elements correctly', async () => {
    mockVehicleDataFetch();
    render(<App />);
    await screen.findByLabelText('Make:');

    expect(screen.getByText('Select Your Vehicle')).toBeInTheDocument();
    expect(screen.getByLabelText('Make:')).toBeInTheDocument();
    expect(screen.getByLabelText('Model:')).toBeInTheDocument();
    expect(screen.getByLabelText('Badge:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('populates make dropdown with vehicle makes', async () => {
    mockVehicleDataFetch();
    render(<App />);
    const makeSelect = await screen.findByLabelText('Make:') as HTMLSelectElement;
    const options = Array.from(makeSelect.options).map((opt) => opt.value);
    
    expect(options).toContain('Ford');
    expect(options).toContain('BMW');
    expect(options).toContain('Tesla');
  });

  it('enables model dropdown when make is selected', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    render(<App />);
    
    const makeSelect = await screen.findByLabelText('Make:');
    const modelSelect = screen.getByLabelText('Model:') as HTMLSelectElement;
    
    expect(modelSelect.disabled).toBe(true);
    
    await user.selectOptions(makeSelect, 'Ford');
    expect(modelSelect.disabled).toBe(false);
  });

  it('populates model dropdown based on selected make', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    render(<App />);
    
    const makeSelect = await screen.findByLabelText('Make:');
    await user.selectOptions(makeSelect, 'Ford');
    
    const modelSelect = screen.getByLabelText('Model:') as HTMLSelectElement;
    const options = Array.from(modelSelect.options).map((opt) => opt.value);
    
    expect(options).toContain('Ranger');
    expect(options).toContain('Falcon');
    expect(options).toContain('Fiesta');
  });

  it('enables badge dropdown when model is selected', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    render(<App />);
    
    const makeSelect = await screen.findByLabelText('Make:');
    const modelSelect = screen.getByLabelText('Model:');
    const badgeSelect = screen.getByLabelText('Badge:') as HTMLSelectElement;
    
    expect(badgeSelect.disabled).toBe(true);
    
    await user.selectOptions(makeSelect, 'Ford');
    await user.selectOptions(modelSelect, 'Ranger');
    
    expect(badgeSelect.disabled).toBe(false);
  });

  it('populates badge dropdown based on selected model', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    render(<App />);
    
    const makeSelect = await screen.findByLabelText('Make:');
    const modelSelect = screen.getByLabelText('Model:');
    await user.selectOptions(makeSelect, 'Tesla');
    await user.selectOptions(modelSelect, 'Model 3');
    
    const badgeSelect = screen.getByLabelText('Badge:') as HTMLSelectElement;
    const options = Array.from(badgeSelect.options).map((opt) => opt.value);
    
    expect(options).toContain('Standard');
    expect(options).toContain('Performance');
    expect(options).toContain('Long Range');
  });

  it('shows logbook file input when badge is selected', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    render(<App />);
    
    const makeSelect = await screen.findByLabelText('Make:');
    const modelSelect = screen.getByLabelText('Model:');
    const badgeSelect = screen.getByLabelText('Badge:');
    
    // Initially, logbook input should not be visible
    let logbookInput = screen.queryByLabelText(/upload logbook/i);
    expect(logbookInput).not.toBeInTheDocument();
    
    // Select a complete vehicle
    await user.selectOptions(makeSelect, 'BMW');
    await user.selectOptions(modelSelect, '130d');
    await user.selectOptions(badgeSelect, 'xDrive 26d');
    
    // Now logbook input should be visible
    logbookInput = screen.getByLabelText(/upload logbook/i);
    expect(logbookInput).toBeInTheDocument();
  });

  it('disables submit button until a badge is selected', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    render(<App />);
    
    const submitBtn = await screen.findByRole('button', { name: /submit/i }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
    
    const makeSelect = screen.getByLabelText('Make:');
    const modelSelect = screen.getByLabelText('Model:');
    const badgeSelect = screen.getByLabelText('Badge:');
    
    await user.selectOptions(makeSelect, 'Ford');
    await user.selectOptions(modelSelect, 'Ranger');
    await user.selectOptions(badgeSelect, 'Raptor');
    
    expect(submitBtn.disabled).toBe(false);
  });

  it('submits form with selected vehicle and no file', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    (window.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        make: 'Ford',
        model: 'Ranger',
        badge: 'Raptor',
        logbookContent: 'No file uploaded.',
      }),
    });

    render(<App />);
    
    const makeSelect = await screen.findByLabelText('Make:');
    const modelSelect = screen.getByLabelText('Model:');
    const badgeSelect = screen.getByLabelText('Badge:');
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    
    await user.selectOptions(makeSelect, 'Ford');
    await user.selectOptions(modelSelect, 'Ranger');
    await user.selectOptions(badgeSelect, 'Raptor');
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith('http://localhost:3000/upload', expect.objectContaining({
        method: 'POST',
      }));
    });
  });

  it('submits form with selected vehicle and file', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    (window.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        make: 'Tesla',
        model: 'Model 3',
        badge: 'Performance',
        logbookContent: 'Service at 50,000 miles.',
      }),
    });

    render(<App />);
    
    const makeSelect = await screen.findByLabelText('Make:');
    const modelSelect = screen.getByLabelText('Model:');
    const badgeSelect = screen.getByLabelText('Badge:');
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    
    await user.selectOptions(makeSelect, 'Tesla');
    await user.selectOptions(modelSelect, 'Model 3');
    await user.selectOptions(badgeSelect, 'Performance');
    
    const logbookInput = screen.getByLabelText(/upload logbook/i) as HTMLInputElement;
    const file = new File(['Service at 50,000 miles.'], 'logbook.txt', { type: 'text/plain' });
    await user.upload(logbookInput, file);
    
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith('http://localhost:3000/upload', expect.objectContaining({
        method: 'POST',
      }));
    });
  });

  it('displays success message after successful submission', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    (window.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        make: 'Ford',
        model: 'Mustang',
        badge: 'GT',
        logbookContent: 'Full service completed.',
      }),
    });

    render(<App />);
    
    const makeSelect = await screen.findByLabelText('Make:');
    const modelSelect = screen.getByLabelText('Model:');
    const badgeSelect = screen.getByLabelText('Badge:');
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    
    await user.selectOptions(makeSelect, 'Ford');
    await user.selectOptions(modelSelect, 'Ranger');
    await user.selectOptions(badgeSelect, 'Raptor');
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/submission successful/i)).toBeInTheDocument();
    });
  });

  it('displays error message on submission failure', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    (window.fetch as Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<App />);
    
    const makeSelect = await screen.findByLabelText('Make:');
    const modelSelect = screen.getByLabelText('Model:');
    const badgeSelect = screen.getByLabelText('Badge:');
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    
    await user.selectOptions(makeSelect, 'Ford');
    await user.selectOptions(modelSelect, 'Ranger');
    await user.selectOptions(badgeSelect, 'Raptor');
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('quick select buttons populate all fields correctly', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    render(<App />);
    
    const quickSelectBtn = await screen.findByRole('button', { name: /tesla model 3 performance/i });
    await user.click(quickSelectBtn);
    
    const makeSelect = screen.getByLabelText('Make:') as HTMLSelectElement;
    const modelSelect = screen.getByLabelText('Model:') as HTMLSelectElement;
    const badgeSelect = screen.getByLabelText('Badge:') as HTMLSelectElement;
    
    expect(makeSelect.value).toBe('Tesla');
    expect(modelSelect.value).toBe('Model 3');
    expect(badgeSelect.value).toBe('Performance');
  });

  it('allows submitting another vehicle after successful submission', async () => {
    const user = userEvent.setup();
    mockVehicleDataFetch();
    (window.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        make: 'Ford',
        model: 'Ranger',
        badge: 'Raptor',
        logbookContent: 'No file uploaded.',
      }),
    });

    render(<App />);
    
    const makeSelect = await screen.findByLabelText('Make:');
    const modelSelect = screen.getByLabelText('Model:');
    const badgeSelect = screen.getByLabelText('Badge:');
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    
    // First submission
    await user.selectOptions(makeSelect, 'Ford');
    await user.selectOptions(modelSelect, 'Ranger');
    await user.selectOptions(badgeSelect, 'Raptor');
    await user.click(submitBtn);
    
    // Wait for success message - it's in an h2
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /submission successful/i })).toBeInTheDocument();
    });
    
    // Click "Submit Another Vehicle"
    const submitAnotherBtn = screen.getByRole('button', { name: /submit another vehicle/i });
    await user.click(submitAnotherBtn);
    
    // Form should be reset
    expect((screen.getByLabelText('Make:') as HTMLSelectElement).value).toBe('');
    expect((screen.getByLabelText('Model:') as HTMLSelectElement).value).toBe('');
    expect((screen.getByLabelText('Badge:') as HTMLSelectElement).value).toBe('');
  });
});
