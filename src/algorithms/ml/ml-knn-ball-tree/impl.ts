// 球树 KNN · 实现（返回最近邻距离）
export interface BallNode {
  center: number[];
  radius: number;
  left: BallNode | null;
  right: BallNode | null;
  point: number[] | null;
}
function farthestFrom(pts: number[][], p: number[]): number {
  let bi = 0,
    bd = -1;
  for (let i = 0; i < pts.length; i++) {
    const d = Math.hypot(...pts[i]!.map((v, j) => v - p[j]!));
    if (d > bd) {
      bd = d;
      bi = i;
    }
  }
  return bi;
}
function buildBall(pts: number[][]): BallNode {
  const n = pts.length;
  const center = pts[0]!.map((_, j) => pts.reduce((s, p) => s + p[j]!, 0) / n);
  let radius = 0;
  for (const p of pts) radius = Math.max(radius, Math.hypot(...p.map((v, j) => v - center[j]!)));
  if (n === 1) return { center, radius, left: null, right: null, point: pts[0]! };
  const a = pts[farthestFrom(pts, center)]!;
  const b = pts[farthestFrom(pts, a)]!;
  const left = pts.filter(
    (p) => Math.hypot(...p.map((v, j) => v - a[j]!)) <= Math.hypot(...p.map((v, j) => v - b[j]!)),
  );
  const right = pts.filter(
    (p) =>
      !(Math.hypot(...p.map((v, j) => v - a[j]!)) <= Math.hypot(...p.map((v, j) => v - b[j]!))),
  );
  return {
    center,
    radius,
    left: left.length ? buildBall(left) : null,
    right: right.length ? buildBall(right) : null,
    point: null,
  };
}
export function ballTreeKnn(pts: number[][], query: number[]): number {
  if (pts.length === 0) return Infinity;
  const root = buildBall(pts);
  let best = Infinity;
  const visit = (node: BallNode | null): void => {
    if (!node) return;
    const lb = Math.hypot(...query.map((v, j) => v - node.center[j]!)) - node.radius;
    if (lb > best) return;
    if (node.point) {
      best = Math.min(best, Math.hypot(...query.map((v, j) => v - node.point![j]!)));
      return;
    }
    visit(node.left);
    visit(node.right);
  };
  visit(root);
  return best;
}
