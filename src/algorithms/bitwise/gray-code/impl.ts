// =============================================================================
// 格雷码 Gray Code · 纯算法实现
// 相邻两个码只有一个二进制位不同。反射法：n 位格雷码 = (n-1) 位格雷码 + 其逆序前缀 1。
// =============================================================================

export interface GrayCodeHooks {
  /** 生成第 i 个格雷码时触发。 */
  onEmit?: (index: number, code: number) => void;
  /** 镜像反射阶段。 */
  onReflect?: (n: number) => void;
}

/**
 * 生成 n 位格雷码序列。
 * @param n 位数（n>=0）
 * @returns 格雷码数值数组，长度 2^n
 */
export function grayCode(n: number, hooks: GrayCodeHooks = {}): number[] {
  if (n < 0) return [];
  const codes = [0];
  hooks.onEmit?.(0, 0);
  for (let bit = 0; bit < n; bit++) {
    hooks.onReflect?.(bit + 1);
    const len = codes.length;
    // 反射：逆序 + 前缀 1
    for (let i = len - 1; i >= 0; i--) {
      const code = codes[i]! | (1 << bit);
      codes.push(code);
      hooks.onEmit?.(codes.length - 1, code);
    }
  }
  return codes;
}

/** 整数 → 格雷码：gray = n ^ (n >> 1)。 */
export function toGray(n: number): number {
  return n ^ (n >> 1);
}

/** 格雷码 → 整数。 */
export function fromGray(gray: number): number {
  let n = gray;
  let mask = n >> 1;
  while (mask !== 0) {
    n ^= mask;
    mask >>= 1;
  }
  return n;
}
