// =============================================================================
// Voronoi图（Voronoi）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 对偶于 Delaunay：每条 Delaunay 边对应一条 Voronoi 边（连接两侧三角形外心）。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}
export interface VoronoiEdge {
  /** 两端点（外心）。若某侧无三角形则为 null（边延伸到无穷）。 */
  from: Point | null;
  to: Point | null;
  /** 这条边分隔的两个站点下标。 */
  sites: [number, number];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface VoronoiHooks {
  onDualEdge?: (edge: VoronoiEdge) => void;
  onResult?: (edges: VoronoiEdge[]) => void;
}

export interface VoronoiResult {
  /** Voronoi 边集合。 */
  edges: VoronoiEdge[];
}

/** 三点外心；共线返回 null。 */
function circumcenter(a: Point, b: Point, c: Point): Point | null {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-12) return null;
  const ax2 = a.x * a.x + a.y * a.y;
  const bx2 = b.x * b.x + b.y * b.y;
  const cx2 = c.x * c.x + c.y * c.y;
  return {
    x: (ax2 * (b.y - c.y) + bx2 * (c.y - a.y) + cx2 * (a.y - b.y)) / d,
    y: (ax2 * (c.x - b.x) + bx2 * (a.x - c.x) + cx2 * (b.x - a.x)) / d,
  };
}

/**
 * Voronoi 图（作为 Delaunay 的对偶）：
 * 对每对相邻站点 (i,j)，求共享边 (i,j) 的 Delaunay 三角形的外心并相连。
 * 若边只属于一个三角形，则一端为 null（射线方向）。
 * @param points 站点
 * @param hooks 可选的事件钩子
 */
export function voronoi(points: Point[], hooks: VoronoiHooks = {}): VoronoiResult {
  const n = points.length;
  const edgeTris = new Map<string, Point[]>(); // key "min,max" -> 外心列表

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const cc = circumcenter(points[i]!, points[j]!, points[k]!);
        if (!cc) continue;
        for (const [a, b] of [
          [i, j],
          [j, k],
          [i, k],
        ] as const) {
          const key = a < b ? `${a},${b}` : `${b},${a}`;
          const arr = edgeTris.get(key) ?? [];
          arr.push(cc);
          edgeTris.set(key, arr);
        }
      }
    }
  }

  const edges: VoronoiEdge[] = [];
  for (const [key, ccs] of edgeTris) {
    const [a, b] = key.split(',').map(Number) as [number, number];
    const from = ccs[0] ?? null;
    const to = ccs[1] ?? null;
    const edge: VoronoiEdge = { from, to, sites: [a, b] };
    hooks.onDualEdge?.(edge);
    edges.push(edge);
  }
  hooks.onResult?.(edges);
  return { edges };
}
