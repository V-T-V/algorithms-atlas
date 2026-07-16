// =============================================================================
// 全排列 II（Permutations II）· 纯算法实现
// 含重复元素数组，生成所有不重复全排列。
// 关键：排序 + used 标记 + 同层剪枝。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface Permutations2Hooks {
  /** 选取下标 i 的元素填入当前位置。 */
  onPick?: (index: number, value: number, perm: number[]) => void;
  /** 同层剪枝：跳过重复元素。 */
  onPrune?: (index: number, value: number) => void;
  /** 回溯：撤销对下标 index 元素的选择。 */
  onBacktrack?: (index: number, value: number, perm: number[]) => void;
  /** 找到一个完整排列。 */
  onPermutation?: (perm: number[]) => void;
}

/**
 * 生成含重复元素数组的所有不重复全排列。
 *
 * @param arr 源数组（会被克隆）
 * @param hooks 可选事件钩子
 * @returns 所有不重复全排列
 */
export function permutations2(arr: readonly number[], hooks: Permutations2Hooks = {}): number[][] {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const result: number[][] = [];
  const perm: number[] = [];
  const used: boolean[] = new Array<boolean>(n).fill(false);

  const backtrack = (): void => {
    if (perm.length === n) {
      const snap = [...perm];
      result.push(snap);
      hooks.onPermutation?.(snap);
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      // 同层剪枝：当前元素与前一个相同，且前一个在本层未使用
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]!) {
        hooks.onPrune?.(i, sorted[i]!);
        continue;
      }
      used[i] = true;
      perm.push(sorted[i]!);
      hooks.onPick?.(i, sorted[i]!, [...perm]);
      backtrack();
      perm.pop();
      used[i] = false;
      hooks.onBacktrack?.(i, sorted[i]!, [...perm]);
    }
  };

  backtrack();
  return result;
}

/** 计算含重复元素数组的去重全排列数：n! / Π(每个值的出现次数!) */
export function countUniquePermutations(arr: readonly number[]): number {
  const n = arr.length;
  const counter = new Map<number, number>();
  for (const x of arr) counter.set(x, (counter.get(x) ?? 0) + 1);
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  for (const c of counter.values()) {
    for (let k = 2; k <= c; k++) r = Math.floor(r / k);
  }
  return r;
}
