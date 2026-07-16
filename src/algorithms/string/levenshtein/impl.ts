// =============================================================================
// 莱文斯坦距离 Levenshtein Distance · 纯算法实现
// 编辑距离 DP，支持回溯得到具体编辑操作序列。零 DOM 依赖，可独立单测。
// 通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 编辑操作类型。 */
export type EditOp = 'match' | 'replace' | 'insert' | 'delete';

/** 一次回溯得到的编辑操作（对 a 而言）。 */
export interface EditStep {
  op: EditOp;
  /** op 为 match/replace/delete 时：a 中的字符索引；insert 时为 -1。 */
  i: number;
  /** op 为 match/replace/insert 时：b 中的字符索引；delete 时为 -1。 */
  j: number;
  /** 涉及的字符（便于展示）。 */
  aChar?: string;
  bChar?: string;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LevenshteinHooks {
  /** 开始计算单元 (i, j)。 */
  onCell?: (i: number, j: number) => void;
  /** 单元 (i, j) 的值已确定为 value，来源 from（'diag'|'left'|'top'）。 */
  onSet?: (i: number, j: number, value: number, from: 'diag' | 'left' | 'top') => void;
  /** DP 表填完。 */
  onTable?: (dp: number[][]) => void;
  /** 距离确定，附带编辑路径。 */
  onDone?: (distance: number, path: EditStep[]) => void;
}

/**
 * 莱文斯坦距离：把字符串 `a` 编辑成 `b` 所需的最少**单字符编辑**次数
 * （插入 / 删除 / 替换，每次代价 1）。
 *
 * DP：`dp[i][j]` = `a[0..i)` 与 `b[0..j)` 的编辑距离。\n
 *   - `dp[0][j] = j`，`dp[i][0] = i`（全插入 / 全删除）\n
 *   - 若 `a[i−1] === b[j−1]`：`dp[i][j] = dp[i−1][j−1]`（无需编辑）\n
 *   - 否则：`dp[i][j] = 1 + min(dp[i−1][j−1], dp[i][j−1], dp[i−1][j])`\n
 *     分别对应 替换 / 插入 / 删除。\n
 *
 * 复杂度 `O(|a|·|b|)` 时间与空间。本实现保留整张表以便回溯。\n
 *
 * @returns 莱文斯坦距离
 */
export function levenshtein(a: string, b: string, hooks: LevenshteinHooks = {}): number {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = 0; i <= n; i++) {
    dp[i]![0] = i;
    hooks.onSet?.(i, 0, i, 'top');
  }
  for (let j = 0; j <= m; j++) {
    dp[0]![j] = j;
    hooks.onSet?.(0, j, j, 'left');
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      hooks.onCell?.(i, j);
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      if (cost === 0) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
        hooks.onSet?.(i, j, dp[i]![j]!, 'diag');
      } else {
        const diag = dp[i - 1]![j - 1]!; // 替换
        const left = dp[i]![j - 1]!; // 插入
        const top = dp[i - 1]![j]!; // 删除
        const min = Math.min(diag, left, top);
        dp[i]![j] = 1 + min;
        const from: 'diag' | 'left' | 'top' = min === diag ? 'diag' : min === left ? 'left' : 'top';
        hooks.onSet?.(i, j, dp[i]![j]!, from);
      }
    }
  }
  hooks.onTable?.(dp);

  const path = backtrack(a, b, dp);
  hooks.onDone?.(dp[n]![m]!, path);
  return dp[n]![m]!;
}

/**
 * 由填好的 DP 表回溯一条最优编辑路径（从右下角走到左上角，遇到相等优先走对角）。
 */
export function backtrack(a: string, b: string, dp: number[][]): EditStep[] {
  const steps: EditStep[] = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      steps.push({ op: 'match', i: i - 1, j: j - 1, aChar: a[i - 1], bChar: b[j - 1] });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i]![j] === dp[i - 1]![j - 1]! + 1) {
      steps.push({ op: 'replace', i: i - 1, j: j - 1, aChar: a[i - 1], bChar: b[j - 1] });
      i--;
      j--;
    } else if (j > 0 && dp[i]![j] === dp[i]![j - 1]! + 1) {
      steps.push({ op: 'insert', i: -1, j: j - 1, bChar: b[j - 1] });
      j--;
    } else {
      // i > 0 && dp[i][j] === dp[i-1][j] + 1
      steps.push({ op: 'delete', i: i - 1, j: -1, aChar: a[i - 1] });
      i--;
    }
  }
  steps.reverse();
  return steps;
}

/**
 * 滚动数组版：只用两行求距离，空间 `O(min(|a|,|b|))`。不回溯。
 */
export function levenshteinRolling(a: string, b: string): number {
  // 让 b 为较短者以省空间
  if (a.length < b.length) [a, b] = [b, a];
  const m = b.length;
  let prev = new Array<number>(m + 1);
  let cur = new Array<number>(m + 1);
  for (let j = 0; j <= m; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[m]!;
}
