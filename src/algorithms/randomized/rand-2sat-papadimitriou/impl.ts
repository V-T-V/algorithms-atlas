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
export { Rng as PSRng };

type Clause = [number, number];
export function twoSat(clauses: Clause[], n: number, seed: number): boolean[] | null {
  const r = new Rng(seed);
  for (let restart = 0; restart < Math.log2(n + 2) + 2; restart++) {
    const assign = new Array<boolean>(n).fill(false);
    for (let i = 0; i < n; i++) assign[i] = r.next() < 0.5;
    const isSat = (c: Clause): boolean =>
      (c[0] > 0 ? assign[c[0] - 1]! : !assign[-c[0] - 1]!) ||
      (c[1] > 0 ? assign[c[1] - 1]! : !assign[-c[1] - 1]!);
    for (let step = 0; step < 2 * n * n; step++) {
      const unsat = clauses.filter((c) => !isSat(c));
      if (unsat.length === 0) return assign;
      const c = unsat[Math.floor(r.next() * unsat.length)]!;
      const varIdx = Math.abs(r.next() < 0.5 ? c[0] : c[1]) - 1;
      assign[varIdx] = !assign[varIdx];
    }
    if (clauses.every(isSat)) return assign;
  }
  return null;
}
