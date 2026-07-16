// =============================================================================
// 元音拼写计数
// a->e; e->a,i; i->a,e,o,u; o->i,u; u->a
// =============================================================================

const MOD = 1_000_000_007;

export interface VowelHooks {
  onDay?: (i: number, total: number) => void;
  onDone?: (total: number) => void;
}

export function countVowelPermutation(n: number, hooks: VowelHooks = {}): number {
  let a = 1,
    e = 1,
    ii = 1,
    o = 1,
    u = 1;
  for (let step = 2; step <= n; step++) {
    const na = (e + ii + u) % MOD;
    const ne = (a + ii) % MOD;
    const ni = (e + o) % MOD;
    const no = ii % MOD;
    const nu = (ii + o) % MOD;
    a = na;
    e = ne;
    ii = ni;
    o = no;
    u = nu;
    hooks.onDay?.(step, (a + e + ii + o + u) % MOD);
  }
  const ans = (a + e + ii + o + u) % MOD;
  hooks.onDone?.(ans);
  return ans;
}
