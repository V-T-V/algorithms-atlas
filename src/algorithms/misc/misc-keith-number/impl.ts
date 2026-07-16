// 基思数 · 实现
export interface KnHooks {
  onTerm?: (term: number) => void;
  onConclude?: (isKeith: boolean) => void;
}
export function isKeithNumber(n: number, hooks: KnHooks = {}): boolean {
  const digits: number[] = [];
  let m = n;
  while (m > 0) {
    digits.unshift(m % 10);
    m = Math.floor(m / 10);
  }
  const k = digits.length;
  if (k < 2) {
    hooks.onConclude?.(false);
    return false;
  }
  let seq = [...digits];
  for (let i = 0; i < 1000; i++) {
    const next = seq.reduce((a, b) => a + b, 0);
    hooks.onTerm?.(next);
    if (next === n) {
      hooks.onConclude?.(true);
      return true;
    }
    if (next > n) {
      hooks.onConclude?.(false);
      return false;
    }
    seq = [...seq.slice(1), next];
  }
  hooks.onConclude?.(false);
  return false;
}
