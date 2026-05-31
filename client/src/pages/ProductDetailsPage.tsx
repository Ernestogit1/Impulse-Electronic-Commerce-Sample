import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { FavoriteBorder, Favorite, ShoppingBagOutlined } from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { ProductImage } from '@/components/ui/ProductImage';
import { PriceTag } from '@/components/ui/PriceTag';
import { Badge } from '@/components/ui/Badge';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Skeleton } from '@/components/ui/Skeleton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useGetProductQuery, useGetProductsQuery } from '@/services/api/apiSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import { toggleWishlist, selectWishlistIds } from '@/features/wishlist/wishlistSlice';
import { pushToast, setCartDrawer } from '@/features/ui/uiSlice';

export function ProductDetailsPage() {
  const { slug = '' } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useGetProductQuery(slug);
  const wishlistIds = useAppSelector(selectWishlistIds);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [activeImg, setActiveImg] = useState(0);

  const { data: related } = useGetProductsQuery(
    { category: product?.categorySlug ?? '', limit: 4 },
    { skip: !product },
  );

  if (isLoading) return <ProductDetailsSkeleton />;
  if (isError || !product)
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <Button component={Link} to="/catalog" variant="contained" sx={{ mt: 3 }}>
          Back to catalog
        </Button>
      </Container>
    );

  const wishlisted = wishlistIds.includes(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= product.lowStockThreshold;

  const add = () => {
    dispatch(
      addToCart({
        productId: product.id,
        quantity: qty,
        title: product.title,
        slug: product.slug,
        image: product.images[0]?.url,
        unitPrice: product.price,
        currency: product.currency,
        stock: product.stock,
      }),
    );
    dispatch(pushToast(`${product.title} added to cart`, 'success'));
    dispatch(setCartDrawer(true));
  };

  return (
    <Container className="py-10">
      <Breadcrumbs sx={{ mb: 4, fontSize: 14 }}>
        <Link to="/" className="text-muted hover:text-content">Home</Link>
        <Link to="/catalog" className="text-muted hover:text-content">Shop</Link>
        <Link to={`/catalog?category=${product.categorySlug}`} className="text-muted hover:text-content">
          {product.categoryName}
        </Link>
        <span className="text-content">{product.title}</span>
      </Breadcrumbs>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-line bg-surface">
            <ProductImage
              src={product.images[activeImg]?.url}
              alt={product.title}
              className="aspect-square w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((im, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-20 overflow-hidden rounded-xl border ${i === activeImg ? 'border-brand-500' : 'border-line'}`}
                >
                  <ProductImage src={im.url} alt={im.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium uppercase tracking-wide text-brand-500">
              {product.brand}
            </span>
            {product.featured && <Badge tone="brand">Featured</Badge>}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold text-content lg:text-4xl">
            {product.title}
          </h1>
          <div className="mt-3 flex items-center gap-2">
            <Rating value={product.rating} precision={0.5} size="small" readOnly />
            <span className="text-sm text-muted">
              {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </div>

          <div className="mt-6">
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} currency={product.currency} size="lg" />
          </div>

          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-6 flex items-center gap-2">
            {outOfStock ? (
              <Badge tone="danger">Out of stock</Badge>
            ) : lowStock ? (
              <Badge tone="warning">Only {product.stock} left</Badge>
            ) : (
              <Badge tone="success">In stock</Badge>
            )}
            <span className="text-xs text-muted">Tags: {product.tags.join(', ')}</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantityStepper value={qty} max={product.stock || 99} onChange={setQty} />
            <Button
              size="large"
              variant="contained"
              startIcon={<ShoppingBagOutlined />}
              disabled={outOfStock}
              onClick={add}
              sx={{ flex: 1, minWidth: 200 }}
            >
              {outOfStock ? 'Sold out' : 'Add to cart'}
            </Button>
            <Button
              size="large"
              variant="outlined"
              startIcon={wishlisted ? <Favorite /> : <FavoriteBorder />}
              onClick={() => dispatch(toggleWishlist(product.id))}
            >
              {wishlisted ? 'Saved' : 'Save'}
            </Button>
          </div>

          {!outOfStock && (
            <Button
              variant="text"
              sx={{ mt: 2 }}
              onClick={() => { add(); navigate('/checkout'); }}
            >
              Buy it now →
            </Button>
          )}

          {/* Tabs */}
          <div className="mt-10 border-t border-line">
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab label="Details" />
              <Tab label="Specs" />
              <Tab label={`Reviews (${product.reviewCount})`} />
            </Tabs>
            <div className="py-5 text-sm leading-relaxed text-muted">
              {tab === 0 && <p>{product.description}</p>}
              {tab === 1 && (
                <ul className="space-y-2">
                  <li><span className="text-content">Brand:</span> {product.brand}</li>
                  <li><span className="text-content">Category:</span> {product.categoryName}</li>
                  <li><span className="text-content">SKU:</span> {product.id.toUpperCase()}</li>
                  <li><span className="text-content">Warranty:</span> 2 years</li>
                </ul>
              )}
              {tab === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-3xl font-bold text-content">
                      {product.rating.toFixed(1)}
                    </span>
                    <div>
                      <Rating value={product.rating} precision={0.5} size="small" readOnly />
                      <p className="text-xs text-muted">Based on {product.reviewCount} reviews</p>
                    </div>
                  </div>
                  <p className="text-muted">
                    Reviews are seeded for this demo. Connect the backend to enable customer reviews.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related && related.items.length > 0 && (
        <div className="mt-20">
          <SectionHeading eyebrow="You may also like" title="Related products" />
          <div className="mt-8">
            <ProductGrid products={related.items.filter((p) => p.id !== product.id).slice(0, 4)} />
          </div>
        </div>
      )}
    </Container>
  );
}

function ProductDetailsSkeleton() {
  return (
    <Container className="py-10">
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </Container>
  );
}
