// =============================================================================
// 播放列表数（LeetCode 920 Number of Music Playlists）· 纯算法实现
// 共 n 首不同歌，目标列表长 L，每首歌至少播 1 次，且任意两首同名歌之间至少隔 k 首不同歌。
// dp[i][j] = 列表长 i、用了 j 首不同歌的方案数。
//   dp[i][j] = dp[i-1][j-1] * (n-(j-1))  // 新歌
//            + dp[i-1][j] * max(j-k, 0)   // 旧歌
//   答案 dp[L][n]。取模。
// =============================================================================

export interface MusicHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onResult?: (total: number) => void;
}

export function numberOfMusicPlaylists(
  n: number,
  goal: number,
  k: number,
  mod = 1_000_000_007,
  hooks: MusicHooks = {},
): number {
  if (goal < n) {
    hooks.onResult?.(0);
    return 0;
  }
  // dp[i][j]
  const dp: number[][] = Array.from({ length: goal + 1 }, () => new Array<number>(n + 1).fill(0));
  dp[0]![0] = 1;
  for (let i = 1; i <= goal; i++) {
    for (let j = 1; j <= n; j++) {
      // 新歌
      let v = (dp[i - 1]![j - 1]! * (n - (j - 1))) % mod;
      // 旧歌
      if (j > k) {
        v = (v + ((dp[i - 1]![j]! * (j - k)) % mod)) % mod;
      }
      dp[i]![j] = v;
      hooks.onCell?.(i, j, v);
    }
  }
  const ans = dp[goal]![n]!;
  hooks.onResult?.(ans);
  return ans;
}
