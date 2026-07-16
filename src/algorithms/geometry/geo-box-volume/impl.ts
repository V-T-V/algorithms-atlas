// 长方体体积 · 实现
export function boxVolume(l: number, w: number, h: number): number {
  if (l < 0 || w < 0 || h < 0) throw new RangeError('边长必须非负');
  return l * w * h;
}
