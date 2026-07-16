// =============================================================================
// 组合数 预处理
// =============================================================================

const MOD = 1_000_000_007n;

export class Combinatorics {
  readonly fact: bigint[];
  readonly invFact: bigint[];
  constructor(readonly N: number) {
    this.fact = new Array(N + 1).fill(1n);
    this.invFact = new Array(N + 1).fill(1n);
    for (let i = 1; i <= N; i++) this.fact[i] = (this.fact[i - 1]! * BigInt(i)) % MOD;
    this.invFact[N] = modPow(this.fact[N]!, MOD - 2n, MOD);
    for (let i = N - 1; i >= 0; i--) this.invFact[i] = (this.invFact[i + 1]! * BigInt(i + 1)) % MOD;
  }
  choose(n: number, k: number): bigint {
    if (k < 0 || k > n) return 0n;
    return (((this.fact[n]! * this.invFact[k]!) % MOD) * this.invFact[n - k]!) % MOD;
  }
}

function modPow(base: bigint, exp: bigint, m: bigint): bigint {
  let r = 1n;
  let b = base % m;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

export interface CombHooks {
  onChoose?: (n: number, k: number, value: bigint) => void;
}

export function buildCombinatorics(N: number): Combinatorics {
  return new Combinatorics(N);
}
