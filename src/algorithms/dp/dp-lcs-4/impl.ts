// =============================================================================
// LCS（滚动数组）· 纯算法实现
// =============================================================================
export interface LcsHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onMatch?: (i: number, j: number) => void;
  onDone?: (len: number) => void;
}

export function lengthOfLCS(
  a: readonly string[],
  b: readonly string[],
  hooks: LcsHooks = {},
): number {
  const n = a.length,
    m = b.length;
  if (n === 0 || m === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  let prev = new Array<number>(m + 1).fill(0);
  let cur = new Array<number>(m + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        cur[j] = prev[j - 1]! + 1;
        hooks.onMatch?.(i, j);
      } else {
        cur[j] = Math.max(prev[j]!, cur[j - 1]!);
      }
      hooks.onCell?.(i, j, cur[j]!);
    }
    [prev, cur] = [cur, prev];
    cur.fill(0);
  }
  hooks.onDone?.(prev[m]!);
  return prev[m]!;
}
