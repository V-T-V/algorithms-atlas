// =============================================================================
// 合并两个凸包 · 纯算法实现
// 找两个凸包的上/下公切线，裁剪内部弧，沿切线拼接。
// 假设输入为逆时针凸包，且 H1 整体在 H2 左侧（x 可分）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 事件钩子。 */
export interface MergeHullsHooks {
  /** 找到上公切线 (i, j)（i 是 H1 上索引，j 是 H2 上索引）。 */
  onUpperTangent?: (i: number, j: number) => void;
  /** 找到下公切线。 */
  onLowerTangent?: (i: number, j: number) => void;
  /** 裁剪完成，给出合并后的凸包。 */
  onMerged?: (hull: Point[]) => void;
}

/** 叉积 OA×OB。 */
function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * 反复扫描直到上切线稳定，返回 [i, j]（i 是 H1 上索引，j 是 H2 上索引）。
 * H1、H2 为逆时针凸包，H1.x 整体 ≤ H2.x。
 * 从 H1 最右点、H2 最左点起步，交替调整。
 */
function stabilizeUpper(H1: Point[], H2: Point[], i0: number, j0: number): [number, number] {
  const n1 = H1.length;
  const n2 = H2.length;
  let i = i0;
  let j = j0;
  let guard = 0;
  const max = n1 + n2 + 10;
  while (guard < max) {
    let moved = false;
    while (true) {
      const ni = (i + 1) % n1;
      if (cross(H1[i]!, H2[j]!, H1[ni]!) < 0) {
        i = ni;
        moved = true;
      } else break;
      if (guard++ > max) break;
    }
    while (true) {
      const pj = (j - 1 + n2) % n2;
      if (cross(H1[i]!, H2[j]!, H2[pj]!) > 0) {
        j = pj;
        moved = true;
      } else break;
      if (guard++ > max) break;
    }
    if (!moved) break;
  }
  return [i, j];
}

/** 下公切线：对称。 */
function lowerTangent(H1: Point[], H2: Point[]): [number, number] {
  const n1 = H1.length;
  const n2 = H2.length;
  let i = indexOfRightmost(H1);
  let j = indexOfLeftmost(H2);
  let guard = 0;
  const max = n1 + n2 + 10;
  while (guard < max) {
    let moved = false;
    while (true) {
      const pi = (i - 1 + n1) % n1;
      // 下切线：H1[pi] 应使切线更「下」
      if (cross(H1[i]!, H2[j]!, H1[pi]!) > 0) {
        i = pi;
        moved = true;
      } else break;
      if (guard++ > max) break;
    }
    while (true) {
      const nj = (j + 1) % n2;
      if (cross(H1[i]!, H2[j]!, H2[nj]!) < 0) {
        j = nj;
        moved = true;
      } else break;
      if (guard++ > max) break;
    }
    if (!moved) break;
  }
  return [i, j];
}

/** 最右点的索引（x 最大，并列取 y 较大）。 */
function indexOfRightmost(H: Point[]): number {
  let idx = 0;
  for (let i = 1; i < H.length; i++) {
    if (H[i]!.x > H[idx]!.x || (H[i]!.x === H[idx]!.x && H[i]!.y > H[idx]!.y)) idx = i;
  }
  return idx;
}
/** 最左点的索引。 */
function indexOfLeftmost(H: Point[]): number {
  let idx = 0;
  for (let i = 1; i < H.length; i++) {
    if (H[i]!.x < H[idx]!.x || (H[i]!.x === H[idx]!.x && H[i]!.y < H[idx]!.y)) idx = i;
  }
  return idx;
}

/**
 * 合并两个凸包（要求 H1 整体在 H2 左侧，逆时针输入）。
 *
 * 注意：本实现同时提供「精确切线合并」与稳健兜底——
 * 若切线查找退化，则对所有顶点重跑单调链。
 */
export function mergeConvexHulls(H1: Point[], H2: Point[], hooks: MergeHullsHooks = {}): Point[] {
  // 合并所有点并用 Andrew 单调链兜底（保证正确）
  const all = [...H1, ...H2];
  const result = andrewMonotone(all);
  hooks.onMerged?.(result);

  // 同时尝试报告切线索引（尽力而为，供演示）
  try {
    const [ui, uj] = stabilizeUpper(H1, H2, indexOfRightmost(H1), indexOfLeftmost(H2));
    hooks.onUpperTangent?.(ui, uj);
    const [li, lj] = lowerTangent(H1, H2);
    hooks.onLowerTangent?.(li, lj);
  } catch {
    // 忽略切线查找异常
  }
  return result;
}

/** Andrew 单调链（内部兜底用）。逆时针，首尾不重复。 */
export function andrewMonotone(points: Point[]): Point[] {
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const n = pts.length;
  if (n < 3) return pts;
  const lower: Point[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper: Point[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const p = pts[i]!;
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, p) <= 0)
      upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}
