export interface AlignHooks {
  onMask?: (mask: number) => void;
  onResult?: (r: number) => void;
}
export function alignUp(size: number, align: number, hooks: AlignHooks = {}): number {
  if ((align & (align - 1)) !== 0 || align <= 0) throw new RangeError('align 必须是正的 2 的幂');
  const mask = align - 1;
  hooks.onMask?.(mask >>> 0);
  const r = (((size | 0) + mask) & ~mask) | 0;
  hooks.onResult?.(r);
  return r;
}
