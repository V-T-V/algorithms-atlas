// =============================================================================
// 全域哈希族 · 纯算法实现
// H = { h_{a,b}(x) = ((a*x + b) mod p) mod m }，a∈[1,p-1], b∈[0,p-1], p 素数。
// 对任意 x≠y，碰撞概率 ≤ 1/m。零 DOM 依赖，可独立单测。
// =============================================================================

/** 默认素数（键域上界，需 ≥ 最大键值）。取 2^31 - 1。 */
export const DEFAULT_PRIME = 0x7fffffff; // 2^31 - 1（Mersenne 素数）

/** 一个哈希函数实例（由 (a, b) 参数化）。 */
export interface HashFunction {
  a: number;
  b: number;
}

/** 事件钩子。 */
export interface UniversalHashHooks {
  /** 采样得到一个哈希函数。 */
  onSample?: (fn: HashFunction) => void;
  /** 计算某键的桶下标。 */
  onHash?: (key: number, fn: HashFunction, bucket: number) => void;
}

/** 模乘（BigInt 保证大素数下不溢出）。 */
function modMul(a: number, b: number, p: number): number {
  return Number((((BigInt(a) * BigInt(b)) % BigInt(p)) + BigInt(p)) % BigInt(p));
}

/** 模加。 */
function modAdd(a: number, b: number, p: number): number {
  return (((a + b) % p) + p) % p;
}

/** mulberry32 PRNG（可复现）。 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/**
 * 全域哈希族（参数 a,b 随机抽样）。
 */
export class UniversalHashFamily {
  readonly prime: number;
  readonly m: number; // 槽位数
  private readonly rng: () => number;

  constructor(m: number, prime: number = DEFAULT_PRIME, rng?: () => number) {
    if (m <= 0) throw new RangeError('m must be positive');
    if (prime <= 1) throw new RangeError('prime must be > 1');
    this.m = m;
    this.prime = prime;
    this.rng = rng ?? mulberry32(0xc2b2ae35);
  }

  /**
   * 从族中随机抽样一个哈希函数 h_{a,b}。
   * a ∈ [1, prime-1]，b ∈ [0, prime-1]。
   */
  sample(hooks?: UniversalHashHooks): HashFunction {
    const a = 1 + Math.floor(this.rng() * (this.prime - 1)); // [1, prime-1]
    const b = Math.floor(this.rng() * this.prime); // [0, prime-1]
    const fn = { a, b };
    hooks?.onSample?.(fn);
    return fn;
  }

  /**
   * 用给定哈希函数计算整数键的桶下标。
   * h_{a,b}(key) = ((a*key + b) mod prime) mod m
   */
  hash(key: number, fn: HashFunction, hooks?: UniversalHashHooks): number {
    const v = modAdd(modMul(fn.a, key, this.prime), fn.b, this.prime);
    const bucket = v % this.m;
    hooks?.onHash?.(key, fn, bucket);
    return bucket;
  }

  /**
   * 把一组键分配到 m 个桶，返回每桶的键数（用于冲突统计）。
   */
  assign(keys: readonly number[], fn: HashFunction, hooks?: UniversalHashHooks): number[] {
    const counts = new Array<number>(this.m).fill(0);
    for (const k of keys) {
      const b = this.hash(k, fn, hooks);
      counts[b] = counts[b]! + 1;
    }
    return counts;
  }
}
