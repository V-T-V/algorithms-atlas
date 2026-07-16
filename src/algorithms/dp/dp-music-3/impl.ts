// =============================================================================
// 歌曲列表 · 纯算法实现
// =============================================================================
export interface MusicHooks {
  onLen?: (i: number, val: number) => void;
  onDone?: (count: number) => void;
}

export function numMusicPlaylists(
  n: number,
  goal: number,
  k: number,
  hooks: MusicHooks = {},
  mod = 1_000_000_007,
): number {
  const dp = new Array<number>(goal + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= goal; i++) {
    // add a brand-new song: have (n - (i-1)) unused songs available
    let ways = (dp[i - 1]! * (n - (i - 1))) % mod;
    // add a reused song: any of the (i-1) songs already played, except the last k
    if (i - 1 > k) {
      ways = (ways + dp[i - 1]! * (i - 1 - k)) % mod;
    }
    dp[i] = ways;
    hooks.onLen?.(i, ways);
  }
  hooks.onDone?.(dp[goal]!);
  return dp[goal]!;
}
