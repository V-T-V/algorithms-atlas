// 孔多塞悖论 · 实现
export interface CondorcetHooks {
  onPair?: (a: number, b: number, winner: number) => void;
  onCycle?: (hasCycle: boolean) => void;
}
export function condorcetParadox(
  rankings: readonly (readonly number[])[],
  m: number,
  hooks: CondorcetHooks = {},
): { pairwise: number[][]; hasCycle: boolean } {
  const P = Array.from({ length: m }, () => new Array<number>(m).fill(0));
  for (const r of rankings)
    for (let a = 0; a < m; a++)
      for (let b = 0; b < m; b++) {
        if (a === b) continue;
        const ia = r.indexOf(a),
          ib = r.indexOf(b);
        if (ia < ib) P[a]![b]!++;
      }
  const W = Array.from({ length: m }, () => new Array<number>(m).fill(0));
  for (let a = 0; a < m; a++)
    for (let b = 0; b < m; b++) {
      if (a === b) continue;
      if (P[a]![b]! > P[b]![a]!) {
        W[a]![b] = 1;
        hooks.onPair?.(a, b, a);
      } else if (P[b]![a]! > P[a]![b]!) {
        W[a]![b] = -1;
      }
    }
  // 检测长度 3 循环
  let hasCycle = false;
  for (let a = 0; a < m && !hasCycle; a++)
    for (let b = 0; b < m; b++)
      for (let c = 0; c < m; c++) {
        if (W[a]![b] === 1 && W[b]![c] === 1 && W[c]![a] === 1) {
          hasCycle = true;
          break;
        }
      }
  hooks.onCycle?.(hasCycle);
  return { pairwise: W, hasCycle };
}
