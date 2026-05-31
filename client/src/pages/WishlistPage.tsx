import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FavoriteBorder } from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { ProductGrid } from '@/components/product/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAppSelector } from '@/app/hooks';
import { selectWishlistIds } from '@/features/wishlist/wishlistSlice';
import { useGetProductsQuery } from '@/services/api/apiSlice';

export function WishlistPage() {
  const ids = useAppSelector(selectWishlistIds);
  const { data, isLoading } = useGetProductsQuery({ limit: 100 });
  const products = data?.items.filter((p) => ids.includes(p.id));

  return (
    <Container className="py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-content">Your wishlist</h1>
      {!isLoading && (!products || products.length === 0) ? (
        <EmptyState
          icon={<FavoriteBorder />}
          title="No saved items yet"
          description="Tap the heart on any product to save it here for later."
          action={
            <Button variant="contained" component={Link} to="/catalog">
              Discover products
            </Button>
          }
        />
      ) : (
        <ProductGrid products={products} loading={isLoading} skeletonCount={4} />
      )}
    </Container>
  );
}
