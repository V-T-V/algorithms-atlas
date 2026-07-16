// 错排数 · 实现
export interface DrHooks {
  onValue?: (i: number, d: number) => void;
  onConclude?: (values: number[]) => void;
}
export function derangement(n: number, hooks: DrHooks = {}): number[] {
  if (n < 0) return [];
  const out = [1, 0];
  for (let i = 2; i <= n; i++) {
    out.push((i - 1) * (out[i - 1]! + out[i - 2]!));
    hooks.onValue?.(i, out[i]!);
  }
  hooks.onValue?.(0, out[0]!);
  if (n >= 1) hooks.onValue?.(1, out[1]!);
  hooks.onConclude?.(out.slice(0, n + 1));
  return out.slice(0, n + 1);
}
