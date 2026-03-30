import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { type ReactNode } from 'react';

// Invisible fallback -- crashed section simply disappears (per D-06)
// On a portfolio site, showing error UI is worse than hiding a broken section
function SectionFallback(_props: FallbackProps) {
  return null;
}

// Log errors to console for developer debugging
function handleSectionError(error: Error, info: { componentStack?: string | null }) {
  console.error('[SectionError]', error.message, info.componentStack);
}

export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={SectionFallback} onError={handleSectionError}>
      {children}
    </ErrorBoundary>
  );
}
