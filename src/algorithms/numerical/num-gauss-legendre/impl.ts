// =============================================================================
// Gauss-Legendre 求积 · 纯算法实现
//   节点 = Legendre 多项式 P_n 的根，通过 Newton-Raphson 求
//   权重 w_k = 2 / [(1 - x_k²) · (P\'_n(x_k))²]
// =============================================================================

export interface GlNodes {
  nodes: number[];
  weights: number[];
}

/** 用递推计算 P_n(x) 与 P\'_n(x)。 */
function legendreAndDeriv(n: number, x: number): { p: number; dp: number } {
  if (n === 0) return { p: 1, dp: 0 };
  if (n === 1) return { p: x, dp: 1 };
  let pPrev = 1;
  let pCurr = x;
  let dCurr = 1;
  for (let k = 2; k <= n; k++) {
    const pNew = ((2 * k - 1) * x * pCurr - (k - 1) * pPrev) / k;
    const dNew = k * pCurr + x * dCurr;
    pPrev = pCurr;
    pCurr = pNew;
    dCurr = dNew;
  }
  return { p: pCurr, dp: dCurr };
}

/** 计算 n 个 Gauss-Legendre 节点和权重（升序）。 */
export function gaussLegendre(n: number): GlNodes {
  if (n < 1) throw new RangeError('n 必须 ≥ 1');
  // 临时存放 [node, weight] 对
  const pairs: Array<{ x: number; w: number }> = [];
  // 找 ceil(n/2) 个正根（含 0，奇数 n 时含 0）
  for (let i = 1; i <= Math.ceil(n / 2); i++) {
    let x = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5));
    for (let iter = 0; iter < 100; iter++) {
      const { p, dp } = legendreAndDeriv(n, x);
      const dx = p / dp;
      x -= dx;
      if (Math.abs(dx) < 1e-15) break;
    }
    const { dp } = legendreAndDeriv(n, x);
    const w = 2 / ((1 - x * x) * dp * dp);
    pairs.push({ x, w });
  }
  // pairs 是降序（i=1 给最大根）。正根降序：[x_max, ..., x_min]
  const positive = pairs.filter((p) => p.x > 1e-15); // 降序
  const zeroIdx = pairs.findIndex((p) => Math.abs(p.x) < 1e-15);
  // 升序合并：负根（最大绝对值→最小绝对值），即 -x_max ... -x_min；然后 0；然后 x_min ... x_max
  const nodes: number[] = [];
  const weights: number[] = [];
  for (let i = 0; i < positive.length; i++) {
    nodes.push(-positive[i]!.x);
    weights.push(positive[i]!.w);
  }
  if (zeroIdx !== -1) {
    nodes.push(0);
    weights.push(pairs[zeroIdx]!.w);
  }
  for (let i = positive.length - 1; i >= 0; i--) {
    nodes.push(positive[i]!.x);
    weights.push(positive[i]!.w);
  }
  return { nodes, weights };
}

/** Gauss-Legendre 积分 ∫_a^b f(x) dx。 */
export function integrateGl(f: (x: number) => number, a: number, b: number, n = 5): number {
  const { nodes, weights } = gaussLegendre(n);
  const mid = (a + b) / 2;
  const half = (b - a) / 2;
  let s = 0;
  for (let i = 0; i < n; i++) {
    s += weights[i]! * f(mid + half * nodes[i]!);
  }
  return half * s;
}
