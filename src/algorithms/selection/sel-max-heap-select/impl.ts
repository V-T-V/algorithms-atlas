// 最大堆选择 · 实现
export interface XhHooks {
  onPop?: (v: number, remaining: number) => void;
  onResult?: (v: number) => void;
}
function siftDownMax(a: number[], i: number, n: number): void {
  while (true) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let s = i;
    if (l < n && a[l]! > a[s]!) s = l;
    if (r < n && a[r]! > a[s]!) s = r;
    if (s === i) break;
    [a[i], a[s]] = [a[s]!, a[i]!];
    i = s;
  }
}
export function maxHeapSelect(arr: number[], k: number, hooks: XhHooks = {}): number {
  const a = [...arr];
  const n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDownMax(a, i, n);
  let size = n;
  while (size > k + 1) {
    hooks.onPop?.(a[0]!, size);
    a[0] = a[size - 1]!;
    size--;
    siftDownMax(a, 0, size);
  }
  hooks.onResult?.(a[0]!);
  return a[0]!;
}
