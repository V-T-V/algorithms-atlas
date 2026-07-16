// =============================================================================
// 石子游戏 IV：n 个石子轮流取平方数，取走最后一个者胜。
// dp[i] = OR_{k²<=i} !dp[i-k²]
// =============================================================================

export interface StoneGame4Hooks {
  onState?: (i: number, win: boolean) => void;
  onResult?: (firstWins: boolean, dp: boolean[]) => void;
}

export interface StoneGame4Result {
  firstWins: boolean;
  dp: boolean[];
}

export function stoneGame4(n: number, hooks: StoneGame4Hooks = {}): StoneGame4Result {
  if (n <= 0) {
    hooks.onResult?.(false, []);
    return { firstWins: false, dp: [] };
  }
  const dp = new Array<boolean>(n + 1).fill(false);
  dp[0] = false;
  hooks.onState?.(0, false);
  for (let i = 1; i <= n; i++) {
    let k = 1;
    let win = false;
    while (k * k <= i) {
      if (!dp[i - k * k]!) {
        win = true;
        break;
      }
      k++;
    }
    dp[i] = win;
    hooks.onState?.(i, win);
  }
  hooks.onResult?.(dp[n]!, dp);
  return { firstWins: dp[n]!, dp };
}
