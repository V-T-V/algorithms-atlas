// =============================================================================
// 取硬币博弈（Coin-Change Game）· 纯算法实现
// n 枚硬币，每次取 1..m，取最后一枚者胜。用 SG 值（mex）判定并给出取法。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface CoinChangeGameHooks {
  /** 计算某状态（剩余硬币数）的 SG 值。 */
  onSG?: (coins: number, sg: number) => void;
  /** 给出胜负判定。 */
  onConclude?: (firstWins: boolean, n: number, m: number) => void;
  /** 给出必胜取法（取走数量）。firstWins=false 时为 0。 */
  onWinningMove?: (take: number) => void;
}

export interface CoinGameResult {
  /** 剩余硬币数。 */
  n: number;
  /** 每次最多取的数量。 */
  m: number;
  /** 先手是否必胜。 */
  firstWins: boolean;
  /** 必胜取法（取走硬币数）。 */
  winningMove: number;
  /** 每个状态的 SG 值（sg[i] = SG(i)）。 */
  sg: number[];
}

/**
 * 取硬币博弈分析：用 SG 值（mex）判定先手胜负并给出取法。
 *
 * @param n 初始硬币数
 * @param m 每次最多取的数量（1..m）
 * @param hooks 可选事件钩子
 */
export function coinChangeGame(
  n: number,
  m: number,
  hooks: CoinChangeGameHooks = {},
): CoinGameResult {
  // sg[i] = mex{ sg[i-k] | 1<=k<=min(m,i) }，sg[0]=0
  const sg: number[] = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const seen = new Set<number>();
    for (let k = 1; k <= Math.min(m, i); k++) {
      seen.add(sg[i - k]!);
    }
    // mex
    let v = 0;
    while (seen.has(v)) v++;
    sg[i] = v;
    hooks.onSG?.(i, v);
  }

  const firstWins = sg[n]! !== 0;
  hooks.onConclude?.(firstWins, n, m);

  // 必胜取法：找到 k 使 sg[n-k]=0
  let winningMove = 0;
  if (firstWins) {
    for (let k = 1; k <= Math.min(m, n); k++) {
      if (sg[n - k]! === 0) {
        winningMove = k;
        break;
      }
    }
    hooks.onWinningMove?.(winningMove);
  }

  return { n, m, firstWins, winningMove, sg };
}
