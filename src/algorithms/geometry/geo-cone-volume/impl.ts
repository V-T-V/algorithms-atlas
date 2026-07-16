// 圆锥体积 · 实现
export function coneVolume(r: number, h: number): number {
  if (r < 0 || h < 0) throw new RangeError('尺寸必须非负');
  return (Math.PI * r * r * h) / 3;
}
