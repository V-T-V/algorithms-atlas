// =============================================================================
// Android 解锁模式枚举 · 纯算法实现
// skip[i][j] = 从 i 到 j 必须经过的中间点（0 表示无）。回溯枚举长度恰为 L 的所有序列。
// =============================================================================
export interface BtAndroidUnlockHooks {
  onVisit?: (point: number, path: number[]) => void;
  onPattern?: (path: number[]) => void;
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

export function btAndroidUnlock(length: number, hooks: BtAndroidUnlockHooks = {}): number[][] {
  const skip = buildSkip();
  const visited = new Array<boolean>(10).fill(false);
  const result: number[][] = [];

  const dfs = (cur: number, path: number[]): void => {
    if (path.length === length) {
      const snap = [...path];
      result.push(snap);
      hooks.onPattern?.(snap);
      return;
    }
    for (let next = 1; next <= 9; next++) {
      if (visited[next]) continue;
      const mid = skip[cur]![next]!;
      if (mid !== 0 && !visited[mid]) continue;
      visited[next] = true;
      hooks.onVisit?.(next, [...path, next]);
      dfs(next, [...path, next]);
      visited[next] = false;
    }
  };

  for (let start = 1; start <= 9; start++) {
    visited[start] = true;
    dfs(start, [start]);
    visited[start] = false;
  }
  return result;
}
