// =============================================================================
// 三角形面积（Triangle Area）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface TriangleAreaHooks {
  onComputeCross?: (cross2: number) => void;
  onResult?: (area: number) => void;
}

export interface TriangleAreaResult {
  /** 有向面积（带符号：逆时针为正）。 */
  signedArea: number;
  /** 无符号面积。 */
  area: number;
}

/** 叉积 (b-a) × (c-a)。 */
function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/**
 * 三角形面积：用叉积公式 S = |cross| / 2。
 * @param pts 三个顶点
 * @param hooks 可选的事件钩子
 */
export function triangleArea(
  pts: [Point, Point, Point],
  hooks: TriangleAreaHooks = {},
): TriangleAreaResult {
  const [a, b, c] = pts;
  const cross2 = cross(a, b, c);
  hooks.onComputeCross?.(cross2);
  const signedArea = cross2 / 2;
  const area = Math.abs(signedArea);
  hooks.onResult?.(area);
  return { signedArea, area };
}
