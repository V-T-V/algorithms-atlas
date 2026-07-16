// CART 决策树 · 实现
export interface TreeNode {
  isLeaf: boolean;
  label?: number;
  feature?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}
function gini(labels: number[]): number {
  const total = labels.length;
  if (total === 0) return 0;
  const m: Record<number, number> = {};
  for (const v of labels) m[v] = (m[v] ?? 0) + 1;
  let s = 0;
  for (const k in m) {
    const p = m[k]! / total;
    s += p * p;
  }
  return 1 - s;
}
export function buildCart(
  features: number[][],
  labels: number[],
  depth = 0,
  maxDepth = 5,
): TreeNode {
  const uniq = [...new Set(labels)];
  if (uniq.length === 1 || depth >= maxDepth || features.length === 0)
    return { isLeaf: true, label: labels[0] };
  const base = gini(labels);
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
      const g =
        base -
        (left.length / labels.length) * gini(left) -
        (right.length / labels.length) * gini(right);
      if (g > bestGain) {
        bestGain = g;
        bestF = f;
        bestT = t;
      }
    }
  }
  const lI: number[] = [],
    rI: number[] = [];
  for (let r = 0; r < features.length; r++) (features[r]![bestF]! <= bestT ? lI : rI).push(r);
  return {
    isLeaf: false,
    feature: bestF,
    threshold: bestT,
    left: buildCart(
      lI.map((i) => features[i]!),
      lI.map((i) => labels[i]!),
      depth + 1,
      maxDepth,
    ),
    right: buildCart(
      rI.map((i) => features[i]!),
      rI.map((i) => labels[i]!),
      depth + 1,
      maxDepth,
    ),
  };
}
export function predictCart(node: TreeNode, x: number[]): number {
  while (!node.isLeaf) node = x[node.feature!]! <= node.threshold! ? node.left! : node.right!;
  return node.label!;
}
