import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { SearchRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setSearchOpen } from '@/features/ui/uiSlice';

const SUGGESTIONS = ['Headphones', 'Mechanical keyboard', 'Smartwatch', 'Charger', 'Backpack'];

export function SearchDialog() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const open = useAppSelector((s) => s.ui.searchOpen);
  const [q, setQ] = useState('');
  const close = () => dispatch(setSearchOpen(false));

  const submit = (term: string) => {
    close();
    setQ('');
    navigate(`/catalog?q=${encodeURIComponent(term)}`);
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: 'background.paper' } }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) submit(q.trim());
        }}
        className="p-3"
      >
        <TextField
          autoFocus
          fullWidth
          placeholder="Search products, brands, categories…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded />
              </InputAdornment>
            ),
          }}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="rounded-full border border-line px-3 py-1.5 text-sm text-muted transition hover:border-brand-500 hover:text-content"
            >
              {s}
            </button>
          ))}
        </div>
      </form>
    </Dialog>
  );
}
