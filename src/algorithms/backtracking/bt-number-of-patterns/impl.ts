// =============================================================================
// 解锁模式数 · 纯算法实现 (LeetCode 351)
// skip[i][j] = 从 i 到 j 必须经过的中间点（0 表示无）。回溯计数。
// =============================================================================
export interface BtNumberOfPatternsHooks {
  onVisit?: (point: number, path: number[]) => void;
  onCount?: (length: number, count: number) => void;
}

function buildSkip(): number[][] {
  const skip: number[][] = Array.from({ length: 10 }, () => new Array<number>(10).fill(0));
  const set = (i: number, j: number, v: number): void => {
    skip[i]![j]! = v;
    skip[j]![i]! = v;
  };
  set(1, 3, 2);
  set(1, 7, 4);
  set(3, 9, 6);
  set(7, 9, 8);
  set(1, 9, 5);
  set(3, 7, 5);
  set(2, 8, 5);
  set(4, 6, 5);
  return skip;
}

export function btNumberOfPatterns(
  m: number,
  n: number,
  hooks: BtNumberOfPatternsHooks = {},
): number {
  const skip = buildSkip();
  const visited = new Array<boolean>(10).fill(false);
  const counts = new Array<number>(n + 2).fill(0);

  const dfs = (cur: number, len: number, path: number[]): void => {
    if (len > n) return;
    if (len >= m) {
      counts[len]!++;
      hooks.onCount?.(len, counts[len]!);
    }
    for (let next = 1; next <= 9; next++) {
      if (visited[next]) continue;
      const mid = skip[cur]![next]!;
      if (mid !== 0 && !visited[mid]) continue;
      visited[next] = true;
      hooks.onVisit?.(next, [...path, next]);
      dfs(next, len + 1, [...path, next]);
      visited[next] = false;
    }
  };

  // 起点 1/3/7/9 对称，2/4/6/8 对称，5 单独
  const starts: Array<[number, number]> = [
    [1, 4],
    [2, 4],
    [5, 1],
  ];
  let total = 0;
  for (const [start, mult] of starts) {
    visited[start] = true;
    const before = counts.reduce((a, b) => a + b, 0);
    dfs(start, 1, [start]);
    const after = counts.reduce((a, b) => a + b, 0);
    total += (after - before) * mult;
    visited[start] = false;
  }

  return total;
}
