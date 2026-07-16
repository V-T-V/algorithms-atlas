// =============================================================================
// 双哈希字符串
// =============================================================================

const B1 = 131n;
const B2 = 137n;
const M1 = 1_000_000_007n;
const M2 = 998_244_353n;

export type HashPair = { h1: bigint; h2: bigint };

export interface DoubleHashHooks {
  onPrefix?: (i: number, h: HashPair) => void;
  onQuery?: (l: number, r: number, h: HashPair) => void;
}

export class DoubleHash3 {
  private p1: bigint[];
  private p2: bigint[];
  private pw1: bigint[];
  private pw2: bigint[];
  constructor(
    s: string,
    private hooks: DoubleHashHooks = {},
  ) {
    const n = s.length;
    this.p1 = new Array(n + 1).fill(0n);
    this.p2 = new Array(n + 1).fill(0n);
    this.pw1 = new Array(n + 1).fill(1n);
    this.pw2 = new Array(n + 1).fill(1n);
    for (let i = 0; i < n; i++) {
      this.pw1[i + 1] = (this.pw1[i]! * B1) % M1;
      this.pw2[i + 1] = (this.pw2[i]! * B2) % M2;
      this.p1[i + 1] = (this.p1[i]! * B1 + BigInt(s.charCodeAt(i))) % M1;
      this.p2[i + 1] = (this.p2[i]! * B2 + BigInt(s.charCodeAt(i))) % M2;
      this.hooks.onPrefix?.(i + 1, { h1: this.p1[i + 1]!, h2: this.p2[i + 1]! });
    }
  }
  hash(l: number, r: number): HashPair {
    const h1 = (((this.p1[r + 1]! - this.p1[l]! * this.pw1[r - l + 1]!) % M1) + M1) % M1;
    const h2 = (((this.p2[r + 1]! - this.p2[l]! * this.pw2[r - l + 1]!) % M2) + M2) % M2;
    const result = { h1, h2 };
    this.hooks.onQuery?.(l, r, result);
    return result;
  }
}
