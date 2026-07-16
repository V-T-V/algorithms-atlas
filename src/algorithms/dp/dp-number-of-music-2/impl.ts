// =============================================================================
// 播放列表方案数 · 纯算法实现
// =============================================================================

const MOD = 1_000_000_007n;

export interface MusicPlaylistHooks {
  onSlot?: (i: number, dp: bigint[]) => void;
  onDone?: (ways: number) => void;
}

export function musicPlaylist(
  n: number,
  goal: number,
  k: number,
  hooks: MusicPlaylistHooks = {},
): number {
  // dp[j] = 前 i 首用了 j 首不同歌的方案数
  let dp = new Array<bigint>(n + 1).fill(0n);
  dp[0] = 1n;
  for (let i = 1; i <= goal; i++) {
    const next = new Array<bigint>(n + 1).fill(0n);
    for (let j = 1; j <= n; j++) {
      // 新歌：(n-(j-1)) 种
      const useNew = (dp[j - 1]! * BigInt(n - (j - 1))) % MOD;
      // 重复：max(j-k,0) 种可选
      const repeatCount = Math.max(j - k, 0);
      const useOld = (dp[j]! * BigInt(repeatCount)) % MOD;
      next[j] = (useNew + useOld) % MOD;
    }
    dp = next;
    hooks.onSlot?.(i, [...dp]);
  }
  const ans = Number(dp[n]!);
  hooks.onDone?.(ans);
  return ans;
}
