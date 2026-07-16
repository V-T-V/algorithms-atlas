// 部分键哈希 · 实现
export interface PkHooks {
  onKey?: (key: number, fields: number[], hash: number) => void;
}
export function partialKeyHash(
  keys: readonly number[],
  mask: number,
  hooks: PkHooks = {},
): number[] {
  return keys.map((k) => {
    const partial = k & mask;
    let h = partial;
    h = ((h >>> 16) ^ h) * 0x45d9f3b;
    h = ((h >>> 16) ^ h) * 0x45d9f3b;
    h = (h >>> 16) ^ h;
    hooks.onKey?.(k, [partial >>> 8, partial & 0xff], h >>> 0);
    return h >>> 0;
  });
}
