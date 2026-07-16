// 比较版本号 · 实现
export interface CompareVersionHooks {
  onSegment?: (i: number, a: number, b: number, cmp: number) => void;
  onConclude?: (cmp: number) => void;
}
export function miscCompareVersion(
  v1: string,
  v2: string,
  hooks: CompareVersionHooks = {},
): number {
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    const cmp = x < y ? -1 : x > y ? 1 : 0;
    hooks.onSegment?.(i, x, y, cmp);
    if (cmp !== 0) {
      hooks.onConclude?.(cmp);
      return cmp;
    }
  }
  hooks.onConclude?.(0);
  return 0;
}
