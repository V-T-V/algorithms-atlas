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
export { Rng as MCRng };

export function markovChain(
  trans: number[][],
  start: number,
  steps: number,
  seed: number,
): number[] {
  const r = new Rng(seed);
  const states = [start];
  let cur = start;
  for (let i = 0; i < steps; i++) {
    const u = r.next();
    let acc = 0;
    for (let j = 0; j < trans[cur]!.length; j++) {
      acc += trans[cur]![j]!;
      if (u < acc) {
        cur = j;
        break;
      }
    }
    states.push(cur);
  }
  return states;
}
