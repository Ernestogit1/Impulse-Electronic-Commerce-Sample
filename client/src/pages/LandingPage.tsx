import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import {
  LocalShippingOutlined,
  VerifiedUserOutlined,
  AutorenewOutlined,
  SupportAgentOutlined,
  ArrowForwardRounded,
} from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductImage } from '@/components/ui/ProductImage';
import { Reveal } from '@/components/motion/Reveal';
import { useGetProductsQuery, useGetCategoriesQuery } from '@/services/api/apiSlice';

const VALUE_PROPS = [
  { icon: LocalShippingOutlined, title: 'Free shipping', desc: 'On orders over ₱10,000' },
  { icon: VerifiedUserOutlined, title: '2-year warranty', desc: 'On every Impulse product' },
  { icon: AutorenewOutlined, title: '30-day returns', desc: 'No-questions-asked' },
  { icon: SupportAgentOutlined, title: 'Concierge support', desc: 'Real humans, fast replies' },
];

export function LandingPage() {
  const { data: featured, isLoading: loadingFeatured } = useGetProductsQuery({ featured: true, limit: 8 });
  const { data: categories, isLoading: loadingCats } = useGetCategoriesQuery();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(45,212,225,0.22), transparent 60%)' }}
        />
        <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300"
            >
              ✦ New season — curated drops
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 font-display text-4xl font-bold leading-[1.05] text-content sm:text-5xl lg:text-6xl"
            >
              Technology that feels <span className="text-gradient-brand">premium.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-5 max-w-lg text-lg text-muted"
            >
              Audio, wearables, and workspace essentials — obsessively designed and built to last.
              Welcome to the Impulse Storefront.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button
                component={Link}
                to="/catalog"
                size="large"
                variant="contained"
                endIcon={<ArrowForwardRounded />}
              >
                Shop the collection
              </Button>
              <Button component={Link} to="/catalog?category=audio" size="large" variant="outlined">
                Explore audio
              </Button>
            </motion.div>
            <div className="mt-10 flex gap-8">
              {[
                ['20k+', 'Happy customers'],
                ['4.9★', 'Average rating'],
                ['24/7', 'Support'],
              ].map(([stat, label]) => (
                <div key={label}>
                  <div className="font-display text-2xl font-bold text-content">{stat}</div>
                  <div className="text-xs text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border border-line shadow-elevated">
              <ProductImage
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
                alt="Featured product"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute -bottom-5 -left-5 rounded-2xl border border-line glass p-4 shadow-card"
            >
              <div className="text-xs text-muted">Best seller</div>
              <div className="font-display font-semibold text-content">Aureus One</div>
              <div className="text-sm font-semibold text-brand-400">₱12,990</div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Value props */}
      <section className="border-b border-line bg-surface">
        <Container className="grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-400">
                <Icon fontSize="small" />
              </div>
              <div>
                <div className="text-sm font-semibold text-content">{title}</div>
                <div className="text-xs text-muted">{desc}</div>
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Categories */}
      <Container className="py-16">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by category"
          description="Find exactly what you’re looking for across our curated collections."
        />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {(loadingCats ? Array.from({ length: 6 }) : categories)?.map((c: any, i: number) => (
            <Reveal key={c?.id ?? i} index={i}>
              <Link
                to={c ? `/catalog?category=${c.slug}` : '#'}
                className="group relative block aspect-square overflow-hidden rounded-2xl border border-line"
              >
                <ProductImage src={c?.image} alt={c?.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-3 font-display font-semibold text-white">
                  {c?.name ?? '—'}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Featured products */}
      <Container className="pb-16">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured products"
          description="The pieces our community can’t stop talking about."
          action={
            <Button component={Link} to="/catalog" endIcon={<ArrowForwardRounded />}>
              View all
            </Button>
          }
        />
        <div className="mt-8">
          <ProductGrid products={featured?.items} loading={loadingFeatured} skeletonCount={8} />
        </div>
      </Container>

      {/* Brand story banner */}
      <Container className="pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-900 p-10 lg:p-16">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div
            className="absolute -right-20 top-0 h-80 w-80 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(45,212,225,0.25), transparent 60%)' }}
          />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-content lg:text-4xl">
              Built by <span className="text-gradient-brand">Impulse Software Solutions</span>
            </h2>
            <p className="mt-4 text-muted">
              This storefront is a reference build demonstrating production-grade architecture,
              modern UI/UX, and full-stack engineering — the same standard we bring to client work.
            </p>
            <Button component={Link} to="/catalog" variant="contained" sx={{ mt: 4 }} endIcon={<ArrowForwardRounded />}>
              Start shopping
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
