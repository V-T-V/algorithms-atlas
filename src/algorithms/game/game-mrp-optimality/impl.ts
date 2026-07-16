// MRP 价值迭代 · 实现
export interface MrpHooks {
  onIter?: (k: number, V: number[]) => void;
  onConverge?: (V: number[], iters: number) => void;
}
export function mrpValue(
  P: ReadonlyArray<readonly number[]>,
  R: readonly number[],
  gamma: number,
  iters = 100,
  hooks: MrpHooks = {},
): number[] {
  const n = R.length;
  let V = new Array<number>(n).fill(0);
  for (let k = 0; k < iters; k++) {
    const nV = new Array<number>(n).fill(0);
    for (let s = 0; s < n; s++) {
      let sum = 0;
      for (let s2 = 0; s2 < n; s2++) sum += P[s]![s2]! * V[s2]!;
      nV[s] = R[s]! + gamma * sum;
    }
    V = nV;
    hooks.onIter?.(k, V);
    if (k > 2 && converged(V, nV, 1e-6)) {
      hooks.onConverge?.(V, k);
      break;
    }
  }
  return V;
}
function converged(a: number[], b: number[], eps: number): boolean {
  let m = 0;
  for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i]! - b[i]!));
  return m < eps;
}
