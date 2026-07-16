// =============================================================================
// n 位格雷码（公式法）· 纯算法实现
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface GrayCodeNHooks {
  /** 生成第 i 个格雷码。 */
  onEmit?: (index: number, code: number) => void;
  /** 完成。 */
  onDone?: (codes: number[]) => void;
}

/**
 * 用公式 g(i) = i ^ (i>>1) 生成第 i 个格雷码。
 *
 * @param i 下标（0..2^n-1）
 */
export function grayCodeAt(i: number): number {
  return i ^ (i >> 1);
}

/**
 * 生成 n 位格雷码完整序列。
 *
 * @param n 位数（n >= 0）
 * @param hooks 可选的事件钩子
 */
export function grayCodeN(n: number, hooks: GrayCodeNHooks = {}): number[] {
  if (n < 0) throw new RangeError(`n 须非负，收到 ${n}`);
  const codes: number[] = [];
  const total = 1 << n;
  for (let i = 0; i < total; i++) {
    const g = i ^ (i >> 1);
    codes.push(g);
    hooks.onEmit?.(i, g);
  }
  hooks.onDone?.(codes);
  return codes;
}

/** 把非负整数格式化为 n 位定宽二进制字符串。 */
export function toBinaryString(n: number, width: number): string {
  let s = '';
  let x = n;
  for (let i = 0; i < width; i++) {
    s = (x & 1) + s;
    x = Math.floor(x / 2);
  }
  return s;
}
