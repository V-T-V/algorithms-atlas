// =============================================================================
// Miller-Rabin 素数判定
// =============================================================================

export interface MillerRabinHooks {
  onWitness?: (a: bigint, verdict: 'composite' | 'probable') => void;
  onDone?: (prime: boolean) => void;
}

function mulmod(a: bigint, b: bigint, m: bigint): bigint {
  return (a * b) % m;
}

function powmod(base: bigint, exp: bigint, m: bigint): bigint {
  let result = 1n;
  let b = base % m;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = mulmod(result, b, m);
    b = mulmod(b, b, m);
    e >>= 1n;
  }
  return result;
}

export function isPrime(n: number | bigint, hooks: MillerRabinHooks = {}): boolean {
  const N = typeof n === 'bigint' ? n : BigInt(n);
  if (N < 2n) {
    hooks.onDone?.(false);
    return false;
  }
  if (N === 2n || N === 3n) {
    hooks.onDone?.(true);
    return true;
  }
  if (N % 2n === 0n) {
    hooks.onDone?.(false);
    return false;
  }
  let d = N - 1n;
  let r = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    r++;
  }
  const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  for (const a of witnesses) {
    if (a >= N) continue;
    let x = powmod(a, d, N);
    if (x === 1n || x === N - 1n) {
      hooks.onWitness?.(a, 'probable');
      continue;
    }
    let composite = true;
    for (let i = 1n; i < r; i++) {
      x = mulmod(x, x, N);
      if (x === N - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) {
      hooks.onWitness?.(a, 'composite');
      hooks.onDone?.(false);
      return false;
    }
    hooks.onWitness?.(a, 'probable');
  }
  hooks.onDone?.(true);
  return true;
}
