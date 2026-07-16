// 配对堆选择 · 实现（简化）
export interface PhNode {
  v: number;
  children: PhNode[];
}
export interface PhHooks {
  onPop?: (v: number, k: number) => void;
  onResult?: (v: number) => void;
}
function merge(a: PhNode | null, b: PhNode | null): PhNode | null {
  if (!a) return b;
  if (!b) return a;
  if (a.v <= b.v) {
    a.children.push(b);
    return a;
  }
  b.children.push(a);
  return b;
}
function mergePairs(nodes: PhNode[]): PhNode | null {
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0]!;
  // 两两合并
  const merged: PhNode[] = [];
  for (let i = 0; i + 1 < nodes.length; i += 2) merged.push(merge(nodes[i]!, nodes[i + 1]!)!);
  if (nodes.length % 2 === 1) merged.push(nodes[nodes.length - 1]!);
  let result: PhNode | null = merged[merged.length - 1]!;
  for (let i = merged.length - 2; i >= 0; i--) result = merge(merged[i]!, result);
  return result;
}
export function pairingHeapSelect(arr: number[], k: number, hooks: PhHooks = {}): number {
  let root: PhNode | null = null;
  for (const v of arr) root = merge(root, { v, children: [] });
  let result = root?.v ?? NaN;
  for (let i = 0; i <= k && root; i++) {
    result = root.v;
    hooks.onPop?.(result, i);
    root = mergePairs(root.children);
  }
  hooks.onResult?.(result);
  return result;
}
