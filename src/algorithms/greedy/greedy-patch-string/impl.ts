// =============================================================================
// 字符串拼接最小表示 · 纯算法实现
// 按 a+b < b+a 排序后拼接，得到字典序最小拼接。
// =============================================================================
export interface GreedyPatchStringHooks {
  onSort?: (sorted: string[]) => void;
  onConcat?: (result: string) => void;
}

export function greedyPatchString(
  parts: readonly string[],
  hooks: GreedyPatchStringHooks = {},
): string {
  const sorted = [...parts].sort((a, b) => (a + b < b + a ? -1 : a + b > b + a ? 1 : 0));
  hooks.onSort?.(sorted);
  const result = sorted.join('');
  hooks.onConcat?.(result);
  return result;
}
