// 模式数据库 · 实现

export interface PdbHooks {
  onEntry?: (pattern: string, distance: number) => void;
  onQuery?: (pattern: string, distance: number) => void;
}

/**
 * 为一组「关键位置」构建模式数据库。
 * @param n 棋盘边长（n×n）
 * @param keyTiles 关键子的值（如 [1,2]）
 * @param goal 目标排列（长度 n*n）
 * BFS 只考虑关键子的移动，空白可任意走，非关键子视为「不区分的可移动块」。
 */
export function buildPatternDatabase(
  n: number,
  keyTiles: number[],
  goal: number[],
  hooks: PdbHooks = {},
): Map<string, number> {
  const db = new Map<string, number>();
  // 把状态归约为「模式」：关键子保留原值，其它归为 -1，空白归为 0
  const toPattern = (state: number[]): string => {
    const set = new Set(keyTiles);
    return state.map((v) => (set.has(v) ? v : v === 0 ? 0 : -1)).join(',');
  };
  const start = toPattern(goal);
  db.set(start, 0);
  const queue: Array<{ state: number[]; dist: number }> = [{ state: [...goal], dist: 0 }];
  while (queue.length > 0) {
    const { state, dist } = queue.shift()!;
    const blank = state.indexOf(0);
    const br = Math.floor(blank / n);
    const bc = blank % n;
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as const) {
      const nr = br + dr;
      const nc = bc + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
      const ni = nr * n + nc;
      const next = [...state];
      const t1 = next[blank]!;
      next[blank] = next[ni]!;
      next[ni] = t1;
      const pat = toPattern(next);
      if (!db.has(pat)) {
        const nd = dist + 1;
        db.set(pat, nd);
        hooks.onEntry?.(pat, nd);
        queue.push({ state: next, dist: nd });
      }
    }
  }
  return db;
}

/** 查询某状态的模式距离。 */
export function queryPdb(
  db: Map<string, number>,
  state: number[],
  keyTiles: number[],
  hooks: PdbHooks = {},
): number {
  const set = new Set(keyTiles);
  const pat = state.map((v) => (set.has(v) ? v : v === 0 ? 0 : -1)).join(',');
  const d = db.get(pat) ?? Infinity;
  hooks.onQuery?.(pat, d);
  return d;
}
