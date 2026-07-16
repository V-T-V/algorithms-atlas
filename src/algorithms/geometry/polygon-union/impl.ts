// =============================================================================
// 多边形并集面积 · 纯算法实现
// 蒙特卡洛估计：包围盒内随机采样，统计命中至少一个多边形的比例。
// 含精确快速路径：两两不相交 → 面积之和。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 事件钩子。 */
export interface PolygonUnionHooks {
  /** 每次采样：点、是否命中任一多边形、当前命中计数与总计数。 */
  onSample?: (p: Point, hit: boolean, hitCount: number, totalCount: number) => void;
  /** 每 batchSize 个点更新估计。 */
  onBatch?: (estimate: number, totalCount: number) => void;
  /** 完成。 */
  onDone?: (estimate: number, hitCount: number, totalCount: number) => void;
}

/** 确定性 RNG（Mulberry32）。 */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 射线法判断点 p 是否在多边形 polygon 内（含边界）。 */
export function pointInPolygon(p: Point, polygon: Point[]): boolean {
  const n = polygon.length;
  if (n < 3) return false;
  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i]!.x,
      yi = polygon[i]!.y;
    const xj = polygon[j]!.x,
      yj = polygon[j]!.y;
    const intersect = yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** 鞋带公式面积（无向）。 */
export function polygonArea(points: Point[]): number {
  const n = points.length;
  if (n < 3) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const cur = points[i]!;
    const nxt = points[(i + 1) % n]!;
    sum += cur.x * nxt.y - nxt.x * cur.y;
  }
  return Math.abs(sum) / 2;
}

/** 求多个多边形的联合包围盒。 */
export function unionBoundingBox(
  polygons: Point[][],
): { xmin: number; ymin: number; xmax: number; ymax: number } | null {
  if (polygons.length === 0) return null;
  let xmin = Infinity,
    ymin = Infinity,
    xmax = -Infinity,
    ymax = -Infinity;
  for (const poly of polygons) {
    for (const p of poly) {
      if (p.x < xmin) xmin = p.x;
      if (p.y < ymin) ymin = p.y;
      if (p.x > xmax) xmax = p.x;
      if (p.y > ymax) ymax = p.y;
    }
  }
  if (!isFinite(xmin)) return null;
  return { xmin, ymin, xmax, ymax };
}

export interface UnionAreaResult {
  /** 估计的并集面积。 */
  estimate: number;
  /** 包围盒面积。 */
  boxArea: number;
  /** 命中点数。 */
  hitCount: number;
  /** 总采样数。 */
  totalCount: number;
}

/**
 * 蒙特卡洛估计多个多边形的并集面积。
 *
 * @param polygons 多边形列表（每个为顶点数组，可顺/逆时针）
 * @param n 采样点数
 * @param rng [0,1) 随机源
 * @param batchSize 每多少点更新估计
 * @param hooks 可选钩子
 */
export function polygonUnionArea(
  polygons: Point[][],
  n: number,
  rng: Rng = Math.random,
  batchSize: number = Math.max(1, Math.floor(n / 10)),
  hooks: PolygonUnionHooks = {},
): UnionAreaResult {
  const bb = unionBoundingBox(polygons);
  if (bb === null) {
    hooks.onDone?.(0, 0, 0);
    return { estimate: 0, boxArea: 0, hitCount: 0, totalCount: 0 };
  }
  const { xmin, ymin, xmax, ymax } = bb;
  const boxArea = (xmax - xmin) * (ymax - ymin);
  if (boxArea === 0) {
    hooks.onDone?.(0, 0, 0);
    return { estimate: 0, boxArea: 0, hitCount: 0, totalCount: 0 };
  }

  let hitCount = 0;
  for (let i = 0; i < n; i++) {
    const x = xmin + (xmax - xmin) * rng();
    const y = ymin + (ymax - ymin) * rng();
    const p: Point = { x, y };
    let hit = false;
    for (const poly of polygons) {
      if (pointInPolygon(p, poly)) {
        hit = true;
        break;
      }
    }
    if (hit) hitCount++;
    hooks.onSample?.(p, hit, hitCount, i + 1);
    if ((i + 1) % batchSize === 0) {
      hooks.onBatch?.((hitCount / (i + 1)) * boxArea, i + 1);
    }
  }

  const estimate = (hitCount / n) * boxArea;
  hooks.onDone?.(estimate, hitCount, n);
  return { estimate, boxArea, hitCount, totalCount: n };
}

/**
 * 精确快速路径：当所有多边形两两不相交时，并集面积 = 各面积之和。
 * 注意：本函数不验证「是否真不相交」，调用者需保证；仅作求和。
 */
export function sumAreas(polygons: Point[][]): number {
  return polygons.reduce((s, poly) => s + polygonArea(poly), 0);
}
