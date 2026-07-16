// Pollard Rho · 实现
export interface PrHooks {
  onIter?: (i: number, x: number, y: number, gcd: number) => void;
  onFactor?: (factor: number) => void;
}
function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}
export function pollardRho(n: number, hooks: PrHooks = {}): number {
  if (n % 2 === 0) return 2;
  let x = 2,
    y = 2,
    c = 1,
    d = 1;
  const f = (v: number) => (v * v + c) % n;
  for (let i = 0; i < 10000 && d === 1; i++) {
    x = f(x);
    y = f(f(y));
    d = gcd(Math.abs(x - y), n);
    hooks.onIter?.(i, x, y, d);
  }
  if (d !== n && d > 1) {
    hooks.onFactor?.(d);
    return d;
  }
  return n;
}
