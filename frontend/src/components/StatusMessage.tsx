import React, { type ReactNode } from 'react';

interface StatusMessageProps {
  type: 'error' | 'success';
  role?: 'alert' | 'status';
  live?: 'assertive' | 'polite';
  children: ReactNode;
}

export const StatusMessage = React.forwardRef<HTMLDivElement, StatusMessageProps>(
  ({ type, role = type === 'error' ? 'alert' : 'status', live = type === 'error' ? 'assertive' : 'polite', children }, ref) => (
    <div
      ref={ref}
      tabIndex={-1}
      role={role}
      aria-live={live}
      className={`statusMessage ${type}`}
    >
      {children}
    </div>
  )
);

StatusMessage.displayName = 'StatusMessage';
