// =============================================================================
// 双哈希（类封装前缀哈希）· 纯算法实现
// 两对独立 (base, mod)，O(1) 子串哈希。
// =============================================================================

export interface DoubleHashConfig {
  base1: number;
  mod1: number;
  base2: number;
  mod2: number;
}

export const DEFAULT_CONFIG: DoubleHashConfig = {
  base1: 131,
  mod1: 1000000007,
  base2: 137,
  mod2: 1000000009,
};

export interface HashPair {
  h1: number;
  h2: number;
}

/** 双哈希前缀器。 */
export class DoubleHasher {
  readonly n: number;
  private pref1: number[];
  private pref2: number[];
  private pow1: number[];
  private pow2: number[];
  private cfg: DoubleHashConfig;

  constructor(s: string, cfg: DoubleHashConfig = DEFAULT_CONFIG) {
    this.n = s.length;
    this.cfg = cfg;
    this.pref1 = new Array<number>(this.n + 1).fill(0);
    this.pref2 = new Array<number>(this.n + 1).fill(0);
    this.pow1 = new Array<number>(this.n + 1).fill(1);
    this.pow2 = new Array<number>(this.n + 1).fill(1);
    for (let i = 0; i < this.n; i++) {
      this.pow1[i + 1] = (this.pow1[i]! * cfg.base1) % cfg.mod1;
      this.pow2[i + 1] = (this.pow2[i]! * cfg.base2) % cfg.mod2;
      this.pref1[i + 1] = (this.pref1[i]! * cfg.base1 + s.charCodeAt(i)) % cfg.mod1;
      this.pref2[i + 1] = (this.pref2[i]! * cfg.base2 + s.charCodeAt(i)) % cfg.mod2;
    }
  }

  /** 子串 s[l..r)（含 l，不含 r）的双哈希。 */
  hash(l: number, r: number): HashPair {
    if (l < 0 || r > this.n || l > r) throw new RangeError('DoubleHasher.hash: invalid range');
    const { mod1, mod2 } = this.cfg;
    const h1 = (((this.pref1[r]! - this.pref1[l]! * this.pow1[r - l]!) % mod1) + mod1) % mod1;
    const h2 = (((this.pref2[r]! - this.pref2[l]! * this.pow2[r - l]!) % mod2) + mod2) % mod2;
    return { h1, h2 };
  }

  /** 整串哈希。 */
  fullHash(): HashPair {
    return this.hash(0, this.n);
  }
}

/** 事件钩子（用于 trace）。 */
export interface DoubleHashHooks {
  /** 预处理位置 i 时的前缀哈希。 */
  onPrefix?: (i: number, h1: number, h2: number) => void;
  /** 子串查询 [l,r) 的结果。 */
  onQuery?: (l: number, r: number, hash: HashPair) => void;
}

/** 函数式便捷接口：求整串双哈希。 */
export function doubleHash(
  s: string,
  cfg: DoubleHashConfig = DEFAULT_CONFIG,
  hooks: DoubleHashHooks = {},
): HashPair {
  const h = new DoubleHasher(s, cfg);
  for (let i = 0; i < s.length; i++) {
    hooks.onPrefix?.(i, h['pref1'][i + 1]!, h['pref2'][i + 1]!);
  }
  const f = h.fullHash();
  hooks.onQuery?.(0, s.length, f);
  return f;
}
