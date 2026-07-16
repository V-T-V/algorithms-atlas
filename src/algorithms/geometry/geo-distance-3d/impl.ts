// 三维欧氏距离 · 实现
export interface Pt3 {
  x: number;
  y: number;
  z: number;
}
export function distance3D(a: Pt3, b: Pt3): number {
  return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
}
