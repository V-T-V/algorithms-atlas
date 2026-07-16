// =============================================================================
// 线性同余生成器（Linear Congruential Generator, LCG）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每次输出，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LcgHooks {
  /** 每生成一个新值 value 时触发。 */
  onNext?: (value: number) => void;
}

/** glibc 默认参数。 */
export const GLIBC_A = 1103515245;
export const GLIBC_C = 12345;
export const GLIBC_M = 2 ** 31; // 2147483648

/**
 * 线性同余生成器（LCG）。
 *
 * 递推：Xₙ₊₁ = (a·Xₙ + c) mod m。
 * 默认使用 glibc 参数 a=1103515245, c=12345, m=2³¹（满周期）。
 * 同一种子产生完全相同的序列，可复现。
 */
export class LCG {
  private state: number;
  readonly a: number;
  readonly c: number;
  readonly m: number;

  constructor(seed: number, a: number = GLIBC_A, c: number = GLIBC_C, m: number = GLIBC_M) {
    this.a = a;
    this.c = c;
    this.m = m;
    this.state = ((seed % m) + m) % m; // 归一化到 [0, m)
  }

  /** 生成下一个伪随机整数（[0, m)）。 */
  next(): number {
    // 用 BigInt 保证任意 m 下乘法不溢出，结果严格落在 [0, m)。
    const s = (BigInt(this.a) * BigInt(this.state) + BigInt(this.c)) % BigInt(this.m);
    this.state = Number(s);
    return this.state;
  }

  /** 生成 [0, max) 区间的整数。 */
  nextInt(max: number): number {
    return this.next() % max;
  }

  /** 生成 [0, 1) 浮点数。 */
  nextFloat(): number {
    return this.next() / this.m;
  }
}

/**
 * 便捷函数：用给定种子生成 count 个伪随机数，可选钩子。
 *
 * @param seed 种子
 * @param count 生成个数
 * @param hooks 可选事件钩子
 * @returns 生成序列
 */
export function generateLcgSequence(
  seed: number,
  count: number,
  hooks: LcgHooks = {},
  a?: number,
  c?: number,
  m?: number,
): number[] {
  const gen = new LCG(seed, a, c, m);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const v = gen.next();
    hooks.onNext?.(v);
    out.push(v);
  }
  return out;
}
