// 欧拉函数区间 · 实现
export interface EtHooks {
  onValue?: (i: number, phi: number) => void;
  onConclude?: (phis: number[]) => void;
}
export function eulerTotientRange(n: number, hooks: EtHooks = {}): number[] {
  const phi = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 2; i <= n; i++) {
    if (phi[i] === i) {
      for (let j = i; j <= n; j += i) phi[j]! -= phi[j]! / i;
    }
    hooks.onValue?.(i, phi[i]!);
  }
  hooks.onConclude?.(phi.slice(1));
  return phi.slice(1);
}
