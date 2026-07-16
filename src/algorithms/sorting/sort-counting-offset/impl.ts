// 计数排序（带负数偏移）· 纯算法实现
export interface CountingOffsetHooks {
  onCount?: (count: number[], arr: number[]) => void;
}

export function countingSortOffset(
  arr: readonly number[],
  hooks: CountingOffsetHooks = {},
): number[] {
  if (arr.length === 0) return [];
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const range = mx - mn + 1;
  const count = new Array<number>(range).fill(0);
  for (const v of arr) count[v - mn]!++;
  hooks.onCount?.(count, [...arr]);
  for (let i = 1; i < range; i++) count[i]! += count[i - 1]!;
  const out = new Array<number>(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    const v = arr[i]!;
    count[v - mn]!--;
    out[count[v - mn]!] = v;
  }
  return out;
}
