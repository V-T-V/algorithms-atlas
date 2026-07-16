// =============================================================================
// Clenshaw-Curtis 求积 · 纯算法实现
// =============================================================================

export interface CcNodes {
  nodes: number[]; // x_k
  weights: number[]; // w_k
  a: number;
  b: number;
}

/** 计算 N+1 个 Clenshaw-Curtis 节点与权（N 为偶数时公式最简单）。 */
export function clenshawCurtis(N: number, a = -1, b = 1): CcNodes {
  if (N < 1) throw new RangeError('N 必须 ≥ 1');
  if (N % 2 !== 0) N += 1; // 取偶数
  const mid = (a + b) / 2;
  const half = (b - a) / 2;
  // 节点
  const nodes: number[] = [];
  for (let k = 0; k <= N; k++) {
    nodes.push(mid + half * Math.cos((k * Math.PI) / N));
  }
  // 权重
  const weights = new Array<number>(N + 1).fill(0);
  const M = N / 2;
  for (let k = 0; k <= N; k++) {
    const cK = k === 0 || k === N ? 1 : 2;
    // b_n 系数
    let sum = 0;
    for (let n = 0; n <= M; n++) {
      const bN = n === 0 || n === M ? 1 : 2;
      sum += (bN / (1 - 4 * n * n)) * Math.cos((2 * n * k * Math.PI) / N);
    }
    weights[k] = (cK / N) * sum * half;
  }
  // 端点权重需要 /2 （但上述公式已含 cK=1）
  // 标准化：w_0 和 w_N 实际上是上述除 2
  weights[0]! /= 2;
  weights[N]! /= 2;
  return { nodes, weights, a, b };
}

/** Clenshaw-Curtis 积分。 */
export function integrateCc(f: (x: number) => number, a: number, b: number, N = 16): number {
  const { nodes, weights } = clenshawCurtis(N, a, b);
  let s = 0;
  for (let k = 0; k <= N; k++) s += weights[k]! * f(nodes[k]!);
  return s;
}
