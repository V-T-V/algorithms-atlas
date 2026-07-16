export interface TvHooks {
  onRow?: (i: number, html: string) => void;
}
export function transformRows<T>(
  rows: T[],
  tfn: (r: T, i: number) => string,
  hooks: TvHooks = {},
): string {
  const parts = rows.map((r, i) => {
    const h = tfn(r, i);
    hooks.onRow?.(i, h);
    return h;
  });
  return parts.join('');
}
