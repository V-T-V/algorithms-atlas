// 3 的幂 · 实现
export interface PowerOf3Hooks {
  onDivide?: (cur: number) => void;
  onConclude?: (isPower: boolean) => void;
}
export function miscPowerOf3(n: number, hooks: PowerOf3Hooks = {}): boolean {
  if (n <= 0) return false;
  let cur = n;
  while (cur % 3 === 0) {
    cur /= 3;
    hooks.onDivide?.(cur);
  }
  const isPower = cur === 1;
  hooks.onConclude?.(isPower);
  return isPower;
}
