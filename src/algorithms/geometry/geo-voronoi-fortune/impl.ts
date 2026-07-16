// =============================================================================
// Voronoi 图（Fortune 等价 · 空圆法）· 纯算法实现
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

export interface VoronoiVertex {
  /** 对应的三个 site 下标。 */
  sites: [number, number, number];
  center: Point;
  radius: number;
}

export interface VoronoiHooks {
  /** 考察一个三元组时调用（是否形成空圆、是否成为顶点）。 */
  onTriple?: (sites: [number, number, number], empty: boolean) => void;
  onVertex?: (v: VoronoiVertex) => void;
}

/**
 * 三角形 (a,b,c) 的外心（过三点的圆心）；共线返回 null。
 */
export function circumcenter(a: Point, b: Point, c: Point): Point | null {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-12) return null;
  const aa = a.x * a.x + a.y * a.y;
  const bb = b.x * b.x + b.y * b.y;
  const cc = c.x * c.x + c.y * c.y;
  const ux = (aa * (b.y - c.y) + bb * (c.y - a.y) + cc * (a.y - b.y)) / d;
  const uy = (aa * (c.x - b.x) + bb * (a.x - c.x) + cc * (b.x - a.x)) / d;
  return { x: ux, y: uy };
}

/**
 * 计算 sites 的 Voronoi 顶点（空圆外心）。
 * @param sites 生成点集
 */
export function voronoi(sites: readonly Point[], hooks: VoronoiHooks = {}): VoronoiVertex[] {
  const n = sites.length;
  const verts: VoronoiVertex[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const a = sites[i]!;
        const b = sites[j]!;
        const c = sites[k]!;
        const center = circumcenter(a, b, c);
        if (!center) continue;
        const r = Math.hypot(center.x - a.x, center.y - a.y);
        let empty = true;
        for (let m = 0; m < n; m++) {
          if (m === i || m === j || m === k) continue;
          const p = sites[m]!;
          if (Math.hypot(p.x - center.x, p.y - center.y) < r - 1e-9) {
            empty = false;
            break;
          }
        }
        hooks.onTriple?.([i, j, k], empty);
        if (empty) {
          const v: VoronoiVertex = { sites: [i, j, k], center, radius: r };
          verts.push(v);
          hooks.onVertex?.(v);
        }
      }
    }
  }
  return verts;
}
