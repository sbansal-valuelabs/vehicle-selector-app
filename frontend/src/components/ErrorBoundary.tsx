import { Component, type ReactNode, type ErrorInfo } from 'react';
import { APP_CONFIG } from '../constants/appConstants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for production error handling
 * Prevents entire app crash from component errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (APP_CONFIG.DEBUG) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, you could send this to an error tracking service
    // Example: errorTrackingService.captureException(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="appContainer">
          <h1>Something went wrong</h1>
          <p>The application encountered an unexpected error. Please refresh the page to try again.</p>
          {APP_CONFIG.DEBUG && this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              {this.state.error.toString()}
            </details>
          )}
        </main>
      );
    }

    return this.props.children;
  }
}
