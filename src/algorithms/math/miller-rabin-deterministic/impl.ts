// =============================================================================
// 确定性 Miller-Rabin · 纯算法实现
// 对 n < 2^64 用固定 witnesses 做确定性素性判定。
// =============================================================================

/** 事件钩子。 */
export interface MillerRabinDetHooks {
  /** 把 n-1 分解为 d·2^r。 */
  onDecompose?: (d: bigint, r: number) => void;
  /** 对某 witness a 做一轮检验，passed 表示是否通过。 */
  onWitness?: (a: bigint, passed: boolean) => void;
  /** 最终判定 isPrime。 */
  onDone?: (n: bigint, isPrime: boolean) => void;
}

function powMod(base: bigint, exp: bigint, m: bigint): bigint {
  let b = ((base % m) + m) % m;
  let e = exp;
  let r = 1n % m;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

/** 64 位以内的确定性 witnesses。 */
const WITNESSES_64 = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

/**
 * 确定性 Miller-Rabin 素性判定。对 n < 3,317,044,064,679,887,385,961,981 使用上述固定 witnesses。
 * @param n 待判定正整数
 * @returns 是否为素数
 */
export function isPrimeMillerRabin(n: number | bigint, hooks: MillerRabinDetHooks = {}): boolean {
  const nn = typeof n === 'number' ? BigInt(n) : n;
  if (nn < 2n) {
    hooks.onDone?.(nn, false);
    return false;
  }
  // 小素数直接判定
  for (const p of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    if (nn === p) {
      hooks.onDone?.(nn, true);
      return true;
    }
    if (nn % p === 0n) {
      hooks.onDone?.(nn, false);
      return false;
    }
  }
  // 分解 n-1 = d · 2^r，d 为奇数
  let d = nn - 1n;
  let r = 0;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    r++;
  }
  hooks.onDecompose?.(d, r);

  for (const a of WITNESSES_64) {
    if (a >= nn - 1n) continue;
    let x = powMod(a, d, nn);
    let passed = x === 1n || x === nn - 1n;
    if (!passed) {
      for (let i = 1; i < r; i++) {
        x = (x * x) % nn;
        if (x === nn - 1n) {
          passed = true;
          break;
        }
      }
    }
    hooks.onWitness?.(a, passed);
    if (!passed) {
      hooks.onDone?.(nn, false);
      return false;
    }
  }
  hooks.onDone?.(nn, true);
  return true;
}
