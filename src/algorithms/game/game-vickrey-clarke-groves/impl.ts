// VCG (单物品拍卖) · 实现
export interface VcgHooks {
  onReport?: (i: number, v: number) => void;
  onAllocate?: (winner: number, price: number) => void;
}
export function vcgAuction(
  values: readonly number[],
  hooks: VcgHooks = {},
): { winner: number; price: number } {
  const n = values.length;
  let winner = 0;
  for (let i = 0; i < n; i++) {
    hooks.onReport?.(i, values[i]!);
    if (values[i]! > values[winner]!) winner = i;
  }
  // Clarke 代价 = 第二高 (其他人无 winner 时的最大福利 - 有 winner 时)
  let second = -Infinity;
  for (let i = 0; i < n; i++) if (i !== winner && values[i]! > second) second = values[i]!;
  const price = second < 0 ? 0 : second;
  hooks.onAllocate?.(winner, price);
  return { winner, price };
}
