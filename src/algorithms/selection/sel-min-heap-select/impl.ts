// 最小堆选择 · 实现
export interface MhHooks {
  onPop?: (value: number, k: number) => void;
  onResult?: (v: number) => void;
}
function siftDown(a: number[], i: number, n: number): void {
  while (true) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let s = i;
    if (l < n && a[l]! < a[s]!) s = l;
    if (r < n && a[r]! < a[s]!) s = r;
    if (s === i) break;
    [a[i], a[s]] = [a[s]!, a[i]!];
    i = s;
  }
}
export function minHeapSelect(arr: number[], k: number, hooks: MhHooks = {}): number {
  const a = [...arr];
  const n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(a, i, n);
  let result = a[0]!;
  let size = n;
  for (let i = 0; i <= k && size > 0; i++) {
    result = a[0]!;
    hooks.onPop?.(result, i);
    a[0] = a[size - 1]!;
    size--;
    siftDown(a, 0, size);
  }
  hooks.onResult?.(result);
  return result;
}
