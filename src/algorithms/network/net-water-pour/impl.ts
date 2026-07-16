export interface WpHooks {
  onGcd?: (g: number) => void;
  onResult?: (ok: boolean) => void;
}
function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
export function canMeasureWater(
  jug1: number,
  jug2: number,
  target: number,
  hooks: WpHooks = {},
): boolean {
  if (target > jug1 + jug2) {
    hooks.onResult?.(false);
    return false;
  }
  const g = gcd(jug1, jug2);
  hooks.onGcd?.(g);
  const ok = target % g === 0;
  hooks.onResult?.(ok);
  return ok;
}
