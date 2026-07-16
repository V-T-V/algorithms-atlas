// =============================================================================
// 学生出勤记录 II
// =============================================================================

const MOD = 1_000_000_007;

export interface AttendanceHooks {
  onDay?: (i: number, total: number) => void;
  onDone?: (total: number) => void;
}

export function checkRecord(n: number, hooks: AttendanceHooks = {}): number {
  // dp[A][L]: A 已用 A 次（0/1），L 末尾连续 L 数（0/1/2）
  let dp: number[][] = [
    [1, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < n; i++) {
    const ndp: number[][] = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    // 加 P
    for (let a = 0; a < 2; a++) {
      ndp[a]![0] = (ndp[a]![0]! + dp[a]![0]! + dp[a]![1]! + dp[a]![2]!) % MOD;
    }
    // 加 L
    for (let a = 0; a < 2; a++) {
      ndp[a]![1] = (ndp[a]![1]! + dp[a]![0]!) % MOD;
      ndp[a]![2] = (ndp[a]![2]! + dp[a]![1]!) % MOD;
    }
    // 加 A
    ndp[1]![0] = (ndp[1]![0]! + dp[0]![0]! + dp[0]![1]! + dp[0]![2]!) % MOD;
    dp = ndp;
    let total = 0;
    for (let a = 0; a < 2; a++) for (let l = 0; l < 3; l++) total = (total + dp[a]![l]!) % MOD;
    hooks.onDay?.(i, total);
  }
  let ans = 0;
  for (let a = 0; a < 2; a++) for (let l = 0; l < 3; l++) ans = (ans + dp[a]![l]!) % MOD;
  hooks.onDone?.(ans);
  return ans;
}
