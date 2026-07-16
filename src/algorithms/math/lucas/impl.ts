// =============================================================================
// 卢卡斯定理 Lucas Theorem · 纯算法实现
// 计算 C(n, m) mod p，其中 p 为素数。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LucasHooks {
  /** Lucas 递归分解的一层：把 (n, m) 拆成 p 进制位 (n0, m0) 和 (n', m')。 */
  onDigit?: (n: number, m: number, n0: number, m0: number, p: number) => void;
  /** 单个 C(n_i, m_i) mod p 的值被算出。 */
  onComb?: (n0: number, m0: number, p: number, value: number) => void;
  /** 完成，给出最终结果。 */
  onDone?: (result: number) => void;
}

/** 判断 p 是否为素数（试除，仅用于小 p）。 */
function isPrime(p: number): boolean {
  if (p < 2) return false;
  if (p % 2 === 0) return p === 2;
  for (let i = 3; i * i <= p; i += 2) {
    if (p % i === 0) return false;
  }
  return true;
}

/**
 * 预处理 [0..p) 的阶乘表 fact 与逆元表 invFact（费马小定理）。
 * 用 `fact[a] · invFact[b] · invFact[a−b] mod p` 即可 `O(1)` 求 C(a, b) mod p。
 *
 * 用 BigInt 防止乘法溢出；对外仍返回 number。
 */
function buildFactorials(p: number): {
  fact: bigint[];
  invFact: bigint[];
  mod: bigint;
} {
  const P = BigInt(p);
  const fact = new Array<bigint>(p).fill(1n);
  for (let i = 1; i < p; i++) fact[i] = (fact[i - 1]! * BigInt(i)) % P;
  // 费马小定理求逆元：x^(p-2) mod p
  const pow = (base: bigint, e: bigint): bigint => {
    let r = 1n;
    let b = base % P;
    let exp = e;
    while (exp > 0n) {
      if (exp & 1n) r = (r * b) % P;
      b = (b * b) % P;
      exp >>= 1n;
    }
    return r;
  };
  const invFact = new Array<bigint>(p).fill(1n);
  invFact[p - 1] = pow(fact[p - 1]!, P - 2n);
  for (let i = p - 2; i >= 0; i--) invFact[i] = (invFact[i + 1]! * BigInt(i + 1)) % P;
  return { fact, invFact, mod: P };
}

/**
 * 用预处理阶乘表 `O(1)` 求 C(a, b) mod p（要求 `0 ≤ a, b < p`）。
 */
function combSmall(
  a: number,
  b: number,
  table: { fact: bigint[]; invFact: bigint[]; mod: bigint },
): number {
  if (b < 0 || b > a) return 0;
  const { fact, invFact, mod } = table;
  const v = (((fact[a]! * invFact[b]!) % mod) * invFact[a - b]!) % mod;
  return Number(v);
}

/**
 * 卢卡斯定理：`C(n, m) mod p`，`p` 为素数。
 *
 * 定理：把 `n, m` 写成 `p` 进制 `n = (n_k ... n_1 n_0)_p`、`m = (m_k ... m_1 m_0)_p`，
 * 则 `C(n, m) ≡ ∏ C(n_i, m_i) (mod p)`。
 *
 * 等价递归形式：
 *   `Lucas(n, m, p) = Lucas(n/p, m/p, p) · C(n mod p, m mod p) mod p`，
 *   `Lucas(n, 0, p) = 1`。
 *
 * 复杂度：预处理阶乘 `O(p)`；每次查询 `O(log_p n)` 层，每层 `O(1)`。
 *
 * @param n 上指标（≥0）
 * @param m 下指标（≥0，若 m>n 返回 0）
 * @param p 素数模数（≥2）
 * @returns `C(n, m) mod p`
 */
export function lucas(n: number, m: number, p: number, hooks: LucasHooks = {}): number {
  if (p < 2 || !isPrime(p)) throw new RangeError('lucas: p must be a prime ≥ 2');
  if (n < 0 || m < 0) throw new RangeError('lucas: n, m must be non-negative');
  if (m > n) {
    hooks.onDone?.(0);
    return 0;
  }
  const table = buildFactorials(p);

  let result = 1;
  let nn = n;
  let mm = m;
  while (mm > 0) {
    const n0 = nn % p;
    const m0 = mm % p;
    hooks.onDigit?.(nn, mm, n0, m0, p);
    if (m0 > n0) {
      // 该位 C(n0, m0)=0 → 乘积为 0
      hooks.onComb?.(n0, m0, p, 0);
      hooks.onDone?.(0);
      return 0;
    }
    const c = combSmall(n0, m0, table);
    hooks.onComb?.(n0, m0, p, c);
    result = (result * c) % p;
    nn = Math.floor(nn / p);
    mm = Math.floor(mm / p);
  }
  hooks.onDone?.(result);
  return result;
}

/**
 * 暴力 C(n, m) 用 BigInt 计算（用于交叉校验，n 不宜过大）。
 */
export function combBig(n: number, m: number): bigint {
  if (m < 0 || m > n) return 0n;
  m = Math.min(m, n - m);
  let r = 1n;
  for (let i = 0; i < m; i++) {
    r = (r * BigInt(n - i)) / BigInt(i + 1);
  }
  return r;
}
