// =============================================================================
// 排列排序（Permutation Sort）· 纯算法实现
// 字典序枚举全排列，找到第一个有序者。确定性。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PermutationSortHooks {
  /** 尝试了一个候选排列 attempt（第 t 个，从 1 开始）。 */
  onAttempt?: (attempt: number[], t: number) => void;
  /** 该排列是否有序。 */
  onCheck?: (sorted: boolean) => void;
  /** 生成下一个字典序排列（返回是否还有下一个）。 */
  onAdvance?: (hasNext: boolean) => void;
}

/** 判断数组是否非降序。 */
function isSorted(a: readonly number[]): boolean {
  for (let i = 1; i < a.length; i++) if (a[i - 1]! > a[i]!) return false;
  return true;
}

/**
 * 字典序下一个排列（原地）。返回 false 表示已是最后一个（整体逆序）。
 * 算法：std::next_permutation 的标准实现。
 */
function nextPermutation(a: number[]): boolean {
  const n = a.length;
  let i = n - 2;
  while (i >= 0 && a[i]! >= a[i + 1]!) i--;
  if (i < 0) return false;
  let j = n - 1;
  while (a[j]! <= a[i]!) j--;
  const t = a[i]!;
  a[i] = a[j]!;
  a[j] = t;
  // 反转 i+1..n-1
  let l = i + 1;
  let r = n - 1;
  while (l < r) {
    const tmp = a[l]!;
    a[l] = a[r]!;
    a[r] = tmp;
    l++;
    r--;
  }
  return true;
}

/**
 * 排列排序：字典序枚举排列直到有序。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 * @param maxAttempts 安全上限（默认 1e6），避免演示卡死
 */
export function permutationSort(
  arr: readonly number[],
  hooks: PermutationSortHooks = {},
  maxAttempts = 1_000_000,
): number[] {
  const n = arr.length;
  if (n <= 1) return [...arr];
  // 从升序开始枚举，第一个有序的排列就是升序本身
  const a = [...arr].sort((x, y) => x - y);
  // 但演示要展示「穷举」过程：从原始输入开始枚举更直观
  const cur = [...arr];
  let t = 1;
  hooks.onAttempt?.([...cur], t);
  if (isSorted(cur)) {
    hooks.onCheck?.(true);
    return cur;
  }
  hooks.onCheck?.(false);
  while (t < maxAttempts) {
    const hasNext = nextPermutation(cur);
    hooks.onAdvance?.(hasNext);
    if (!hasNext) {
      // 已是最后一个排列，绕回到字典序最小（升序），它必定有序
      cur.splice(0, cur.length, ...a);
    }
    t++;
    hooks.onAttempt?.([...cur], t);
    if (isSorted(cur)) {
      hooks.onCheck?.(true);
      return cur;
    }
    hooks.onCheck?.(false);
  }
  // 兜底：返回升序
  return a;
}
