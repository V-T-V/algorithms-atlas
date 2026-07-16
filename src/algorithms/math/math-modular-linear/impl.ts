// =============================================================================
// 线性同余方程 · 扩展欧几里得
// =============================================================================

export interface ModularLinearHooks {
  onGcd?: (g: number, x0: number, y0: number) => void;
  onSolution?: (x: number) => void;
}

export interface ExtGcdResult {
  g: number;
  x: number;
  y: number;
}

export function extGcd(a: number, b: number): ExtGcdResult {
  if (b === 0) return { g: a, x: 1, y: 0 };
  const r = extGcd(b, a % b);
  return { g: r.g, x: r.y, y: r.x - Math.floor(a / b) * r.y };
}

export function mod(a: number, m: number): number {
  const r = a % m;
  return r < 0 ? r + m : r;
}

export function solveLinearCongruence(
  a: number,
  b: number,
  m: number,
  hooks: ModularLinearHooks = {},
): number[] {
  const { g, x: x0, y: y0 } = extGcd(((a % m) + m) % m, m);
  hooks.onGcd?.(g, x0, y0);
  if (b % g !== 0) return [];
  const m1 = m / g;
  const a1 = (((a / g) % m1) + m1) % m1;
  const b1 = (((b / g) % m1) + m1) % m1;
  const base = mod(x0 * (b / g), m);
  const solutions: number[] = [];
  for (let i = 0; i < g; i++) {
    const x = mod(base + (m / g) * i, m);
    solutions.push(x);
    hooks.onSolution?.(x);
  }
  return solutions.sort((p, q) => p - q);
}
