// 单调递增数字 · 实现
export interface MonotoneHooks {
  onMark?: (pos: number, marker: number) => void;
  onConclude?: (result: number) => void;
}
export interface MonotoneResult {
  value: number;
}
export function greedyMonotone2(n: number, hooks: MonotoneHooks = {}): MonotoneResult {
  const s = String(n).split('').map(Number);
  let marker = s.length;
  for (let i = s.length - 1; i > 0; i--) {
    if (s[i]! < s[i - 1]!) {
      marker = i;
      s[i - 1] = s[i - 1]! - 1;
      hooks.onMark?.(i - 1, marker);
    }
  }
  for (let i = marker; i < s.length; i++) s[i] = 9;
  const value = Number(s.join(''));
  hooks.onConclude?.(value);
  return { value };
}
