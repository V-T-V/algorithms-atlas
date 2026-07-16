export interface XorSwapHooks {
  onStep?: (step: number, a: number, b: number) => void;
}
export function xorSwap(a: number, b: number, hooks: XorSwapHooks = {}): [number, number] {
  let x = a | 0,
    y = b | 0;
  x = (x ^ y) | 0;
  hooks.onStep?.(1, x, y);
  y = (x ^ y) | 0;
  hooks.onStep?.(2, x, y);
  x = (x ^ y) | 0;
  hooks.onStep?.(3, x, y);
  return [x, y];
}
