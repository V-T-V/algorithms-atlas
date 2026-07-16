// =============================================================================
// 象棋残局（将杀最短步数）· 纯算法实现
// 抽象为「攻击方目标值」模型：用一个一维追逐问题演示 mate-in-N。
// 状态：攻击者位置 aP、防守王位置 dP、棋盘大小 n。
// 动作：攻击者/防守王各移动到相邻格，攻击者追到防守王位置即"将杀"。
// 求攻击者最少步数（双方都最优：攻击最小化步数、防守最大化步数）。
// =============================================================================
export interface GameChessEndgameHooks {
  onMove?: (attacker: number, defender: number, step: number) => void;
  onMemo?: (state: string, distance: number) => void;
}

export interface EndgameResult {
  /** 攻击方将杀所需最少步数；-1 表示在深度限制内无法将杀。 */
  mateIn: number;
}

export function gameChessEndgame(
  size: number,
  attackerStart: number,
  defenderStart: number,
  maxDepth = 2 * size,
  hooks: GameChessEndgameHooks = {},
): EndgameResult {
  const neighbors = (pos: number): number[] => {
    const r = Math.floor(pos / size);
    const c = pos % size;
    const out: number[] = [];
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as Array<[number, number]>) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) out.push(nr * size + nc);
    }
    return out;
  };

  const memo = new Map<string, number>();

  // turn=0 攻击方（最小化到将杀的步数），turn=1 防守方（最大化）
  // 返回从该状态到将杀的步数（攻击方视角），Infinity 表示无法将杀
  const solve = (aP: number, dP: number, turn: 0 | 1, depth: number): number => {
    if (aP === dP) return 0; // 已将杀
    if (depth > maxDepth) return Infinity; // 超出深度视为无法将杀
    const key = `${aP},${dP},${turn},${depth}`;
    if (memo.has(key)) return memo.get(key)!;

    if (turn === 0) {
      // 攻击方移动一步
      let best = Infinity;
      for (const next of neighbors(aP)) {
        hooks.onMove?.(next, dP, 0);
        const sub = solve(next, dP, 1, depth + 1);
        if (sub !== Infinity) best = Math.min(best, 1 + sub);
      }
      memo.set(key, best);
      hooks.onMemo?.(key, best);
      return best;
    } else {
      // 防守方移动一步，最大化（无法移动视为已被将杀）
      let best = -Infinity;
      const opts = neighbors(dP).filter((p) => p !== aP);
      if (opts.length === 0) {
        // 无路可走：僵局视为无法将杀
        memo.set(key, Infinity);
        return Infinity;
      }
      for (const next of opts) {
        const sub = solve(aP, next, 0, depth + 1);
        if (sub !== Infinity) best = Math.max(best, 1 + sub);
      }
      const result = best === -Infinity ? Infinity : best;
      memo.set(key, result);
      return result;
    }
  };

  // 用深度限制：若结果超过 maxDepth，视为 -1
  const dist = solve(attackerStart, defenderStart, 0, 0);
  const mateIn = dist === Infinity || dist > maxDepth ? -1 : dist;
  return { mateIn };
}
