// =============================================================================
// 交错字符串
// dp[i][j] = s1[0..i) 与 s2[0..j) 能否交错拼成 s3[0..i+j)
// dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1]) || (dp[i][j-1] && s2[j-1]==s3[i+j-1])
// =============================================================================

export interface InterleavingHooks {
  onCell?: (i: number, j: number, ok: boolean) => void;
  onResult?: (interleaving: boolean) => void;
}

export interface InterleavingResult {
  interleaving: boolean;
  dp: boolean[][];
}

export function isInterleave(
  s1: string,
  s2: string,
  s3: string,
  hooks: InterleavingHooks = {},
): InterleavingResult {
  const m = s1.length;
  const n = s2.length;
  if (m + n !== s3.length) {
    hooks.onResult?.(false);
    return { interleaving: false, dp: [] };
  }
  const dp: boolean[][] = Array.from({ length: m + 1 }, () =>
    new Array<boolean>(n + 1).fill(false),
  );
  dp[0]![0] = true;
  hooks.onCell?.(0, 0, true);
  for (let i = 1; i <= m; i++) {
    dp[i]![0] = (dp[i - 1]![0] ?? false) && s1[i - 1] === s3[i - 1];
    hooks.onCell?.(i, 0, dp[i]![0]!);
  }
  for (let j = 1; j <= n; j++) {
    dp[0]![j] = (dp[0]![j - 1] ?? false) && s2[j - 1] === s3[j - 1];
    hooks.onCell?.(0, j, dp[0]![j]!);
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const fromS1 = dp[i - 1]![j]! && s1[i - 1] === s3[i + j - 1];
      const fromS2 = dp[i]![j - 1]! && s2[j - 1] === s3[i + j - 1];
      dp[i]![j] = fromS1 || fromS2;
      hooks.onCell?.(i, j, dp[i]![j]!);
    }
  }
  const result = dp[m]![n]!;
  hooks.onResult?.(result);
  return { interleaving: result, dp };
}
