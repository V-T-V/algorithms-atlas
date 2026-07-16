// =============================================================================
// Pollard Rho 随机化因数分解 · 纯算法实现
// 伪随机序列 x → x² + c (mod n) + Floyd 环检测 + Miller-Rabin 终止。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** 事件钩子。 */
export interface PollardRhoHooks {
  /** 尝试用常数 c 启动一轮 Rho 搜索。 */
  onStart?: (n: bigint, c: bigint) => void;
  /** 每步快慢指针：给出 x_slow、x_fast、gcd 值。 */
  onStep?: (xSlow: bigint, xFast: bigint, g: bigint) => void;
  /** 找到非平凡因子 d（g 在 1..n 之间）。 */
  onFactor?: (d: bigint) => void;
  /** 完成对一个素因子的提取。 */
  onResult?: (n: bigint, factor: bigint | null) => void;
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

/** Miller-Rabin 单轮（确定性基 {2,3,5,7,11,13,17,19,23,29,31,37}）。 */
export function isProbablePrime(n: bigint): boolean {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;
  let d = n - 1n;
  let s = 0n;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s++;
  }
  const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n].filter((a) => a < n);
  for (const a of bases) {
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let composite = true;
    for (let r = 1n; r < s; r++) {
      x = (x * x) % n;
      if (x === n - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) return false;
  }
  return true;
}

/** gcd（BigInt）。 */
export function bigGcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b > 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** (x² + c) mod n —— Rho 序列的迭代函数。 */
function rhoStep(x: bigint, c: bigint, n: bigint): bigint {
  return (x * x + c) % n;
}

/**
 * Pollard Rho 单次：尝试为合数 n 找一个非平凡因子。
 * 使用 Brent 改进（积累若干步再求一次 gcd），失败返回 null。
 */
export function pollardRhoOne(n: bigint, hooks: PollardRhoHooks = {}): bigint | null {
  if (n % 2n === 0n) return 2n;
  // 依次尝试不同常数 c
  for (let c = 1n; c < n; c++) {
    hooks.onStart?.(n, c);
    let x = 2n;
    let y = 2n;
    let d = 1n;
    // Brent 风格
    while (d === 1n) {
      x = rhoStep(x, c, n);
      y = rhoStep(rhoStep(y, c, n), c, n);
      const diff = x - y;
      d = bigGcd(diff < 0n ? -diff : diff, n);
      hooks.onStep?.(x, y, d);
      if (x === y) break; // 退化，换 c
    }
    if (d > 1n && d < n) {
      hooks.onFactor?.(d);
      hooks.onResult?.(n, d);
      return d;
    }
    // d===n 或退化为环，换 c 重试
  }
  hooks.onResult?.(n, null);
  return null;
}

/**
 * 完整分解 n，返回升序素因子列表（含重复因子）。
 *
 * @param n 待分解正整数（>1）
 * @param hooks 可选钩子
 * @returns 升序素因子数组
 */
export function factorize(n: bigint, hooks: PollardRhoHooks = {}): bigint[] {
  const factors: bigint[] = [];
  const stack: bigint[] = [n];
  while (stack.length > 0) {
    const m = stack.pop()!;
    if (m === 1n) continue;
    if (isProbablePrime(m)) {
      factors.push(m);
      continue;
    }
    // 先提取 2
    if (m % 2n === 0n) {
      let q = m;
      while (q % 2n === 0n) {
        factors.push(2n);
        q /= 2n;
      }
      if (q > 1n) stack.push(q);
      continue;
    }
    const d = pollardRhoOne(m, hooks);
    if (d === null) {
      // 无法分解（极少），当作素数
      factors.push(m);
    } else {
      stack.push(d);
      stack.push(m / d);
    }
  }
  factors.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return factors;
}
