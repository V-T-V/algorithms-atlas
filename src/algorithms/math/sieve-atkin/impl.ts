// =============================================================================
// Atkin 筛（Sieve of Atkin）· 纯算法实现
// 现代 O(n/log log n) 素数筛。利用二次型的素数判据：
//   对每个 (x,y)，n=4x²+y², 3x²+y², 3x²-y² 落在 [1,limit]，按模 12 的余数标记可能素数，
//   再对每个素数的平方筛去其倍数。
// =============================================================================

export interface AtkinHooks {
  onFlip?: (n: number) => void;
  onSieveSquare?: (p: number) => void;
  onResult?: (primes: number[]) => void;
}

export function sieveAtkin(limit: number, hooks: AtkinHooks = {}): number[] {
  if (limit < 2) {
    hooks.onResult?.([]);
    return [];
  }
  const isPrime = new Array<boolean>(limit + 1).fill(false);
  // 已知小素数
  if (limit >= 2) isPrime[2] = true;
  if (limit >= 3) isPrime[3] = true;

  // 步骤 1：根据二次型翻转
  for (let x = 1; x * x <= limit; x++) {
    for (let y = 1; y * y <= limit; y++) {
      // n = 4x² + y²
      let n = 4 * x * x + y * y;
      if (n <= limit && (n % 12 === 1 || n % 12 === 5)) {
        isPrime[n] = !isPrime[n];
        hooks.onFlip?.(n);
      }
      // n = 3x² + y²
      n = 3 * x * x + y * y;
      if (n <= limit && n % 12 === 7) {
        isPrime[n] = !isPrime[n];
        hooks.onFlip?.(n);
      }
      // n = 3x² - y²（要求 x > y）
      n = 3 * x * x - y * y;
      if (x > y && n <= limit && n % 12 === 11) {
        isPrime[n] = !isPrime[n];
        hooks.onFlip?.(n);
      }
    }
  }

  // 步骤 2：对每个素数 r，把 r² 的倍数标记为合数
  for (let r = 5; r * r <= limit; r++) {
    if (isPrime[r]!) {
      hooks.onSieveSquare?.(r);
      for (let i = r * r; i <= limit; i += r * r) {
        isPrime[i] = false;
      }
    }
  }

  // 收集
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime[i]!) primes.push(i);
  }
  hooks.onResult?.(primes);
  return primes;
}
