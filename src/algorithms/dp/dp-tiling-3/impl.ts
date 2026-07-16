// =============================================================================
// 多米诺+三联骨牌铺砖
// =============================================================================

const MOD = 1_000_000_007;

export interface TilingHooks {
  onStep?: (i: number, f: number, p: number) => void;
  onDone?: (ways: number) => void;
}

export function numTilings(n: number, hooks: TilingHooks = {}): number {
  if (n === 0) return 1;
  if (n === 1) return 1;
  let fPrev2 = 1; // f[0]
  let fPrev1 = 1; // f[1]
  let pPrev1 = 0; // p[1]
  for (let i = 2; i <= n; i++) {
    const f = (fPrev1 + fPrev2 + 2 * pPrev1) % MOD;
    const p = (pPrev1 + fPrev2) % MOD;
    fPrev2 = fPrev1;
    fPrev1 = f;
    pPrev1 = p;
    hooks.onStep?.(i, f, p);
  }
  hooks.onDone?.(fPrev1);
  return fPrev1;
}
