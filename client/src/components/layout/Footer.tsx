import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { ArrowForwardRounded } from '@mui/icons-material';
import { Logo } from '@/components/brand/Logo';
import { PoweredByImpulse } from '@/components/brand/PoweredByImpulse';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      ['All products', '/catalog'],
      ['Audio', '/catalog?category=audio'],
      ['Wearables', '/catalog?category=wearables'],
      ['Workspace', '/catalog?category=workspace'],
    ],
  },
  {
    title: 'Account',
    links: [
      ['Sign in', '/login'],
      ['My orders', '/orders'],
      ['Wishlist', '/wishlist'],
      ['Profile', '/profile'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About Impulse', '/'],
      ['Careers', '/'],
      ['Contact', '/'],
      ['Admin', '/admin'],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-8xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo size={38} />
            <p className="mt-4 max-w-xs text-sm text-muted">
              Premium technology and lifestyle goods, curated for people who care about the details.
            </p>
            <form
              className="mt-5 max-w-xs"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup"
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Email for early drops"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" size="small" aria-label="Subscribe" color="primary">
                        <ArrowForwardRounded fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-content">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-muted transition-colors hover:text-content">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-muted">© {new Date().getFullYear()} Impulse Storefront. All rights reserved.</p>
          <PoweredByImpulse />
        </div>
      </div>
    </footer>
  );
}
