// =============================================================================
// 最大重叠区间 · 纯算法实现
// 输入若干区间，返回任一点被覆盖的最大区间数及该点位置。
// =============================================================================
export interface GreedyMaxIntersectionHooks {
  onEvent?: (pos: number, delta: number, current: number) => void;
  onMax?: (pos: number, maxCount: number) => void;
  onConclude?: (maxCount: number, atPos: number) => void;
}

export interface MaxIntersectionResult {
  maxCount: number;
  atPos: number;
}

export function greedyMaxIntersection(
  intervals: ReadonlyArray<readonly [number, number]>,
  hooks: GreedyMaxIntersectionHooks = {},
): MaxIntersectionResult {
  type Ev = [number, number]; // [pos, delta]
  const events: Ev[] = [];
  for (const iv of intervals) {
    events.push([iv[0], 1]);
    events.push([iv[1], -1]);
  }
  // 排序：先按位置；同位置先处理离开（-1）再进入（+1），避免把相切算重叠
  events.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));

  let current = 0;
  let maxCount = 0;
  let atPos = 0;
  for (const [pos, delta] of events) {
    current += delta;
    hooks.onEvent?.(pos, delta, current);
    if (current > maxCount) {
      maxCount = current;
      atPos = pos;
      hooks.onMax?.(pos, maxCount);
    }
  }
  hooks.onConclude?.(maxCount, atPos);
  return { maxCount, atPos };
}
