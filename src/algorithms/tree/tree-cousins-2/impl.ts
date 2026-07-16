export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface CousinHooks {
  onFind?: (v: number, depth: number) => void;
  onResult?: (c: boolean) => void;
}
export function areCousins(
  root: TreeNode | null,
  x: number,
  y: number,
  hooks: CousinHooks = {},
): boolean {
  if (!root) return false;
  const q: Array<{ node: TreeNode; parent: number | null }> = [{ node: root, parent: null }];
  let depth = 0;
  let xInfo: { depth: number; parent: number | null } | null = null;
  let yInfo: { depth: number; parent: number | null } | null = null;
  while (q.length && (!xInfo || !yInfo)) {
    const sz = q.length;
    for (let i = 0; i < sz; i++) {
      const { node, parent } = q.shift()!;
      if (node.value === x) {
        xInfo = { depth, parent };
        hooks.onFind?.(x, depth);
      }
      if (node.value === y) {
        yInfo = { depth, parent };
        hooks.onFind?.(y, depth);
      }
      if (node.left) q.push({ node: node.left, parent: node.value });
      if (node.right) q.push({ node: node.right, parent: node.value });
    }
    depth++;
  }
  const r = !!xInfo && !!yInfo && xInfo.depth === yInfo.depth && xInfo.parent !== yInfo.parent;
  return r;
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root];
  let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]!);
      q.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]!);
      q.push(node.right);
    }
    i++;
  }
  return root;
}
