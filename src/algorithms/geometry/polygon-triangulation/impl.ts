// =============================================================================
// 多边形三角剖分（耳切法）· 纯算法实现
// 反复剪去「耳尖」（凸顶点且三角形内无其它顶点）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 一个三角形（三个顶点索引，指向原多边形）。 */
export interface Triangle {
  a: number;
  b: number;
  c: number;
}

/** 事件钩子。 */
export interface TriangulationHooks {
  /** 测试顶点 i 是否为耳（凸且无内点）。 */
  onTestEar?: (i: number, isEar: boolean) => void;
  /** 剪下耳 (prev, i, next)。 */
  onClipEar?: (prev: number, i: number, next: number, remaining: number) => void;
  /** 完成。 */
  onDone?: (triangles: Triangle[]) => void;
}

/** 叉积 OA×OB。 */
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/** 点 p 是否在三角形 (a,b,c) 内（含边界）。 */
function pointInTriangle(p: Point, a: Point, b: Point, c: Point): boolean {
  const d1 = cross(a, b, p);
  const d2 = cross(b, c, p);
  const d3 = cross(c, a, p);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

/**
 * 耳切法三角剖分（要求逆时针简单多边形）。
 *
 * @param points 顶点（逆时针，首尾不重复）
 * @param hooks 可选事件钩子
 * @returns 三角形数组（每个含 3 个原顶点索引）
 */
export function triangulate(points: Point[], hooks: TriangulationHooks = {}): Triangle[] {
  const n = points.length;
  if (n < 3) return [];
  if (n === 3) {
    const tri: Triangle = { a: 0, b: 1, c: 2 };
    hooks.onDone?.([tri]);
    return [tri];
  }

  // 工作索引表（按原顺序的顶点索引链表）
  let idx = Array.from({ length: n }, (_, i) => i);
  const triangles: Triangle[] = [];

  /** 取工作索引第 k 项对应的原顶点。 */
  const pt = (k: number): Point => points[idx[k]!]!;

  let guard = 0;
  const maxGuard = n * n + 10;
  while (idx.length > 3) {
    let clipped = false;
    const m = idx.length;
    for (let i = 0; i < m; i++) {
      const prev = (i - 1 + m) % m;
      const next = (i + 1) % m;
      const a = pt(prev);
      const b = pt(i);
      const c = pt(next);
      // 凸判定：逆时针多边形中，凸顶点的叉积 > 0
      const cr = cross(a, b, c);
      if (cr <= 0) {
        hooks.onTestEar?.(idx[i]!, false);
        continue; // 非凸（含共线），不是耳
      }
      // 检查无其它剩余顶点落在三角形内
      let isEar = true;
      for (let k = 0; k < m; k++) {
        if (k === prev || k === i || k === next) continue;
        if (pointInTriangle(pt(k), a, b, c)) {
          isEar = false;
          break;
        }
      }
      hooks.onTestEar?.(idx[i]!, isEar);
      if (!isEar) continue;

      // 剪耳
      triangles.push({ a: idx[prev]!, b: idx[i]!, c: idx[next]! });
      hooks.onClipEar?.(idx[prev]!, idx[i]!, idx[next]!, m - 1);
      // 从工作表中删除 i
      idx = idx.filter((_, k) => k !== i);
      clipped = true;
      break;
    }
    if (!clipped) {
      // 防御：理论上不应发生，但退化情形下兜底退出
      guard++;
      if (guard > maxGuard) break;
    }
  }
  // 最后一个三角形
  if (idx.length === 3) {
    triangles.push({ a: idx[0]!, b: idx[1]!, c: idx[2]! });
  }
  hooks.onDone?.(triangles);
  return triangles;
}
