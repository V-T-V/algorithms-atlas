// 中国剩余定理 · 实现
export interface CrtHooks {
  onSolve?: (i: number, partial: number) => void;
  onConclude?: (x: number, N: number) => void;
}
function extGcd(a: number, b: number): [number, number, number] {
  if (b === 0) return [a, 1, 0];
  const [g, x, y] = extGcd(b, a % b);
  return [g, y, x - Math.floor(a / b) * y];
}
export function crt(
  rems: readonly number[],
  mods: readonly number[],
  hooks: CrtHooks = {},
): number {
  let x = 0,
    N = 1;
  for (const m of mods) N *= m;
  for (let i = 0; i < mods.length; i++) {
    const Ni = N / mods[i]!;
    const [, inv] = extGcd(Ni % mods[i]!, mods[i]!);
    x += (rems[i]! * Ni * ((inv % mods[i]!) + mods[i]!)) % mods[i]!;
    hooks.onSolve?.(i, x);
  }
  x = ((x % N) + N) % N;
  hooks.onConclude?.(x, N);
  return x;
}
