// 小步大步 · 实现
export interface BgHooks {
  onBaby?: (i: number, val: number) => void;
  onGiant?: (j: number, val: number, found: boolean) => void;
  onConclude?: (x: number | null) => void;
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
export function babyStepGiantStep(
  a: number,
  b: number,
  p: number,
  hooks: BgHooks = {},
): number | null {
  const m = Math.ceil(Math.sqrt(p));
  const table = new Map<number, number>();
  let cur = 1;
  for (let i = 0; i < m; i++) {
    if (!table.has(cur)) table.set(cur, i);
    hooks.onBaby?.(i, cur);
    cur = (cur * a) % p;
  }
  const factor = modPow(a, p - 2, p); // a^{-1} (Fermat)
  const giantFactor = modPow(factor, m, p);
  let gamma = b % p;
  for (let j = 0; j < m; j++) {
    if (table.has(gamma)) {
      const x = j * m + table.get(gamma)!;
      hooks.onGiant?.(j, gamma, true);
      hooks.onConclude?.(x);
      return x;
    }
    hooks.onGiant?.(j, gamma, false);
    gamma = (gamma * giantFactor) % p;
  }
  hooks.onConclude?.(null);
  return null;
}
