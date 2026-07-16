// 基数排序（LSD 十六进制）· 纯算法实现
export interface RadixHexHooks {
  onPass?: (digit: number, arr: number[]) => void;
}

export function radixSortLsdHex(arr: readonly number[], hooks: RadixHexHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;
  const max = Math.max(...a);
  let digit = 0;
  for (let exp = 0; max >>> (exp * 4) > 0; exp++, digit++) {
    const buckets: number[][] = Array.from({ length: 16 }, () => []);
    for (const v of a) buckets[(v >>> (exp * 4)) & 0xf]!.push(v);
    let k = 0;
    for (const b of buckets) for (const v of b) a[k++] = v;
    hooks.onPass?.(digit, a);
  }
  return a;
}
