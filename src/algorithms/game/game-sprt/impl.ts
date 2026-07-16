// SPRT · 实现 (Bernoulli 似然, H0: p=p0 vs H1: p=p1)
export interface SprtHooks {
  onSample?: (n: number, logRatio: number, lo: number, hi: number) => void;
  onDecide?: (acceptH1: boolean, n: number) => void;
}
export function sprt(
  samples: readonly number[],
  p0: number,
  p1: number,
  alpha: number,
  beta: number,
  hooks: SprtHooks = {},
): { acceptH1: boolean; n: number } {
  const A = Math.log(beta / (1 - alpha));
  const B = Math.log((1 - beta) / alpha);
  let logRatio = 0,
    n = 0;
  for (const x of samples) {
    n++;
    logRatio += x === 1 ? Math.log(p1 / p0) : Math.log((1 - p1) / (1 - p0));
    hooks.onSample?.(n, logRatio, A, B);
    if (logRatio <= A) {
      hooks.onDecide?.(false, n);
      return { acceptH1: false, n };
    }
    if (logRatio >= B) {
      hooks.onDecide?.(true, n);
      return { acceptH1: true, n };
    }
  }
  hooks.onDecide?.(false, n);
  return { acceptH1: false, n };
}
