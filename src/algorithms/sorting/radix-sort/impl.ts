// =============================================================================
// 基数排序 Radix Sort (LSD) · 纯算法实现（非比较）
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 仅处理非负整数；按十进制位从低位到高位（LSD）逐位做稳定计数排序。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RadixSortHooks {
  /** 进入某一位（digit=0 为个位，1 为十位 …）的稳定排序。 */
  onDigit?: (digit: number, divisor: number) => void;
  /** 取输入下标 i 的值 v 的当前位 d（用于「分配」）。 */
  onDistribute?: (i: number, v: number, d: number) => void;
  /** 一位计数完成、即将做前缀和收集。count 为 10 桶计数。 */
  onBucket?: (count: number[]) => void;
  /** 把值 v 从输入下标 i 收集到输出下标 outIdx。 */
  onCollect?: (i: number, v: number, outIdx: number, output: number[]) => void;
}

/**
 * 基数排序（LSD，最低位优先；非比较、稳定）。
 * 对非负整数，从最低位（个位）起，逐位用稳定的*计数排序*把元素分配到 0~9 桶并按序收集，
 * 直到所有数的最高位都处理完毕。
 * @param arr 待排序数组（克隆后只读，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function radixSort(arr: readonly number[], hooks: RadixSortHooks = {}): number[] {
  let a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  // 找最大值，确定要处理多少位
  let maxVal = a[0]!;
  for (let i = 1; i < n; i++) if (a[i]! > maxVal) maxVal = a[i]!;

  const BASE = 10;
  for (let divisor = 1; Math.floor(maxVal / divisor) > 0; divisor *= BASE) {
    const digit = Math.round(Math.log(divisor) / Math.log(BASE));
    hooks.onDigit?.(digit, divisor);

    // —— 计数（分配到桶）——
    const count = new Array<number>(BASE).fill(0);
    for (let i = 0; i < n; i++) {
      const v = a[i]!;
      const d = Math.floor(v / divisor) % BASE;
      count[d]!++;
      hooks.onDistribute?.(i, v, d);
    }

    // —— 前缀和 ——
    for (let d = 1; d < BASE; d++) count[d]! += count[d - 1]!;
    hooks.onBucket?.(count);

    // —— 逆序收集（保证稳定性）——
    const output = new Array<number>(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      const v = a[i]!;
      const d = Math.floor(v / divisor) % BASE;
      count[d]!--;
      const outIdx = count[d]!;
      output[outIdx] = v;
      hooks.onCollect?.(i, v, outIdx, output);
    }
    a = output;
  }
  return a;
}
