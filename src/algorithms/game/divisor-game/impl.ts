// =============================================================================
// 除数博弈（Divisor Game）· 纯算法实现
// DP：dp[i] = 当前玩家面对 i 是否必胜。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface DivisorGameHooks {
  /** 计算状态 i 的胜负（true 当前玩家必胜）。 */
  onState?: (i: number, wins: boolean, winningMove: number) => void;
  /** 给出结论。 */
  onConclude?: (n: number, aliceWins: boolean) => void;
}

export interface DivisorGameResult {
  /** 初始 N。 */
  n: number;
  /** Alice 是否必胜。 */
  aliceWins: boolean;
  /** dp[1..n]，true 表示当前玩家必胜。 */
  dp: boolean[];
  /** Alice 的第一步必胜取法（N 减去的 x）。无解为 0。 */
  firstMove: number;
}

/** 枚举 i 的所有真因数（升序）。 */
function properDivisors(i: number): number[] {
  const divs: number[] = [];
  for (let x = 1; x < i; x++) {
    if (i % x === 0) divs.push(x);
  }
  return divs;
}

/**
 * 除数博弈：判断 Alice 先手面对 N 是否必胜。
 *
 * @param n 初始数字 N
 * @param hooks 可选事件钩子
 */
export function divisorGame(n: number, hooks: DivisorGameHooks = {}): DivisorGameResult {
  if (n <= 0) return { n, aliceWins: false, dp: [], firstMove: 0 };
  // dp[1]=false（面对 1 无棋可走必败）
  const dp: boolean[] = new Array<boolean>(n + 1).fill(false);
  const move: number[] = new Array<number>(n + 1).fill(0);
  dp[1] = false;
  for (let i = 2; i <= n; i++) {
    for (const x of properDivisors(i)) {
      if (!dp[i - x]!) {
        dp[i] = true;
        move[i] = x;
        break;
      }
    }
    hooks.onState?.(i, dp[i]!, move[i]!);
  }
  hooks.onConclude?.(n, dp[n]!);
  return { n, aliceWins: dp[n]!, dp, firstMove: move[n]! };
}
