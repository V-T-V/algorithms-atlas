// =============================================================================
// 珠算排序 Bead Sort (Gravity Sort) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BeadSortHooks {
  /** 把第 i 个元素的 value 颗「珠子」铺到各列（重力下落）。 */
  onDrop?: (i: number, rowCount: number) => void;
  /** 重力下落后，从矩阵按行读出新值并写回下标 i。 */
  onReadRow?: (i: number, newV: number) => void;
}

/**
 * 珠算排序（Gravity Sort）。
 *
 * 原理：把每个非负整数想象成一排竖直杆上滑落的珠子（数值 = 该行珠子数）；
 * 让所有珠子在重力作用下下落、堆叠到各列底部；随后每一行的珠子数即为排序结果。
 * 仅适用于**非负整数**。
 *
 * - 时间 `O(n·m)`，m 为最大值
 * - 空间 `O(n·m)`（珠子矩阵）
 *
 * @param arr 非负整数数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function beadSort(arr: readonly number[], hooks: BeadSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n === 0) return a;
  // 逐元素校验非负整数（不能只看 max——混合正负时 max>0 但负数会被静默吞掉）
  for (let i = 0; i < n; i++) {
    const v = a[i]!;
    if (!Number.isInteger(v) || v < 0) {
      throw new RangeError(`beadSort: only supports non-negative integers, got ${v} at index ${i}`);
    }
  }
  const max = Math.max(...a);

  // poles[c] = 第 c 列下落后已堆叠的珠子数
  const poles = new Array<number>(max).fill(0);

  // 阶段 1：每个元素把自己的珠子撒到前 value 列（每列珠子 +1）
  for (let i = 0; i < n; i++) {
    const v = a[i]!;
    hooks.onDrop?.(i, v);
    for (let c = 0; c < v; c++) poles[c]! += 1;
  }

  // 阶段 2：行 r 的珠子数 = #{c : poles[c] > r}。
  //        poles 整体随 c 递减未必成立，故线性扫描统计。
  //        最底部（最高堆叠）的行对应最大值，倒序回填以得到升序结果。
  for (let r = 0; r < n; r++) {
    const row = n - 1 - r;
    let cnt = 0;
    for (let c = 0; c < max; c++) if (poles[c]! > r) cnt++;
    a[row] = cnt;
    hooks.onReadRow?.(row, cnt);
  }
  return a;
}
