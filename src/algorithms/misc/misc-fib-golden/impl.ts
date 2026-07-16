// 黄金比斐波那契 (Binet) · 实现
export interface FgHooks {
  onValue?: (i: number, f: number) => void;
  onConclude?: (values: number[]) => void;
}
const PHI = (1 + Math.sqrt(5)) / 2;
const PSI = (1 - Math.sqrt(5)) / 2;
export function fibGolden(n: number, hooks: FgHooks = {}): number[] {
  const out: number[] = [];
  for (let i = 0; i <= n; i++) {
    const f = Math.round((Math.pow(PHI, i) - Math.pow(PSI, i)) / Math.sqrt(5));
    out.push(f);
    hooks.onValue?.(i, f);
  }
  hooks.onConclude?.(out);
  return out;
}
