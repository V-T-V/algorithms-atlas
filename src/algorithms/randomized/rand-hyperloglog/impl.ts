// HyperLogLog 简版（基于最大前导零）· 实现
export class HyperLogLogLite {
  private maxZeros = 0;
  private hash(x: number): number {
    let h = (x * 2654435761) >>> 0;
    h ^= h >>> 13;
    h ^= h << 7;
    h ^= h >>> 17;
    return h >>> 0;
  }
  private leadingZeros(h: number): number {
    if (h === 0) return 32;
    let z = 0;
    for (let i = 31; i >= 0; i--) {
      if ((h >>> i) & 1) break;
      z++;
    }
    return z;
  }
  add(x: number): void {
    const h = this.hash(x);
    const z = this.leadingZeros(h) + 1;
    if (z > this.maxZeros) this.maxZeros = z;
  }
  estimate(): number {
    return Math.floor(2 ** this.maxZeros);
  }
}
