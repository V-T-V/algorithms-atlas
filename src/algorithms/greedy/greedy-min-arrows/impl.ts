// =============================================================================
// 最少箭射爆气球 · 纯算法实现 (LeetCode 452)
// points[i] = [start, end]。按 end 排序贪心。
// =============================================================================
export interface GreedyMinArrowsHooks {
  onShoot?: (position: number, burstCount: number) => void;
  onConclude?: (arrows: number) => void;
}

export function greedyMinArrows(
  points: ReadonlyArray<readonly [number, number]>,
  hooks: GreedyMinArrowsHooks = {},
): number {
  if (points.length === 0) {
    hooks.onConclude?.(0);
    return 0;
  }
  const sorted = [...points].sort((a, b) => a[1] - b[1]);
  let arrows = 1;
  let pos = sorted[0]![1];
  let burst = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i]![0]! > pos) {
      hooks.onShoot?.(pos, burst);
      arrows++;
      pos = sorted[i]![1]!;
      burst = 1;
    } else {
      burst++;
    }
  }
  hooks.onShoot?.(pos, burst);
  hooks.onConclude?.(arrows);
  return arrows;
}
