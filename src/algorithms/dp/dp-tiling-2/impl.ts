// =============================================================================
// 2×N 铺砖 · 纯算法实现
// =============================================================================

export interface TilingHooks {
  onStep?: (i: number, ways: number) => void;
  onDone?: (ways: number) => void;
}

export function dominoTiling2xN(n: number, hooks: TilingHooks = {}): number {
  if (n < 0) {
    hooks.onDone?.(0);
    return 0;
  }
  if (n === 0) {
    hooks.onStep?.(0, 1);
    hooks.onDone?.(1);
    return 1;
  }
  let a = 1; // f(0)
  let b = 1; // f(1)
  hooks.onStep?.(0, 1);
  hooks.onStep?.(1, 1);
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
    hooks.onStep?.(i, b);
  }
  hooks.onDone?.(b);
  return b;
}
