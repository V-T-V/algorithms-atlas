// =============================================================================
// 最大空圆 · 纯算法实现
// 枚举所有三点外心（Voronoi 顶点候选）+ 边界候选，取半径最大且圆内无点者。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 矩形边界 [xmin,xmax]×[ymin,ymax]。 */
export interface BBox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

/** 事件钩子。 */
export interface MaxEmptyCircleHooks {
  /** 测试一个候选圆心：给出圆心、到最近点的距离、是否在边界内。 */
  onCandidate?: (center: Point, radius: number, inside: boolean) => void;
  /** 找到更优解。 */
  onImprove?: (center: Point, radius: number) => void;
  /** 完成。 */
  onDone?: (center: Point, radius: number) => void;
}

export interface MaxEmptyCircleResult {
  /** 圆心。 */
  center: Point;
  /** 半径（=到最近给定点的距离）。 */
  radius: number;
}

/** 两点距离。 */
export function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** 到所有点的最小距离。 */
function nearestDist(p: Point, points: Point[]): number {
  let best = Infinity;
  for (const q of points) {
    const d = dist(p, q);
    if (d < best) best = d;
  }
  return best;
}

/** 点是否在边界内。 */
function inBox(p: Point, bb: BBox, eps = 1e-9): boolean {
  return (
    p.x >= bb.xmin - eps && p.x <= bb.xmax + eps && p.y >= bb.ymin - eps && p.y <= bb.ymax + eps
  );
}

/**
 * 三点外心（外接圆圆心）。共线返回 null。
 */
export function circumcenter(a: Point, b: Point, c: Point): Point | null {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-12) return null; // 共线
  const ax2 = a.x * a.x + a.y * a.y;
  const bx2 = b.x * b.x + b.y * b.y;
  const cx2 = c.x * c.x + c.y * c.y;
  const ux = (ax2 * (b.y - c.y) + bx2 * (c.y - a.y) + cx2 * (a.y - b.y)) / d;
  const uy = (ax2 * (c.x - b.x) + bx2 * (a.x - c.x) + cx2 * (b.x - a.x)) / d;
  return { x: ux, y: uy };
}

/**
 * 最大空圆（精确枚举，O(n³)）。
 *
 * 候选圆心：
 *   1. 所有三点外心（Voronoi 顶点候选）
 *   2. 每个点到边界的最近点（边界候选）
 *   3. 边界框四角
 * 取使「到最近点距离」最大、且在框内的候选。
 *
 * @param points 给定点
 * @param bbox 边界
 * @param hooks 可选钩子
 */
export function maxEmptyCircle(
  points: Point[],
  bbox: BBox,
  hooks: MaxEmptyCircleHooks = {},
): MaxEmptyCircleResult {
  const n = points.length;
  // 退化：无点 → 中心，半径到角的最大
  if (n === 0) {
    const center = { x: (bbox.xmin + bbox.xmax) / 2, y: (bbox.ymin + bbox.ymax) / 2 };
    const r = Math.min(
      center.x - bbox.xmin,
      bbox.xmax - center.x,
      center.y - bbox.ymin,
      bbox.ymax - center.y,
    );
    hooks.onDone?.(center, r);
    return { center, radius: r };
  }

  let best: MaxEmptyCircleResult = { center: points[0]!, radius: 0 };

  const consider = (c: Point): void => {
    if (!inBox(c, bbox)) {
      hooks.onCandidate?.(c, 0, false);
      return;
    }
    const r = nearestDist(c, points);
    hooks.onCandidate?.(c, r, true);
    if (r > best.radius) {
      best = { center: { x: c.x, y: c.y }, radius: r };
      hooks.onImprove?.(best.center, best.radius);
    }
  };

  // 候选 1：三点外心
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const c = circumcenter(points[i]!, points[j]!, points[k]!);
        if (c) consider(c);
      }
    }
  }

  // 候选 2：每个点到四条边的垂足（边界候选）
  for (const p of points) {
    consider({ x: p.x, y: bbox.ymin });
    consider({ x: p.x, y: bbox.ymax });
    consider({ x: bbox.xmin, y: p.y });
    consider({ x: bbox.xmax, y: p.y });
  }

  // 候选 3：边界框四角（角点到最近点的距离）
  consider({ x: bbox.xmin, y: bbox.ymin });
  consider({ x: bbox.xmax, y: bbox.ymin });
  consider({ x: bbox.xmin, y: bbox.ymax });
  consider({ x: bbox.xmax, y: bbox.ymax });

  // 候选 4：框中心（兜底）
  consider({ x: (bbox.xmin + bbox.xmax) / 2, y: (bbox.ymin + bbox.ymax) / 2 });

  hooks.onDone?.(best.center, best.radius);
  return best;
}
