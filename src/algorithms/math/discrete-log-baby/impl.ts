// =============================================================================
// BSGS 离散对数（BigInt）· 纯算法实现
// 求最小非负 x 使 a^x ≡ b (mod m)。
// =============================================================================

/** 事件钩子。 */
export interface DiscreteLogBabyHooks {
  /** 完成小步预存，给出步数 t。 */
  onBabySteps?: (t: bigint) => void;
  /** 一次大步：步数 i、当前值、是否命中。 */
  onGiantStep?: (i: bigint, val: bigint, hit: boolean) => void;
  /** 完成。 */
  onResult?: (x: bigint | null) => void;
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

function extGcd(a: bigint, b: bigint): { g: bigint; x: bigint } {
  let oldR = a;
  let r = b;
  let oldS = 1n;
  let s = 0n;
  while (r !== 0n) {
    const q = oldR / r;
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return { g: oldR, x: oldS };
}

function modInverse(a: bigint, m: bigint): bigint {
  const { g, x } = extGcd(((a % m) + m) % m, m);
  if (g !== 1n) throw new Error('modInverse: not coprime');
  return ((x % m) + m) % m;
}

/**
 * BSGS：求最小非负 x 使 a^x ≡ b (mod m)，m > 1，gcd(a,m)=1。
 * @returns x 或 null（无解）
 */
export function discreteLog(
  a: number | bigint,
  b: number | bigint,
  m: number | bigint,
  hooks: DiscreteLogBabyHooks = {},
): bigint | null {
  const aa = typeof a === 'number' ? BigInt(a) : a;
  const bb = (((typeof b === 'number' ? BigInt(b) : b) % BigInt(m)) + BigInt(m)) % BigInt(m);
  const mm = typeof m === 'number' ? BigInt(m) : m;
  if (mm <= 1n) throw new RangeError('discreteLog: m must be > 1');

  // order 上界 = m-1（m 素数时精确）
  let t = 1n;
  while (t * t < mm) t++;
  hooks.onBabySteps?.(t);

  // 小步：baby[j] = a^j mod m
  const baby = new Map<bigint, bigint>();
  let cur = 1n % mm;
  for (let j = 0n; j < t; j++) {
    if (!baby.has(cur)) baby.set(cur, j);
    cur = (cur * aa) % mm;
  }

  // 大步：a^{-t}
  const factor = modInverse(powMod(aa, t, mm), mm);
  let giant = bb;
  for (let i = 0n; i <= t; i++) {
    const hit = baby.has(giant);
    hooks.onGiantStep?.(i, giant, hit);
    if (hit) {
      const x = i * t + baby.get(giant)!;
      hooks.onResult?.(x);
      return x;
    }
    giant = (giant * factor) % mm;
  }
  hooks.onResult?.(null);
  return null;
}
