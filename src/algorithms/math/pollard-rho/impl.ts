// =============================================================================
// Pollard-Rho 整数分解（Pollard Rho Factorization）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// 大数运算全程用 BigInt，保证正确性。
// =============================================================================

import { millerRabin } from '../miller-rabin/impl.ts';

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PollardRhoHooks {
  /** 单步推进：游标 x、兔 y 与当前累积差值积的 gcd（批量检查时给出）。 */
  onStep?: (x: bigint, y: bigint, gcd: bigint) => void;
  /** 发现一个非平凡因子 d（1 < d < n）。 */
  onFactor?: (d: bigint) => void;
  /** 一次尝试因陷入循环（差值归零）而更换参数 c 重启。 */
  onRestart?: (c: bigint) => void;
  /** 整体完成：n 已被完全分解为升序素因子列表。 */
  onDone?: (factors: bigint[]) => void;
}

const abs = (n: bigint): bigint => (n < 0n ? -n : n);

/** BigInt 最大公约数。 */
export function bigGcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}

/** 伪随机步：f(x) = (x^2 + c) mod n。 */
function step(x: bigint, c: bigint, n: bigint): bigint {
  return (x * x + c) % n;
}

/** BigInt 整数 k 次方根（向下取整）。 */
function iRoot(x: bigint, k: number): bigint {
  if (x < 0n) throw new RangeError('iRoot: x must be non-negative');
  if (x === 0n) return 0n;
  // 二分 [1, x]，找最大的 r 使 r^k <= x
  let lo = 1n;
  let hi = x;
  while (lo < hi) {
    const mid = (lo + hi + 1n) / 2n;
    if (powInt(mid, k) <= x) lo = mid;
    else hi = mid - 1n;
  }
  return lo;
}

/** BigInt 整数幂（小指数）。 */
function powInt(base: bigint, k: number): bigint {
  let r = 1n;
  for (let i = 0; i < k; i++) r *= base;
  return r;
}

/**
 * 检查 n 是否为 a^k（k≥2）的完全幂。若是返回底数 a（>1），否则返回 null。
 * 关键用途：Pollard-Rho 对 n=p² 这类「完全素数平方」会失效（gcd 永远只给 1 或 n），
 * 因此分解前先用本函数提走完全幂。
 */
function perfectPowerRoot(n: bigint): bigint | null {
  if (n < 4n) return null;
  const maxK = Number(n.toString(2).length); // log2(n)
  for (let k = maxK; k >= 2; k--) {
    const r = iRoot(n, k);
    if (r >= 2n && powInt(r, k) === n) return r;
  }
  return null;
}

/** 用龟兔赛跑（Floyd 判圈）+ 批量 gcd，在合数 n 中找一个非平凡因子。
 *  返回因子 d（1 < d < n）；找不到（陷入死循环兜底失败）返回 1n。 */
function findFactor(n: bigint, c: bigint, hooks: PollardRhoHooks, maxIter: number): bigint {
  let x = 2n;
  let y = 2n;
  let prod = 1n;
  let sinceGcd = 0;
  for (let i = 0; i < maxIter; i++) {
    x = step(x, c, n);
    y = step(step(y, c, n), c, n);
    const diff = x > y ? x - y : y - x;
    if (diff === 0n) break; // 序列进入循环
    prod = (prod * diff) % n;
    sinceGcd++;
    // 每 64 步检查一次 gcd（减少昂贵大 gcd 次数，又能及时捕捉因子）
    if (sinceGcd >= 64) {
      const d = bigGcd(prod, n);
      hooks.onStep?.(x, y, d);
      if (d > 1n) return d;
      prod = 1n;
      sinceGcd = 0;
    } else {
      hooks.onStep?.(x, y, 1n);
    }
  }
  // 兜底：对最后的累积积求 gcd（可能在循环前已夹住因子）
  const d = bigGcd(prod, n);
  return d;
}

/**
 * Pollard-Rho：找出合数 n 的一个非平凡因子。
 *
 * 原理：构造序列 `x₀=2, x_{i+1} = f(x_i) = x_i² + c (mod n)`（f 是「伪随机」映射）。
 * 由于值域有限，序列迟早进入循环。用 Floyd 判圈（龟兔赛跑）追两点 `x, y`，
 * 计算 `d = gcd(|x - y|, n)`：若 `1 < d < n`，d 即一个因子。
 *
 * - 素数 / 小输入直接处理
 * - 用「批量 gcd」：把连续若干步的 `|x-y|` 相乘，再统一求一次 gcd，减少昂贵大 gcd
 * - 陷入循环（差值归零）则换常数 c 重启
 *
 * @param n 待分解整数（n > 1）
 * @returns 一个非平凡因子 d（1 < d < n）。若 n 为素数返回 n 本身。
 */
export function pollardRho(n: number | bigint, hooks: PollardRhoHooks = {}): bigint {
  const nb = BigInt(n);
  if (nb <= 1n) throw new RangeError('pollardRho: n must be > 1');
  if (nb % 2n === 0n) {
    hooks.onFactor?.(2n);
    return 2n;
  }
  // n 本身是素数（且在 JS 安全整数范围内）：无非平凡因子，返回自身
  if (nb <= 9007199254740991n && millerRabin(Number(nb))) {
    hooks.onFactor?.(nb);
    return nb;
  }

  // 完全幂检测：n = a^k（k≥2）。Pollard-Rho 对 n=p² 会失效，故提前提走。
  // 取底数 a：若 a 仍可分解，递归路径会继续处理；这里直接返回 a 作为因子。
  const ppRoot = perfectPowerRoot(nb);
  if (ppRoot !== null && ppRoot > 1n && ppRoot < nb) {
    hooks.onFactor?.(ppRoot);
    return ppRoot;
  }

  // 每轮允许的最大步数：经验上 √(最小因子) 量级，给充足余量
  const maxIter = 1 << 18;
  for (let c = 1n; ; c++) {
    hooks.onRestart?.(c);
    const d = findFactor(nb, c, hooks, maxIter);
    if (d > 1n && d < nb) {
      hooks.onFactor?.(d);
      return d;
    }
    // d===1（未夹住因子）或 d===n（夹住了 n 自身）→ 换 c 重来
  }
}

/**
 * 完全分解 n：递归调用 Pollard-Rho，把 n 拆成升序素因子列表。
 * 利用 Miller-Rabin 区分素因子与继续分解的合数因子。
 */
export function factorize(n: number | bigint, hooks: PollardRhoHooks = {}): bigint[] {
  const nb = BigInt(n);
  if (nb <= 1n) {
    hooks.onDone?.([]);
    return [];
  }
  const factors: bigint[] = [];

  const pushPrime = (m: bigint): void => {
    if (m <= 1n) return;
    const isSmallPrime = m <= 9007199254740991n && millerRabin(Number(m));
    if (isSmallPrime) {
      factors.push(m);
      hooks.onFactor?.(m);
      return;
    }
    const d = pollardRho(m, hooks);
    if (d === m) {
      factors.push(m); // n 本身就是（超出安全范围的）素数
      return;
    }
    pushPrime(d);
    pushPrime(m / d);
  };

  // 先把 2 全部提走，避免偶数分支噪声
  let rest = nb;
  while (rest % 2n === 0n) {
    factors.push(2n);
    hooks.onFactor?.(2n);
    rest /= 2n;
  }
  pushPrime(rest);

  factors.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  hooks.onDone?.(factors);
  return factors;
}
