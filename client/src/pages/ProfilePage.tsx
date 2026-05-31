import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { LockOutlined, PlaceOutlined } from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectAuthUser } from '@/features/auth/authSlice';
import { pushToast } from '@/features/ui/uiSlice';
import { mockUsers } from '@/services/mock/db/users';

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('');

  // demo: pull the seeded address for the demo customer
  const addresses = mockUsers.find((u) => u.id === user?.id)?.addresses ?? [];

  return (
    <Container className="py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-content">My profile</h1>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <Avatar src={user?.photoURL} sx={{ width: 88, height: 88, mx: 'auto', mb: 2 }}>
            {user?.name?.charAt(0)}
          </Avatar>
          <h2 className="font-display text-lg font-semibold text-content">{user?.name}</h2>
          <p className="text-sm text-muted">{user?.email}</p>
          <div className="mt-3 flex justify-center">
            <Badge tone={user?.role === 'admin' ? 'brand' : 'neutral'}>{user?.role}</Badge>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-display font-semibold text-content">Account details</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <TextField label="Email" value={user?.email ?? ''} fullWidth disabled />
              <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
            </div>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => dispatch(pushToast('Profile saved', 'success'))}
            >
              Save changes
            </Button>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center gap-2">
              <LockOutlined fontSize="small" className="text-brand-400" />
              <h3 className="font-display font-semibold text-content">Security</h3>
            </div>
            <p className="mt-2 text-sm text-muted">
              Your password is managed securely by <span className="text-content">Firebase Authentication</span>.
              We never store your password — only a <code className="rounded bg-elevated px-1.5 py-0.5 text-xs">firebase-managed</code> placeholder is kept in our database.
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center gap-2">
              <PlaceOutlined fontSize="small" className="text-brand-400" />
              <h3 className="font-display font-semibold text-content">Addresses</h3>
            </div>
            {addresses.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No saved addresses yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {addresses.map((a) => (
                  <div key={a.id} className="rounded-xl border border-line p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-content">{a.label}</span>
                      {a.isDefault && <Badge tone="brand">Default</Badge>}
                    </div>
                    <p className="mt-1 text-muted">
                      {a.fullName}, {a.line1}, {a.city}, {a.region} {a.postalCode}, {a.country}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Container>
  );
}
