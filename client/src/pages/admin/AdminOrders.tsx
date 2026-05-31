import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AdminHeader } from '@/features/admin/components/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { useAdminGetOrdersQuery, useAdminUpdateOrderStatusMutation } from '@/services/api/apiSlice';
import { useAppDispatch } from '@/app/hooks';
import { pushToast } from '@/features/ui/uiSlice';
import { formatMoney } from '@/lib/money';
import { orderStatusLabel, orderStatusTone } from '@/features/orders/statusTone';
import type { OrderStatus } from '@shared/types';

const STATUSES: OrderStatus[] = ['pending', 'paid', 'fulfilled', 'completed', 'cancelled', 'refunded'];

export default function AdminOrders() {
  const dispatch = useAppDispatch();
  const { data: orders, isLoading } = useAdminGetOrdersQuery();
  const [updateStatus] = useAdminUpdateOrderStatusMutation();

  const change = async (id: string, status: OrderStatus) => {
    await updateStatus({ id, status }).unwrap();
    dispatch(pushToast(`Order marked ${orderStatusLabel[status].toLowerCase()}`, 'success'));
  };

  return (
    <div>
      <AdminHeader title="Orders" subtitle={`${orders?.length ?? 0} total orders`} />

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Items</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}><td className="p-4" colSpan={6}><Skeleton className="h-9 w-full" /></td></tr>
                  ))
                : orders?.map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-medium text-content">{o.orderNumber}</td>
                      <td className="p-4 text-muted">{o.contactEmail}</td>
                      <td className="p-4 text-muted">
                        {new Date(o.placedAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                      </td>
                      <td className="p-4 text-center">{o.items.reduce((n, it) => n + it.quantity, 0)}</td>
                      <td className="p-4 text-right font-semibold text-content">{formatMoney(o.total, o.currency)}</td>
                      <td className="p-4">
                        <Select
                          size="small"
                          value={o.status}
                          onChange={(e) => change(o.id, e.target.value as OrderStatus)}
                          renderValue={(v) => <Badge tone={orderStatusTone[v as OrderStatus]}>{orderStatusLabel[v as OrderStatus]}</Badge>}
                          sx={{ minWidth: 150 }}
                        >
                          {STATUSES.map((s) => (
                            <MenuItem key={s} value={s}>{orderStatusLabel[s]}</MenuItem>
                          ))}
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
