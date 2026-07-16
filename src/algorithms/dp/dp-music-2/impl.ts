// =============================================================================
// 歌单组合（0/1 背包计数）
// =============================================================================

const MOD = 1_000_000_007;

export interface MusicHooks {
  onSong?: (i: number, len: number) => void;
  onCell?: (t: number, val: number) => void;
  onDone?: (ways: number) => void;
}

export function playlistCount(
  lens: readonly number[],
  target: number,
  hooks: MusicHooks = {},
): number {
  const dp = new Array<number>(target + 1).fill(0);
  dp[0] = 1;
  for (let i = 0; i < lens.length; i++) {
    const L = lens[i]!;
    hooks.onSong?.(i, L);
    for (let t = target; t >= L; t--) {
      dp[t] = (dp[t]! + dp[t - L]!) % MOD;
      hooks.onCell?.(t, dp[t]!);
    }
  }
  hooks.onDone?.(dp[target]!);
  return dp[target]!;
}
