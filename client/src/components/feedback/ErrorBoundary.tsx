import { Component, type ErrorInfo, type ReactNode } from 'react';
import Button from '@mui/material/Button';
import { Logo } from '@/components/brand/Logo';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  error: Error | null;
}

/** App-level error boundary with a branded recovery screen. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production this would report to Sentry/LogRocket.
    console.error('[Impulse] Uncaught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-6 text-center">
          <Logo to={null} />
          <div>
            <h1 className="font-display text-2xl font-bold text-content">Something went sideways</h1>
            <p className="mt-2 max-w-md text-muted">
              An unexpected error occurred. You can try again — if it keeps happening, refresh the page.
            </p>
          </div>
          <pre className="max-w-lg overflow-auto rounded-xl border border-line bg-surface p-4 text-left text-xs text-muted">
            {this.state.error.message}
          </pre>
          <div className="flex gap-3">
            <Button variant="contained" onClick={this.handleReset}>
              Try again
            </Button>
            <Button variant="outlined" onClick={() => window.location.assign('/')}>
              Go home
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
