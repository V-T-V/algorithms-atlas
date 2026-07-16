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
export { Rng as W2dRng };

export function randomWalk2D(steps: number, seed: number): [number, number][] {
  const r = new Rng(seed);
  const path: [number, number][] = [[0, 0]];
  const dirs: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (let i = 0; i < steps; i++) {
    const [dx, dy] = dirs[Math.floor(r.next() * 4)]!;
    const last = path[path.length - 1]!;
    path.push([last[0] + dx, last[1] + dy]);
  }
  return path;
}
