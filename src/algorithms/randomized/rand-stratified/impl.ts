// 分层采样 · 纯算法实现
export interface StratifiedHooks {
  onStratum?: (index: number, lo: number, hi: number, x: number) => void;
  onResult?: (samples: number[], estimate: number) => void;
}

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 0x100000000;
  };
}

export function stratifiedSample1D(
  n: number,
  rng: () => number = lcg(42),
  hooks: StratifiedHooks = {},
): number[] {
  const samples: number[] = [];
  for (let i = 0; i < n; i++) {
    const lo = i / n;
    const hi = (i + 1) / n;
    const x = lo + rng() * (hi - lo);
    samples.push(x);
    hooks.onStratum?.(i, lo, hi, x);
  }
  hooks.onResult?.([...samples], samples.reduce((s, v) => s + v, 0) / n);
  return samples;
}

/** 用分层采样估计 ∫₀¹ f(x) dx。 */
export function stratifiedIntegrate(
  f: (x: number) => number,
  n: number,
  rng: () => number = lcg(42),
): number {
  const samples = stratifiedSample1D(n, rng);
  return samples.reduce((s, x) => s + f(x), 0) / n;
}

/** 2D 分层（n×n 网格，每格一个点）。 */
export function stratifiedSample2D(
  n: number,
  rng: () => number = lcg(42),
): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = (i + rng()) / n;
      const y = (j + rng()) / n;
      out.push([x, y]);
    }
  }
  return out;
}
