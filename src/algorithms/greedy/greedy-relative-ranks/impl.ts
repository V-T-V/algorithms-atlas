// =============================================================================
// 相对名次 · 纯算法实现 (LeetCode 506)
// =============================================================================
export interface GreedyRelativeRanksHooks {
  onRank?: (index: number, rank: number, medal: string) => void;
  onConclude?: (ranks: string[]) => void;
}

export function greedyRelativeRanks(
  scores: readonly number[],
  hooks: GreedyRelativeRanksHooks = {},
): string[] {
  const indexed = scores.map((s, i) => [s, i] as const);
  indexed.sort((a, b) => b[0] - a[0]);
  const result = new Array<string>(scores.length).fill('');
  const MEDALS = ['Gold Medal', 'Silver Medal', 'Bronze Medal'];
  indexed.forEach(([_score, originalIndex], rank) => {
    const medal = rank < 3 ? MEDALS[rank]! : String(rank + 1);
    result[originalIndex]! = medal;
    hooks.onRank?.(originalIndex, rank + 1, medal);
  });
  hooks.onConclude?.(result);
  return result;
}
