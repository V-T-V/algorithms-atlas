// =============================================================================
// 重力排序（Gravity Sort / Bead Sort 矩阵实现）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GravitySortHooks {
  /** 矩阵构建完成，给出位矩阵（行=原始元素，列=珠位）。 */
  onMatrix?: (matrix: number[][]) => void;
  /** 重力下落完成，给出每列的珠子总数（从下往上累加）。 */
  onColumns?: (columnCounts: number[]) => void;
  /** 重建完成，给出排序后的数组。 */
  onRebuilt?: (sorted: number[]) => void;
}

/**
 * 重力排序：模拟珠子受重力下落。
 *
 * 实现：对每个数 v，置位矩阵对应行的前 v 列；对每列求和得到「该列有多少颗珠子」；
 * 然后第 i（从底部数）行重建为「列高 ≥ i 的列数」，即第 i 个最大值。
 *
 * @param arr 非负整数数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 * @returns 升序排列的结果
 */
export function gravitySort(arr: readonly number[], hooks: GravitySortHooks = {}): number[] {
  const n = arr.length;
  if (n <= 1) return [...arr];

  for (const v of arr) {
    if (!Number.isInteger(v) || v < 0) {
      throw new RangeError(`gravitySort 仅支持非负整数，收到 ${v}`);
    }
  }

  let max = 0;
  for (const v of arr) if (v > max) max = v;
  if (max === 0) return new Array<number>(n).fill(0);

  // 位矩阵：matrix[i][j] = 1 表示元素 i 在第 j 列有珠子
  const matrix: number[][] = arr.map((v) => {
    const row = new Array<number>(max).fill(0);
    for (let j = 0; j < v; j++) row[j] = 1;
    return row;
  });
  hooks.onMatrix?.(matrix);

  // 每列珠子总数
  const colCounts = new Array<number>(max).fill(0);
  for (let j = 0; j < max; j++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += matrix[i]![j]!;
    colCounts[j] = s;
  }
  hooks.onColumns?.(colCounts);

  // 重建：第 k 个（从底向上）升序元素 = 列高 >= (n - k) 的列数... 不对。
  // 正确：升序结果第 r 位（r=0 最小）= 列数中，珠子总数 > (n-1-r) 的列数。
  // 等价于：结果 i 的值 = sum_j [colCounts[j] >= (n - i)]
  const sorted = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    // sorted[i]（升序第 i 小）= 满足 colCounts[j] > (n-1-i) 的列数
    const threshold = n - 1 - i;
    let cnt = 0;
    for (let j = 0; j < max; j++) if (colCounts[j]! > threshold) cnt++;
    sorted[i] = cnt;
  }
  hooks.onRebuilt?.(sorted);
  return sorted;
}
