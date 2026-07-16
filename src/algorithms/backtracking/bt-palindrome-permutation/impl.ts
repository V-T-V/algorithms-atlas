// =============================================================================
// 回文排列判定 · 纯算法实现 (LeetCode 266)
// 统计字符频数，奇数次字符 ≤1 即可重排为回文。
// =============================================================================
export interface BtPalindromePermutationHooks {
  onCount?: (counts: Record<string, number>) => void;
  onOddCount?: (oddCount: number) => void;
  onConclude?: (can: boolean) => void;
}

export function btPalindromePermutation(
  s: string,
  hooks: BtPalindromePermutationHooks = {},
): boolean {
  const counts: Record<string, number> = {};
  for (const ch of s) {
    counts[ch] = (counts[ch] ?? 0) + 1;
  }
  hooks.onCount?.(counts);

  let odd = 0;
  for (const k of Object.keys(counts)) {
    if (counts[k]! % 2 === 1) odd++;
  }
  hooks.onOddCount?.(odd);

  const can = odd <= 1;
  hooks.onConclude?.(can);
  return can;
}
