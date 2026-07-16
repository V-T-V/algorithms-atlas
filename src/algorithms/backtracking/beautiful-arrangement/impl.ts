// =============================================================================
// 优美排列（Beautiful Arrangement）· 纯算法实现
// 回溯逐位置填数，满足整除约束。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface BeautifulArrangementHooks {
  /** 在位置 pos 放入数字 value。 */
  onPlace?: (pos: number, value: number, arrangement: number[]) => void;
  /** 在位置 pos 尝试 value 但不满足约束。 */
  onReject?: (pos: number, value: number) => void;
  /** 回溯：移除位置 pos 的数。 */
  onBacktrack?: (pos: number, value: number, arrangement: number[]) => void;
  /** 找到一个优美排列。 */
  onArrangement?: (arr: number[]) => void;
}

/**
 * 统计 1..n 的优美排列总数。
 *
 * @param n 上界
 * @param hooks 可选事件钩子
 * @returns 优美排列数量
 */
export function beautifulArrangement(n: number, hooks: BeautifulArrangementHooks = {}): number {
  if (n <= 0) return 0;
  const arr: number[] = new Array<number>(n).fill(0);
  const used: boolean[] = new Array<boolean>(n + 1).fill(false);
  let count = 0;

  const backtrack = (pos: number): void => {
    if (pos > n) {
      count++;
      hooks.onArrangement?.([...arr]);
      return;
    }
    for (let v = 1; v <= n; v++) {
      if (used[v]) continue;
      // 约束：v % pos === 0 或 pos % v === 0
      if (v % pos !== 0 && pos % v !== 0) {
        hooks.onReject?.(pos, v);
        continue;
      }
      arr[pos - 1] = v;
      used[v] = true;
      hooks.onPlace?.(pos, v, [...arr]);
      backtrack(pos + 1);
      arr[pos - 1] = 0;
      used[v] = false;
      hooks.onBacktrack?.(pos, v, [...arr]);
    }
  };

  backtrack(1);
  return count;
}

/** 优美排列的已知解数表（n=1..15）。 */
export const BEAUTIFUL_COUNT: ReadonlyArray<number> = [
  0, 1, 2, 3, 8, 10, 36, 41, 132, 250, 700, 750, 4010, 4237, 10680,
];
