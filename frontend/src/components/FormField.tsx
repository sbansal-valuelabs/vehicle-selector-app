import { type ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ id, label, children, className = '' }: FormFieldProps) {
  return (
    <div className={`formGroup ${className}`.trim()}>
      <label htmlFor={id} className="formLabel">
        {label}
      </label>
      {children}
    </div>
  );
}
