// 掩码绝对值 · 实现
export interface AbsMaskHooks {
  onMask?: (mask: number) => void;
  onResult?: (v: number) => void;
}
export function absMask(x: number, hooks: AbsMaskHooks = {}): number {
  const v = x | 0;
  const mask = v >> 31; // 算术右移：负数全1(=-1)，非负全0
  hooks.onMask?.(mask >>> 0);
  const r = ((v ^ mask) - mask) | 0;
  hooks.onResult?.(r);
  return r;
}
