// =============================================================================
// Delaunay三角剖分（Delaunay）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 简单暴力版：枚举所有三元组，用「空圆性质」判定是否为 Delaunay 三角形。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}
/** 以三个点的原始下标表示的三角形。 */
export interface Triangle {
  i: number;
  j: number;
  k: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DelaunayHooks {
  onCheck?: (tri: Triangle, ok: boolean) => void;
  onResult?: (tris: Triangle[]) => void;
}

export interface DelaunayResult {
  /** Delaunay 三角形集合（下标组）。 */
  triangles: Triangle[];
}

/** 三点外接圆圆心与半径；共线返回 null。 */
function circumcircle(a: Point, b: Point, c: Point): { c: Point; r2: number } | null {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-12) return null;
  const ax2 = a.x * a.x + a.y * a.y;
  const bx2 = b.x * b.x + b.y * b.y;
  const cx2 = c.x * c.x + c.y * c.y;
  const ux = (ax2 * (b.y - c.y) + bx2 * (c.y - a.y) + cx2 * (a.y - b.y)) / d;
  const uy = (ax2 * (c.x - b.x) + bx2 * (a.x - c.x) + cx2 * (b.x - a.x)) / d;
  return { c: { x: ux, y: uy }, r2: (a.x - ux) ** 2 + (a.y - uy) ** 2 };
}

/**
 * Delaunay 三角剖分（空圆性质，O(n^4) 暴力版）：
 * 一个三角形是 Delaunay 的 ⟺ 其外接圆内部不含任何其他点。
 * @param points 点集
 * @param hooks 可选的事件钩子
 */
export function delaunay(points: Point[], hooks: DelaunayHooks = {}): DelaunayResult {
  const n = points.length;
  const triangles: Triangle[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const cc = circumcircle(points[i]!, points[j]!, points[k]!);
        if (!cc) continue;
        let ok = true;
        for (let m = 0; m < n; m++) {
          if (m === i || m === j || m === k) continue;
          const dx = points[m]!.x - cc.c.x;
          const dy = points[m]!.y - cc.c.y;
          if (dx * dx + dy * dy < cc.r2 - 1e-9) {
            ok = false;
            break;
          }
        }
        hooks.onCheck?.({ i, j, k }, ok);
        if (ok) triangles.push({ i, j, k });
      }
    }
  }
  hooks.onResult?.(triangles);
  return { triangles };
}
