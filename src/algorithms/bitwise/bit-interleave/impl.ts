// =============================================================================
// 位交错 (Morton / Z-order) · 纯算法实现
// 把 16 位 x、y 的位扩散到 32 位的偶/奇位再或起来。
// =============================================================================

/** 把 16 位整数 x 的位扩散到 32 位字的偶数位（位 0,2,4,…）。 */
export function spread16(x: number): number {
  let v = (x & 0xffff) >>> 0;
  // 二分扩散
  v = (v | (v << 8)) & 0x00ff00ff;
  v = (v | (v << 4)) & 0x0f0f0f0f;
  v = (v | (v << 2)) & 0x33333333;
  v = (v | (v << 1)) & 0x55555555;
  return v >>> 0;
}

/** 把 32 位字的偶数位「压缩」回 16 位整数（spread16 的逆）。 */
export function squash16(v: number): number {
  let x = v & 0x55555555;
  x = (x | (x >>> 1)) & 0x33333333;
  x = (x | (x >>> 2)) & 0x0f0f0f0f;
  x = (x | (x >>> 4)) & 0x00ff00ff;
  x = (x | (x >>> 8)) & 0x0000ffff;
  return x >>> 0;
}

export interface BitInterleaveHooks {
  onSpread?: (which: 'x' | 'y', spread: number) => void;
  onInterleave?: (xSpread: number, ySpread: number, code: number) => void;
}

/**
 * 计算 (x, y) 的 Morton 码：x 的位放偶数位，y 的位放奇数位。
 * 要求 x、y ∈ [0, 2^16)。
 */
export function mortonCode(x: number, y: number, hooks: BitInterleaveHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffff) {
    throw new RangeError(`x 要求 [0, 65535]，收到 ${x}`);
  }
  if (!Number.isInteger(y) || y < 0 || y > 0xffff) {
    throw new RangeError(`y 要求 [0, 65535]，收到 ${y}`);
  }
  const xs = spread16(x);
  hooks.onSpread?.('x', xs);
  const ys = spread16(y);
  hooks.onSpread?.('y', ys);
  const code = (xs | (ys << 1)) >>> 0;
  hooks.onInterleave?.(xs, ys, code);
  return code;
}

/** 从 Morton 码还原 (x, y)。 */
export function mortonDecode(code: number): { x: number; y: number } {
  if (!Number.isInteger(code) || code < 0 || code > 0xffffffff) {
    throw new RangeError(`code 要求 32 位无符号，收到 ${code}`);
  }
  const x = squash16(code);
  const y = squash16(code >>> 1);
  return { x, y };
}

export function toBinary32(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0');
}
