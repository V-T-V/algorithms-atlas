// Miller-Rabin · 实现
export interface MrHooks {
  onWitness?: (a: number, isComposite: boolean) => void;
  onConclude?: (probablyPrime: boolean) => void;
}
function modPow(b: number, e: number, m: number): number {
  let r = 1;
  b = b % m;
  while (e > 0) {
    if (e & 1) r = (r * b) % m;
    e = Math.floor(e / 2);
    b = (b * b) % m;
  }
  return r;
}
export function millerRabin(n: number, k = 5, hooks: MrHooks = {}): boolean {
  if (n < 2) {
    hooks.onConclude?.(false);
    return false;
  }
  if (n === 2 || n === 3) {
    hooks.onConclude?.(true);
    return true;
  }
  if (n % 2 === 0) {
    hooks.onConclude?.(false);
    return false;
  }
  let d = n - 1,
    r = 0;
  while (d % 2 === 0) {
    d = Math.floor(d / 2);
    r++;
  }
  outer: for (let i = 0; i < k; i++) {
    const a = 2 + Math.floor(Math.random() * (n - 3));
    let x = modPow(a, d, n);
    if (x === 1 || x === n - 1) {
      hooks.onWitness?.(a, false);
      continue;
    }
    for (let j = 0; j < r - 1; j++) {
      x = (x * x) % n;
      if (x === n - 1) {
        hooks.onWitness?.(a, false);
        continue outer;
      }
    }
    hooks.onWitness?.(a, true);
    hooks.onConclude?.(false);
    return false;
  }
  hooks.onConclude?.(true);
  return true;
}
