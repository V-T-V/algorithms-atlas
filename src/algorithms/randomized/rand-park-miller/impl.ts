// Park-Miller MINSTD · 实现
export class ParkMiller {
  private s: number;
  constructor(seed: number) {
    this.s = seed % 2147483647 || 1;
    if (this.s < 0) this.s += 2147483647;
  }
  next(): number {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
}
export function parkMillerSeq(seed: number, n: number): number[] {
  const r = new ParkMiller(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(r.next());
  return out;
}
