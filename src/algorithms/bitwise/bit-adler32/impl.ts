// =============================================================================
// Adler-32 校验 · 纯算法实现
// =============================================================================

export interface Adler32Hooks {
  /** 每处理一个字节后调用（字节值、当前 s1、s2）。 */
  onByte?: (byteValue: number, s1: number, s2: number) => void;
}

const MOD = 65521;

/**
 * Adler-32：对字节数组计算 zlib Adler-32 校验。
 * 初始 s1=1, s2=0；每字节 s1=(s1+b)%MOD, s2=(s2+s1)%MOD。
 * 结果 = (s2<<16)|s1。
 * @param bytes 输入字节序列（每个 0..255）
 */
export function adler32(bytes: readonly number[], hooks: Adler32Hooks = {}): number {
  for (const b of bytes) {
    if (!Number.isInteger(b) || b < 0 || b > 0xff) {
      throw new RangeError(`adler32 字节要求 0..255，收到 ${b}`);
    }
  }
  let s1 = 1;
  let s2 = 0;
  for (const b of bytes) {
    s1 = (s1 + b) % MOD;
    s2 = (s2 + s1) % MOD;
    hooks.onByte?.(b, s1, s2);
  }
  return ((s2 << 16) | s1) >>> 0;
}
