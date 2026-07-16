// 贪心线段覆盖 · 实现
export interface ScHooks {
  onPlace?: (rightEnd: number, covered: number) => void;
  onConclude?: (count: number) => void;
}
export function segmentCover(points: readonly number[], len: number, hooks: ScHooks = {}): number {
  const pts = [...points].sort((a, b) => a - b);
  let count = 0,
    i = 0;
  while (i < pts.length) {
    const rightEnd = pts[i]! + len;
    let covered = 0;
    while (i < pts.length && pts[i]! <= rightEnd) {
      covered++;
      i++;
    }
    count++;
    hooks.onPlace?.(rightEnd, covered);
  }
  hooks.onConclude?.(count);
  return count;
}
