export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface SerHooks {
  onVisit?: (v: number | null) => void;
  onResult?: (s: string) => void;
}
export function serialize(root: TreeNode | null, hooks: SerHooks = {}): string {
  const out: string[] = [];
  const go = (n: TreeNode | null) => {
    if (!n) {
      out.push('null');
      hooks.onVisit?.(null);
      return;
    }
    out.push(String(n.value));
    hooks.onVisit?.(n.value);
    go(n.left);
    go(n.right);
  };
  go(root);
  const s = out.join(',');
  hooks.onResult?.(s);
  return s;
}
export function deserialize(s: string): TreeNode | null {
  const arr = s.split(',');
  let i = 0;
  const go = (): TreeNode | null => {
    const v = arr[i++];
    if (v === 'null' || v === undefined) return null;
    return new TreeNode(Number(v), go(), go());
  };
  return go();
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
