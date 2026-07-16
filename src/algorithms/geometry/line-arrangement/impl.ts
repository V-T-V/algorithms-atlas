// =============================================================================
// 直线排列 · 纯算法实现
// 计算所有两两交点（朴素 O(n²)），并给出排列的顶点/边/面计数。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 直线：用 a·x + b·y = c 表示（要求 (a,b)≠(0,0)）。 */
export interface Line {
  a: number;
  b: number;
  c: number;
}

/** 事件钩子。 */
export interface LineArrangementHooks {
  /** 计算直线 i 与 j 的交点。 */
  onIntersect?: (i: number, j: number, p: Point | null) => void;
  /** 完成所有交点计算。 */
  onDone?: (vertices: Point[], verticesCount: number, edges: number, faces: number) => void;
}

export interface LineArrangementResult {
  /** 所有交点（去重前）。 */
  intersections: Array<{ i: number; j: number; point: Point }>;
  /** 不同交点数（无三线共点时 = C(n,2)）。 */
  vertexCount: number;
  /** 边数 = n²（含射线，一般位置）。 */
  edgeCount: number;
  /** 面数 = n(n+1)/2 + 1（一般位置）。 */
  faceCount: number;
}

/**
 * 计算两条直线 a1·x+b1·y=c1 与 a2·x+b2·y=c2 的交点。
 * 平行（含重合）时返回 null。用行列式法。
 */
export function intersectLines(l1: Line, l2: Line): Point | null {
  const det = l1.a * l2.b - l2.a * l1.b;
  if (Math.abs(det) < 1e-12) return null; // 平行或重合
  const x = (l1.c * l2.b - l2.c * l1.b) / det;
  const y = (l1.a * l2.c - l2.a * l1.c) / det;
  return { x, y };
}

/**
 * 构造直线排列：求所有交点并计算计数。
 * 假设无三线共点、无平行（一般位置）；若存在平行/共点，计数按实际交点数给出。
 */
export function lineArrangement(
  lines: Line[],
  hooks: LineArrangementHooks = {},
): LineArrangementResult {
  const n = lines.length;
  const intersections: Array<{ i: number; j: number; point: Point }> = [];
  const pointSet = new Set<string>();

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const p = intersectLines(lines[i]!, lines[j]!);
      hooks.onIntersect?.(i, j, p);
      if (p) {
        intersections.push({ i, j, point: p });
        // 用四舍五入的坐标去重（应对三线共点）
        const key = `${p.x.toFixed(6)},${p.y.toFixed(6)}`;
        pointSet.add(key);
      }
    }
  }

  // 顶点数 = 不同交点数
  const vertexCount = pointSet.size;
  // 边数：一般位置下每条直线被分成 n 段 → n²；这里给一般位置公式
  const edgeCount = n * n;
  // 面数：F = n(n+1)/2 + 1（一般位置）
  const faceCount = (n * (n + 1)) / 2 + 1;

  const vertices = intersections.map((x) => x.point);
  hooks.onDone?.(vertices, vertexCount, edgeCount, faceCount);
  return { intersections, vertexCount, edgeCount, faceCount };
}
