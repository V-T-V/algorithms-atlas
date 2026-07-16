// =============================================================================
// HyperLogLog · 纯算法实现
// 基数估计：m=2^b 个寄存器，每个元素哈希后取高 b 位选寄存器，
// 剩余位的 leading-zeros+1 取 max 存入。最后调和平均 + 小/大修正。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface HllHooks {
  /** 处理一个元素：寄存器 j、观察到的 ρ、是否更新了寄存器。 */
  onObserve?: (item: string, j: number, rho: number, updated: boolean, oldMax: number) => void;
}

/** 简单确定性 32 位哈希（用于演示与单测）。 */
export function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 32 位无符号整数的前导零个数。 */
export function clz32(x: number): number {
  const v = x >>> 0;
  if (v === 0) return 32;
  let n = 0;
  let w = v;
  if ((w & 0xffff0000) === 0) {
    n += 16;
    w <<= 16;
  }
  if ((w & 0xff000000) === 0) {
    n += 8;
    w <<= 8;
  }
  if ((w & 0xf0000000) === 0) {
    n += 4;
    w <<= 4;
  }
  if ((w & 0xc0000000) === 0) {
    n += 2;
    w <<= 2;
  }
  if ((w & 0x80000000) === 0) {
    n += 1;
  }
  return n;
}

/** α_m 常数（偏差修正）。 */
function alpha(m: number): number {
  switch (m) {
    case 16:
      return 0.673;
    case 32:
      return 0.697;
    case 64:
      return 0.709;
    default:
      return 0.7213 / (1 + 1.079 / m);
  }
}

export class HyperLogLog {
  readonly b: number;
  readonly m: number;
  readonly registers: number[]; // 每个寄存器存 ρ 的最大值
  private count = 0;

  constructor(precision: number = 6) {
    if (precision < 4 || precision > 16) throw new Error('precision 必须 ∈ [4,16]');
    this.b = precision;
    this.m = 1 << precision;
    this.registers = new Array<number>(this.m).fill(0);
  }

  /** 观察一个元素。 */
  add(item: string, hooks: HllHooks = {}): void {
    const h = hash32(item);
    // 取高 b 位作为寄存器索引
    const j = h >>> (32 - this.b);
    // 剩余 (32-b) 位左移到高位，计算其前导零
    const shifted = (h << this.b) >>> 0;
    // ρ = (剩余位的前导零) - b + 1；剩余位有 (32-b) 位，全部 0 时 ρ = (32-b)+1
    const rho = clz32(shifted) - this.b + 1;
    const rhoClamped = Math.max(rho, 1);
    const old = this.registers[j]!;
    if (rhoClamped > old) {
      this.registers[j] = rhoClamped;
      hooks.onObserve?.(item, j, rhoClamped, true, old);
    } else {
      hooks.onObserve?.(item, j, rhoClamped, false, old);
    }
    this.count++;
  }

  /** 估计基数。 */
  estimate(): number {
    const m = this.m;
    let sum = 0;
    let zeros = 0;
    for (let i = 0; i < m; i++) {
      const r = this.registers[i]!;
      sum += 1 / Math.pow(2, r);
      if (r === 0) zeros++;
    }
    const alphaM = alpha(m);
    const raw = (alphaM * m * m) / sum;

    // 小范围修正（LinearCounting）
    if (raw <= 2.5 * m) {
      if (zeros > 0) {
        return Math.round(m * Math.log(m / zeros));
      }
    }
    // 大范围修正（32 位空间上限）
    const two32 = Math.pow(2, 32);
    if (raw > two32 / 30) {
      return Math.round(-two32 * Math.log(1 - raw / two32));
    }
    return Math.round(raw);
  }

  /** 已观察的总元素数（含重复）。 */
  get observed(): number {
    return this.count;
  }

  /** 合并另一 HLL（相同精度）到本实例（并集）。 */
  merge(other: HyperLogLog): void {
    if (other.b !== this.b) throw new Error('精度不同无法合并');
    for (let i = 0; i < this.m; i++) {
      if (other.registers[i]! > this.registers[i]!) {
        this.registers[i] = other.registers[i]!;
      }
    }
    this.count += other.count;
  }

  /** 重置。 */
  reset(): void {
    this.registers.fill(0);
    this.count = 0;
  }
}

/** 便捷：估计字符串数组的基数。 */
export function estimateCardinality(items: readonly string[], precision: number = 6): number {
  const hll = new HyperLogLog(precision);
  for (const it of items) hll.add(it);
  return hll.estimate();
}
