// =============================================================================
// Gauss-Hermite 求积（物理学家型 H_n）· 纯算法实现
//   节点 = H_n 的根（Newton-Raphson）
//   权 w_k = 2^{n} n! √π / (n² · [H_{n-1}(x_k)]²)  （标准公式）
// =============================================================================

export interface GhNodes {
  nodes: number[];
  weights: number[];
}

/** 物理 H_n(x) 与 H_{n-1}(x)。 */
function hermiteAndPrev(n: number, x: number): { h: number; hPrev: number; dh: number } {
  if (n === 0) return { h: 1, hPrev: 0, dh: 0 };
  if (n === 1) return { h: 2 * x, hPrev: 1, dh: 2 };
  let hPrev = 1;
  let hCurr = 2 * x;
  for (let k = 1; k < n; k++) {
    const hNew = 2 * x * hCurr - 2 * k * hPrev;
    hPrev = hCurr;
    hCurr = hNew;
  }
  // 导数：H_n' = 2n H_{n-1}
  return { h: hCurr, hPrev, dh: 2 * n * hPrev };
}

function factorial(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

/** n 个 Gauss-Hermite 节点与权重（物理学家型，升序）。 */
export function gaussHermite(n: number): GhNodes {
  if (n < 1) throw new RangeError('n 必须 ≥ 1');
  const pairs: Array<{ x: number; w: number }> = [];
  const m = Math.ceil(n / 2);
  const nFact = factorial(n);
  const denom = n * n;
  for (let i = 1; i <= m; i++) {
    // 初始猜测（Ahmad-Asaadi 等的近似）
    let x = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5)) * Math.sqrt(2 * n + 1);
    // Newton-Raphson
    for (let iter = 0; iter < 100; iter++) {
      const { h, dh } = hermiteAndPrev(n, x);
      const dx = h / dh;
      x -= dx;
      if (Math.abs(dx) < 1e-15) break;
    }
    const { hPrev } = hermiteAndPrev(n, x);
    // 权：w_k = 2^{n} n! √π / (n² [H_{n-1}(x_k)]²)
    const w = (Math.pow(2, n) * nFact * Math.sqrt(Math.PI)) / (denom * hPrev * hPrev);
    pairs.push({ x, w });
  }
  // 升序合并
  const positive = pairs.filter((p) => p.x > 1e-12);
  const zeroIdx = pairs.findIndex((p) => Math.abs(p.x) <= 1e-12);
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

/** ∫_{-∞}^{+∞} f(x) e^{-x²} dx ≈ Σ w_k f(x_k)。 */
export function integrateGh(f: (x: number) => number, n = 10): number {
  const { nodes, weights } = gaussHermite(n);
  let s = 0;
  for (let i = 0; i < n; i++) s += weights[i]! * f(nodes[i]!);
  return s;
}
