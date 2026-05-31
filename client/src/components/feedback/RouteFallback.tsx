import CircularProgress from '@mui/material/CircularProgress';

/** Suspense fallback for lazily-loaded route bundles. */
export function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <CircularProgress color="primary" />
    </div>
  );
}
