import { useCallback, useRef, useState, type RefObject } from 'react';

export interface Selection {
  make: string;
  model: string;
  badge: string;
}

const initialSelection: Selection = {
  make: '',
  model: '',
  badge: '',
};

export function useVehicleSelection() {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetSelection = useCallback(() => {
    setSelection(initialSelection);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const updateSelection = useCallback(
    (field: keyof Selection, value: string) => {
      setSelection((current) => {
        if (field === 'make') {
          return { make: value, model: '', badge: '' };
        }

        if (field === 'model') {
          return { ...current, model: value, badge: '' };
        }

        return { ...current, badge: value };
      });
    },
    [],
  );

  const quickSelect = useCallback((selection: Selection) => {
    setSelection(selection);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const validateSelection = useCallback((selectionToValidate: Selection) => {
    if (!selectionToValidate.make) return 'Please select a make.';
    if (!selectionToValidate.model) return 'Please select a model.';
    if (!selectionToValidate.badge) return 'Please select a badge.';
    return null;
  }, []);

  return {
    selection,
    fileInputRef: fileInputRef as RefObject<HTMLInputElement | null>,
    resetSelection,
    updateSelection,
    quickSelect,
    validateSelection,
  };
}
