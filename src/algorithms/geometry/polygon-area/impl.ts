// =============================================================================
// 多边形面积 Polygon Area (Shoelace Formula) · 纯算法实现
// 用鞋带公式（Gauss 面积公式）计算简单多边形的有向/无向面积。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PolygonAreaHooks {
  /** 处理第 i 条边 (p[i], p[i+1])，给出叉积贡献 cross = x_i·y_{i+1} − x_{i+1}·y_i。 */
  onEdge?: (i: number, cross: number) => void;
  /** 累加一次：当前的有向面积之和（未除以 2）。 */
  onAccumulate?: (sum: number) => void;
  /** 完成，给出最终面积（无向，非负）。 */
  onDone?: (area: number) => void;
}

/**
 * 多边形面积 —— **鞋带公式**（Gauss 面积公式）。
 *
 * 给定按顺时针或逆时针顺序给出的简单多边形顶点 `p0, p1, …, p_{n-1}`，其**有向面积**为：
 *
 * ```
 * A = 1/2 · Σ_{i=0..n-1} ( x_i · y_{i+1} − x_{i+1} · y_i )
 * ```
 *
 * 其中下标对 n 取模（最后一条边连接 p_{n-1} 与 p_0）。
 *
 * - 顶点为**逆时针**时，A > 0；**顺时针**时，A < 0；本实现返回 `|A|`。
 * - 对**自相交**多边形，鞋带公式给出的是「带符号面积」（按绕数加权），不等于实际几何面积。
 * - 退化情况：n < 3 时面积为 0。
 *
 * 时间 `O(n)`，空间 `O(1)`。
 *
 * @param points 顶点数组（按边界顺序，首尾不必相同）
 * @param hooks 可选事件钩子
 * @returns 多边形面积（非负）
 */
export function polygonArea(points: readonly Point[], hooks: PolygonAreaHooks = {}): number {
  const n = points.length;
  if (n < 3) {
    hooks.onDone?.(0);
    return 0;
  }
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const cur = points[i]!;
    const nxt = points[(i + 1) % n]!;
    const cross = cur.x * nxt.y - nxt.x * cur.y;
    hooks.onEdge?.(i, cross);
    sum += cross;
    hooks.onAccumulate?.(sum);
  }
  const area = Math.abs(sum) / 2;
  hooks.onDone?.(area);
  return area;
}

/**
 * 有向面积（带符号）：逆时针为正、顺时针为负。便于判定顶点顺序。
 */
export function signedArea(points: readonly Point[]): number {
  const n = points.length;
  if (n < 3) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const cur = points[i]!;
    const nxt = points[(i + 1) % n]!;
    sum += cur.x * nxt.y - nxt.x * cur.y;
  }
  return sum / 2;
}
