// =============================================================================
// 拉格朗日插值 Lagrange Interpolation · 纯算法实现
// 给定 n 个数据点 (x_i, y_i)，构造过这些点的多项式，求任意 x 处的值。
// =============================================================================

export interface DataPoint {
  x: number;
  y: number;
}

export interface LagrangeHooks {
  /** 计算第 i 个基多项式时触发。 */
  onBasis?: (i: number, basisValue: number) => void;
}

/**
 * 拉格朗日插值：求多项式在 x 处的值。
 * P(x) = Σ y_i · L_i(x)，其中 L_i(x) = Π_{j≠i} (x - x_j) / (x_i - x_j)
 * @param points 数据点（x 各不相同）
 * @param x 求值点
 */
export function lagrangeInterpolate(
  points: readonly DataPoint[],
  x: number,
  hooks: LagrangeHooks = {},
): number {
  let result = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    let basis = 1;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const pi = points[i]!;
      const pj = points[j]!;
      basis *= (x - pj.x) / (pi.x - pj.x);
    }
    hooks.onBasis?.(i, basis);
    result += points[i]!.y * basis;
  }
  return result;
}
