// 7 元中位数 · 实现
export interface M7Hooks {
  onResult?: (m: number) => void;
}
export function medianOf7(arr: number[], hooks: M7Hooks = {}): number {
  if (arr.length !== 7) throw new Error('need 7');
  const sorted = [...arr].sort((a, b) => a - b);
  const m = sorted[3]!;
  hooks.onResult?.(m);
  return m;
}
