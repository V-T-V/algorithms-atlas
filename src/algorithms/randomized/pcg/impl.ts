// =============================================================================
// PCG32 (Permuted Congruential Generator) · 纯算法实现
// 状态推进：LCG (state = state*MULT + INC) mod 2^64
// 输出置换：PCG-XSH-RR（xorshift + rotate-right）
// 用 BigInt 实现 64 位精确运算。零 DOM 依赖，可独立单测。
// =============================================================================

/** PCG32 默认常量（O'Neill 论文推荐）。 */
const PCG_DEFAULT_MULT = 6364136223846793005n;
const PCG_DEFAULT_INC = 1442695040888963407n;
const MOD64 = 1n << 64n;
const MASK64 = MOD64 - 1n;
const MASK32 = (1n << 32n) - 1n;

/** 事件钩子。 */
export interface PcgHooks {
  /** 每生成一个新值（无符号 32 位）时触发。 */
  onNext?: (value: number) => void;
}

/** 64 位无符号右移（BigInt >> 是算术右移，需用 >>>）。 */
function shr64(x: bigint, n: bigint): bigint {
  return (x & MASK64) >> n;
}

/** 32 位无符号 rotate-right。 */
function rotr32(x: number, r: number): number {
  const v = x >>> 0;
  return ((v >>> r) | (v << (32 - r))) >>> 0;
}

/**
 * PCG32 伪随机数生成器。
 * 64 位状态 + 64 位流选择符（inc，奇数）。
 */
export class PCG32 {
  private state: bigint;
  private readonly inc: bigint;
  private readonly mult: bigint;

  constructor(
    seed: bigint | number = 0x853c49e6748fea9bn,
    inc: bigint | number = 0xda3e39cb94b95bdbn,
  ) {
    this.state = 0n;
    this.inc = ((BigInt(inc) << 1n) | 1n) & MASK64; // inc 必须为奇数
    this.mult = PCG_DEFAULT_MULT;
    // 初始化：state = 0; state = state*mult + inc; state = state*mult + (seed|inc)
    this.state = (this.mult * this.state + this.inc) & MASK64;
    this.state = (this.state + BigInt(seed)) & MASK64;
    this.state = (this.mult * this.state + this.inc) & MASK64;
  }

  /** 生成下一个无符号 32 位值。 */
  next(): number {
    // 1) LCG 推进
    const oldstate = this.state;
    this.state = (oldstate * this.mult + this.inc) & MASK64;
    // 2) PCG-XSH-RR 输出函数
    const xorshifted = (((oldstate >> 18n) ^ oldstate) >> 27n) & MASK32;
    const rot = Number(shr64(oldstate, 59n) & 31n);
    const result = rotr32(Number(xorshifted & MASK32), rot);
    return result >>> 0;
  }

  /** [0, max) 区间整数。 */
  nextInt(max: number): number {
    if (max <= 0) return 0;
    return this.next() % max;
  }

  /** [0, 1) 浮点数（32 位精度）。 */
  nextFloat(): number {
    return this.next() / 0x100000000;
  }
}

/**
 * 便捷：用种子生成 count 个无符号 32 位数。
 */
export function generatePcgSequence(
  seed: bigint | number,
  count: number,
  inc?: bigint | number,
  hooks: PcgHooks = {},
): number[] {
  const gen = inc !== undefined ? new PCG32(seed, inc) : new PCG32(seed);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const v = gen.next();
    hooks.onNext?.(v);
    out.push(v);
  }
  return out;
}

export { PCG_DEFAULT_MULT, PCG_DEFAULT_INC };
