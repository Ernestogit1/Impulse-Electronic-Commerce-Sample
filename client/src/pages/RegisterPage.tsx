import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { Google } from '@mui/icons-material';
import { useAuth } from '@/features/auth/useAuth';
import { useAppDispatch } from '@/app/hooks';
import { pushToast } from '@/features/ui/uiSlice';

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
      navigate('/', { replace: true });
    } catch (e: any) {
      dispatch(pushToast(e?.message ?? 'Registration failed', 'error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-content">Create your account</h1>
      <p className="mt-2 text-muted">Join Impulse — it only takes a moment.</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => register(name, email, password));
        }}
      >
        <TextField label="Full name" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Passwords are managed securely by Firebase Authentication."
          required
        />
        <Button
          type="submit"
          fullWidth
          size="large"
          variant="contained"
          disabled={busy}
          startIcon={busy ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          Create account
        </Button>
      </form>

      <Divider sx={{ my: 3 }}>or</Divider>

      <Button fullWidth variant="outlined" startIcon={<Google />} onClick={() => run(loginWithGoogle)}>
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-400 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
