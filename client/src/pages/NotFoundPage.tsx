import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Container } from '@/components/ui/Container';

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="font-display text-8xl font-bold text-gradient-brand">404</div>
      <h1 className="mt-4 font-display text-2xl font-bold text-content">Page not found</h1>
      <p className="mt-2 max-w-md text-muted">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button component={Link} to="/" variant="contained">
          Back home
        </Button>
        <Button component={Link} to="/catalog" variant="outlined">
          Browse products
        </Button>
      </div>
    </Container>
  );
}
