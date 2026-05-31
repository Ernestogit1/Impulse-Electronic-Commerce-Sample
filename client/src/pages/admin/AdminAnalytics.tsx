import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { AdminHeader } from '@/features/admin/components/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProductImage } from '@/components/ui/ProductImage';
import {
  useGetRevenueSeriesQuery,
  useGetOrdersByStatusQuery,
  useGetTopProductsQuery,
} from '@/services/api/apiSlice';
import { formatMoney } from '@/lib/money';
import { orderStatusLabel } from '@/features/orders/statusTone';

const PIE_COLORS = ['#2DD4E1', '#4C9AFF', '#3FB984', '#11788A', '#E5484D', '#8A8A86'];

export default function AdminAnalytics() {
  const { data: revenue } = useGetRevenueSeriesQuery();
  const { data: byStatus } = useGetOrdersByStatusQuery();
  const { data: top } = useGetTopProductsQuery();

  return (
    <div>
      <AdminHeader title="Sales analytics" subtitle="Revenue, order mix, and best sellers." />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="mb-4 font-display font-semibold text-content">Revenue trend</h3>
          {!revenue ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenue} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2DD4E1" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#2DD4E1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).getDate().toString()} tick={{ fontSize: 11, fill: '#8A8A86' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#8A8A86' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#142231', border: '1px solid #1E2E3C', borderRadius: 12 }} formatter={(v: number) => [formatMoney(v, 'PHP'), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#2DD4E1" strokeWidth={2} fill="url(#rev2)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="mb-4 font-display font-semibold text-content">Orders by status</h3>
          {!byStatus ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={byStatus.filter((s) => s.count > 0)}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  label={(e: any) => orderStatusLabel[e.status as keyof typeof orderStatusLabel]}
                >
                  {byStatus.filter((s) => s.count > 0).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#142231', border: '1px solid #1E2E3C', borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 xl:col-span-2">
          <h3 className="mb-4 font-display font-semibold text-content">Top products by revenue</h3>
          {!top ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={top} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#8A8A86' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="title" width={140} tick={{ fontSize: 11, fill: '#B4B4B0' }} axisLine={false} tickLine={false} tickFormatter={(t: string) => (t.length > 18 ? t.slice(0, 18) + '…' : t)} />
                  <Tooltip contentStyle={{ background: '#142231', border: '1px solid #1E2E3C', borderRadius: 12 }} formatter={(v: number) => [formatMoney(v, 'PHP'), 'Revenue']} />
                  <Bar dataKey="revenue" fill="#2DD4E1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ul className="space-y-3">
                {top.map((p, i) => (
                  <li key={p.productId} className="flex items-center gap-3">
                    <span className="w-5 text-sm font-bold text-muted">{i + 1}</span>
                    <ProductImage src={p.image} alt={p.title} className="h-10 w-10 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm text-content">{p.title}</p>
                      <p className="text-xs text-muted">{p.unitsSold} sold</p>
                    </div>
                    <span className="text-sm font-semibold text-brand-400">{formatMoney(p.revenue, 'PHP')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
