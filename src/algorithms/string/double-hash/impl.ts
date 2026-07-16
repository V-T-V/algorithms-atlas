// =============================================================================
// 双哈希（双模数滚动哈希）· 纯算法实现
// 同时维护两套独立基数/模数的前缀哈希，把哈希碰撞概率降到约 1/(M1*M2)。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DoubleHashHooks {
  /** 计算完位置 i 的双哈希 (h1, h2)。 */
  onStep?: (i: number, h1: number, h2: number) => void;
  /** 计算完成。 */
  onDone?: () => void;
}

export const BASE1 = 131;
export const MOD1 = 1_000_000_007;
export const BASE2 = 137;
export const MOD2 = 998_244_353;

export interface DoubleHashResult {
  /** 前缀哈希数组（mod MOD1），长度 n+1。 */
  prefix1: number[];
  /** 前缀哈希数组（mod MOD2），长度 n+1。 */
  prefix2: number[];
  /** powB1[i] = BASE1^i mod MOD1。 */
  pow1: number[];
  /** powB2[i] = BASE2^i mod MOD2。 */
  pow2: number[];
  n: number;
}

/**
 * 双模数滚动哈希：对字符串同时计算两套独立前缀哈希。
 *
 * 两套 (BASE, MOD) 互相独立；若两子串在两套哈希下都相等，则认为字符串相等
 * （碰撞概率 ≈ 1/(MOD1*MOD2) ≈ 10^-18，可视为零）。
 *
 * 构造时间 O(n)，单次子串查询 O(1)，空间 O(n)。
 *
 * @returns DoubleHashResult，含两套前缀哈希与幂次表
 */
export function doubleHash(s: string, hooks: DoubleHashHooks = {}): DoubleHashResult {
  const n = s.length;
  const prefix1 = new Array<number>(n + 1).fill(0);
  const prefix2 = new Array<number>(n + 1).fill(0);
  const pow1 = new Array<number>(n + 1).fill(1);
  const pow2 = new Array<number>(n + 1).fill(1);
  for (let i = 0; i < n; i++) {
    pow1[i + 1] = (pow1[i]! * BASE1) % MOD1;
    pow2[i + 1] = (pow2[i]! * BASE2) % MOD2;
    prefix1[i + 1] = (prefix1[i]! * BASE1 + s.charCodeAt(i)) % MOD1;
    prefix2[i + 1] = (prefix2[i]! * BASE2 + s.charCodeAt(i)) % MOD2;
    hooks.onStep?.(i, prefix1[i + 1]!, prefix2[i + 1]!);
  }
  hooks.onDone?.();
  return { prefix1, prefix2, pow1, pow2, n };
}

/** 查询 s[l..r]（闭区间）的双哈希指纹 [h1, h2]。 */
export function subHashDouble(res: DoubleHashResult, l: number, r: number): [number, number] {
  const len = r - l + 1;
  const h1 = (res.prefix1[r + 1]! - ((res.prefix1[l]! * res.pow1[len]!) % MOD1) + MOD1) % MOD1;
  const h2 = (res.prefix2[r + 1]! - ((res.prefix2[l]! * res.pow2[len]!) % MOD2) + MOD2) % MOD2;
  return [h1, h2];
}
