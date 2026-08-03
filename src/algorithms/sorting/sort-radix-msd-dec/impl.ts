// 基数排序（MSD 十进制）· 纯算法实现
export interface RadixMsdHooks {
  onDigit?: (digit: number, depth: number, arr: number[]) => void;
}

function digit(v: number, d: number): number {
  return Math.floor(v / Math.pow(10, d)) % 10;
}

function msd(a: number[], lo: number, hi: number, depth: number, hooks: RadixMsdHooks): void {
  // depth 表示当前考察的十进制位（0=个位）。MSD 从最高位向个位推进，
  // 当 depth < 0 时已无更低有效位可分，停止递归。
  if (depth < 0 || lo >= hi) return;
  const buckets: number[][] = Array.from({ length: 10 }, () => []);
  for (let i = lo; i <= hi; i++) buckets[digit(a[i]!, depth)]!.push(a[i]!);
  let k = lo;
  for (const b of buckets) for (const v of b) a[k++] = v;
  hooks.onDigit?.(depth, depth, a.slice(lo, hi + 1));
  let start = lo;
  for (const b of buckets) {
    if (b.length > 1) {
      // 仅当桶内多于一个元素时才需要按更低位继续划分；
      // 向更低有效位推进（depth - 1），避免相同前缀无限递归。
      msd(a, start, start + b.length - 1, depth - 1, hooks);
    }
    if (b.length > 0) start += b.length;
  }
}

export function radixSortMsdDec(arr: readonly number[], hooks: RadixMsdHooks = {}): number[] {
  const a = [...arr];
  if (a.length <= 1) return a;
  const max = Math.max(...a);
  // 最高位索引（个位=0）。max=0 时只有个位，maxDepth=0。
  const maxDepth = max === 0 ? 0 : Math.floor(Math.log10(max));
  msd(a, 0, a.length - 1, maxDepth, hooks);
  return a;
}
