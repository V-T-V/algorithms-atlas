// =============================================================================
// 序列重建 · 纯算法实现
// 建图 + 拓扑序唯一性判定。
// =============================================================================

export interface SequenceReconHooks {
  onEdge?: (from: number, to: number) => void;
  onOutput?: (node: number) => void;
  onResult?: (ok: boolean) => void;
}

export function sequenceReconstruction(
  org: number[],
  seqs: number[][],
  hooks: SequenceReconHooks = {},
): boolean {
  // 确定节点集合与最大值
  const nodeSet = new Set<number>();
  for (const s of seqs) for (const x of s) nodeSet.add(x);
  if (nodeSet.size === 0 && org.length === 0) {
    hooks.onResult?.(true);
    return true;
  }
  const maxN = org.length;
  if (org.length !== nodeSet.size) {
    hooks.onResult?.(false);
    return false;
  }
  for (const x of org) {
    if (!nodeSet.has(x)) {
      hooks.onResult?.(false);
      return false;
    }
  }
  const adj = new Map<number, number[]>();
  const inDeg = new Map<number, number>();
  for (let i = 1; i <= maxN; i++) {
    adj.set(i, []);
    inDeg.set(i, 0);
  }
  for (const seq of seqs) {
    for (let i = 0; i + 1 < seq.length; i++) {
      const u = seq[i]!;
      const v = seq[i + 1]!;
      adj.get(u)!.push(v);
      inDeg.set(v, (inDeg.get(v) ?? 0) + 1);
      hooks.onEdge?.(u, v);
    }
  }
  const queue: number[] = [];
  for (let i = 1; i <= maxN; i++) {
    if ((inDeg.get(i) ?? 0) === 0) queue.push(i);
  }
  let pos = 0;
  while (queue.length > 0) {
    if (queue.length > 1) {
      // 不唯一
      hooks.onResult?.(false);
      return false;
    }
    const u = queue.shift()!;
    if (pos >= org.length || org[pos] !== u) {
      hooks.onResult?.(false);
      return false;
    }
    hooks.onOutput?.(u);
    pos++;
    for (const v of adj.get(u) ?? []) {
      inDeg.set(v, (inDeg.get(v) ?? 0) - 1);
      if ((inDeg.get(v) ?? 0) === 0) queue.push(v);
    }
  }
  const ok = pos === org.length;
  hooks.onResult?.(ok);
  return ok;
}
