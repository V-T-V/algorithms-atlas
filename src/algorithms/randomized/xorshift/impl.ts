// =============================================================================
// Xorshift128 生成器 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每次输出，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface XorshiftHooks {
  /** 每生成一个新值 value（无符号 32 位）时触发。 */
  onNext?: (value: number) => void;
}

/**
 * Xorshift128 伪随机数生成器（Marsaglia, 2003）。
 *
 * 状态为 4 个 32 位字 (x, y, z, w)。每次输出：
 *   t = x ^ (x << 11)
 *   x = y; y = z; z = w
 *   w = w ^ (w >> 19) ^ (t ^ (t >> 8))
 * 返回无符号 32 位 w。
 *
 * 周期为 2¹²⁸ − 1。全零状态非法，构造时用固定非零常量初始化前三个字，
 * 第四个字取种子（种子为 0 时回退到默认非零常量）。
 */
export class Xorshift {
  private x: number;
  private y: number;
  private z: number;
  private w: number;

  constructor(seed: number = Date.now()) {
    // 经典非零常量初始化前三字（Marsaglia 推荐）
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    // 第四字取种子；种子为 0 时回退到默认非零常量，避免退化为零状态
    this.w = seed >>> 0 || 88675123;
  }

  /** 生成下一个无符号 32 位伪随机整数。 */
  next(): number {
    const t = (this.x ^ (this.x << 11)) >>> 0;
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = (this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;
    return this.w;
  }

  /** 生成 [0, max) 区间整数。 */
  nextInt(max: number): number {
    return this.next() % max;
  }

  /** 生成 [0, 1) 浮点数。 */
  nextFloat(): number {
    return this.next() / 0x100000000; // / 2^32
  }
}

/**
 * 便捷函数：用给定种子生成 count 个伪随机数，可选钩子。
 */
export function generateXorshiftSequence(
  seed: number,
  count: number,
  hooks: XorshiftHooks = {},
): number[] {
  const gen = new Xorshift(seed);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const v = gen.next();
    hooks.onNext?.(v);
    out.push(v);
  }
  return out;
}
