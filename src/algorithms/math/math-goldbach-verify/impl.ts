// =============================================================================
// 哥德巴赫验证
// =============================================================================

export interface GoldbachHooks {
  onCheck?: (even: number, ok: boolean, repr?: [number, number]) => void;
}

export interface GoldbachResult {
  valid: boolean; // 所有偶数均满足
  representations: Array<{ even: number; repr: [number, number] }>;
}

export function goldbachVerify(N: number, hooks: GoldbachHooks = {}): GoldbachResult {
  const size = Math.max(3, Math.floor(N));
  const sieve = new Array<boolean>(size + 1).fill(true);
  sieve[0] = false;
  sieve[1] = false;
  for (let i = 2; i * i <= size; i++) {
    if (sieve[i]) for (let j = i * i; j <= size; j += i) sieve[j] = false;
  }
  const primes: number[] = [];
  for (let i = 2; i <= size; i++) if (sieve[i]) primes.push(i);

  const representations: Array<{ even: number; repr: [number, number] }> = [];
  let allValid = true;

  for (let e = 4; e <= size; e += 2) {
    let found: [number, number] | null = null;
    for (const p of primes) {
      if (p > e / 2) break;
      if (sieve[e - p]) {
        found = [p, e - p];
        break;
      }
    }
    if (found) {
      representations.push({ even: e, repr: found });
      hooks.onCheck?.(e, true, found);
    } else {
      allValid = false;
      hooks.onCheck?.(e, false);
    }
  }
  return { valid: allValid, representations };
}
