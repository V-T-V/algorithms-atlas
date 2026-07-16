// 四元数乘法 · 实现
export interface Quat {
  w: number;
  x: number;
  y: number;
  z: number;
}
export function qMul(a: Quat, b: Quat): Quat {
  return {
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
  };
}
export function qNorm(a: Quat): number {
  return Math.hypot(a.w, a.x, a.y, a.z);
}
