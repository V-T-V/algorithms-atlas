// =============================================================================
// 近邻传播聚类（Affinity Propagation）· 纯算法实现
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface AffinityResult {
  /** 每个点的簇编号（= 其代表点在原数组中的下标）。 */
  labels: number[];
  /** 被选为代表点（簇心）的原下标集合。 */
  exemplars: number[];
  /** 实际迭代轮数。 */
  iterations: number;
  /** 是否收敛。 */
  converged: boolean;
}

export interface AffinityHooks {
  /** 每轮迭代结束。 */
  onIteration?: (iter: number, exemplars: number[]) => void;
  /** 完成。 */
  onDone?: (result: AffinityResult) => void;
}

function dist2(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/**
 * 近邻传播聚类。
 * @param points 数据点
 * @param preference 偏好度（对角线值），默认取相似度中位数（中等簇数）
 * @param damping 阻尼系数 λ ∈ [0,1)，默认 0.5
 * @param maxIter 最大迭代数
 * @param convergenceIters 连续多少轮代表点不变视为收敛
 */
export function affinityPropagation(
  points: readonly Point[],
  preference?: number,
  damping = 0.5,
  maxIter = 200,
  convergenceIters = 15,
  hooks: AffinityHooks = {},
): AffinityResult {
  const n = points.length;
  if (n === 0) return { labels: [], exemplars: [], iterations: 0, converged: true };
  if (damping < 0 || damping >= 1) throw new RangeError(`damping 须 ∈ [0,1)，收到 ${damping}`);

  // 构造相似度矩阵 s(i,k) = −||xi−xk||²
  const s: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      s[i]![k] = i === k ? 0 : -dist2(points[i]!, points[k]!);
    }
  }
  // preference = 对角线值
  let pref = preference;
  if (pref === undefined) {
    const offDiag: number[] = [];
    for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) if (i !== k) offDiag.push(s[i]![k]!);
    offDiag.sort((a, b) => a - b);
    pref = offDiag.length > 0 ? offDiag[Math.floor(offDiag.length / 2)]! : 0;
  }
  for (let k = 0; k < n; k++) s[k]![k] = pref;

  const R: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const A: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  let converged = false;
  let iter = 0;
  let stableCount = 0;
  let prevExemplars: number[] = [];

  for (; iter < maxIter; iter++) {
    // 更新责任度 R
    const newR: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      // 预计算 max1, max2 of (A(i,·) + S(i,·))
      let max1 = -Infinity;
      let max2 = -Infinity;
      let maxK = -1;
      for (let k = 0; k < n; k++) {
        const v = A[i]![k]! + s[i]![k]!;
        if (v > max1) {
          max2 = max1;
          max1 = v;
          maxK = k;
        } else if (v > max2) {
          max2 = v;
        }
      }
      for (let k = 0; k < n; k++) {
        const sub = k === maxK ? max2 : max1;
        newR[i]![k] = s[i]![k]! - sub;
      }
    }
    // 阻尼
    for (let i = 0; i < n; i++)
      for (let k = 0; k < n; k++) {
        R[i]![k] = damping * R[i]![k]! + (1 - damping) * newR[i]![k]!;
      }

    // 更新可用度 A
    const newA: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let k = 0; k < n; k++) {
      // Σ_{i'≠k} max{0, r(i',k)}
      let sumPos = 0;
      for (let ip = 0; ip < n; ip++) {
        if (ip === k) continue;
        sumPos += Math.max(0, R[ip]![k]!);
      }
      for (let i = 0; i < n; i++) {
        if (i === k) {
          newA[i]![k] = sumPos; // 自可用度
        } else {
          newA[i]![k] = Math.min(0, R[k]![k]! + sumPos - Math.max(0, R[i]![k]!));
        }
      }
    }
    for (let i = 0; i < n; i++)
      for (let k = 0; k < n; k++) {
        A[i]![k] = damping * A[i]![k]! + (1 - damping) * newA[i]![k]!;
      }

    // 计算当前代表点
    const exemplars = currentExemplars(R, A);
    hooks.onIteration?.(iter, exemplars);
    if (exemplars.join(',') === prevExemplars.join(',')) {
      stableCount++;
      if (stableCount >= convergenceIters) {
        converged = true;
        break;
      }
    } else {
      stableCount = 0;
    }
    prevExemplars = exemplars;
  }

  const exemplars = currentExemplars(R, A);
  // 分配标签：每个点选代表点中 a+r 最大的那个
  const labels = new Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    let bestEx = exemplars[0] ?? 0;
    let bestV = -Infinity;
    for (const ex of exemplars) {
      const v = A[i]![ex]! + R[i]![ex]!;
      if (v > bestV) {
        bestV = v;
        bestEx = ex;
      }
    }
    labels[i] = exemplars.indexOf(bestEx);
  }
  const result: AffinityResult = { labels, exemplars, iterations: iter + 1, converged };
  hooks.onDone?.(result);
  return result;
}

/** 从 R、A 求当前代表点：r(k,k)+a(k,k) > 0 的 k。 */
function currentExemplars(R: number[][], A: number[][]): number[] {
  const n = R.length;
  const out: number[] = [];
  for (let k = 0; k < n; k++) {
    if (R[k]![k]! + A[k]![k]! > 0) out.push(k);
  }
  if (out.length === 0 && n > 0) {
    // 退化：选 a+r 最大的点
    let bestK = 0;
    let bestV = -Infinity;
    for (let k = 0; k < n; k++) {
      const v = R[k]![k]! + A[k]![k]!;
      if (v > bestV) {
        bestV = v;
        bestK = k;
      }
    }
    out.push(bestK);
  }
  return out;
}
