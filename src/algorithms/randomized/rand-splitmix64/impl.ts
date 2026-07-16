// splitmix64 · 实现
export class Splitmix64 {
  private x: bigint;
  constructor(seed: number) {
    this.x = BigInt(seed) || 1n;
  }
  next(): number {
    this.x = (this.x + 0x9e3779b97f4a7c15n) & 0xffffffffffffffffn;
    let z = this.x;
    z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & 0xffffffffffffffffn;
    z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & 0xffffffffffffffffn;
    z = z ^ (z >> 31n);
    return Number(z >> 11n) / 2 ** 53;
  }
}
export function splitmixSeq(seed: number, n: number): number[] {
  const r = new Splitmix64(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next());
  return out;
}
