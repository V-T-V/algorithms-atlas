// =============================================================================
// 极角排序（Angle Sort）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AngleSortHooks {
  onAnchor?: (anchor: Point) => void;
  onSorted?: (order: number[]) => void;
  onCompare?: (i: number, j: number, cmp: number) => void;
}

export interface AngleSortResult {
  /** 排序后的点（从 anchor 看去按极角升序）。 */
  sorted: Point[];
  /** 原数组中各点排序后的下标。 */
  order: number[];
}

/** 叉积 (b-o) × (c-o)。 */
function cross(o: Point, b: Point, c: Point): number {
  return (b.x - o.x) * (c.y - o.y) - (b.y - o.y) * (c.x - o.x);
}

/** 象限号 0~3（用于跨象限比较）。 */
function quadrant(o: Point, p: Point): number {
  const dx = p.x - o.x;
  const dy = p.y - o.y;
  if (dx >= 0 && dy >= 0) return 0;
  if (dx < 0 && dy >= 0) return 1;
  if (dx < 0 && dy < 0) return 2;
  return 3;
}

/**
 * 极角排序：以 anchor 为参考点，把其余点按极角（同角按距离）升序排列。
 * @param points 点集
 * @param anchor 参考点（默认取最下/最左点）
 * @param hooks 可选的事件钩子
 */
export function angleSort(
  points: Point[],
  anchor?: Point,
  hooks: AngleSortHooks = {},
): AngleSortResult {
  if (points.length === 0) return { sorted: [], order: [] };
  const o = anchor ?? points.reduce((m, p) => (p.y < m.y || (p.y === m.y && p.x < m.x) ? p : m));
  hooks.onAnchor?.(o);

  const idx = points
    .map((_, i) => i)
    .filter((i) => {
      const p = points[i]!;
      return p.x !== o.x || p.y !== o.y;
    });

  idx.sort((ia, ib) => {
    const a = points[ia]!;
    const b = points[ib]!;
    hooks.onCompare?.(ia, ib, 0);
    const qa = quadrant(o, a);
    const qb = quadrant(o, b);
    if (qa !== qb) return qa - qb;
    const cr = cross(o, a, b);
    if (cr !== 0) return cr > 0 ? -1 : 1; // 逆时针顺序
    const da = (a.x - o.x) ** 2 + (a.y - o.y) ** 2;
    const db = (b.x - o.x) ** 2 + (b.y - o.y) ** 2;
    return da - db;
  });

  hooks.onSorted?.(idx);
  return { sorted: idx.map((i) => points[i]!), order: idx };
}
