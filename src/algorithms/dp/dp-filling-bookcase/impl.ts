// =============================================================================
// 填充书架 · 纯算法实现
// dp[i] = 放完前 i 本书的最小总高度。
// =============================================================================

export interface FillingBookcaseHooks {
  onFill?: (i: number, val: number) => void;
  onResult?: (height: number) => void;
}

export function minHeightShelves(
  books: ReadonlyArray<[number, number]>,
  shelfWidth: number,
  hooks: FillingBookcaseHooks = {},
): number {
  const n = books.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const dp: number[] = new Array<number>(n + 1).fill(0);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    let width = 0;
    let layerMax = 0;
    dp[i] = Infinity;
    for (let j = i - 1; j >= 0; j--) {
      width += books[j]![0];
      if (width > shelfWidth) break;
      layerMax = Math.max(layerMax, books[j]![1]);
      dp[i] = Math.min(dp[i]!, dp[j]! + layerMax);
    }
    hooks.onFill?.(i, dp[i]!);
  }
  hooks.onResult?.(dp[n]!);
  return dp[n]!;
}
