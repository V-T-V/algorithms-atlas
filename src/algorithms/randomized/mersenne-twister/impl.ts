// =============================================================================
// 梅森旋转（Mersenne Twister, MT19937）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每次输出，供录制器使用。
// =============================================================================

const N = 624;
const M = 397;
const MATRIX_A = 0x9908b0df; // 常量向量 a，用于 y 为奇数时
const UPPER_MASK = 0x80000000; // 最高位
const LOWER_MASK = 0x7fffffff; // 低 31 位

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MersenneTwisterHooks {
  /** 每生成一个新值（无符号 32 位）时触发。 */
  onNext?: (value: number) => void;
  /** 触发了一次 twist（状态刷新）。 */
  onTwist?: () => void;
}

/**
 * 梅森旋转 MT19937 伪随机数生成器。
 *
 * - 周期：2¹⁹⁹³⁷ − 1
 * - 623 维 k-分布
 * - 同种子产生确定序列
 */
export class MersenneTwister {
  private mt: number[];
  private index: number;

  constructor(seed: number = Date.now()) {
    this.mt = new Array<number>(N);
    this.index = N;
    this.init(seed);
  }

  /** 初始化：用线性同余将种子展开为 N 个状态字。 */
  init(seed: number): void {
    this.mt[0] = seed >>> 0;
    for (let i = 1; i < N; i++) {
      this.mt[i] = (Math.imul(1812433253, this.mt[i - 1]! ^ (this.mt[i - 1]! >>> 30)) + i) >>> 0;
    }
    this.index = N;
  }

  /** 扭曲（twist）：刷新全部 N 个状态字。 */
  private twist(): void {
    for (let i = 0; i < N; i++) {
      const y = (this.mt[i]! & UPPER_MASK) | (this.mt[(i + 1) % N]! & LOWER_MASK);
      let next = this.mt[(i + M) % N]! ^ (y >>> 1);
      if (y & 1) next ^= MATRIX_A;
      this.mt[i] = next >>> 0;
    }
    this.index = 0;
  }

  /** 抽取下一个经过回火的无符号 32 位值。 */
  next(): number {
    if (this.index >= N) {
      this.twist();
    }
    let y = this.mt[this.index]!;
    this.index++;
    // 回火（tempering）
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;
    return y >>> 0;
  }

  /** 生成 [0, max) 区间整数。 */
  nextInt(max: number): number {
    return this.next() % max;
  }

  /** 生成 [0, 1) 浮点数（32 位精度）。 */
  nextFloat(): number {
    return this.next() / 0x100000000; // / 2^32
  }
}

/**
 * 便捷函数：用给定种子生成 count 个伪随机数，可选钩子。
 */
export function generateMersenneSequence(
  seed: number,
  count: number,
  hooks: MersenneTwisterHooks = {},
): number[] {
  const gen = new MersenneTwister(seed);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const v = gen.next();
    hooks.onNext?.(v);
    out.push(v);
  }
  return out;
}
