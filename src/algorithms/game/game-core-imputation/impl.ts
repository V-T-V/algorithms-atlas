// 核心分配验证 · 实现
export interface CoreHooks {
  onCheck?: (S: number[], coalitionVal: number, allocated: number, ok: boolean) => void;
  onConclude?: (inCore: boolean) => void;
}
export function coreImputation(
  v: (S: number[]) => number,
  x: readonly number[],
  n: number,
  hooks: CoreHooks = {},
): boolean {
  // 效率性
  const total = x.reduce((a, b) => a + b, 0);
  let ok = Math.abs(total - v(Array.from({ length: n }, (_, i) => i))) < 1e-9;
  for (let mask = 1; mask < (1 << n) - 1; mask++) {
    const S: number[] = [];
    for (let b = 0; b < n; b++) if (mask & (1 << b)) S.push(b);
    const coal = v(S);
    const alloc = S.reduce((a, i) => a + x[i]!, 0);
    const good = alloc >= coal - 1e-9;
    hooks.onCheck?.(S, coal, alloc, good);
    if (!good) ok = false;
  }
  hooks.onConclude?.(ok);
  return ok;
}
