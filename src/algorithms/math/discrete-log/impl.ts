// =============================================================================
// 离散对数 BSGS (Baby-Step Giant-Step) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DiscreteLogHooks {
  /** baby-step：记录 g^j mod m。 */
  onBabyStep?: (j: number, value: bigint) => void;
  /** giant-step：检查 t · (g^(-n))^i 是否命中 baby 表。 */
  onGiantStep?: (i: number, value: bigint, hit: boolean) => void;
  /** 最终结果：最小非负 x 或 null（无解）。 */
  onResult?: (x: number | null) => void;
}

/**
 * 离散对数（BSGS）：求最小非负 `x` 使 `g^x ≡ t (mod m)`。
 *
 * 原理（Baby-Step Giant-Step）：令 `n = ⌈√m⌉`。把 `x` 写成 `x = i·n − j`
 * （`0 ≤ j < n`, `0 ≤ i ≤ n`），则 `g^(i·n) ≡ t·g^j (mod m)`。
 * - **Baby step**：预计算 `g^0, g^1, …, g^(n-1) mod m`，存入哈希表 `{value: j}`
 * - **Giant step**：对 `i = 0..n`，计算 `γ_i = t · (g^{-n})^i`，若 `γ_i` 命中表中 `g^j`，
 *   则 `x = i·n − j`；取使 `x ≥ 0` 的最小者
 *
 * - 时间 `O(√m)`，空间 `O(√m)`
 * - 要求 `gcd(g, m) = 1`（否则需先做 p-约化，本实现返回 null）
 *
 * @param g 底数
 * @param t 目标
 * @param m 模数（m > 1）
 * @param hooks 可选的事件钩子
 * @returns 最小非负 `x` 使 `g^x ≡ t (mod m)`，无解返回 `null`
 */
export function discreteLog(
  g: number,
  t: number,
  m: number,
  hooks: DiscreteLogHooks = {},
): number | null {
  if (m <= 1) throw new RangeError('discreteLog: m must be > 1');
  const G = BigInt(g);
  const T = BigInt(((t % m) + m) % m);
  const M = BigInt(m);

  const mul = (a: bigint, b: bigint): bigint => (a * b) % M;
  const pow = (base: bigint, e: number): bigint => {
    let r = 1n % M;
    let b = ((base % M) + M) % M;
    let n = e;
    while (n > 0) {
      if (n & 1) r = mul(r, b);
      n = Math.floor(n / 2);
      b = mul(b, b);
    }
    return r;
  };

  // 特例 t ≡ 1 (mod m) → x = 0
  if (T === 1n % M) {
    hooks.onResult?.(0);
    return 0;
  }

  const n = Math.max(1, Math.ceil(Math.sqrt(m)));

  // baby step: g^j -> j
  const table = new Map<bigint, number>();
  let cur = 1n % M;
  for (let j = 0; j < n; j++) {
    if (!table.has(cur)) table.set(cur, j);
    hooks.onBabyStep?.(j, cur);
    cur = mul(cur, G);
  }

  // giant step 需要 g^{-n}；用扩展欧几里得求 g^n 的逆元（要求 gcd(g,m)=1）
  const gn = pow(G, n);
  const inv = modInverse(gn, M);
  if (inv === null) {
    hooks.onResult?.(null);
    return null;
  }

  let gamma = T % M;
  for (let i = 0; i <= n; i++) {
    const hit = table.has(gamma);
    hooks.onGiantStep?.(i, gamma, hit);
    if (hit) {
      const j = table.get(gamma)!;
      const x = i * n + j;
      if (pow(G, x) === T) {
        hooks.onResult?.(x);
        return x;
      }
    }
    gamma = mul(gamma, inv);
  }
  hooks.onResult?.(null);
  return null;
}

/** 扩展欧几里得求 a 在模 m 下的逆元（要求 gcd(a,m)=1），不存在返回 null。 */
function modInverse(a: bigint, m: bigint): bigint | null {
  const g = gcdExt(a % m, m);
  if (g.g !== 1n && g.g !== -1n) return null;
  return ((g.x % m) + m) % m;
}

function gcdExt(a: bigint, b: bigint): { g: bigint; x: bigint; y: bigint } {
  if (b === 0n) return { g: a, x: 1n, y: 0n };
  const r = gcdExt(b, ((a % b) + b) % b);
  return { g: r.g, x: r.y, y: r.x - (a / b) * r.y };
}
