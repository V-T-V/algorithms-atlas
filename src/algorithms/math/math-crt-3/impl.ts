// =============================================================================
// CRT 扩展（非互素）
// =============================================================================

export interface CrtHooks {
  onMerge?: (r1: bigint, m1: bigint, r2: bigint, m2: bigint, newR: bigint, newM: bigint) => void;
  onDone?: (r: bigint | null, m: bigint) => void;
}

export interface CrtResult {
  remainder: bigint | null;
  modulus: bigint;
}

function extGcd(a: bigint, b: bigint): { g: bigint; x: bigint; y: bigint } {
  if (b === 0n) return { g: a, x: 1n, y: 0n };
  const r = extGcd(b, a % b);
  return { g: r.g, x: r.y, y: r.x - (a / b) * r.y };
}

export function crt(
  remainders: readonly (number | bigint)[],
  moduli: readonly (number | bigint)[],
  hooks: CrtHooks = {},
): CrtResult {
  if (remainders.length === 0) {
    hooks.onDone?.(0n, 1n);
    return { remainder: 0n, modulus: 1n };
  }
  let R =
    typeof remainders[0] === 'bigint' ? (remainders[0] as bigint) : BigInt(remainders[0] as number);
  let M = typeof moduli[0] === 'bigint' ? (moduli[0] as bigint) : BigInt(moduli[0] as number);
  R = ((R % M) + M) % M;
  for (let i = 1; i < remainders.length; i++) {
    const r2 =
      typeof remainders[i] === 'bigint'
        ? (remainders[i] as bigint)
        : BigInt(remainders[i] as number);
    const m2 = typeof moduli[i] === 'bigint' ? (moduli[i] as bigint) : BigInt(moduli[i] as number);
    const { g, x } = extGcd(M, m2);
    const diff = (((r2 - R) % m2) + m2) % m2;
    if (diff % g !== 0n) {
      hooks.onDone?.(null, 0n);
      return { remainder: null, modulus: 0n };
    }
    const lcm = (M / g) * m2;
    const k = (diff / g) % (m2 / g);
    R = R + M * ((x * k) % (m2 / g));
    R = ((R % lcm) + lcm) % lcm;
    M = lcm;
    hooks.onMerge?.(R - M * 0n, M, r2, m2, R, M);
  }
  hooks.onDone?.(R, M);
  return { remainder: R, modulus: M };
}
