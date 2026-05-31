import { Remove, Add } from '@mui/icons-material';
import { cn } from '@/lib/cn';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const btn =
    'grid place-items-center rounded-full text-content transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent focus-ring';
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        className={cn(btn, dim)}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Remove fontSize="small" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={cn(btn, dim)}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Add fontSize="small" />
      </button>
    </div>
  );
}
