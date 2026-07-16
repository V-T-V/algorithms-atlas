// xoroshiro128+ · 实现
function rotl(x: bigint, k: bigint): bigint {
  return ((x << k) | (x >> (64n - k))) & 0xffffffffffffffffn;
}
export class Xoroshiro128 {
  private s0 = 0x9e3779b97f4a7c15n;
  private s1 = 0xbf58476d1ce4e5b9n;
  constructor(seed: number) {
    const s = BigInt(seed) || 1n;
    this.s0 = s;
    this.s1 = (s * 6364136223846793005n + 1442695040888963407n) & 0xffffffffffffffffn;
  }
  next(): number {
    const result = (this.s0 + this.s1) & 0xffffffffffffffffn;
    const s1 = this.s0 ^ this.s1;
    this.s0 = (rotl(this.s0, 24n) ^ s1 ^ ((s1 << 16n) & 0xffffffffffffffffn)) & 0xffffffffffffffffn;
    this.s1 = rotl(s1, 37n);
    return Number(result >> 11n) / 2 ** 53;
  }
}
export function xoroshiroSeq(seed: number, n: number): number[] {
  const r = new Xoroshiro128(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next());
  return out;
}
