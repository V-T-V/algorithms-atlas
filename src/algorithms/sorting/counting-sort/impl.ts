// =============================================================================
// 计数排序 Counting Sort · 纯算法实现（非比较）
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 仅处理非负整数（典型用例）；范围 [0, maxVal]。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CountingSortHooks {
  /** 计算得值域上界 maxVal。 */
  onRange?: (maxVal: number) => void;
  /** 扫描输入：累计下标 i 处值 v 的计数（count[v]++）。 */
  onTally?: (i: number, v: number, count: number[]) => void;
  /** 计数累加成前缀和（count[v] 现表示「≤ v 的元素个数」）。 */
  onPrefix?: (count: number[]) => void;
  /** 把输入下标 i 的值 v 放入输出位置 outIdx（收集步骤）。 */
  onCollect?: (i: number, v: number, outIdx: number, output: number[]) => void;
}

/**
 * 计数排序（非比较、稳定）。
 * 适用于值域较小的非负整数：统计每个值的出现次数，做前缀和得到每个值的最终落点，
 * 再逆序扫描输入把元素「分配」到输出，从而保持稳定性。
 * @param arr 待排序数组（克隆后只读，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function countingSort(arr: readonly number[], hooks: CountingSortHooks = {}): number[] {
  const n = arr.length;
  if (n === 0) return [];
  if (n === 1) return [arr[0]!];

  // 1) 找值域上界
  let maxVal = arr[0]!;
  for (let i = 1; i < n; i++) if (arr[i]! > maxVal) maxVal = arr[i]!;
  hooks.onRange?.(maxVal);

  // 2) 计数
  const count = new Array<number>(maxVal + 1).fill(0);
  for (let i = 0; i < n; i++) {
    const v = arr[i]!;
    count[v]!++;
    hooks.onTally?.(i, v, count);
  }

  // 3) 前缀和：count[v] = (≤ v 的元素个数)
  for (let v = 1; v <= maxVal; v++) count[v]! += count[v - 1]!;
  hooks.onPrefix?.(count);

  // 4) 逆序收集（保证稳定性）
  const output = new Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const v = arr[i]!;
    count[v]!--;
    const outIdx = count[v]!;
    output[outIdx] = v;
    hooks.onCollect?.(i, v, outIdx, output);
  }
  return output;
}
