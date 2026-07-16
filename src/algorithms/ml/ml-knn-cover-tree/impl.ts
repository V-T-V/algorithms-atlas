// 覆盖树 KNN · 实现（简化版：返回最近邻距离）
export interface CoverNode {
  point: number[];
  children: CoverNode[];
}
function dist(a: number[], b: number[]): number {
  return Math.hypot(...a.map((v, i) => v - b[i]!));
}
export function bruteNearest(pts: number[][], query: number[]): number {
  if (pts.length === 0) return Infinity;
  return Math.min(...pts.map((p) => dist(p, query)));
}
// Simplified cover tree: just build a chain by nearest-first insertion (placeholder structure).
export function buildCoverTree(pts: number[][]): CoverNode | null {
  if (pts.length === 0) return null;
  const root: CoverNode = { point: pts[0]!, children: [] };
  for (let i = 1; i < pts.length; i++) root.children.push({ point: pts[i]!, children: [] });
  return root;
}
export function coverTreeNearest(root: CoverNode | null, query: number[]): number {
  if (!root) return Infinity;
  let best = dist(root.point, query);
  for (const c of root.children) best = Math.min(best, dist(c.point, query));
  return best;
}
