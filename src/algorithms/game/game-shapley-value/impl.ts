// 夏普利值 · 实现 (枚举子集)
export interface ShapleyHooks {
  onCoalition?: (i: number, S: number[], marginal: number, weight: number) => void;
  onValue?: (i: number, phi: number) => void;
}
export function shapleyValue(
  v: (S: number[]) => number,
  n: number,
  hooks: ShapleyHooks = {},
): number[] {
  const players = Array.from({ length: n }, (_, i) => i);
  const fact = (k: number) => {
    let f = 1;
    for (let i = 2; i <= k; i++) f *= i;
    return f;
  };
  const phi = new Array<number>(n).fill(0);
  // 枚举所有不含 i 的子集 S
  for (let i = 0; i < n; i++) {
    const others = players.filter((p) => p !== i);
    for (let mask = 0; mask < 1 << others.length; mask++) {
      const S: number[] = [];
      for (let b = 0; b < others.length; b++) if (mask & (1 << b)) S.push(others[b]!);
      const marginal = v([...S, i]) - v(S);
      const s = S.length;
      const weight = (fact(s) * fact(n - s - 1)) / fact(n);
      hooks.onCoalition?.(i, S, marginal, weight);
      phi[i]! += weight * marginal;
    }
    hooks.onValue?.(i, phi[i]!);
  }
  return phi;
}
