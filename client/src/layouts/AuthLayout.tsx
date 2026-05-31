import { Outlet, Link } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { PoweredByImpulse } from '@/components/brand/PoweredByImpulse';

/** Split-screen auth layout: branded showcase panel + form. */
export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute -left-24 top-1/3 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(45,212,225,0.35), transparent 60%)' }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo size={40} />
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight text-content">
              Commerce, <span className="text-gradient-brand">elevated.</span>
            </h1>
            <p className="mt-4 max-w-md text-muted">
              A premium storefront experience — fast, beautiful, and built to convert. Sign in to
              pick up where you left off.
            </p>
          </div>
          <PoweredByImpulse />
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col bg-canvas">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Logo size={34} />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Outlet />
            <p className="mt-10 text-center lg:hidden">
              <PoweredByImpulse />
            </p>
          </div>
        </div>
        <div className="p-6 text-center text-xs text-muted">
          <Link to="/" className="hover:text-content">
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}
