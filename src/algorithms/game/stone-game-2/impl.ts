// =============================================================================
// 石子游戏 II（Stone Game II, LeetCode 1140）· 纯算法实现
// 记忆化搜索：f(i,M) = 当前玩家从 i 起、M 值下的「相对对手优势」。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface StoneGame2Hooks {
  /** 求出某个子问题 (i, M) 的优势值。 */
  onSolve?: (i: number, m: number, advantage: number) => void;
  /** 结论：Alice 的石子数。 */
  onConclude?: (aliceStones: number) => void;
}

export interface StoneGame2Result {
  /** Alice 能拿到的最多石子数。 */
  aliceStones: number;
  /** 总石子数。 */
  total: number;
  /** f(0,1) 的优势值。 */
  advantage: number;
}

/**
 * 石子游戏 II：求 Alice 能拿到的最多石子。
 *
 * @param piles 各堆石子数
 * @param hooks 可选事件钩子
 */
export function stoneGame2(
  piles: readonly number[],
  hooks: StoneGame2Hooks = {},
): StoneGame2Result {
  const n = piles.length;
  if (n === 0) return { aliceStones: 0, total: 0, advantage: 0 };

  // 后缀和：suffix[i] = sum(piles[i..n-1])
  const suffix: number[] = new Array<number>(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) suffix[i] = suffix[i + 1]! + piles[i]!;
  const total = suffix[0]!;

  // 记忆化：memo[i][M]，M 上界最大为 n（因为 2M>=n 时一次拿完）
  const memo: Map<string, number> = new Map();

  const solve = (i: number, m: number): number => {
    if (i >= n) return 0;
    // 若剩余可一次性拿完（2M >= 剩余堆数）
    if (2 * m >= n - i) {
      const adv = suffix[i]!; // 拿走全部，对手 0
      hooks.onSolve?.(i, m, adv);
      return adv;
    }
    const key = `${i},${m}`;
    if (memo.has(key)) return memo.get(key)!;

    let best = -Infinity;
    // 枚举 X=1..2M，sum(i..i+X-1) - solve(i+X, max(M,X))
    let taken = 0;
    for (let x = 1; x <= 2 * m; x++) {
      if (i + x > n) break;
      taken += piles[i + x - 1]!;
      const sub = solve(i + x, Math.max(m, x));
      const adv = taken - sub;
      if (adv > best) best = adv;
    }
    memo.set(key, best);
    hooks.onSolve?.(i, m, best);
    return best;
  };

  const advantage = solve(0, 1);
  const aliceStones = (total + advantage) / 2;
  hooks.onConclude?.(aliceStones);
  return { aliceStones, total, advantage };
}
