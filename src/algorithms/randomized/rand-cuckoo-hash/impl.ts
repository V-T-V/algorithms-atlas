// 布谷鸟哈希 · 实现
export class CuckooHash {
  private t1: (number | null)[];
  private t2: (number | null)[];
  private m: number;
  constructor(m: number) {
    this.m = m;
    this.t1 = new Array(m).fill(null);
    this.t2 = new Array(m).fill(null);
  }
  private h1(k: number): number {
    return ((k * 2654435761) >>> 0) % this.m;
  }
  private h2(k: number): number {
    return ((k * 40503) >>> 0) % this.m;
  }
  insert(k: number, maxKicks = 100): boolean {
    let key = k,
      useT1 = true;
    for (let i = 0; i < maxKicks; i++) {
      if (useT1) {
        const idx = this.h1(key);
        if (this.t1[idx] === null) {
          this.t1[idx] = key;
          return true;
        }
        const t = this.t1[idx]!;
        this.t1[idx] = key;
        key = t;
      } else {
        const idx = this.h2(key);
        if (this.t2[idx] === null) {
          this.t2[idx] = key;
          return true;
        }
        const t = this.t2[idx]!;
        this.t2[idx] = key;
        key = t;
      }
      useT1 = !useT1;
    }
    return false;
  }
  has(k: number): boolean {
    return this.t1[this.h1(k)] === k || this.t2[this.h2(k)] === k;
  }
}
