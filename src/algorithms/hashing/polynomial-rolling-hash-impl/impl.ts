// =============================================================================
// 多项式滚动哈希 · 纯算法实现
// 竞赛风格：H = Σ s[i]·base^(n-1-i) mod P。支持前缀预处理与 O(1) 子串查询。
// =============================================================================

/** 默认参数（竞赛常用）。 */
export const DEFAULT_BASE = 91138233;
export const DEFAULT_PRIME = 972663749;

/** 模乘（用 BigInt 保证不溢出，P 可达 ~2^30）。 */
function modMul(a: number, b: number, p: number): number {
  return Number((((BigInt(a) * BigInt(b)) % BigInt(p)) + BigInt(p)) % BigInt(p));
}

/** 模加。 */
function modAdd(a: number, b: number, p: number): number {
  return (((a + b) % p) + p) % p;
}

/** 把输入归一化为整数数组（字符 charCode）。 */
function toInts(data: string | number[]): number[] {
  if (typeof data === 'string') {
    return Array.from(data).map((c) => c.charCodeAt(0));
  }
  return [...data];
}

/** 事件钩子。 */
export interface PolyHashHooks {
  /** 预处理完成：前缀哈希数组与 base 幂数组已就绪。 */
  onInit?: (prefix: number[], powers: number[]) => void;
  /** 滚动一步：窗口从 start 滚到 start+1，新窗口哈希。 */
  onRoll?: (start: number, oldHash: number, newHash: number) => void;
}

/**
 * 多项式滚动哈希结构体（预计算前缀 + 幂）。
 * 子串哈希：hash(l, r) = Σ_{i=l}^{r-1} s[i]·base^(r-1-i) mod P
 */
export class PolyHash {
  readonly base: number;
  readonly prime: number;
  private readonly values: number[];
  /** prefix[i] = s[0]·base^(i-1) + s[1]·base^(i-2) + ... + s[i-1] (即长度 i 的前缀哈希)。 */
  readonly prefix: number[];
  /** powers[i] = base^i mod P。 */
  readonly powers: number[];

  constructor(data: string | number[], base: number = DEFAULT_BASE, prime: number = DEFAULT_PRIME) {
    this.base = base;
    this.prime = prime;
    this.values = toInts(data);
    const n = this.values.length;
    this.powers = new Array<number>(n + 1).fill(1);
    this.prefix = new Array<number>(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
      this.powers[i + 1] = modMul(this.powers[i]!, base, prime);
      this.prefix[i + 1] = modAdd(modMul(this.prefix[i]!, base, prime), this.values[i]!, prime);
    }
  }

  /** 长度 length 的前缀哈希 [0, length)。 */
  hashPrefix(length: number): number {
    return this.prefix[length]!;
  }

  /**
   * 子串 [l, r) 的哈希（0-based，左闭右开）。
   * hash(l,r) = (prefix[r] - prefix[l]*base^(r-l)) mod P
   */
  hashOf(l: number, r: number): number {
    if (l < 0 || r > this.values.length || l >= r) {
      throw new RangeError(`invalid substring [${l}, ${r})`);
    }
    const len = r - l;
    const h = modAdd(
      this.prefix[r]!,
      -modMul(this.prefix[l]!, this.powers[len]!, this.prime),
      this.prime,
    );
    return h;
  }

  /** 输入长度。 */
  length(): number {
    return this.values.length;
  }
}

/**
 * 在固定窗口宽度 w 上滚动，输出每个窗口的哈希。
 * @param data 输入
 * @param w 窗口宽度
 * @param base 基数
 * @param prime 素数
 * @param hooks 可选事件钩子
 * @returns 每个起始下标对应的哈希数组（长度 = n - w + 1）
 */
export function rollingWindows(
  data: string | number[],
  w: number,
  base: number = DEFAULT_BASE,
  prime: number = DEFAULT_PRIME,
  hooks: PolyHashHooks = {},
): number[] {
  const values = toInts(data);
  const n = values.length;
  if (w <= 0 || w > n) throw new RangeError('invalid window width');

  const powers = new Array<number>(w).fill(1);
  for (let i = 1; i < w; i++) powers[i] = modMul(powers[i - 1]!, base, prime);

  // 首窗口哈希
  let h = 0;
  for (let i = 0; i < w; i++) {
    h = modAdd(modMul(h, base, prime), values[i]!, prime);
  }
  const prefix = [h];
  hooks.onInit?.([h], powers);

  const results = [h];
  for (let i = 0; i < n - w; i++) {
    const oldH = h;
    // 减去最高位 s[i]·base^(w-1)
    h = modAdd(h, -modMul(values[i]!, powers[w - 1]!, prime), prime);
    // 左移 + 加入新低位
    h = modAdd(modMul(h, base, prime), values[i + w]!, prime);
    results.push(h);
    prefix.push(h);
    hooks.onRoll?.(i, oldH, h);
  }

  return results;
}

/** 便捷：两子串是否相等（用哈希判定）。 */
export function substringsEqual(
  a: string | number[],
  la: number,
  ra: number,
  b: string | number[],
  lb: number,
  rb: number,
  base: number = DEFAULT_BASE,
  prime: number = DEFAULT_PRIME,
): boolean {
  const len = ra - la;
  if (len !== rb - lb) return false;
  const ha = new PolyHash(a, base, prime);
  const hb = new PolyHash(b, base, prime);
  return ha.hashOf(la, ra) === hb.hashOf(lb, rb);
}
