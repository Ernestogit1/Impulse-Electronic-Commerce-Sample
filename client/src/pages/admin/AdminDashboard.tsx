import { Link } from 'react-router-dom';
import {
  PaymentsOutlined,
  ShoppingCartOutlined,
  GroupOutlined,
  ReceiptOutlined,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { StatCard, AdminHeader } from '@/features/admin/components/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useGetAnalyticsOverviewQuery,
  useGetRevenueSeriesQuery,
  useAdminGetOrdersQuery,
  useGetLowStockQuery,
} from '@/services/api/apiSlice';
import { formatMoney } from '@/lib/money';
import { orderStatusLabel, orderStatusTone } from '@/features/orders/statusTone';

export default function AdminDashboard() {
  const { data: overview, isLoading: loadingOverview } = useGetAnalyticsOverviewQuery();
  const { data: revenue } = useGetRevenueSeriesQuery();
  const { data: orders } = useAdminGetOrdersQuery();
  const { data: lowStock } = useGetLowStockQuery();

  const recent = orders?.slice(0, 5);

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Welcome back — here’s how Impulse is performing." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          loading={loadingOverview}
          value={overview ? formatMoney(overview.revenue, overview.currency) : '—'}
          delta={overview?.revenueDeltaPct}
          icon={<PaymentsOutlined fontSize="small" />}
        />
        <StatCard
          label="Orders"
          loading={loadingOverview}
          value={overview?.orders ?? '—'}
          delta={overview?.ordersDeltaPct}
          icon={<ShoppingCartOutlined fontSize="small" />}
        />
        <StatCard
          label="Customers"
          loading={loadingOverview}
          value={overview?.customers ?? '—'}
          delta={overview?.customersDeltaPct}
          icon={<GroupOutlined fontSize="small" />}
        />
        <StatCard
          label="Avg. order value"
          loading={loadingOverview}
          value={overview ? formatMoney(overview.avgOrderValue, overview.currency) : '—'}
          delta={overview?.aovDeltaPct}
          icon={<ReceiptOutlined fontSize="small" />}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Revenue chart */}
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="mb-4 font-display font-semibold text-content">Revenue (last 14 days)</h3>
          {!revenue ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenue} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2DD4E1" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#2DD4E1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => new Date(d).toLocaleDateString('en-PH', { day: 'numeric', month: 'short' })}
                  tick={{ fontSize: 11, fill: '#8A8A86' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: '#8A8A86' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ background: '#142231', border: '1px solid #1E2E3C', borderRadius: 12 }}
                  formatter={(v: number) => [formatMoney(v, 'PHP'), 'Revenue']}
                  labelFormatter={(d) => new Date(d).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2DD4E1" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Low stock */}
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="mb-4 font-display font-semibold text-content">Low stock alerts</h3>
          {!lowStock ? (
            <Skeleton className="h-48 w-full" />
          ) : lowStock.length === 0 ? (
            <p className="text-sm text-muted">All products are well stocked. ✦</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.productId} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1 text-content">{p.title}</span>
                  <Badge tone={p.stock === 0 ? 'danger' : 'warning'}>{p.stock} left</Badge>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/inventory" className="mt-4 inline-block text-sm text-brand-400 hover:underline">
            Manage inventory →
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display font-semibold text-content">Recent orders</h3>
          <Link to="/admin/orders" className="text-sm text-brand-400 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted">
                <th className="pb-3">Order</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recent?.map((o) => (
                <tr key={o.id}>
                  <td className="py-3 font-medium text-content">{o.orderNumber}</td>
                  <td className="py-3 text-muted">{o.contactEmail}</td>
                  <td className="py-3">
                    <Badge tone={orderStatusTone[o.status]}>{orderStatusLabel[o.status]}</Badge>
                  </td>
                  <td className="py-3 text-right font-semibold text-content">{formatMoney(o.total, o.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
