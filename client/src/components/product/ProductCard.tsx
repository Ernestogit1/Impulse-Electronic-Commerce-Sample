import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import { Favorite, FavoriteBorder, AddShoppingCart } from '@mui/icons-material';
import type { Product } from '@shared/types';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import { toggleWishlist, selectWishlistIds } from '@/features/wishlist/wishlistSlice';
import { pushToast, setCartDrawer } from '@/features/ui/uiSlice';
import { ProductImage } from '@/components/ui/ProductImage';
import { PriceTag } from '@/components/ui/PriceTag';
import { Badge } from '@/components/ui/Badge';

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const wishlisted = useAppSelector(selectWishlistIds).includes(product.id);
  const outOfStock = product.stock <= 0;
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  const add = () => {
    dispatch(
      addToCart({
        productId: product.id,
        quantity: 1,
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
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
    >
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <ProductImage
          src={product.images[0]?.url}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge tone="brand">-{discount}%</Badge>}
          {product.featured && <Badge tone="neutral">Featured</Badge>}
          {outOfStock && <Badge tone="danger">Sold out</Badge>}
        </div>
      </Link>

      <IconButton
        size="small"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={() => dispatch(toggleWishlist(product.id))}
        className="!absolute !right-3 !top-3"
        sx={{
          bgcolor: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
          color: wishlisted ? '#2DD4E1' : '#fff',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.55)' },
        }}
      >
        {wishlisted ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
      </IconButton>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          {product.categoryName}
        </span>
        <Link to={`/product/${product.slug}`} className="mt-1 focus-ring">
          <h3 className="line-clamp-1 font-display font-semibold text-content transition-colors group-hover:text-brand-400">
            {product.title}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <span className="text-xs text-muted">({product.reviewCount})</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} currency={product.currency} />
          <button
            type="button"
            aria-label="Add to cart"
            disabled={outOfStock}
            onClick={add}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand-500 text-ink-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40 focus-ring"
          >
            <AddShoppingCart fontSize="small" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
