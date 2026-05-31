import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AdminHeader } from '@/features/admin/components/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { useAdminGetUsersQuery, useAdminUpdateUserRoleMutation } from '@/services/api/apiSlice';
import { useAppDispatch } from '@/app/hooks';
import { pushToast } from '@/features/ui/uiSlice';
import type { UserRole } from '@shared/types';

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const { data: users, isLoading } = useAdminGetUsersQuery();
  const [updateRole] = useAdminUpdateUserRoleMutation();

  const change = async (id: string, role: UserRole) => {
    await updateRole({ id, role }).unwrap();
    dispatch(pushToast(`Role updated to ${role}`, 'success'));
  };

  return (
    <div>
      <AdminHeader title="Customers" subtitle={`${users?.length ?? 0} registered users`} />

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}><td className="p-4" colSpan={4}><Skeleton className="h-10 w-full" /></td></tr>
                  ))
                : users?.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.photoURL} sx={{ width: 34, height: 34 }}>{u.name.charAt(0)}</Avatar>
                          <span className="font-medium text-content">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted">{u.email}</td>
                      <td className="p-4 text-muted">
                        {new Date(u.createdAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                      </td>
                      <td className="p-4">
                        <Select
                          size="small"
                          value={u.role}
                          onChange={(e) => change(u.id, e.target.value as UserRole)}
                          renderValue={(v) => <Badge tone={v === 'admin' ? 'brand' : 'neutral'}>{v as string}</Badge>}
                          sx={{ minWidth: 130 }}
                        >
                          <MenuItem value="customer">Customer</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
