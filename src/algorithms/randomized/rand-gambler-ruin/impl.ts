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
export { Rng as GRRng };

export function gamblerRuin(i: number, n: number, seed: number): { win: boolean; steps: number } {
  const r = new Rng(seed);
  let money = i,
    steps = 0;
  while (money > 0 && money < n) {
    money += r.next() < 0.5 ? -1 : 1;
    steps++;
  }
  return { win: money === n, steps };
}
