// 线性探查分析 · 实现 (实测+理论对比)
export interface LpaHooks {
  onInsert?: (key: number, probes: number) => void;
  onConclude?: (avgProbes: number, theory: number) => void;
}
export function linearProbingAnalysis(
  size: number,
  keys: readonly number[],
  hooks: LpaHooks = {},
): { avg: number; theory: number } {
  const table = new Array<number | undefined>(size);
  let totalProbes = 0;
  for (const key of keys) {
    let idx = key % size,
      probes = 0;
    while (table[idx] !== undefined) {
      idx = (idx + 1) % size;
      probes++;
    }
    table[idx] = key;
    totalProbes += probes + 1;
    hooks.onInsert?.(key, probes + 1);
  }
  const alpha = keys.length / size;
  const theory = (1 + 1 / (1 - alpha)) / 2;
  const avg = totalProbes / keys.length;
  hooks.onConclude?.(avg, theory);
  return { avg, theory };
}
