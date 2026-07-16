// =============================================================================
// 瓷砖可能性 · 纯算法实现 (LeetCode 1079)
// 用频数表回溯，每选一个字母（频数减一）即构成一个新序列。
// =============================================================================
export interface BtTilesPossibilitiesHooks {
  onPick?: (ch: string, depth: number) => void;
  onCount?: (total: number) => void;
}

export function btTilesPossibilities(tiles: string, hooks: BtTilesPossibilitiesHooks = {}): number {
  const freq: Record<string, number> = {};
  for (const ch of tiles) freq[ch] = (freq[ch] ?? 0) + 1;
  const keys = Object.keys(freq);
  let total = 0;

  const dfs = (depth: number): void => {
    for (const k of keys) {
      if (freq[k]! <= 0) continue;
      total++;
      hooks.onCount?.(total);
      hooks.onPick?.(k, depth);
      freq[k]!--;
      dfs(depth + 1);
      freq[k]!++;
    }
  };

  dfs(0);
  return total;
}
