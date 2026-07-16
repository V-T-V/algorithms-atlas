// =============================================================================
// 查表法数 1 (Lookup Popcount) · 纯算法实现
// =============================================================================

/** 256 项查表：POPCOUNT_TABLE[b] = b 中 1 的个数（b ∈ [0,255]）。 */
function buildPopcountTable(): number[] {
  const t = new Array<number>(256);
  for (let i = 0; i < 256; i++) {
    let c = 0;
    let v = i;
    while (v > 0) {
      c++;
      v &= v - 1;
    }
    t[i] = c;
  }
  return t;
}

export const POPCOUNT_TABLE: readonly number[] = buildPopcountTable();

export interface LookupPopcountHooks {
  onByte?: (byteIndex: number, byteValue: number, count: number, acc: number) => void;
}

/**
 * 查表法 popcount：把非负整数 n 按字节拆分，每字节查表累加。
 * 支持任意安全整数（>2^32 也能处理，按字节循环）。
 */
export function popcountLookup(n: number, hooks: LookupPopcountHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`popcount 要求非负整数，收到 ${n}`);
  }
  let acc = 0;
  let x = n;
  let byteIndex = 0;
  while (x > 0) {
    const byte = x & 0xff;
    const c = POPCOUNT_TABLE[byte]!;
    acc += c;
    hooks.onByte?.(byteIndex, byte, c, acc);
    x = Math.floor(x / 256);
    byteIndex++;
  }
  return acc;
}

/** 把非负整数格式化为二进制字符串（高位在前）。 */
export function toBinaryString(n: number): string {
  if (n === 0) return '0';
  let s = '';
  let x = n;
  while (x > 0) {
    s = (x & 1) + s;
    x = Math.floor(x / 2);
  }
  return s;
}
