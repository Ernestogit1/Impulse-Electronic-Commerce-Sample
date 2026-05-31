import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { SearchOffRounded } from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { ProductGrid } from '@/components/product/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { useGetProductsQuery, useGetCategoriesQuery } from '@/services/api/apiSlice';
import type { ProductSort } from '@shared/types';
import { cn } from '@/lib/cn';

const SORTS: { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'popular', label: 'Most popular' },
];

const PAGE_SIZE = 12;
const MAX_PRICE = 25000;

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const { data: categories } = useGetCategoriesQuery();

  const q = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const sort = (params.get('sort') as ProductSort) ?? 'newest';
  const page = Number(params.get('page') ?? '1');
  const minPrice = Number(params.get('minPrice') ?? '0');
  const maxPrice = Number(params.get('maxPrice') ?? String(MAX_PRICE));

  const query = useMemo(
    () => ({ q, category, sort, page, limit: PAGE_SIZE, minPrice, maxPrice }),
    [q, category, sort, page, minPrice, maxPrice],
  );
  const { data, isFetching } = useGetProductsQuery(query);

  const patch = (next: Record<string, string | number | undefined>, resetPage = true) => {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === '' || v === null) merged.delete(k);
      else merged.set(k, String(v));
    });
    if (resetPage) merged.delete('page');
    setParams(merged);
  };

  const activeCat = categories?.find((c) => c.slug === category);
  const title = q ? `Results for “${q}”` : activeCat ? activeCat.name : 'All products';

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-content">{title}</h1>
        <p className="mt-1 text-muted">
          {data ? `${data.meta.total} product${data.meta.total === 1 ? '' : 's'}` : 'Loading…'}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted">
              Category
            </h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => patch({ category: undefined })}
                className={cn(
                  'rounded-lg px-3 py-2 text-left text-sm transition',
                  !category ? 'bg-brand-500/15 text-brand-300' : 'text-muted hover:bg-white/5 hover:text-content',
                )}
              >
                All categories
              </button>
              {categories?.map((c) => (
                <button
                  key={c.id}
                  onClick={() => patch({ category: c.slug })}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                    category === c.slug ? 'bg-brand-500/15 text-brand-300' : 'text-muted hover:bg-white/5 hover:text-content',
                  )}
                >
                  <span>{c.name}</span>
                  <span className="text-xs opacity-70">{c.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted">
              Price range
            </h3>
            <Slider
              value={[minPrice, maxPrice]}
              min={0}
              max={MAX_PRICE}
              step={500}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `₱${v.toLocaleString()}`}
              onChangeCommitted={(_, val) => {
                const [lo, hi] = val as number[];
                patch({ minPrice: lo || undefined, maxPrice: hi < MAX_PRICE ? hi : undefined });
              }}
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₱{minPrice.toLocaleString()}</span>
              <span>₱{maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {(q || category || minPrice > 0 || maxPrice < MAX_PRICE) && (
            <Button fullWidth variant="outlined" onClick={() => setParams(new URLSearchParams())}>
              Clear filters
            </Button>
          )}
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {q && <Chip label={`Search: ${q}`} onDelete={() => patch({ q: undefined })} />}
              {activeCat && <Chip label={activeCat.name} onDelete={() => patch({ category: undefined })} />}
            </div>
            <FormControl size="small" sx={{ minWidth: 190 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sort}
                label="Sort by"
                onChange={(e) => patch({ sort: e.target.value }, true)}
              >
                {SORTS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {!isFetching && data && data.items.length === 0 ? (
            <EmptyState
              icon={<SearchOffRounded />}
              title="No products found"
              description="Try adjusting your filters or search term."
              action={
                <Button variant="contained" onClick={() => setParams(new URLSearchParams())}>
                  Reset filters
                </Button>
              }
            />
          ) : (
            <ProductGrid
              products={data?.items}
              loading={isFetching && !data}
              skeletonCount={PAGE_SIZE}
              className="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          )}

          {data && data.meta.totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                count={data.meta.totalPages}
                page={page}
                color="primary"
                onChange={(_, p) => {
                  patch({ page: p }, false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
