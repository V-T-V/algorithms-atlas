// =============================================================================
// 数论变换 Number Theoretic Transform (NTT) · 纯算法实现
// FFT 在模素数下的「整数版本」：用原根的幂代替复数单位根，全程精确无浮点误差。
// 默认模数 998244353 = 119·2^23 + 1，原根 g = 3，支持长度至 2^23 的变换。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 默认 NTT 模数：998244353 = 119·2^23 + 1。 */
export const NTT_MOD = 998244353n;
/** 默认原根 g = 3。 */
export const NTT_G = 3n;

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NttHooks {
  /** 进入某一蝶形级 stage（0-based），该级半步长 half。 */
  onStage?: (stage: number, half: number) => void;
  /** 一次蝶形运算：使用旋转因子 w。 */
  onButterfly?: (stage: number, k: number, w: bigint) => void;
  /** 计算出本级的「主旋转因子」wStep。 */
  onTwiddle?: (stage: number, wStep: bigint) => void;
  /** 变换完成。 */
  onDone?: (result: bigint[], inverse: boolean) => void;
}

/** 判断是否为 2 的幂。 */
export function isPow2(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

/** 位反转：对 len=log2(n) 位二进制逆序。 */
export function bitReverse(x: number, len: number): number {
  let r = 0;
  for (let i = 0; i < len; i++) {
    r = (r << 1) | (x & 1);
    x >>= 1;
  }
  return r;
}

/** 模意义下的快速幂（BigInt）：base^exp mod m。 */
export function powMod(base: bigint, exp: bigint, m: bigint): bigint {
  let r = 1n;
  let b = ((base % m) + m) % m;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

/** 模逆元：a^(-1) mod m（要求 m 为素数，用费马小定理）。 */
export function invMod(a: bigint, m: bigint): bigint {
  return powMod(a, m - 2n, m);
}

/**
 * **迭代版 NTT**（Cooley–Tukey 蝶形，与 FFT 同构，但用模数下的原根幂代替复数单位根）。
 *
 * 输入 `a` 长度必须为 2 的幂，元素均为 BigInt。`inverse=false`（默认）做正向 NTT，
 * `inverse=true` 做 INTT（结果再乘 `n^(-1)` mod m）。
 *
 * 原地修改 `a` 并返回之。模数 m 必须满足：m = k·2^L + 1（默森型素数），g 是其原根，
 * 且 `2^L ≥ n`。对默认 (m=998244353, g=3)，L=23，可支持 n ≤ 2^23。
 *
 * 蝶形：对每个 stage（半步长 half=2^stage）：
 *   - 主旋转因子 `wn = g^((m-1)/(2·half)) mod m`（正向）；逆向用其逆元
 *   - 对每对 `(i, i+half)`：`t = w·a[i+half] mod m`；`a[i+half] = (a[i]−t) mod m`；`a[i] = (a[i]+t) mod m`
 *
 * 时间 `O(n log n)`，空间 `O(n)` 原地。
 *
 * @param a 系数数组（BigInt），长度为 2 的幂
 * @param inverse 是否做逆变换
 * @param hooks 可选事件钩子
 * @param mod 模数（默认 998244353）
 * @param g 原根（默认 3）
 */
export function nttInPlace(
  a: bigint[],
  inverse = false,
  hooks: NttHooks = {},
  mod: bigint = NTT_MOD,
  g: bigint = NTT_G,
): bigint[] {
  const n = a.length;
  if (n === 0) return a;
  if (!isPow2(n)) throw new RangeError('ntt: input length must be a power of 2');

  // 1) 位反转重排
  const len = Math.log2(n);
  for (let i = 0; i < n; i++) {
    const j = bitReverse(i, len);
    if (j > i) {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
    }
  }

  // 2) 蝶形
  for (let half = 1; half < n; half <<= 1) {
    const stage = Math.log2(half);
    hooks.onStage?.(stage, half);
    // 主旋转因子：g^((m-1)/(2*half))，逆向取逆元
    const exp = (mod - 1n) / BigInt(2 * half);
    let wStep = powMod(g, exp, mod);
    if (inverse) wStep = invMod(wStep, mod);
    hooks.onTwiddle?.(stage, wStep);
    for (let base = 0; base < n; base += 2 * half) {
      let w = 1n;
      for (let k = 0; k < half; k++) {
        const i = base + k;
        const j = base + k + half;
        const t = (w * a[j]!) % mod;
        a[j] = (a[i]! - t + mod) % mod;
        a[i] = (a[i]! + t) % mod;
        hooks.onButterfly?.(stage, k, w);
        w = (w * wStep) % mod;
      }
    }
  }

  // 3) 逆向再乘 n^(-1)
  if (inverse) {
    const nInv = invMod(BigInt(n), mod);
    for (let i = 0; i < n; i++) a[i] = (a[i]! * nInv) % mod;
  }

  hooks.onDone?.(a, inverse);
  return a;
}

/**
 * 便捷：对 number[] 做正向 NTT（自动零填充到最近的 2 的幂），返回 BigInt[]。
 */
export function ntt(
  reals: number[],
  inverse = false,
  hooks: NttHooks = {},
  mod: bigint = NTT_MOD,
  g: bigint = NTT_G,
): bigint[] {
  if (reals.length === 0) return [];
  let n = 1;
  while (n < reals.length) n <<= 1;
  const a: bigint[] = new Array<bigint>(n);
  for (let i = 0; i < n; i++) a[i] = BigInt(reals[i] ?? 0);
  return nttInPlace(a, inverse, hooks, mod, g);
}

/**
 * **朴素数论变换**（`O(n²)`，用于交叉校验 NTT 正确性）。
 * `X[k] = Σ a[t] · g^((m-1)/n · k·t) mod m`（正向取 g，逆向取 g^(-1) 后再乘 n^(-1)）。
 */
export function nttNaive(
  reals: number[],
  inverse = false,
  mod: bigint = NTT_MOD,
  g: bigint = NTT_G,
): bigint[] {
  const n = reals.length;
  const out: bigint[] = new Array<bigint>(n);
  const root = powMod(g, (mod - 1n) / BigInt(n), mod); // n 次单位根
  const rootNow = inverse ? invMod(root, mod) : root;
  for (let k = 0; k < n; k++) {
    let s = 0n;
    for (let t = 0; t < n; t++) {
      s = (s + BigInt(reals[t]!) * powMod(rootNow, BigInt((k * t) % n), mod)) % mod;
    }
    out[k] = s;
  }
  if (inverse) {
    const nInv = invMod(BigInt(n), mod);
    for (let i = 0; i < n; i++) out[i] = (out[i]! * nInv) % mod;
  }
  return out;
}

/**
 * **多项式乘法**：在模 998244353 下计算 `A(x)·B(x)` 的系数。
 * 用 NTT 加速，把两个多项式补到长度 2 的幂后点值相乘再 INTT 回来。
 *
 * 时间 `O((n+m) log(n+m))`。
 *
 * @param A 多项式 A 的系数（低次在前）
 * @param B 多项式 B 的系数
 * @returns A·B 的系数数组（长度 = 第一个 ≥ |A|+|B|−1 的 2 的幂，高位可能含 0）
 */
export function polyMultiply(
  A: number[],
  B: number[],
  mod: bigint = NTT_MOD,
  g: bigint = NTT_G,
): bigint[] {
  if (A.length === 0 || B.length === 0) return [];
  let n = 1;
  while (n < A.length + B.length - 1) n <<= 1;
  const fa: bigint[] = new Array<bigint>(n).fill(0n);
  const fb: bigint[] = new Array<bigint>(n).fill(0n);
  for (let i = 0; i < A.length; i++) fa[i] = BigInt(A[i]!);
  for (let i = 0; i < B.length; i++) fb[i] = BigInt(B[i]!);
  nttInPlace(fa, false, {}, mod, g);
  nttInPlace(fb, false, {}, mod, g);
  for (let i = 0; i < n; i++) fa[i] = (fa[i]! * fb[i]!) % mod;
  nttInPlace(fa, true, {}, mod, g);
  // 截断到实际次数 +1
  const result = fa.slice(0, A.length + B.length - 1);
  return result;
}
