// =============================================================================
// 仅循环左移 (ROL) · 纯算法实现
// =============================================================================

export interface RotateLeftHooks {
  onNormalize?: (rawShift: number, normalized: number) => void;
  onRotate?: (r: number, result: number) => void;
}

/**
 * 32 位循环左移：x 左移 r 位，溢出位从右端回绕。
 *   r = ((shift % 32) + 32) % 32  规范化到 [0, 32)
 *   r == 0 时返回 x 原值
 *   否则 result = (x << r) | (x >>> (32 - r))
 */
export function rotateLeft(x: number, shift: number, hooks: RotateLeftHooks = {}): number {
  const r = (((shift | 0) % 32) + 32) % 32;
  hooks.onNormalize?.(shift | 0, r);
  const v = x >>> 0;
  const result = r === 0 ? v : ((v << r) | (v >>> (32 - r))) >>> 0;
  hooks.onRotate?.(r, result);
  return result;
}

/** 连续左移 n 次的累积（等价于 rotateLeft(x, sum)）。 */
export function rotateLeftMany(x: number, shifts: number[], hooks: RotateLeftHooks = {}): number {
  let v = x >>> 0;
  for (const s of shifts) v = rotateLeft(v, s, hooks);
  return v;
}

export function toBinary32(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0');
}
