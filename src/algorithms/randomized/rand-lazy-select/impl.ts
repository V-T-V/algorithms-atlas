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
export { Rng as LSRng };

export function lazySelect(arr: number[], k: number, seed: number): number {
  if (k < 1 || k > arr.length) throw new RangeError('k 越界');
  const r = new Rng(seed);
  const s = arr.slice();
  // Quickselect with random pivot (deterministic test)
  let lo = 0,
    hi = s.length - 1,
    target = k - 1;
  while (lo < hi) {
    const p = lo + Math.floor(r.next() * (hi - lo + 1));
    const pv = s[p]!;
    [s[p]!, s[hi]!] = [s[hi]!, s[p]!];
    let store = lo;
    for (let i = lo; i < hi; i++)
      if (s[i]! < pv) {
        [s[i]!, s[store]!] = [s[store]!, s[i]!];
        store++;
      }
    [s[store]!, s[hi]!] = [s[hi]!, s[store]!];
    if (store === target) return s[store]!;
    if (store < target) lo = store + 1;
    else hi = store - 1;
  }
  return s[lo]!;
}
