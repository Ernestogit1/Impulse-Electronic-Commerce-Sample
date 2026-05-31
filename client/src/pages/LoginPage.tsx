import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { Google, PersonOutline, AdminPanelSettingsOutlined } from '@mui/icons-material';
import { useAuth } from '@/features/auth/useAuth';
import { useAppDispatch } from '@/app/hooks';
import { pushToast } from '@/features/ui/uiSlice';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loginWithEmail, loginWithGoogle, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('customer@impulse.ph');
  const [password, setPassword] = useState('demo1234');
  const [busy, setBusy] = useState(false);

  const redirect = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
      navigate(redirect, { replace: true });
    } catch (e: any) {
      dispatch(pushToast(e?.message ?? 'Sign in failed', 'error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-content">Welcome back</h1>
      <p className="mt-2 text-muted">Sign in to your Impulse account.</p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button variant="outlined" startIcon={<PersonOutline />} onClick={() => run(() => loginAsDemo('customer'))}>
          Demo customer
        </Button>
        <Button variant="outlined" startIcon={<AdminPanelSettingsOutlined />} onClick={() => run(() => loginAsDemo('admin'))}>
          Demo admin
        </Button>
      </div>

      <Divider sx={{ my: 3 }}>or</Divider>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => loginWithEmail(email, password));
        }}
      >
        <TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          size="large"
          variant="contained"
          disabled={busy}
          startIcon={busy ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          Sign in
        </Button>
      </form>

      <Button fullWidth variant="text" startIcon={<Google />} sx={{ mt: 2 }} onClick={() => run(loginWithGoogle)}>
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted">
        New to Impulse?{' '}
        <Link to="/register" className="font-semibold text-brand-400 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
