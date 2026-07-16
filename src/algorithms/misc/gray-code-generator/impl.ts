// =============================================================================
// 格雷码生成 · 纯算法实现
// g(i) = i ^ (i>>1)；支持枚举与双向转换。零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface GrayCodeHooks {
  /** 生成一个格雷码（序号 i 与其格雷码值 g）。 */
  onCode?: (i: number, gray: number, bits: number) => void;
  /** 枚举完成。 */
  onResult?: (codes: number[]) => void;
}

/**
 * 自然数 i 转格雷码：g = i ^ (i >> 1)。
 */
export function toGray(i: number): number {
  if (!Number.isInteger(i) || i < 0) {
    throw new RangeError('i must be a non-negative integer');
  }
  return (i ^ (i >>> 1)) >>> 0;
}

/**
 * 格雷码 g 转自然数（二进制）。
 * 迭代前缀异或：b = g; while (g >>= 1) b ^= g。
 */
export function fromGray(g: number): number {
  if (!Number.isInteger(g) || g < 0) {
    throw new RangeError('g must be a non-negative integer');
  }
  let b = g;
  let shift = g >>> 1;
  while (shift > 0) {
    b ^= shift;
    shift >>>= 1;
  }
  return b >>> 0;
}

/**
 * 生成 n 位格雷码序列（长度 2ⁿ），第 i 项为 toGray(i)。
 * @param n 位数（1~20，避免过大）
 * @param hooks 可选事件钩子
 * @returns 长度 2ⁿ 的格雷码数值数组
 */
export function grayCodes(n: number, hooks: GrayCodeHooks = {}): number[] {
  if (!Number.isInteger(n) || n < 1 || n > 20) {
    throw new RangeError('n must be an integer in [1, 20]');
  }
  const count = 1 << n; // 2^n
  const codes: number[] = [];
  for (let i = 0; i < count; i++) {
    const g = (i ^ (i >>> 1)) >>> 0;
    codes.push(g);
    hooks.onCode?.(i, g, n);
  }
  hooks.onResult?.(codes);
  return codes;
}

/**
 * 反射构造法生成 n 位格雷码（教学版）：
 * n 位格雷码 = (n-1 位格雷码) 拼接 (其逆序每项加 2^(n-1))。
 */
export function grayCodesReflected(n: number): number[] {
  if (!Number.isInteger(n) || n < 1 || n > 20) {
    throw new RangeError('n must be an integer in [1, 20]');
  }
  let codes: number[] = [0, 1]; // 1 位格雷码
  for (let bit = 2; bit <= n; bit++) {
    const high = 1 << (bit - 1);
    const reflected = [...codes].reverse().map((c) => c + high);
    codes = [...codes, ...reflected];
  }
  return codes;
}

/** 把数值格式化为指定位数的二进制字符串。 */
export function toBinaryString(value: number, bits: number): string {
  return (value >>> 0).toString(2).padStart(bits, '0');
}
