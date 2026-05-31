import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/app/store';
import { ThemeModeProvider } from '@/theme/ThemeModeProvider';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { Toaster } from '@/components/feedback/Toaster';
import { SessionBootstrap } from './SessionBootstrap';

/** Composes every global provider in the correct order. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeModeProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <SessionBootstrap />
            {children}
            <Toaster />
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeModeProvider>
    </Provider>
  );
}
