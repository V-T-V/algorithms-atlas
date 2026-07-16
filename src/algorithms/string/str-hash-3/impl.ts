// =============================================================================
// 多项式字符串哈希（单模数）
// =============================================================================

const BASE = 131n;
const MOD = 1_000_000_007n;

export interface StrHashHooks {
  onPrefix?: (i: number, hash: bigint) => void;
  onQuery?: (l: number, r: number, hash: bigint) => void;
}

export class StringHash3 {
  private prefix: bigint[];
  private powers: bigint[];
  constructor(
    s: string,
    private hooks: StrHashHooks = {},
  ) {
    const n = s.length;
    this.prefix = new Array(n + 1).fill(0n);
    this.powers = new Array(n + 1).fill(1n);
    for (let i = 0; i < n; i++) {
      this.powers[i + 1] = (this.powers[i]! * BASE) % MOD;
      this.prefix[i + 1] = (this.prefix[i]! * BASE + BigInt(s.charCodeAt(i))) % MOD;
      this.hooks.onPrefix?.(i + 1, this.prefix[i + 1]!);
    }
  }
  /** 区间 [l, r]（0-indexed，含）的哈希。 */
  hash(l: number, r: number): bigint {
    const h =
      (((this.prefix[r + 1]! - this.prefix[l]! * this.powers[r - l + 1]!) % MOD) + MOD) % MOD;
    this.hooks.onQuery?.(l, r, h);
    return h;
  }
  equals(other: StringHash3, l1: number, r1: number, l2: number, r2: number): boolean {
    if (r1 - l1 !== r2 - l2) return false;
    return this.hash(l1, r1) === other.hash(l2, r2);
  }
}
