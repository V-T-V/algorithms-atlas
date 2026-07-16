// =============================================================================
// 查表位反转（Bit Reverse via Lookup Table）· 纯算法实现
// =============================================================================

export interface ReverseHooks {
  /** 每处理完一个字节后调用（字节下标从低到高 0..3、当前累加结果）。 */
  onByte?: (byteIndex: number, acc: number) => void;
}

/** 256 项字节反转表：REV8[b] = b 的 8 位反转。 */
const REV8: readonly number[] = (() => {
  const t = new Array<number>(256);
  for (let i = 0; i < 256; i++) {
    let r = 0;
    let v = i;
    for (let b = 0; b < 8; b++) {
      r = (r << 1) | (v & 1);
      v >>= 1;
    }
    t[i] = r;
  }
  return t;
})();

/**
 * 查表位反转：返回 32 位无符号整数 x 的二进制位反转结果。
 * 从低字节到高字节逐字节查表，左移拼接。
 * @param x 32 位无符号整数
 */
export function reverseLookup(x: number, hooks: ReverseHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`reverseLookup 要求 32 位无符号整数，收到 ${x}`);
  }
  let n = x >>> 0;
  let r = 0;
  for (let b = 0; b < 4; b++) {
    r = ((r << 8) | REV8[n & 0xff]!) >>> 0;
    hooks.onByte?.(b, r);
    n = n >>> 8;
  }
  return r >>> 0;
}
