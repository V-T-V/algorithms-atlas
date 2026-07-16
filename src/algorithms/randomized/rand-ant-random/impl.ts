// 共享 LCG 随机源（测试可复现）
class Rng {
  private s: number;
  constructor(seed: number) {
    this.s = seed >>> 0 || 1;
  }
  next(): number {
    // xorshift32
    let x = this.s;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.s = x >>> 0;
    return this.s / 0x100000000;
  }
  range(lo: number, hi: number): number {
    return lo + Math.floor(this.next() * (hi - lo));
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]!;
  }
}
export { Rng as AntRng };

export function antWalk(steps: number, seed: number): [number, number] {
  const r = new Rng(seed);
  let x = 0,
    y = 0;
  const dx = [0, 1, 0, -1],
    dy = [1, 0, -1, 0];
  for (let i = 0; i < steps; i++) {
    const d = Math.floor(r.next() * 4);
    x += dx[d]!;
    y += dy[d]!;
  }
  return [x, y];
}
