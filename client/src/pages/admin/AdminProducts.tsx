import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { AddRounded, EditOutlined, DeleteOutline } from '@mui/icons-material';
import { AdminHeader } from '@/features/admin/components/StatCard';
import { Badge } from '@/components/ui/Badge';
import { ProductImage } from '@/components/ui/ProductImage';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/services/api/apiSlice';
import { useAppDispatch } from '@/app/hooks';
import { pushToast } from '@/features/ui/uiSlice';
import { formatMoney } from '@/lib/money';
import type { Product } from '@shared/types';

interface FormState {
  title: string;
  categoryId: string;
  price: string;
  stock: string;
  brand: string;
  description: string;
  image: string;
}

const emptyForm: FormState = { title: '', categoryId: '', price: '', stock: '', brand: '', description: '', image: '' };

export default function AdminProducts() {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetProductsQuery({ limit: 100, sort: 'newest' });
  const { data: categories } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, categoryId: categories?.[0]?.id ?? '' });
    setOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      title: p.title,
      categoryId: p.categoryId,
      price: String(p.price),
      stock: String(p.stock),
      brand: p.brand ?? '',
      description: p.description,
      image: p.images[0]?.url ?? '',
    });
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      title: form.title,
      categoryId: form.categoryId,
      price: Number(form.price),
      stock: Number(form.stock),
      brand: form.brand,
      description: form.description,
      images: form.image ? [{ url: form.image, alt: form.title }] : [],
    };
    try {
      if (editing) {
        await updateProduct({ id: editing.id, dto: payload }).unwrap();
        dispatch(pushToast('Product updated', 'success'));
      } else {
        await createProduct(payload).unwrap();
        dispatch(pushToast('Product created', 'success'));
      }
      setOpen(false);
    } catch {
      dispatch(pushToast('Could not save product', 'error'));
    }
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete “${p.title}”?`)) return;
    await deleteProduct(p.id).unwrap();
    dispatch(pushToast('Product deleted', 'info'));
  };

  return (
    <div>
      <AdminHeader
        title="Products"
        subtitle={`${data?.meta.total ?? 0} products in catalog`}
        action={
          <Button variant="contained" startIcon={<AddRounded />} onClick={openCreate}>
            Add product
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-right">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="p-4" colSpan={6}>
                        <Skeleton className="h-10 w-full" />
                      </td>
                    </tr>
                  ))
                : data?.items.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <ProductImage src={p.images[0]?.url} alt={p.title} className="h-10 w-10 rounded-lg object-cover" />
                          <span className="line-clamp-1 font-medium text-content">{p.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted">{p.categoryName}</td>
                      <td className="p-4 text-right text-content">{formatMoney(p.price, p.currency)}</td>
                      <td className="p-4 text-right">{p.stock}</td>
                      <td className="p-4">
                        <Badge tone={p.stock === 0 ? 'danger' : p.stock <= p.lowStockThreshold ? 'warning' : 'success'}>
                          {p.stock === 0 ? 'Out' : p.stock <= p.lowStockThreshold ? 'Low' : 'Active'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <IconButton size="small" onClick={() => openEdit(p)} aria-label="Edit">
                          <EditOutlined fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => remove(p)} aria-label="Delete">
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit product' : 'Add product'}</DialogTitle>
        <DialogContent>
          <div className="mt-1 space-y-4">
            <TextField label="Title" fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <TextField label="Brand" fullWidth value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <TextField
              select
              label="Category"
              fullWidth
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories?.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Price (₱)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <TextField label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <TextField label="Image URL" fullWidth value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <TextField label="Description" fullWidth multiline minRows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={!form.title || !form.price}>
            {editing ? 'Save changes' : 'Create product'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
