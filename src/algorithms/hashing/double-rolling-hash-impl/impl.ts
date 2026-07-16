// =============================================================================
// 双模滚动哈希 · 纯算法实现
// 两套独立 (base, P) 同时计算，碰撞概率 ~1/(P1·P2)。
// =============================================================================

/** 默认两套参数。 */
export const PARAMS = {
  base1: 91138233,
  prime1: 1_000_000_007,
  base2: 97266353,
  prime2: 1_000_000_009,
} as const;

/** 双哈希元组。 */
export type DoubleHash = { h1: number; h2: number };

/** 模乘（BigInt 保证安全）。 */
function modMul(a: number, b: number, p: number): number {
  return Number((((BigInt(a) * BigInt(b)) % BigInt(p)) + BigInt(p)) % BigInt(p));
}

/** 模加。 */
function modAdd(a: number, b: number, p: number): number {
  return (((a + b) % p) + p) % p;
}

/** 字符串 → 字符编码数组。 */
function toInts(data: string | number[]): number[] {
  if (typeof data === 'string') {
    return Array.from(data).map((c) => c.charCodeAt(0));
  }
  return [...data];
}

/** 单哈希的前缀 + 幂预计算。 */
class SingleHash {
  readonly base: number;
  readonly prime: number;
  readonly prefix: number[];
  readonly powers: number[];

  constructor(values: number[], base: number, prime: number) {
    this.base = base;
    this.prime = prime;
    const n = values.length;
    this.powers = new Array<number>(n + 1).fill(1);
    this.prefix = new Array<number>(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
      this.powers[i + 1] = modMul(this.powers[i]!, base, prime);
      this.prefix[i + 1] = modAdd(modMul(this.prefix[i]!, base, prime), values[i]!, prime);
    }
  }

  hashOf(l: number, r: number): number {
    const len = r - l;
    return modAdd(
      this.prefix[r]!,
      -modMul(this.prefix[l]!, this.powers[len]!, this.prime),
      this.prime,
    );
  }
}

/** 事件钩子。 */
export interface DoubleHashHooks {
  /** 预处理完成。 */
  onInit?: () => void;
  /** 子串查询返回双哈希元组。 */
  onQuery?: (l: number, r: number, dh: DoubleHash) => void;
}

/**
 * 双模滚动哈希结构体。
 */
export class DoubleRollingHash {
  private readonly values: number[];
  private readonly sh1: SingleHash;
  private readonly sh2: SingleHash;
  readonly base1: number;
  readonly prime1: number;
  readonly base2: number;
  readonly prime2: number;

  constructor(
    data: string | number[],
    base1: number = PARAMS.base1,
    prime1: number = PARAMS.prime1,
    base2: number = PARAMS.base2,
    prime2: number = PARAMS.prime2,
  ) {
    this.values = toInts(data);
    this.base1 = base1;
    this.prime1 = prime1;
    this.base2 = base2;
    this.prime2 = prime2;
    this.sh1 = new SingleHash(this.values, base1, prime1);
    this.sh2 = new SingleHash(this.values, base2, prime2);
  }

  /** 子串 [l, r) 的双哈希。 */
  hashOf(l: number, r: number, hooks?: DoubleHashHooks): DoubleHash {
    if (l < 0 || r > this.values.length || l >= r) {
      throw new RangeError(`invalid substring [${l}, ${r})`);
    }
    const dh = { h1: this.sh1.hashOf(l, r), h2: this.sh2.hashOf(l, r) };
    hooks?.onQuery?.(l, r, dh);
    return dh;
  }

  /** 全串双哈希。 */
  fullHash(hooks?: DoubleHashHooks): DoubleHash {
    return this.hashOf(0, this.values.length, hooks);
  }

  /** 输入长度。 */
  length(): number {
    return this.values.length;
  }
}

/** 便捷：比较两串的指定子串是否相等（双哈希判定）。 */
export function doubleSubstringsEqual(
  a: string | number[],
  la: number,
  ra: number,
  b: string | number[],
  lb: number,
  rb: number,
): boolean {
  const len = ra - la;
  if (len !== rb - lb) return false;
  const ha = new DoubleRollingHash(a);
  const hb = new DoubleRollingHash(b);
  const da = ha.hashOf(la, ra);
  const db = hb.hashOf(lb, rb);
  return da.h1 === db.h1 && da.h2 === db.h2;
}

/** 暴力子串相等（直接逐字符比较，用于校验）。 */
export function naiveSubstringsEqual(
  a: string,
  la: number,
  ra: number,
  b: string,
  lb: number,
  rb: number,
): boolean {
  const len = ra - la;
  if (len !== rb - lb) return false;
  for (let i = 0; i < len; i++) {
    if (a.charCodeAt(la + i) !== b.charCodeAt(lb + i)) return false;
  }
  return true;
}
