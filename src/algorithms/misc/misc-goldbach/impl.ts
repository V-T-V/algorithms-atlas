// 哥德巴赫验证 · 实现
export interface GbHooks {
  onPair?: (p: number, q: number) => void;
  onConclude?: (pairs: number) => void;
}
function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}
export function goldbach(n: number, hooks: GbHooks = {}): Array<[number, number]> {
  if (n <= 2 || n % 2 !== 0) {
    hooks.onConclude?.(0);
    return [];
  }
  const pairs: Array<[number, number]> = [];
  for (let p = 2; p <= n / 2; p++) {
    if (isPrime(p) && isPrime(n - p)) {
      pairs.push([p, n - p]);
      hooks.onPair?.(p, n - p);
    }
  }
  hooks.onConclude?.(pairs.length);
  return pairs;
}
