/**
 * Minimal className combiner (no dependency). Accepts strings, falsy values, and
 * conditional maps. Keeps JSX tidy: cn('a', cond && 'b', { c: isC }).
 */
export type ClassValue = string | number | null | false | undefined | Record<string, boolean>;

export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (typeof v === 'string' || typeof v === 'number') {
      out.push(String(v));
    } else if (typeof v === 'object') {
      for (const [key, on] of Object.entries(v)) if (on) out.push(key);
    }
  }
  return out.join(' ');
}
