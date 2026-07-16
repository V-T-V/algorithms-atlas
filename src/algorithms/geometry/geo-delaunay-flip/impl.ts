// =============================================================================
// Delaunay 翻转（Edge Flip）· 纯算法实现
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

export interface Quad {
  a: Point;
  b: Point;
  c: Point;
  d: Point;
}

export interface FlipHooks {
  onIncircle?: (a: Point, b: Point, c: Point, d: Point, value: number) => void;
  onFlip?: (before: [Point, Point], after: [Point, Point]) => void;
}

/**
 * incircle 行列式：对 CCW 三角形 ABC 与点 D，
 * 返回 > 0 表示 D 在 △ABC 外接圆**内**（即对角线 AC 非法，需翻转）。
 */
export function incircle(a: Point, b: Point, c: Point, d: Point): number {
  const adx = a.x - d.x;
  const ady = a.y - d.y;
  const bdx = b.x - d.x;
  const bdy = b.y - d.y;
  const cdx = c.x - d.x;
  const cdy = c.y - d.y;
  const az = adx * adx + ady * ady;
  const bz = bdx * bdx + bdy * bdy;
  const cz = cdx * cdx + cdy * cdy;
  return adx * (bdy * cz - bz * cdy) - ady * (bdx * cz - bz * cdx) + az * (bdx * cdy - bdy * cdx);
}

/**
 * 对四边形 ABCD（CCW，对角线 AC）判定并执行一次 Delaunay 翻转。
 * 若 D 在 △ABC 外接圆内（incircle > 0），翻转 AC → BD，返回新对角线。
 * @returns 是否发生翻转
 */
export function delaunayFlip(quad: Quad, hooks: FlipHooks = {}): boolean {
  const { a, b, c, d } = quad;
  const v = incircle(a, b, c, d);
  hooks.onIncircle?.(a, b, c, d, v);
  if (v > 0) {
    hooks.onFlip?.([a, c], [b, d]);
    return true;
  }
  return false;
}

/**
 * 对一组共享对角边的四边形反复翻转，直到全部满足 Delaunay。
 * @param quads 待检查的四边形列表（每次取 ABCD，AC 为当前对角）
 * @returns 发生翻转的次数
 */
export function delaunayFlipAll(quads: Quad[], hooks: FlipHooks = {}): number {
  let flips = 0;
  let changed = true;
  let guard = 0;
  while (changed && guard < quads.length * quads.length + 10) {
    changed = false;
    guard++;
    for (const q of quads) {
      if (delaunayFlip(q, hooks)) {
        flips++;
        changed = true;
      }
    }
  }
  return flips;
}
