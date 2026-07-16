// 卡特兰数枚举 · 实现
export interface CtHooks {
  onValue?: (i: number, c: number) => void;
  onConclude?: (values: number[]) => void;
}
export function catalanSeq(n: number, hooks: CtHooks = {}): number[] {
  const out: number[] = [];
  let c = 1;
  out.push(c);
  hooks.onValue?.(0, c);
  for (let i = 0; i < n; i++) {
    c = (c * 2 * (2 * i + 1)) / (i + 2);
    out.push(c);
    hooks.onValue?.(i + 1, c);
  }
  hooks.onConclude?.(out);
  return out;
}
