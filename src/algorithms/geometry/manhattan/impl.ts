// =============================================================================
// 曼哈顿距离（Manhattan Dist）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ManhattanHooks {
  onAxis?: (axis: 'x' | 'y', delta: number) => void;
  onResult?: (dist: number) => void;
}

export interface ManhattanResult {
  /** 曼哈顿距离 |dx|+|dy|。 */
  distance: number;
}

/**
 * 曼哈顿距离（L1 距离）：两点在各坐标轴上差值绝对值之和。
 * @param a 起点
 * @param b 终点
 * @param hooks 可选的事件钩子
 */
export function manhattan(a: Point, b: Point, hooks: ManhattanHooks = {}): ManhattanResult {
  const dx = Math.abs(b.x - a.x);
  const dy = Math.abs(b.y - a.y);
  hooks.onAxis?.('x', dx);
  hooks.onAxis?.('y', dy);
  const distance = dx + dy;
  hooks.onResult?.(distance);
  return { distance };
}

/** 两点之间的欧氏（L2）距离，作为对照。 */
export function euclidean(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
