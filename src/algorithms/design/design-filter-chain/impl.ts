// 过滤器链 · 实现
export interface Filter<T> {
  (input: T): { ok: boolean; reason?: string };
}
export interface FilterChainHooks {
  onFilter?: (index: number, ok: boolean, reason?: string) => void;
}
export function applyFilters<T>(
  input: T,
  filters: Filter<T>[],
  hooks: FilterChainHooks = {},
): { ok: boolean; reason?: string } {
  for (let i = 0; i < filters.length; i++) {
    const r = filters[i]!(input);
    hooks.onFilter?.(i, r.ok, r.reason);
    if (!r.ok) return { ok: false, reason: r.reason };
  }
  return { ok: true };
}
