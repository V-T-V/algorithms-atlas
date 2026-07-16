// 四面体体积 · 实现
export interface Pt3 {
  x: number;
  y: number;
  z: number;
}
export function tetrahedronVolume(a: Pt3, b: Pt3, c: Pt3, d: Pt3): number {
  const ux = b.x - a.x,
    uy = b.y - a.y,
    uz = b.z - a.z;
  const vx = c.x - a.x,
    vy = c.y - a.y,
    vz = c.z - a.z;
  const wx = d.x - a.x,
    wy = d.y - a.y,
    wz = d.z - a.z;
  const det = ux * (vy * wz - vz * wy) - uy * (vx * wz - vz * wx) + uz * (vx * wy - vy * wx);
  return Math.abs(det) / 6;
}
