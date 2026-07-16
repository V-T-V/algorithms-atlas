// =============================================================================
// 字符串基数排序（MSD 基数排序）· 纯算法实现
// 从最高位（第 0 位）起，按当前位字符把字符串分桶递归排序。
// MSD 天然处理变长字符串（短串先结束，字典序靠前）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

const R = 257; // 桶数：0=串已结束，1..256=码点+1

/** 字符到桶下标：d 位超出串长返回 0（已结束），否则码点+1。 */
const bucketIndex = (s: string, d: number): number => {
  if (d >= s.length) return 0;
  return s.charCodeAt(d) + 1;
};

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RadixStringSortHooks {
  /** 对区间 [lo, hi) 在第 d 位分桶排序。 */
  onDigit?: (lo: number, hi: number, d: number) => void;
  /** 字符串（原下标 idx）分配到桶 bucket。 */
  onDistribute?: (idx: number, d: number, bucket: number) => void;
  /** 计算完成。 */
  onDone?: (sorted: string[]) => void;
}

/**
 * MSD 基数排序：按字典序升序、稳定。
 *
 * 每层：计数各桶大小 → 前缀和得桶起点 → 分配到 aux → 拷回 → 递归每个非平凡桶到 d+1。
 * 桶 0（串已结束）无需递归。
 * 时间 O(N·L)（L 为最长串长度），空间 O(N+R)。
 *
 * @returns 排序后的新数组（不改原数组）
 */
export function radixStringSort(words: string[], hooks: RadixStringSortHooks = {}): string[] {
  const arr = [...words];
  const aux: string[] = new Array(arr.length);

  const sort = (lo: number, hi: number, d: number): void => {
    if (hi - lo <= 1) return;
    hooks.onDigit?.(lo, hi, d);

    // 计数（count[r] = 桶 r 的大小）
    const count = new Array<number>(R).fill(0);
    for (let i = lo; i < hi; i++) {
      const b = bucketIndex(arr[i]!, d);
      count[b]!++;
      hooks.onDistribute?.(i, d, b);
    }
    // 前缀和 → start[r] = 桶 r 在 [lo,hi) 内的起始偏移
    const start = new Array<number>(R + 1).fill(0);
    for (let r = 0; r < R; r++) start[r + 1] = start[r]! + count[r]!;
    // 分配到 aux（用 pos 跟踪每个桶当前写入位置）
    const pos = [...start];
    for (let i = lo; i < hi; i++) {
      const b = bucketIndex(arr[i]!, d);
      aux[lo + pos[b]!] = arr[i]!;
      pos[b] = pos[b]! + 1;
    }
    // 拷回
    for (let i = lo; i < hi; i++) arr[i] = aux[i]!;
    // 递归：桶 r 占据 arr[lo+start[r] .. lo+start[r+1])；桶 0（串结束）跳过
    for (let r = 1; r < R; r++) {
      const a = lo + start[r]!;
      const b = lo + start[r + 1]!;
      if (b - a > 1) sort(a, b, d + 1);
    }
  };

  sort(0, arr.length, 0);
  hooks.onDone?.(arr);
  return arr;
}
