// 闵可夫斯基和 · 实现（凸多边形，CCW）
export interface Pt {
  x: number;
  y: number;
}
export interface MinkHooks {
  onMerge?: (i: number, j: number) => void;
}
function cmp(a: Pt, b: Pt): boolean {
  const ca = a.y > 0 || (a.y === 0 && a.x >= 0);
  const cb = b.y > 0 || (b.y === 0 && b.x >= 0);
  if (ca !== cb) return ca;
  return a.x * b.y - a.y * b.x > 0;
}
export function minkowskiSum(A: Pt[], B: Pt[], hooks: MinkHooks = {}): Pt[] {
  const edgesA = A.map((p, i) => ({
    x: A[(i + 1) % A.length]!.x - p.x,
    y: A[(i + 1) % A.length]!.y - p.y,
  }));
  const edgesB = B.map((p, i) => ({
    x: B[(i + 1) % B.length]!.x - p.x,
    y: B[(i + 1) % B.length]!.y - p.y,
  }));
  const merged: Pt[] = [];
  let i = 0,
    j = 0;
  while (i < edgesA.length || j < edgesB.length) {
    if (j >= edgesB.length || (i < edgesA.length && cmp(edgesA[i]!, edgesB[j]!))) {
      merged.push(edgesA[i]!);
      i++;
    } else {
      merged.push(edgesB[j]!);
      j++;
    }
    hooks.onMerge?.(i, j);
  }
  // reconstruct from origin
  const res: Pt[] = [];
  let cur = { x: 0, y: 0 };
  for (const e of merged) {
    res.push({ ...cur });
    cur = { x: cur.x + e.x, y: cur.y + e.y };
  }
  return res;
}
