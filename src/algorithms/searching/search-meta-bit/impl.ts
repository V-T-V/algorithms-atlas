// 元二分查找（逐位构造）· 纯算法实现
export interface MetaBitHooks {
  onTry?: (p: number) => void;
}

export function metaBitSearch(
  arr: readonly number[],
  target: number,
  hooks: MetaBitHooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  let lg = 0;
  while (1 << lg <= n) lg++;
  let p = 0;
  for (let i = lg; i >= 0; i--) {
    const next = p | (1 << i);
    if (next < n && arr[next]! <= target) {
      hooks.onTry?.(next);
      p = next;
    }
  }
  return arr[p]! === target ? p : -1;
}
