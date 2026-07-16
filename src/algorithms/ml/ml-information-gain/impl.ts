// 信息增益 · 实现
function entropy(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let h = 0;
  for (const c of counts) {
    if (c > 0) {
      const p = c / total;
      h -= p * Math.log2(p);
    }
  }
  return h;
}
export function informationGain(parentLabels: number[], splits: number[][]): number {
  const n = parentLabels.length;
  if (n === 0) return 0;
  const classCount = (arr: number[]): number[] => {
    const m: Record<number, number> = {};
    for (const v of arr) m[v] = (m[v] ?? 0) + 1;
    return Object.values(m);
  };
  const hParent = entropy(classCount(parentLabels));
  let weighted = 0;
  for (const sp of splits) weighted += (sp.length / n) * entropy(classCount(sp));
  return hParent - weighted;
}
