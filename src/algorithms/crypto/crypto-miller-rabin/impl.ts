export interface MrHooks {
  onWitness?: (a: number, composite: boolean) => void;
}
function modpow(base: number, exp: number, m: number): number {
  let r = 1;
  base %= m;
  while (exp > 0) {
    if (exp & 1) r = (r * base) % m;
    exp >>= 1;
    base = (base * base) % m;
  }
  return r;
}
export function millerRabin(n: number, witnesses: number[], hooks: MrHooks = {}): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  let d = n - 1;
  let r = 0;
  while (d % 2 === 0) {
    d /= 2;
    r++;
  }
  for (const a of witnesses) {
    if (a % n === 0) continue;
    let x = modpow(a, d, n);
    let comp = false;
    if (x === 1 || x === n - 1) {
      hooks.onWitness?.(a, false);
      continue;
    }
    for (let i = 0; i < r - 1; i++) {
      x = (x * x) % n;
      if (x === n - 1) {
        comp = false;
        break;
      }
      comp = true;
    }
    hooks.onWitness?.(a, comp);
    if (comp) return false;
  }
  return true;
}
