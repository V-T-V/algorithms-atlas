// C4.5 决策树 · 实现
export interface TreeNode {
  isLeaf: boolean;
  label?: number;
  feature?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}
function entropy(labels: number[]): number {
  const total = labels.length;
  if (total === 0) return 0;
  const m: Record<number, number> = {};
  for (const v of labels) m[v] = (m[v] ?? 0) + 1;
  let h = 0;
  for (const k in m) {
    const p = m[k]! / total;
    h -= p * Math.log2(p);
  }
  return h;
}
function splitInfo(parts: number[], total: number): number {
  let h = 0;
  for (const c of parts) {
    if (c > 0) {
      const p = c / total;
      h -= p * Math.log2(p);
    }
  }
  return h;
}
export function buildC45(
  features: number[][],
  labels: number[],
  depth = 0,
  maxDepth = 5,
): TreeNode {
  const uniq = [...new Set(labels)];
  if (uniq.length === 1 || depth >= maxDepth || features.length === 0)
    return { isLeaf: true, label: labels[0] };
  const base = entropy(labels);
  let bestGain = -1,
    bestF = 0,
    bestT = 0;
  const d = features[0]!.length;
  for (let f = 0; f < d; f++) {
    const vals = [...new Set(features.map((r) => r[f]!))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const t = (vals[i]! + vals[i + 1]!) / 2;
      const left: number[] = [],
        right: number[] = [];
      for (let r = 0; r < features.length; r++)
        (features[r]![f]! <= t ? left : right).push(labels[r]!);
      if (left.length === 0 || right.length === 0) continue;
      const gain =
        base -
        (left.length / labels.length) * entropy(left) -
        (right.length / labels.length) * entropy(right);
      const si = splitInfo([left.length, right.length], labels.length);
      const ratio = si === 0 ? 0 : gain / si;
      if (ratio > bestGain) {
        bestGain = ratio;
        bestF = f;
        bestT = t;
      }
    }
  }
  const leftIdx: number[] = [],
    rightIdx: number[] = [];
  for (let r = 0; r < features.length; r++)
    (features[r]![bestF]! <= bestT ? leftIdx : rightIdx).push(r);
  return {
    isLeaf: false,
    feature: bestF,
    threshold: bestT,
    left: buildC45(
      leftIdx.map((i) => features[i]!),
      leftIdx.map((i) => labels[i]!),
      depth + 1,
      maxDepth,
    ),
    right: buildC45(
      rightIdx.map((i) => features[i]!),
      rightIdx.map((i) => labels[i]!),
      depth + 1,
      maxDepth,
    ),
  };
}
export function predictC45(node: TreeNode, x: number[]): number {
  while (!node.isLeaf) node = x[node.feature!]! <= node.threshold! ? node.left! : node.right!;
  return node.label!;
}
