// =============================================================================
// 3×N 铺砖：2×1 多米诺（横/竖）+ L 型三多米诺。
// 轮廓线 DP：列高 H=3，状态 mask（3 位）表示本列中被上一列伸出的块预填的格子。
// f[mask] 表示当前列的「传入 mask」对应方案数；逐列滚动。
// =============================================================================

export interface Tiling3xNHooks {
  onColumn?: (col: number, dist: number[]) => void;
  onResult?: (ways: number) => void;
}

export interface Tiling3xNResult {
  ways: number;
}

const H = 3; // 行数
const STATES = 1 << H; // 8

/** 给定当前列的「已占用 mask」（来自上一列伸出），递归地用骨牌填满当前列，
 *  产生下一列的「伸出 mask」及方案数（每种 nextMask 累加进 out[nextMask]）。
 *  allowed: 0=只多米诺, 1=多米诺+三多米诺 */
function transitions(allowed: 0 | 1): Array<Record<number, number>> {
  // 对每个入 mask，预生成 nextMask -> 增量
  const result: Array<Record<number, number>> = Array.from({ length: STATES }, () => ({}));
  for (let mask = 0; mask < STATES; mask++) {
    const cur = new Array<boolean>(H).fill(false);
    for (let r = 0; r < H; r++) cur[r] = ((mask >> r) & 1) === 1;
    const next = new Array<boolean>(H).fill(false);
    // 从最低未填行开始 DFS
    const dfs = (r: number): void => {
      // 找第一个未填行
      while (r < H && cur[r]) r++;
      if (r >= H) {
        // 全填满，记录 next mask
        let nm = 0;
        for (let k = 0; k < H; k++) if (next[k]) nm |= 1 << k;
        result[mask]![nm] = (result[mask]![nm] ?? 0) + 1;
        return;
      }
      // 1) 竖放多米诺：占 (r) 当前列 + 伸出到 (r) 下一列
      cur[r] = true;
      next[r] = true;
      dfs(r + 1);
      cur[r] = false;
      next[r] = false;
      // 2) 横放多米诺：占 (r, r+1) 当前列两格
      if (r + 1 < H && !cur[r + 1]) {
        cur[r] = true;
        cur[r + 1] = true;
        dfs(r + 1);
        cur[r] = false;
        cur[r + 1] = false;
      }
      if (allowed === 1) {
        // 3) L 型三多米诺：4 种朝向
        //   a) 占 (r, r+1) 当前列 + 伸出 (r) 下一列（前提 r+1<H 且 r+1 当前空）
        if (r + 1 < H && !cur[r + 1]) {
          cur[r] = true;
          cur[r + 1] = true;
          next[r] = true;
          dfs(r + 1);
          cur[r] = false;
          cur[r + 1] = false;
          next[r] = false;
          //   b) 占 (r, r+1) 当前列 + 伸出 (r+1) 下一列
          cur[r] = true;
          cur[r + 1] = true;
          next[r + 1] = true;
          dfs(r + 1);
          cur[r] = false;
          cur[r + 1] = false;
          next[r + 1] = false;
        }
        //   c) 占 (r) 当前列 + 伸出 (r, r+1) 下一列
        if (r + 1 < H && !cur[r + 1]) {
          cur[r] = true;
          next[r] = true;
          next[r + 1] = true;
          dfs(r + 1);
          cur[r] = false;
          next[r] = false;
          next[r + 1] = false;
          //   d) 占 (r+1) 当前列 + 伸出 (r, r+1) 下一列
          cur[r + 1] = true;
          next[r] = true;
          next[r + 1] = true;
          dfs(r + 1);
          cur[r + 1] = false;
          next[r] = false;
          next[r + 1] = false;
        }
      }
    };
    dfs(0);
  }
  return result;
}

export function tiling3xN(
  n: number,
  options: { tromino?: boolean } = {},
  hooks: Tiling3xNHooks = {},
): Tiling3xNResult {
  if (n <= 0) {
    hooks.onResult?.(0);
    return { ways: 0 };
  }
  const allowed: 0 | 1 = options.tromino === false ? 0 : 1;
  const trans = transitions(allowed);

  let f = new Array<number>(STATES).fill(0);
  f[0] = 1; // 第 0 列传入 mask=0（无预填）

  for (let col = 0; col < n; col++) {
    const nf = new Array<number>(STATES).fill(0);
    for (let mask = 0; mask < STATES; mask++) {
      const cnt = f[mask]!;
      if (cnt === 0) continue;
      const moves = trans[mask]!;
      for (const key in moves) {
        const nm = Number(key);
        nf[nm] = (nf[nm] ?? 0) + cnt * (moves[nm] ?? 0);
      }
    }
    f = nf;
    hooks.onColumn?.(col, f);
  }

  const ways = f[0]!;
  hooks.onResult?.(ways);
  return { ways };
}
