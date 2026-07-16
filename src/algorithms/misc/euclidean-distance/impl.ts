// =============================================================================
// 欧氏距离（Euclidean Distance）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 支持两点（二维）与 n 维向量两种形式。
// =============================================================================

/** 一个 n 维点。 */
export interface Point {
  /** 各维坐标。长度 = 维度。 */
  coords: number[];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface EuclideanDistanceHooks {
  /** 开始处理第 k 个维度（0-based）。 */
  onDimension?: (k: number, aK: number, bK: number) => void;
  /** 第 k 维的差值平方已计算。 */
  onDiffSquared?: (k: number, diff: number, sq: number, sum: number) => void;
  /** 已累加完所有维度，得到平方和。 */
  onSum?: (sum: number) => void;
  /** 开方得到最终距离。 */
  onResult?: (distance: number) => void;
}

/**
 * 计算两个 n 维向量之间的欧氏距离：
 *   d(a, b) = √( Σ (aᵢ − bᵢ)² )
 *
 * 两个向量维度必须相同。空向量（0 维）距离为 0。
 *
 * @param a 第一个向量
 * @param b 第二个向量
 * @param hooks 可选的事件钩子
 * @returns 欧氏距离
 */
export function euclideanDistance(
  a: readonly number[],
  b: readonly number[],
  hooks: EuclideanDistanceHooks = {},
): number {
  if (a.length !== b.length) {
    throw new Error(`维度不匹配 / dimension mismatch: ${a.length} vs ${b.length}`);
  }

  let sum = 0;
  for (let k = 0; k < a.length; k++) {
    const aK = a[k]!;
    const bK = b[k]!;
    hooks.onDimension?.(k, aK, bK);
    const diff = aK - bK;
    const sq = diff * diff;
    sum += sq;
    hooks.onDiffSquared?.(k, diff, sq, sum);
  }
  hooks.onSum?.(sum);
  const distance = Math.sqrt(sum);
  hooks.onResult?.(distance);
  return distance;
}

/** 平方欧氏距离（省去开方，常用于比较）。 */
export function squaredDistance(a: readonly number[], b: readonly number[]): number {
  if (a.length !== b.length) {
    throw new Error(`维度不匹配 / dimension mismatch: ${a.length} vs ${b.length}`);
  }
  let sum = 0;
  for (let k = 0; k < a.length; k++) {
    const diff = a[k]! - b[k]!;
    sum += diff * diff;
  }
  return sum;
}
