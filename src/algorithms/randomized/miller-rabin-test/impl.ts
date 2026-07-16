// =============================================================================
// Miller-Rabin 随机化素性测试 · 纯算法实现
// 使用 BigInt 模乘快速幂，支持随机化与 n<2^64 的确定性基组。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每轮检验，供录制器使用。
// =============================================================================

/** [0,1) 随机源类型（产生浮点）。 */
export type Rng = () => number;

/** 事件钩子。 */
export interface MillerRabinHooks {
  /** 分解 n−1 = 2^s · d。 */
  onDecompose?: (s: bigint, d: bigint) => void;
  /** 第 round 轮：选定的基 a。 */
  onBase?: (round: number, a: bigint) => void;
  /** 第 round 轮：a^d (mod n) 的取值。 */
  onAd?: (round: number, ad: bigint) => void;
  /** 第 round 轮：是否通过（true=无法证明合数；false=确证合数）。 */
  onRound?: (round: number, passed: boolean) => void;
  /** 最终结论（true=极可能素数；false=确证合数）。 */
  onResult?: (probablyPrime: boolean, rounds: number) => void;
}

/** 确定性 RNG（Mulberry32）——产生 [0,1)。 */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 模乘快速幂 base^exp mod m。 */
export function modPow(base: bigint, exp: bigint, m: bigint): bigint {
  if (m === 1n) return 0n;
  let result = 1n;
  let b = base % m;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    e >>= 1n;
    b = (b * b) % m;
  }
  return result;
}

/** n<2^64 的确定性基组（足以无误差判定）。 */
export const DETERMINISTIC_BASES: bigint[] = [
  2n,
  3n,
  5n,
  7n,
  11n,
  13n,
  17n,
  19n,
  23n,
  29n,
  31n,
  37n,
];

/**
 * 单轮 Miller-Rabin 检验：用基 a 检验 n（奇数，n−1=2^s·d）。
 * @returns true=本轮通过（无法证明合数）；false=a 是合数证据
 */
function singleRound(
  n: bigint,
  d: bigint,
  s: bigint,
  a: bigint,
  hooks?: MillerRabinHooks,
  round?: number,
): boolean {
  let x = modPow(a, d, n);
  hooks?.onAd?.(round ?? 0, x);
  if (x === 1n || x === n - 1n) return true;
  for (let r = 1n; r < s; r++) {
    x = (x * x) % n;
    if (x === n - 1n) return true;
    if (x === 1n) return false;
  }
  return false;
}

/**
 * Miller-Rabin 素性测试。
 *
 * @param n 待测正整数（>1）
 * @param rounds 随机轮数（当 useDeterministic 为 true 时忽略，改用确定性基组）
 * @param rng [0,1) 随机源（仅随机化模式使用）
 * @param useDeterministic 是否用确定性基组（对 n<3.3e24 无误差）
 * @param hooks 可选钩子
 * @returns true=极可能/确定素数；false=确证合数
 */
export function millerRabin(
  n: bigint,
  rounds: number = 10,
  rng: Rng = Math.random,
  useDeterministic: boolean = false,
  hooks: MillerRabinHooks = {},
): boolean {
  if (n < 2n) {
    hooks.onResult?.(false, 0);
    return false;
  }
  if (n === 2n || n === 3n) {
    hooks.onResult?.(true, 0);
    return true;
  }
  if (n % 2n === 0n) {
    hooks.onResult?.(false, 0);
    return false;
  }

  // 分解 n−1 = 2^s · d
  let d = n - 1n;
  let s = 0n;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s++;
  }
  hooks.onDecompose?.(s, d);

  let bases: bigint[];
  if (useDeterministic) {
    bases = DETERMINISTIC_BASES.filter((a) => a < n);
  } else {
    bases = [];
    for (let i = 0; i < rounds; i++) {
      // a ∈ [2, n−2]
      const span = n - 4n;
      let a = 2n;
      if (span > 0n) {
        // 取 [0, span] 的随机 BigInt
        const bits = span.toString(2).length;
        let r = 0n;
        for (let b = 0; b < bits; b++) {
          r = (r << 1n) | (rng() < 0.5 ? 0n : 1n);
        }
        r = r % (span + 1n);
        a = 2n + r;
      }
      bases.push(a);
    }
  }

  for (let i = 0; i < bases.length; i++) {
    const a = bases[i]!;
    hooks.onBase?.(i, a);
    const passed = singleRound(n, d, s, a, hooks, i);
    hooks.onRound?.(i, passed);
    if (!passed) {
      hooks.onResult?.(false, i + 1);
      return false; // a 证明 n 合数
    }
  }
  hooks.onResult?.(true, bases.length);
  return true;
}
