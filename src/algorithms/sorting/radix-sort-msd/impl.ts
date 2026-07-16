// =============================================================================
// MSD 基数排序（MSD Radix Sort）· 纯算法实现
// 从最高位起，按十进制位（基数 10）分桶后递归。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MsdRadixHooks {
  /** 在数组 [lo, hi) 子段上处理第 digit 位（digit=0 为个位）。 */
  onEnterRange?: (digit: number, lo: number, hi: number) => void;
  /** 元素 value 被分配到桶 d。 */
  onDistribute?: (digit: number, value: number, d: number) => void;
  /** 把各桶回写到 [lo, hi)（已按当前位分组）。 */
  onCollect?: (digit: number, lo: number, hi: number) => void;
  /** 子段 [lo, hi) 完成排序。 */
  onDone?: (lo: number, hi: number) => void;
}

/** 返回 value 在第 digit 位（0=个位）上的十进制数字，超出最高位返回 0。 */
export function digitAt(value: number, digit: number): number {
  return Math.floor(value / Math.pow(10, digit)) % 10;
}

/**
 * MSD 基数排序：对非负整数数组从最高位起分桶递归。
 * 时间 O(d·(n+b))（d=位数，b=基数 10），空间 O(n+b)，稳定。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function msdRadixSort(arr: readonly number[], hooks: MsdRadixHooks = {}): number[] {
  const a = [...arr];
  if (a.length <= 1) return a;
  const maxVal = a.reduce((m, v) => (v > m ? v : m), 0);
  const maxDigit = maxVal <= 0 ? 0 : Math.floor(Math.log10(maxVal));
  sortRange(a, 0, a.length, maxDigit, hooks);
  return a;
}

const BASE = 10;

/** 对子段 a[lo, hi) 处理第 digit 位（含更低位的递归）。 */
function sortRange(a: number[], lo: number, hi: number, digit: number, hooks: MsdRadixHooks): void {
  if (hi - lo <= 1 || digit < 0) {
    hooks.onDone?.(lo, hi);
    return;
  }
  hooks.onEnterRange?.(digit, lo, hi);

  // 1. 统计每个桶（数字 0..9）的大小
  const size = new Array<number>(BASE).fill(0);
  for (let i = lo; i < hi; i++) {
    const d = digitAt(a[i]!, digit);
    size[d]!++;
    hooks.onDistribute?.(digit, a[i]!, d);
  }

  // 2. 求每个桶在 buf 中的起始偏移
  const off: number[] = [0];
  for (let d = 0; d < BASE; d++) off.push(off[d]! + size[d]!);

  // 3. 稳定分配到 buf
  const buf: number[] = new Array(hi - lo);
  const cursor = [...off];
  for (let i = lo; i < hi; i++) {
    const d = digitAt(a[i]!, digit);
    buf[cursor[d]!++] = a[i]!;
  }

  // 4. 回写到原数组
  for (let k = 0; k < buf.length; k++) a[lo + k] = buf[k]!;
  hooks.onCollect?.(digit, lo, hi);

  // 5. 对每个非空桶递归处理下一位
  for (let d = 0; d < BASE; d++) {
    const bucketLo = lo + off[d]!;
    const bucketHi = lo + off[d + 1]!;
    if (bucketHi - bucketLo > 1) sortRange(a, bucketLo, bucketHi, digit - 1, hooks);
  }
  hooks.onDone?.(lo, hi);
}
