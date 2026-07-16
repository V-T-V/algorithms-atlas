export interface GNode {
  val: string;
  neighbors: GNode[];
}
export interface CloneHooks {
  onClone?: (val: string) => void;
  onResult?: (root: GNode | null) => void;
}
export function cloneGraph(node: GNode | null, hooks: CloneHooks = {}): GNode | null {
  if (!node) {
    hooks.onResult?.(null);
    return null;
  }
  const map = new Map<string, GNode>();
  const q: GNode[] = [node];
  map.set(node.val, { val: node.val, neighbors: [] });
  while (q.length) {
    const cur = q.shift()!;
    for (const nb of cur.neighbors) {
      if (!map.has(nb.val)) {
        map.set(nb.val, { val: nb.val, neighbors: [] });
        q.push(nb);
      }
      map.get(cur.val)!.neighbors.push(map.get(nb.val)!);
    }
    hooks.onClone?.(cur.val);
  }
  const r = map.get(node.val)!;
  hooks.onResult?.(r);
  return r;
}
