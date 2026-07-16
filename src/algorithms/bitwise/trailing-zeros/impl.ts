// =============================================================================
// 末尾零个数 (ctz) · 纯算法实现
// 用 de Bruijn 序列实现 branchless ctz（32 位）。
// =============================================================================

const DE_BRUIJN_MAGIC = 0x077cb531;
/** de Bruijn 查表：index → ctz。 */
const DE_BRUIJN_TABLE: readonly number[] = (() => {
  const t = new Array<number>(32);
  for (let i = 0; i < 32; i++) {
    // (magic << i) >>> 27 的位置
    const pos = ((DE_BRUIJN_MAGIC << i) >>> 27) >>> 0;
    t[pos] = i;
  }
  return t;
})();

export interface CtzHooks {
  onLowestBit?: (x: number, lowestBit: number) => void;
  onLookup?: (index: number, ctz: number) => void;
}

/**
 * 32 位 ctz（count trailing zeros）：最低位 1 的位索引。
 * 0 的 ctz 约定为 32。
 *   ctz(8)  = 3   (0b1000)
 *   ctz(10) = 1   (0b1010)
 *   ctz(0)  = 32
 */
export function ctz(n: number, hooks: CtzHooks = {}): number {
  if (!Number.isInteger(n) || n < 0 || n > 0xffffffff) {
    throw new RangeError(`ctz 要求 32 位无符号整数，收到 ${n}`);
  }
  if (n === 0) return 32;
  // 32 位操作
  const lowestBit = (n & -n) >>> 0; // 隔离最低位 1
  hooks.onLowestBit?.(n, lowestBit);
  // de Bruijn 乘法 + 移位
  const index = ((lowestBit * DE_BRUIJN_MAGIC) >>> 27) >>> 0;
  const result = DE_BRUIJN_TABLE[index]!;
  hooks.onLookup?.(index, result);
  return result;
}

/** 把非负整数格式化为 32 位二进制字符串。 */
export function toBinary32(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0');
}
