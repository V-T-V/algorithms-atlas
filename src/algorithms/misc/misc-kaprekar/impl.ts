// 卡布列克数 · 实现
export interface KpHooks {
  onSplit?: (sq: number, left: number, right: number) => void;
  onConclude?: (isKaprekar: boolean) => void;
}
export function isKaprekar(n: number, hooks: KpHooks = {}): boolean {
  if (n < 1) {
    hooks.onConclude?.(false);
    return false;
  }
  const sq = n * n;
  const s = String(sq);
  for (let i = 1; i < s.length; i++) {
    const left = parseInt(s.slice(0, i), 10);
    const right = parseInt(s.slice(i), 10);
    hooks.onSplit?.(sq, left, right);
    if (right > 0 && left + right === n) {
      hooks.onConclude?.(true);
      return true;
    }
  }
  hooks.onConclude?.(false);
  return false;
}
