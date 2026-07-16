// =============================================================================
// 末尾零计数（ctz）查表变种 · 纯算法实现
// =============================================================================

export interface CtzHooks {
  /** 检查第 byteIndex 个字节（0=最低字节），给出该字节的值与查表结果。 */
  onByte?: (byteIndex: number, byteValue: number, byteCtz: number) => void;
}

/** 256 项 ctz 表：低字节 0..255 的末尾零个数（255 表示全零字节）。 */
const CTZ_TABLE: readonly number[] = (() => {
  const t = new Array<number>(256).fill(255);
  for (let i = 1; i < 256; i++) {
    let c = 0;
    let v = i;
    while ((v & 1) === 0) {
      c++;
      v >>= 1;
    }
    t[i] = c;
  }
  return t;
})();

/**
 * 末尾零计数（查表变种）：返回 x 的最低位 1 的下标（0-based）；x == 0 时返回 -1。
 * 逐字节从低到高扫描：若低字节非零，直接查表；否则累加 8 并右移。
 * @param x 32 位无符号整数
 */
export function ctz2(x: number, hooks: CtzHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`ctz2 要求 32 位无符号整数，收到 ${x}`);
  }
  let n = x >>> 0;
  if (n === 0) return -1;
  let count = 0;
  for (let b = 0; b < 4; b++) {
    const byte = n & 0xff;
    const t = CTZ_TABLE[byte]!;
    hooks.onByte?.(b, byte, t);
    if (byte !== 0) {
      return count + t;
    }
    count += 8;
    n = n >>> 8;
  }
  return count;
}
